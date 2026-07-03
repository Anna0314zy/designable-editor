## Context

Slides Engine 是一个 TypeScript/React/pnpm monorepo。当前仓库已有 `scripts/ai-commit.mjs`，可以调用 OpenAI-compatible / DeepSeek 风格接口生成 commit message，但还没有统一的 AI review 流程。

目标场景是让开发者可以本地主动 review diff，也让 merge 者可以在 GitHub merge 前手动触发 AI review，并把报告留在 GitHub、通知到固定钉钉群。该能力属于仓库 DevOps 工具链，不进入 `packages/core`、editor、preview、task 或 slide/page tree 数据契约。

## Goals / Non-Goals

**Goals:**

- 提供本地和 CI 共用的 AI review orchestrator。
- 基于代码 diff 分析 bug、兼容性、类型、安全、性能和测试缺口等风险。
- 生成 P0 / P1 / P2 / P3 分级 JSON 与 Markdown 报告。
- 支持 GitHub Actions 手动触发，适合 merge 前由 merge 者主动运行。
- 支持 PR 摘要评论、workflow artifact 和固定钉钉群通知。
- 采用软阻断策略：AI 报告提醒风险，不自动禁止 merge。

**Non-Goals:**

- 第一版不自动在每次 push 或 PR 更新时运行。
- 第一版不通过 `/ai-review` PR 评论触发。
- 第一版不做逐行 GitHub review comment。
- 第一版不审 OpenSpec、AGENTS 或 monorepo 架构规则。
- 第一版不接入 CodeRabbit、Qodo 等 SaaS。
- 第一版不做全仓上下文检索。
- 第一版不维护 GitHub 用户到钉钉用户的映射。
- 第一版不修改 editor、preview、task、packages/core 或序列化数据结构。

## Decisions

### Decision: 使用仓库内 orchestrator

采用仓库内脚本作为统一入口，第一版入口为 `scripts/ai-review.mjs`。本地命令和 GitHub Actions workflow 都调用同一份脚本，保证报告结构、模型调用、错误处理和输出格式一致。

Alternatives considered:

- 直接接 CodeRabbit、Qodo Merge 等 SaaS：PR 体验成熟，但本地 CLI、固定钉钉流程、自定义 P0-P3 报告、私有代码治理和费用控制不够贴合当前目标。
- 使用 PR-Agent、reviewdog、Danger 等开源 PR 工具拼装：适合作为后续集成，但第一版仍需要额外编排本地/CI 一致性、钉钉摘要和软阻断策略。

Rationale:

- 仓库已有 `scripts/ai-commit.mjs`，说明 Node 脚本是当前 AI 辅助工具的自然落点。
- 仓库内 orchestrator 可以把 report schema、model provider、GitHub Action 和 DingTalk 通知都控制在本项目内。
- 实现边界保持在 DevOps 工具链，不影响产品运行时 package。

### Decision: 本地审未提交 diff，DevOps 审待 merge diff

orchestrator 支持 `--scope working` 和 `--scope branch`。本地默认使用 `--scope working`，审查 `git diff HEAD` 和 untracked files；DevOps/CI workflow 显式使用 `--scope branch`，审查 PR 或 base/head 的待 merge diff。第一版只把 diff、文件路径和必要 metadata 发送给模型。

Alternatives considered:

- 在 prompt 中加入 OpenSpec、AGENTS 和项目规则。
- 为每个变更文件额外检索仓库上下文。

Rationale:

- 已确认第一版只检查代码 diff 风险。
- 本地开发者通常关心当前未提交改动，而不是当前分支相对 `main` 的全部历史 diff。
- merge 者在 GitHub 上关心的是 PR 待 merge diff，因此 CI 必须使用 branch scope。
- diff-only review 能降低 token 成本、误导性上下文和实现复杂度。
- 项目规则 review 可以等基础流程稳定后，作为独立能力增量加入。

### Decision: 模型先返回严格 JSON，再由脚本格式化报告

模型输出优先要求严格 JSON，字段包括 `summary`、`highestSeverity`、`recommendation`、`counts`、`findings`、`testGaps` 和 `manualChecks`。脚本负责把 JSON 转成 GitHub 和手机端可读的 Markdown。

