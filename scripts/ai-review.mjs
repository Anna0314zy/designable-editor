#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { createHmac } from 'node:crypto';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const severityValues = new Set(['P0', 'P1', 'P2', 'P3']);
const highestSeverityValues = new Set(['P0', 'P1', 'P2', 'P3', 'none']);
const recommendationValues = new Set(['clean', 'needs_attention', 'high_risk']);
const confidenceValues = new Set(['low', 'medium', 'high']);

const defaultReport = {
  jsonOut: 'ai-review-report.json',
  mdOut: 'ai-review-report.md',
  summaryOut: 'ai-review-summary.md',
};

function die(message) {
  console.error(message);
  process.exit(1);
}

function readRequiredValue(args, index, flag) {
  const value = args[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value.`);
  }
  return value;
}

export function parseArgs(args) {
  const options = {
    scope: 'working',
    base: 'main',
    head: 'HEAD',
    jsonOut: defaultReport.jsonOut,
    mdOut: defaultReport.mdOut,
    summaryOut: defaultReport.summaryOut,
    prNumber: '',
    prTitle: '',
    actor: '',
    reportUrl: '',
    mockResponse: '',
    mockResponseFile: '',
    diffFile: '',
    help: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--') {
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }

    const valueFlags = new Map([
      ['--base', 'base'],
      ['--scope', 'scope'],
      ['--head', 'head'],
      ['--json-out', 'jsonOut'],
      ['--md-out', 'mdOut'],
      ['--summary-out', 'summaryOut'],
      ['--pr-number', 'prNumber'],
      ['--pr-title', 'prTitle'],
      ['--actor', 'actor'],
      ['--report-url', 'reportUrl'],
      ['--mock-response', 'mockResponse'],
      ['--mock-response-file', 'mockResponseFile'],
      ['--diff-file', 'diffFile'],
    ]);

    if (valueFlags.has(arg)) {
      options[valueFlags.get(arg)] = readRequiredValue(args, index, arg);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!['working', 'branch'].includes(options.scope)) {
    throw new Error('--scope must be working or branch.');
  }

  return options;
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' });
}

function parseNulList(value) {
  return value.split('\0').filter(Boolean);
}

function readUntrackedTextFile(file) {
  const stat = statSync(file);
  if (!stat.isFile()) return '';

  const content = readFileSync(file);
  if (content.includes(0)) {
    return [
      `diff --git a/${file} b/${file}`,
      'new file mode 100644',
      '--- /dev/null',
      `+++ b/${file}`,
      '@@',
      '[binary or non-text file omitted]',
      '',
    ].join('\n');
  }

  const text = content.toString('utf8');
  const lines = text.split('\n');
  const added = lines.map((line) => `+${line}`).join('\n');

  return [
    `diff --git a/${file} b/${file}`,
    'new file mode 100644',
    '--- /dev/null',
    `+++ b/${file}`,
    '@@',
    added,
    '',
  ].join('\n');
}

function getUntrackedDiff() {
  const files = parseNulList(git(['ls-files', '--others', '--exclude-standard', '-z']));
  return files
    .map(readUntrackedTextFile)
    .filter(Boolean)
    .join('\n');
}

export function getDiff({ scope, base, head }) {
  if (scope === 'branch') {
    return git(['diff', `${base}...${head}`, '--stat', '--patch']).trim();
  }

  const trackedDiff = git(['diff', 'HEAD', '--stat', '--patch']).trim();
  const untrackedDiff = getUntrackedDiff().trim();
  return [trackedDiff, untrackedDiff].filter(Boolean).join('\n\n');
}

export function limitDiff(diff, limit) {
  const max = Number(limit);
  if (!Number.isFinite(max) || max <= 0) {
    throw new Error('AI_REVIEW_MAX_DIFF_CHARS must be a positive number.');
  }

  if (diff.length <= max) {
    return {
      text: diff,
      truncated: false,
      originalLength: diff.length,
      limit: max,
    };
  }

  return {
    text: diff.slice(0, max),
    truncated: true,
    originalLength: diff.length,
    limit: max,
  };
}

export function buildReviewPrompt({ diff, scope, base, head, truncated }) {
  return `你是一个严格的 AI code reviewer。请审查代码 diff 中真实存在的风险。

Rules:
- Return strict JSON only. Do not wrap it in markdown.
- 只基于提供的 diff 输出 findings，不要使用没有证据的推断。
- 如果没有明确问题，允许返回 clean report，不要凑占位 finding。
- 不做纯风格审查，除非风格问题会带来真实风险。
- 重点检查 bug、兼容性、类型、安全、性能和测试缺口。
- 行号缺失时使用 null，不要伪造行号。
- recommendation 只能是 clean、needs_attention 或 high_risk。
- highestSeverity 只能是 P0、P1、P2、P3 或 none。
- confidence 只能是 low、medium 或 high。

Severity:
- P0: 明确会导致线上崩溃、数据丢失、严重安全问题、构建或启动必挂。
- P1: 高概率引入主流程回归、兼容性破坏、权限/鉴权风险、明显性能灾难。
- P2: 中等风险 bug、边界条件遗漏、测试缺口、可维护性明显下降。
- P3: 建议优化、可读性、轻微防御性改进，不影响 merge 判断。

JSON shape:
{
  "summary": "本次变更整体风险摘要",
  "highestSeverity": "P1",
  "recommendation": "needs_attention",
  "counts": { "P0": 0, "P1": 1, "P2": 2, "P3": 1 },
  "findings": [
    {
      "severity": "P1",
      "title": "问题标题",
      "file": "path/to/file.ts",
      "line": 42,
      "evidence": "基于 diff 的证据",
      "risk": "为什么有风险",
      "suggestion": "建议怎么改",
      "confidence": "high"
    }
  ],
  "testGaps": ["缺少哪些验证"],
  "manualChecks": ["建议 merge 前人工检查什么"]
}

Review metadata:
- scope: ${scope}
- base: ${base}
- head: ${head}
- diffLimited: ${truncated ? 'true' : 'false'}

Diff:
${diff}`;
}

function stripJsonFence(text) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

export function parseModelJson(text) {
  try {
    return JSON.parse(stripJsonFence(text));
  } catch (error) {
    throw new Error(`AI review model returned invalid JSON: ${error.message}`);
  }
}

function assertString(report, key) {
  if (typeof report[key] !== 'string' || !report[key].trim()) {
    throw new Error(`Report field "${key}" must be a non-empty string.`);
  }
}

function validateCounts(counts) {
  if (!counts || typeof counts !== 'object') {
    throw new Error('Report field "counts" must be an object.');
  }

  for (const severity of severityValues) {
    if (!Number.isInteger(counts[severity]) || counts[severity] < 0) {
      throw new Error(`counts.${severity} must be a non-negative integer.`);
    }
  }
}

function validateFinding(finding, index) {
  if (!finding || typeof finding !== 'object') {
    throw new Error(`findings[${index}] must be an object.`);
  }

  if (!severityValues.has(finding.severity)) {
    throw new Error(`findings[${index}].severity must be P0, P1, P2, or P3.`);
  }

  for (const key of ['title', 'file', 'evidence', 'risk', 'suggestion']) {
    if (typeof finding[key] !== 'string' || !finding[key].trim()) {
      throw new Error(`findings[${index}].${key} must be a non-empty string.`);
    }
  }

  if (finding.line !== null && (!Number.isInteger(finding.line) || finding.line < 1)) {
    throw new Error(`findings[${index}].line must be a positive integer or null.`);
  }

  if (!confidenceValues.has(finding.confidence)) {
    throw new Error(`findings[${index}].confidence must be low, medium, or high.`);
  }
}

function validateStringArray(report, key) {
  if (!Array.isArray(report[key]) || report[key].some((item) => typeof item !== 'string')) {
    throw new Error(`Report field "${key}" must be an array of strings.`);
  }
}

export function validateReport(report) {
  if (!report || typeof report !== 'object') {
    throw new Error('Report must be an object.');
  }

  assertString(report, 'summary');

  if (!highestSeverityValues.has(report.highestSeverity)) {
    throw new Error('highestSeverity must be P0, P1, P2, P3, or none.');
  }

  if (!recommendationValues.has(report.recommendation)) {
    throw new Error('recommendation must be clean, needs_attention, or high_risk.');
  }

  validateCounts(report.counts);

  if (!Array.isArray(report.findings)) {
    throw new Error('Report field "findings" must be an array.');
  }

  report.findings.forEach(validateFinding);
  validateStringArray(report, 'testGaps');
  validateStringArray(report, 'manualChecks');

  return report;
}

export function createNoDiffReport({ scope, base, head }) {
  const target = scope === 'branch' ? `${base}...${head}` : '当前工作区未提交改动';
  return {
    summary: `无变更可审查：${target} 没有 diff。`,
    highestSeverity: 'none',
    recommendation: 'clean',
    counts: { P0: 0, P1: 0, P2: 0, P3: 0 },
    findings: [],
    testGaps: [],
    manualChecks: [],
  };
}

function formatLine(line) {
  return line === null || line === undefined ? '' : `:${line}`;
}

function renderFinding(finding, index) {
  return [
    `${index + 1}. **${finding.severity} ${finding.title}**`,
    `   - 位置：\`${finding.file}${formatLine(finding.line)}\``,
    `   - 证据：${finding.evidence}`,
    `   - 风险：${finding.risk}`,
    `   - 建议：${finding.suggestion}`,
    `   - 置信度：${finding.confidence}`,
  ].join('\n');
}

