## 1. Core Review Script

- [x] 1.1 新增 `scripts/ai-review.mjs`，作为本地和 CI 共用的 AI review 入口。
- [x] 1.2 实现 CLI 参数解析，支持 `--scope`、`--base`、可选 `--head`、可选 PR metadata 和输出路径。
- [x] 1.3 实现本地 `working` scope 未提交 diff 采集，以及 `branch` scope 的 `base...head` diff 采集。
- [x] 1.4 增加可配置 diff 大小限制，使用 `AI_REVIEW_MAX_DIFF_CHARS` 并在报告中记录截断 metadata。
- [x] 1.5 复用仓库现有 OpenAI-compatible 请求风格，支持 `AI_REVIEW_API_KEY` 或 `OPENAI_API_KEY`、`AI_REVIEW_BASE_URL`、`AI_REVIEW_MODEL`。
- [x] 1.6 构造 diff-only AI review prompt，包含 P0/P1/P2/P3 等级定义和严格 JSON 输出要求。

## 2. Report Parsing and Formatting

- [x] 2.1 解析模型返回的 JSON，并支持最小 markdown fence 清理。
- [x] 2.2 校验报告必需字段、severity 值、recommendation 值和 finding 结构。
- [x] 2.3 当模型输出无法形成合法报告时安全失败，不生成误导性报告。
- [x] 2.4 生成 `ai-review-report.json`。
- [x] 2.5 生成适合 GitHub 和手机阅读的 `ai-review-report.md`。
- [x] 2.6 本地运行时输出简洁中文控制台摘要。
- [x] 2.7 处理 no-diff 场景，生成 clean no-change report。
- [x] 2.8 生成供 workflow summary 和 PR comment 使用的 `ai-review-summary.md`。

## 3. Package Script and Local Usage

- [x] 3.1 在根目录 `package.json` 增加 `review:ai` 之类的本地命令。
- [x] 3.2 文档化本地运行所需环境变量。
- [x] 3.3 使用小 diff 验证本地命令可正常生成报告。

## 4. GitHub Actions Workflow

- [x] 4.1 新增 `.github/workflows/ai-review.yml`，使用 `workflow_dispatch` 手动触发。
- [x] 4.2 支持手动输入 PR number，并可选支持 base/head refs。
- [x] 4.3 checkout 仓库时保留足够 history，用于计算目标 diff。
- [x] 4.4 在 CI 中使用 GitHub Secrets 调用共用 AI review 命令。
- [x] 4.5 上传 JSON 和 Markdown 报告为 workflow artifacts。
- [x] 4.6 当提供 PR number 且权限允许时，发布简洁 PR summary comment。
- [x] 4.7 保持 AI findings advisory，P0/P1 风险本身不让 workflow 失败，并在 CI 中显式使用 `--scope branch`。

## 5. DingTalk Notification

- [x] 5.1 实现可选 DingTalk custom robot markdown notification。
- [x] 5.2 支持可选 `DINGTALK_SECRET` 加签。
- [x] 5.3 钉钉消息包含 PR context、actor、highest severity、severity counts、P0/P1 summaries 和 GitHub report link。
- [x] 5.4 未配置 `DINGTALK_WEBHOOK` 时跳过通知且不让 review 失败。
- [x] 5.5 钉钉发送失败时记录日志，但不改变已生成 review 结果。

## 6. Safety and Documentation

- [x] 6.1 确保 API keys、webhook values 和 request headers 不出现在报告或普通日志中。
- [x] 6.2 文档化 CI 使用所需 GitHub Secrets。
- [x] 6.3 文档化面向 merge 者的 soft-blocking review flow。
- [x] 6.4 文档化第一版 non-goals，包括不自动 PR 触发和不做 line-by-line review comments。

## 7. Verification

- [x] 7.1 验证本地 no-diff 行为和 `working` scope 命令语义。
- [x] 7.2 验证本地 valid JSON model response 能生成两份报告文件。
- [x] 7.3 验证 invalid model JSON 会安全失败。
- [x] 7.4 验证 oversized diff 会在报告中标记 limited 或 truncated。
- [ ] 7.5 验证 GitHub manual workflow 可以为 PR 生成 artifacts。
- [ ] 7.6 在权限允许的场景验证 PR summary comment。
- [x] 7.7 验证缺少 DingTalk 配置不会导致 review 失败。
- [ ] 7.8 使用配置好的 webhook 验证 DingTalk notification。