Alternatives considered:

- 让模型直接输出 Markdown。
- 让模型输出自由文本，再用脚本做启发式解析。

Rationale:

- JSON 更容易做字段校验、错误处理和后续扩展。
- Markdown 由脚本生成，可以稳定控制 GitHub 评论和钉钉摘要长度。
- 如果模型输出不合法，脚本可以安全失败，避免生成看似正常但内容不可信的报告。

### Decision: 采用软阻断 merge flow

发现 P0/P1 finding 时，workflow 不因为风险本身失败。只有配置缺失、diff 获取失败、模型调用失败、模型输出无法形成合法报告等执行问题，才让 workflow 失败。

Alternatives considered:

- P0/P1 直接 hard-block。
- 即使脚本无法生成报告也始终 pass。

Rationale:

- 用户选择的是“生成报告并提醒 merge 者，是否 merge 由人判断”。
- AI review 可能误报，早期落地应优先建立可见性和信任。
- 如果报告本身无法生成，应明确暴露失败，避免 merge 者误以为已经完成 review。

### Decision: GitHub Actions 只做手动触发

CI 入口新增 `.github/workflows/ai-review.yml`，使用 `workflow_dispatch` 手动触发。输入优先支持 PR 编号，可选支持 base/head refs。

Alternatives considered:

- 每次 `pull_request` 更新自动运行。
- 通过 PR 评论 `/ai-review` 触发。

Rationale:

- 手动触发更符合 merge 前由 merge 者主动 review 的流程。
- 手动触发可以控制 token 成本。
- 评论触发需要额外处理权限、防滥用、fork PR secret 安全等问题，不适合第一版。

### Decision: 钉钉只发固定群通知

钉钉集成使用自定义机器人 webhook，review 完成后发送 markdown 摘要到固定群。第一版不做按人 @。

Alternatives considered:

- 直接 @ merge 者。
- 只在高风险时通知。

Rationale:

- 固定群通知是最小可用的手机端流程。
- 直接 @ 需要维护 GitHub 用户到钉钉账号或手机号的映射。
- 用户已确认第一版发固定群机器人。

## Risks / Trade-offs

- Diff 被截断可能漏掉问题 -> 报告 MUST 明确标记“基于截断 diff”或“基于有限 diff 内容”。
- 模型可能返回非 JSON -> 脚本 MUST 尝试最小 markdown fence 清理；仍失败时 MUST 失败退出，不生成假报告。
- AI finding 可能误报 -> 流程保持软阻断，并在 finding 中保留 `confidence`。
- GitHub 评论可能产生噪音 -> 第一版可以每次发新摘要评论；后续再升级为更新上一条 AI Review 评论。
- 钉钉发送可能失败 -> 通知失败 MUST NOT 改变已生成 review 结果，但日志需要说明失败原因。
- Secret 有泄露风险 -> API key、webhook 和 request header MUST 来自本地环境变量或 GitHub Secrets，且 MUST NOT 打印到报告或普通日志。

## Migration Plan

1. 补齐本 OpenSpec change 的 proposal、design、spec 和 tasks。
2. 实现 `scripts/ai-review.mjs` 和根目录本地命令。
3. 新增 GitHub Actions 手动触发 workflow。
4. 新增可选 DingTalk notifier。
5. 使用小 diff 和 mocked/real model response 做本地验证。
6. 在 PR 上手动触发 CI 验证 artifact、PR 评论和钉钉通知。

Rollback strategy:

- 删除根目录 package script、AI review 脚本和 GitHub workflow。
- 删除不再使用的 GitHub Secrets。
- 不需要产品数据迁移，因为该 change 不修改运行时数据结构。

## Open Questions

- 第一版大 diff 是只按字符数截断，还是按文件分片后再汇总。
- GitHub PR 评论第一版是否始终发新评论，还是实现“更新上一条 AI Review 评论”。
- 报告文件输出到仓库根目录，还是输出到 `.ai-review/` 这类专用生成目录。