export function renderMarkdownReport(report) {
  const metadata = report.metadata || {};
  const counts = report.counts || { P0: 0, P1: 0, P2: 0, P3: 0 };
  const primaryFindings = report.findings.filter((finding) => finding.severity === 'P0' || finding.severity === 'P1');
  const secondaryFindings = report.findings.filter((finding) => finding.severity === 'P2' || finding.severity === 'P3');
  const lines = [
    `# AI Review: ${report.highestSeverity} / ${report.recommendation}`,
    '',
    `> ${report.summary}`,
    '',
    `**风险统计**：P0: ${counts.P0} · P1: ${counts.P1} · P2: ${counts.P2} · P3: ${counts.P3}`,
  ];

  lines.push('', '## Review Scope');
  lines.push(`- Scope：${metadata.scope === 'branch' ? 'branch diff / merge diff' : 'working tree uncommitted diff'}`);
  if (metadata.scope === 'branch') {
    lines.push(`- Diff：\`${metadata.base}...${metadata.head}\``);
  } else {
    lines.push('- Diff：`git diff HEAD` + untracked files');
  }

  if (metadata.prNumber || metadata.prTitle || metadata.actor || metadata.reportUrl) {
    lines.push('', '## Context');
    if (metadata.prNumber) lines.push(`- PR：#${metadata.prNumber}`);
    if (metadata.prTitle) lines.push(`- 标题：${metadata.prTitle}`);
    if (metadata.actor) lines.push(`- 触发人：${metadata.actor}`);
    if (metadata.reportUrl) lines.push(`- 报告链接：${metadata.reportUrl}`);
  }

  if (metadata.truncated) {
    lines.push('', '> 注意：本报告基于有限 diff 内容生成，可能未覆盖所有变更。');
  }

  lines.push('', '## P0/P1 Highlights');
  lines.push(primaryFindings.length > 0 ? primaryFindings.map(renderFinding).join('\n\n') : '未发现 P0/P1 风险。');

  lines.push('', '## P2/P3 Findings');
  lines.push(secondaryFindings.length > 0 ? secondaryFindings.map(renderFinding).join('\n\n') : '未发现 P2/P3 风险。');

  lines.push('', '## Test Gaps');
  lines.push(report.testGaps.length > 0 ? report.testGaps.map((item) => `- ${item}`).join('\n') : '- 未发现明确测试缺口。');

  lines.push('', '## Manual Checks');
  lines.push(report.manualChecks.length > 0 ? report.manualChecks.map((item) => `- ${item}`).join('\n') : '- 无额外人工检查建议。');

  return `${lines.join('\n')}\n`;
}

