## Why

当前仓库已有本地 AI commit 辅助，但缺少一套可在 merge 前由 merge 者主动触发的 AI review 流程。引入统一的 AI review orchestrator 可以让本地和 GitHub CI 使用同一套 diff 风险分析、等级报告和通知机制，在不自动阻断 merge 的前提下提升合并前风险可见性。

## What Changes

- 新增仓库内 AI review orchestrator，用于读取本地或 CI 中的代码 diff，并调用 OpenAI-compatible / DeepSeek 风格模型生成结构化 review 结果。
- 新增本地命令，让开发者可以基于指定 base 分支主动生成 AI review 报告。
- 新增 GitHub Actions 手动触发 workflow，让 merge 者在 merge 前通过 GitHub 操作调用 AI review。
- 新增 P0 / P1 / P2 / P3 风险等级报告，输出 JSON 和 Markdown 两种格式。
- 新增 PR 摘要评论和 artifact 上传能力，方便 GitHub 留痕。
- 新增固定钉钉群机器人通知能力，让手机端可以快速查看最高风险、统计和报告链接。
- 保持软阻断策略：发现风险不自动失败 workflow，不自动禁止 merge，由 merge 者根据报告判断。

## Capabilities

### New Capabilities

- `ai-review-orchestrator`: 仓库内 AI review 流程，包括本地 diff review、GitHub 手动触发、P0-P3 报告、PR 留痕和钉钉通知。

### Modified Capabilities

- None.

## Impact

- 影响根目录脚本和配置：`package.json`、`scripts/ai-review.mjs`，必要时可拆分 `scripts/lib/ai-review/*`。
- 影响 GitHub Actions：新增 `.github/workflows/ai-review.yml`。
- 影响仓库文档或 OpenSpec artifacts：记录使用方式、环境变量和验证步骤。
- 需要配置 GitHub Secrets：`AI_REVIEW_API_KEY`、可选 `AI_REVIEW_BASE_URL`、`AI_REVIEW_MODEL`、`DINGTALK_WEBHOOK`、`DINGTALK_SECRET`。
- 不影响 editor、preview、task、packages/core 或 slide/page tree 序列化数据结构。
