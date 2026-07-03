# AI Review Orchestrator

## Local Usage

本地运行：

```bash
pnpm run review:ai
```

本地默认审查当前工作区未提交改动，范围等价于 `git diff HEAD` 加 untracked files。不会审查当前分支相对 `main` 的全部历史 diff。

如果确实要在本地审查当前分支相对 base 的待 merge diff，可以显式使用：

```bash
pnpm run review:ai -- --scope branch --base main --head HEAD
```

默认输出：

- `ai-review-report.json`
- `ai-review-report.md`
- `ai-review-summary.md`

常用环境变量：

- `AI_REVIEW_API_KEY` 或 `OPENAI_API_KEY`：AI provider API key。
- `AI_REVIEW_BASE_URL`：OpenAI-compatible endpoint base URL，默认 `https://api.deepseek.com`。
- `AI_REVIEW_MODEL`：模型名，默认 `deepseek-v4-pro`。
- `AI_REVIEW_MAX_DIFF_CHARS`：模型输入 diff 最大字符数，默认 `60000`。

本地调试可使用 mock response，避免真实调用模型：

```bash
pnpm run review:ai -- \
  --mock-response-file tmp/ai-review-response.json
```

## GitHub Manual Review

GitHub Actions 中手动运行 `AI Review` workflow：

- 推荐输入 `pr_number`，workflow 会自动解析 PR base/head。
- 没有 PR number 时，可以输入 `base` 和 `head` refs。
- DevOps/CI 固定使用 `--scope branch`，审查当前 PR 或 base/head 的待 merge diff。
- CI 直接使用 Node 20 执行 `scripts/ai-review.mjs`，不安装 pnpm 依赖。

workflow 会生成：

- workflow artifact：`ai-review-report`，包含完整 JSON、完整 Markdown 和摘要 Markdown
- workflow summary：只写入 `ai-review-summary.md`
- PR summary comment：只发布 `ai-review-summary.md`（提供 PR number 且权限允许时）
- DingTalk notification（配置 webhook 时）

## GitHub Secrets

CI 使用以下 GitHub Secrets：

- `AI_REVIEW_API_KEY`
- `AI_REVIEW_BASE_URL`
- `AI_REVIEW_MODEL`
- `DINGTALK_WEBHOOK`
- `DINGTALK_SECRET`

`DINGTALK_WEBHOOK` 未配置时会跳过钉钉通知，不影响 AI review 结果。

## Soft-Blocking Flow

AI review 是 advisory 流程：

- P0/P1 findings 会写入报告和通知，但不会因为风险本身让 workflow 失败。
- 配置缺失、模型请求失败、模型返回非法 JSON 等情况会让 workflow 失败，因为此时没有生成可信报告。
- 是否 merge 仍由 merge 者根据报告判断。

## Non-Goals

第一版不做：

- 自动 PR 触发。
- `/ai-review` 评论触发。
- line-by-line GitHub review comments。
- OpenSpec/AGENTS 项目规则审查。
- CodeRabbit/Qodo SaaS 接入。
- GitHub 用户到 DingTalk 用户映射。