export function renderMarkdownSummary(report) {
  const metadata = report.metadata || {};
  const counts = report.counts || { P0: 0, P1: 0, P2: 0, P3: 0 };
  const primaryFindings = report.findings
    .filter((finding) => finding.severity === 'P0' || finding.severity === 'P1')
    .slice(0, 5);
  const lines = [
    `## AI Review: ${report.highestSeverity} / ${report.recommendation}`,
    '',
    report.summary,
    '',
    `**风险统计**：P0: ${counts.P0} · P1: ${counts.P1} · P2: ${counts.P2} · P3: ${counts.P3}`,
  ];

  if (metadata.prNumber || metadata.prTitle || metadata.actor || metadata.reportUrl) {
    lines.push('');
    if (metadata.prNumber) lines.push(`- PR：#${metadata.prNumber}`);
    if (metadata.prTitle) lines.push(`- 标题：${metadata.prTitle}`);
    if (metadata.actor) lines.push(`- 触发人：${metadata.actor}`);
    if (metadata.reportUrl) lines.push(`- 完整报告：${metadata.reportUrl}`);
  }

  if (metadata.truncated) {
    lines.push('', '> 注意：本摘要基于有限 diff 内容生成，可能未覆盖所有变更。');
  }

  lines.push('', '### P0/P1 摘要');
  if (primaryFindings.length > 0) {
    lines.push(...primaryFindings.map((finding) => (
      `- **${finding.severity} ${finding.title}**：\`${finding.file}${formatLine(finding.line)}\``
    )));
  } else {
    lines.push('- 未发现 P0/P1 风险。');
  }

  if (report.testGaps.length > 0) {
    lines.push('', '### 测试缺口');
    lines.push(...report.testGaps.slice(0, 3).map((item) => `- ${item}`));
  }

  return `${lines.join('\n')}\n`;
}

