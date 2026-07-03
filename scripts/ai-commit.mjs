#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = new Set(process.argv.slice(2));
const shouldCommit = args.has('--commit');
const shouldSplit = args.has('--split');
const shouldPrintSplitPlan = args.has('--split-plan');
const includeUnstaged = args.has('--unstaged');
const maxDiffChars = Number(process.env.AI_COMMIT_MAX_DIFF_CHARS || 45000);
const model = process.env.AI_COMMIT_MODEL || 'deepseek-v4-pro';
const baseUrl = (process.env.AI_COMMIT_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '');
const endpoint = baseUrl.endsWith('/chat/completions')
  ? baseUrl
  : `${baseUrl}/chat/completions`;

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function gitRaw(args) {
  return execFileSync('git', args, { encoding: 'utf8' });
}

function die(message) {
  console.error(message);
  process.exit(1);
}

function runGit(args) {
  const result = spawnSync('git', args, {
    encoding: 'utf8',
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function parseNulList(value) {
  return value.split('\0').filter(Boolean);
}

function getDiff() {
  const diffArgs = includeUnstaged
    ? ['diff', '--stat', '--patch']
    : ['diff', '--cached', '--stat', '--patch'];

  const diff = git(diffArgs);
  if (!diff) {
    die(includeUnstaged
      ? 'No unstaged changes found.'
      : 'No staged changes found. Run `git add <files>` first, or use `pnpm run commit:ai -- --unstaged` to preview unstaged changes.');
  }

  if (diff.length <= maxDiffChars) return diff;

  return `${diff.slice(0, maxDiffChars)}

[diff truncated: original length ${diff.length} chars, limit ${maxDiffChars}. Focus on the visible files and mention that the summary is based on a truncated diff only if important.]`;
}

function buildPrompt(diff) {
  return `Rules:
- Return only the commit message.
- Use Conventional Commits: <type>(optional scope): <summary>
- Prefer one of: feat, fix, refactor, perf, test, docs, build, chore.
- Summary must be in English, imperative mood, <= 72 chars.
- Add a blank line and 2-5 concise bullet points only when useful.
- Mention user-facing behavior, data/schema changes, tests, or migrations when present.
- Do not invent changes that are not shown in the diff.

Diff:
${diff}`;
}

function buildSplitPrompt(diff, stagedFiles) {
  return `Group the staged files into a small set of clean, independent commits.

Rules:
- Return only valid JSON. Do not wrap it in markdown.
- JSON shape: [{"message":"<conventional commit message>","files":["path/to/file"]}]
- Every staged file must appear exactly once.
- Use only files from the staged file list.
- Prefer 1-5 groups.
- Keep related implementation, tests, docs, config, and generated migration files together.
- Split unrelated tool/config/docs changes from product behavior changes.
- Each message must use Conventional Commits.
- Message first line must be <= 72 chars.

Staged files:
${stagedFiles.map((file) => `- ${file}`).join('\n')}

Diff:
${diff}`;
}

async function callModel({ system, prompt, maxTokens = 500 }) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_COMMIT_API_KEY;
  if (!apiKey) {
    die('OPENAI_API_KEY is not set. Export it first, then rerun `pnpm run commit:ai`.');
  }

  if (process.env.AI_COMMIT_DEBUG) {
    console.error('AI commit provider: DeepSeek');
    console.error(`AI commit endpoint: ${endpoint}`);
    console.error(`AI commit model: ${model}`);
    console.error(`AI commit key suffix: ${apiKey.slice(-4)}`);
  }

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
          content: system,
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
    die(`DeepSeek request failed (${response.status} ${response.statusText}) using ${model} at ${endpoint}: ${detail}`);
  }

  const text = payload?.choices?.[0]?.message?.content
    || payload?.output_text
    || payload?.output?.flatMap((item) => item.content || [])
      .map((content) => content.text)
      .filter(Boolean)
      .join('\n');

  if (!text?.trim()) die('DeepSeek returned an empty response.');

  return text.trim();
}

async function generateCommitMessage(diff) {
  return callModel({
    system: 'You write precise Conventional Commit messages for this repository.',
    prompt: buildPrompt(diff),
  });
}

function commitWithMessage(message) {
  const dir = mkdtempSync(join(tmpdir(), 'ai-commit-'));
  const file = join(dir, 'message.txt');

  try {
    writeFileSync(file, `${message}\n`, 'utf8');
    const result = spawnSync('git', ['commit', '-F', file], {
      encoding: 'utf8',
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function getStagedFiles() {
  return parseNulList(gitRaw(['diff', '--cached', '--name-only', '-z']));
}

function getNameStatusEntries() {
  const parts = parseNulList(gitRaw(['diff', '--cached', '--name-status', '-z']));
  const entries = [];

  for (let index = 0; index < parts.length;) {
    const status = parts[index++];

    if (status.startsWith('R') || status.startsWith('C')) {
      const oldPath = parts[index++];
      const newPath = parts[index++];
      entries.push({ status, file: newPath, pathspecs: [oldPath, newPath] });
      continue;
    }

    const file = parts[index++];
    entries.push({ status, file, pathspecs: [file] });
  }

  return entries;
}

function assertNoMixedStagedFiles(stagedFiles) {
  const unstagedFiles = new Set(parseNulList(gitRaw(['diff', '--name-only', '-z'])));
  const mixedFiles = stagedFiles.filter((file) => unstagedFiles.has(file));

  if (mixedFiles.length > 0) {
    die(`Cannot auto-split because these staged files also have unstaged changes:
${mixedFiles.map((file) => `- ${file}`).join('\n')}

Commit or stash those unstaged edits first, then rerun \`pnpm run commit:ai -- --split\`.`);
  }
}

function parseJsonResponse(text) {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    die(`AI returned invalid JSON for split plan:
${text}`);
  }
}

function validateSplitPlan(plan, entries) {
  if (!Array.isArray(plan) || plan.length === 0) {
    die('AI returned an empty split plan.');
  }

  const staged = new Set(entries.map((entry) => entry.file));
  const seen = new Map();

  for (const [groupIndex, group] of plan.entries()) {
    if (!group || typeof group.message !== 'string' || !Array.isArray(group.files)) {
      die('AI returned an invalid split plan shape.');
    }

    if (!group.message.trim()) {
      die(`Split group ${groupIndex + 1} has an empty commit message.`);
    }

    if (group.files.length === 0) {
      die(`Split group ${groupIndex + 1} has no files.`);
    }

    for (const file of group.files) {
      if (!staged.has(file)) {
        die(`Split plan referenced a file that is not staged: ${file}`);
      }

      if (seen.has(file)) {
        die(`Split plan referenced the same file twice: ${file}`);
      }

      seen.set(file, groupIndex);
    }
  }

  const missing = [...staged].filter((file) => !seen.has(file));
  if (missing.length > 0) {
    die(`Split plan did not include every staged file:
${missing.map((file) => `- ${file}`).join('\n')}`);
  }

  return plan.map((group) => ({
    message: group.message.trim(),
    files: group.files,
  }));
}

async function generateSplitPlan() {
  const stagedFiles = getStagedFiles();
  if (stagedFiles.length === 0) {
    die('No staged changes found. Run `git add <files>` first.');
  }

  const diff = getDiff();
  const response = await callModel({
    system: 'You split staged changes into clean commits and return strict JSON only.',
    prompt: buildSplitPrompt(diff, stagedFiles),
    maxTokens: 1200,
  });

  return validateSplitPlan(parseJsonResponse(response), getNameStatusEntries());
}

function printSplitPlan(plan) {
  console.log('\nGenerated split commit plan:\n');

  plan.forEach((group, index) => {
    console.log(`${index + 1}. ${group.message}`);
    for (const file of group.files) {
      console.log(`   - ${file}`);
    }
    console.log('');
  });
}

function commitSplitPlan(plan) {
  const entries = getNameStatusEntries();
  const stagedFiles = entries.map((entry) => entry.file);
  const entryByFile = new Map(entries.map((entry) => [entry.file, entry]));

  assertNoMixedStagedFiles(stagedFiles);

  runGit(['restore', '--staged', '--', ...entries.flatMap((entry) => entry.pathspecs)]);

  for (const group of plan) {
    const pathspecs = group.files.flatMap((file) => entryByFile.get(file)?.pathspecs || [file]);

    runGit(['add', '--', ...pathspecs]);
    commitWithMessage(group.message);
  }
}

if ((shouldSplit || shouldPrintSplitPlan) && includeUnstaged) {
  die('`--split` and `--split-plan` only work with staged changes.');
}

if (shouldSplit && shouldCommit) {
  die('Use either `--split` or `--commit`, not both.');
}

if (shouldSplit || shouldPrintSplitPlan) {
  const plan = await generateSplitPlan();
  printSplitPlan(plan);

  if (shouldSplit) {
    commitSplitPlan(plan);
  } else {
    console.log('Review it, then run `pnpm run commit:ai -- --split` to create these commits.');
  }

  process.exit(0);
}

const diff = getDiff();
const message = await generateCommitMessage(diff);

console.log('\nGenerated commit message:\n');
console.log(message);
console.log('');

if (shouldCommit) {
  commitWithMessage(message);
} else {
  console.log('Review it, then run `pnpm run commit:ai -- --commit` to commit staged changes with a freshly generated message.');
}