function ensureParentDir(file) {
  mkdirSync(dirname(resolve(file)), { recursive: true });
}

function writeReportFiles({ report, jsonOut, mdOut, summaryOut }) {
  ensureParentDir(jsonOut);
  ensureParentDir(mdOut);
  ensureParentDir(summaryOut);
  writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  writeFileSync(mdOut, renderMarkdownReport(report), 'utf8');
  writeFileSync(summaryOut, renderMarkdownSummary(report), 'utf8');
}

async function callModel(prompt) {
  const apiKey = process.env.AI_REVIEW_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('AI_REVIEW_API_KEY or OPENAI_API_KEY is not set.');
  }

  const model = process.env.AI_REVIEW_MODEL || process.env.AI_COMMIT_MODEL || 'deepseek-v4-pro';
  const baseUrl = (process.env.AI_REVIEW_BASE_URL || process.env.AI_COMMIT_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '');
  const endpoint = baseUrl.endsWith('/chat/completions') ? baseUrl : `${baseUrl}/chat/completions`;
  const maxTokens = Number(process.env.AI_REVIEW_MAX_TOKENS || 4000);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a precise AI code reviewer. Return strict JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      thinking: { type: 'disabled' },
      max_tokens: maxTokens,
      stream: false,
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = payload?.error?.message || payload?.message || response.statusText;
    throw new Error(`AI review request failed (${response.status} ${response.statusText}): ${detail}`);
  }

  const text = payload?.choices?.[0]?.message?.content
    || payload?.output_text
    || payload?.output?.flatMap((item) => item.content || [])
      .map((content) => content.text)
      .filter(Boolean)
      .join('\n');

  if (!text?.trim()) {
    throw new Error('AI review model returned an empty response.');
  }

  return text.trim();
}

function getMockResponse(options) {
  if (options.mockResponse) return options.mockResponse;
  if (options.mockResponseFile) return readFileSync(options.mockResponseFile, 'utf8');
  return '';
}

function withMetadata(report, metadata) {
  return {
    ...report,
    metadata: {
      ...(report.metadata || {}),
      ...metadata,
    },
  };
}

function printSummary(report, { jsonOut, mdOut, summaryOut }) {
  console.log(`AI review 完成：${report.highestSeverity} / ${report.recommendation}`);
  console.log(`风险统计：P0=${report.counts.P0}, P1=${report.counts.P1}, P2=${report.counts.P2}, P3=${report.counts.P3}`);
  console.log(`JSON 报告：${jsonOut}`);
  console.log(`Markdown 报告：${mdOut}`);
  console.log(`Markdown 摘要：${summaryOut}`);
}

function buildDingTalkMarkdown(report) {
  const metadata = report.metadata || {};
  const p01 = report.findings
    .filter((finding) => finding.severity === 'P0' || finding.severity === 'P1')
    .slice(0, 5)
    .map((finding) => `- ${finding.severity} ${finding.title} (${finding.file}${formatLine(finding.line)})`)
    .join('\n') || '- 未发现 P0/P1 风险';

  return [
    `# AI Review: ${report.highestSeverity} / ${report.recommendation}`,
    '',
    metadata.prNumber ? `- PR: #${metadata.prNumber}` : '',
    metadata.prTitle ? `- 标题: ${metadata.prTitle}` : '',
    metadata.actor ? `- 触发人: ${metadata.actor}` : '',
    `- 风险统计: P0=${report.counts.P0}, P1=${report.counts.P1}, P2=${report.counts.P2}, P3=${report.counts.P3}`,
    '',
    '## P0/P1 摘要',
    p01,
    '',
    metadata.reportUrl ? `[查看完整报告](${metadata.reportUrl})` : '',
  ].filter(Boolean).join('\n');
}

function buildDingTalkUrl(webhook, secret) {
  if (!secret) return webhook;

  const timestamp = Date.now();
  const sign = encodeURIComponent(
    createHmac('sha256', secret)
      .update(`${timestamp}\n${secret}`)
      .digest('base64'),
  );
  const separator = webhook.includes('?') ? '&' : '?';
  return `${webhook}${separator}timestamp=${timestamp}&sign=${sign}`;
}

async function notifyDingTalk(report) {
  const webhook = process.env.DINGTALK_WEBHOOK;
  if (!webhook) {
    console.log('DINGTALK_WEBHOOK 未配置，跳过钉钉通知。');
    return;
  }

  try {
    const response = await fetch(buildDingTalkUrl(webhook, process.env.DINGTALK_SECRET), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msgtype: 'markdown',
        markdown: {
          title: `AI Review: ${report.highestSeverity} / ${report.recommendation}`,
          text: buildDingTalkMarkdown(report),
        },
      }),
    });

    if (!response.ok) {
      console.error(`钉钉通知失败：${response.status} ${response.statusText}`);
      return;
    }

    console.log('钉钉通知已发送。');
  } catch (error) {
    console.error(`钉钉通知失败：${error.message}`);
  }
}

export async function runReview(options) {
  const rawDiff = options.diffFile ? readFileSync(options.diffFile, 'utf8') : getDiff(options);
  const maxDiffChars = Number(process.env.AI_REVIEW_MAX_DIFF_CHARS || 60000);
  const limited = limitDiff(rawDiff, maxDiffChars);
  const metadata = {
    scope: options.scope,
    base: options.base,
    head: options.head,
    prNumber: options.prNumber,
    prTitle: options.prTitle,
    actor: options.actor,
    reportUrl: options.reportUrl,
    truncated: limited.truncated,
    originalDiffLength: limited.originalLength,
    diffLimit: limited.limit,
  };

  let report;

  if (!rawDiff.trim()) {
    report = createNoDiffReport(options);
  } else {
    const mockResponse = getMockResponse(options);
    const prompt = buildReviewPrompt({
      diff: limited.text,
      scope: options.scope,
      base: options.base,
      head: options.head,
      truncated: limited.truncated,
    });
    const modelText = mockResponse || await callModel(prompt);
    report = validateReport(parseModelJson(modelText));
  }

  const finalReport = validateReport(withMetadata(report, metadata));
  writeReportFiles({
    report: finalReport,
    jsonOut: options.jsonOut,
    mdOut: options.mdOut,
    summaryOut: options.summaryOut,
  });
  printSummary(finalReport, options);
  // 如果是本地 不发送
  if(options.scope !== 'working') {
    await notifyDingTalk(finalReport);
  }

  return finalReport;
}

function printHelp() {
  console.log(`Usage:
  node scripts/ai-review.mjs [--scope working]
  node scripts/ai-review.mjs --scope branch --base main --head HEAD

Options:
  --scope <scope>             Review scope: working or branch. Default: working
  --base <ref>                Base ref for git diff. Default: main
  --head <ref>                Head ref for git diff. Default: HEAD
  --json-out <path>           JSON report path. Default: ai-review-report.json
  --md-out <path>             Markdown report path. Default: ai-review-report.md
  --summary-out <path>        Markdown summary path. Default: ai-review-summary.md
  --pr-number <number>        PR number metadata
  --pr-title <title>          PR title metadata
  --actor <login>             Trigger actor metadata
  --report-url <url>          Workflow or report URL metadata
  --mock-response <json>      Use a mock model response
  --mock-response-file <path> Use a mock model response file
  --diff-file <path>          Read diff from file instead of git
`);
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    die(error.message);
  }

  if (options.help) {
    printHelp();
    return;
  }

  try {
    await runReview(options);
  } catch (error) {
    die(error.message);
  }
}

const entryPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (entryPath === fileURLToPath(import.meta.url)) {
  await main();
}
