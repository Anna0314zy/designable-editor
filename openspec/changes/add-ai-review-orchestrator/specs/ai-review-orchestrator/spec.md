## ADDED Requirements

### Requirement: 本地 Diff Review
系统 SHALL 提供本地 AI review 命令，默认审查当前工作区未提交改动。

#### Scenario: 审查本地未提交改动
- **WHEN** 开发者在本地运行 AI review 命令且未指定 `--scope branch`
- **THEN** 系统 SHALL 审查 `git diff HEAD` 和 untracked files，并生成 JSON 和 Markdown 两种报告

#### Scenario: 本地显式审查 branch diff
- **WHEN** 开发者运行带有 `--scope branch --base main --head HEAD` 的 AI review 命令
- **THEN** 系统 SHALL 审查 `main...HEAD` diff，并生成 JSON 和 Markdown 两种报告

#### Scenario: 不存在 diff
- **WHEN** 当前 review scope 内没有 diff
- **THEN** 系统 SHALL 正常完成，并生成说明“无变更可审查”的 clean 报告

### Requirement: Diff-Only 风险分析
系统 SHALL 将第一版 AI review 分析范围限制为代码 diff 风险，包括 bug、兼容性、类型、安全、性能和测试缺口。

#### Scenario: 构造模型 prompt
- **WHEN** 系统准备 AI review 请求
- **THEN** prompt SHALL 要求模型只基于提供的 diff 输出 findings，并避免没有证据的推断

#### Scenario: 没有明确问题
- **WHEN** 模型没有识别出由 diff 支撑的 finding
- **THEN** 系统 SHALL 允许生成 clean report，而不是要求模型凑出占位 finding

### Requirement: P0-P3 Severity Report
系统 SHALL 使用 P0、P1、P2、P3 对 findings 进行风险分级。

#### Scenario: 返回高风险 finding
- **WHEN** 模型返回可能导致运行时崩溃、数据丢失、严重安全风险、构建或启动必挂的 finding
- **THEN** 系统 SHALL 将其分类为 P0

#### Scenario: 生成报告摘要
- **WHEN** review findings 可用
- **THEN** JSON 报告 SHALL 包含 highest severity、recommendation、severity counts、findings、test gaps 和 manual checks

### Requirement: 严格结构化模型输出
系统 SHALL 要求模型先返回结构化 JSON，再由脚本格式化 Markdown 输出。

#### Scenario: 返回合法 JSON
- **WHEN** 模型返回合法 review JSON
- **THEN** 系统 SHALL 解析该 JSON，并根据解析结果生成 Markdown 报告

#### Scenario: 返回非法 JSON
- **WHEN** 模型响应经过最小 markdown fence 清理后仍无法解析为 JSON
- **THEN** 系统 SHALL 让 review 命令失败，而不是生成误导性报告

### Requirement: GitHub 手动 Review Workflow
系统 SHALL 提供可由 merge 者在 merge 前手动触发的 GitHub Actions workflow。

#### Scenario: 对 PR 触发 workflow
- **WHEN** 用户使用 PR number 手动运行 AI review workflow
- **THEN** workflow SHALL 使用 `--scope branch` 计算 PR 待 merge diff，运行共用 AI review 命令，并上传 JSON、完整 Markdown 和摘要 Markdown 报告 artifacts

#### Scenario: 提供 PR number
- **WHEN** workflow 基于提供的 PR number 完成 review
- **THEN** workflow SHALL 在权限允许时向该 PR 发布基于摘要 Markdown 的简洁 summary comment

### Requirement: Soft-Blocking Review 结果
系统 SHALL 将 AI findings 作为 advisory 信息，并保留 merge 者的最终判断权。

#### Scenario: 存在 P0 或 P1 findings
- **WHEN** 生成的报告包含 P0 或 P1 findings
- **THEN** workflow SHALL 仍作为已生成 advisory report 正常完成，除非 review 命令本身失败

#### Scenario: Review 命令失败
- **WHEN** 缺少必要配置，或模型请求无法生成合法报告
- **THEN** workflow SHALL 失败，以表明没有生成可信 review 报告

### Requirement: DingTalk 固定群通知
系统 SHALL 在 GitHub 手动 review 后，可选发送 DingTalk markdown 摘要到固定群机器人。

#### Scenario: 配置了 DingTalk webhook
- **WHEN** GitHub 手动 review 完成且配置了 `DINGTALK_WEBHOOK`
- **THEN** 系统 SHALL 发送 DingTalk 摘要，内容包含 PR context、trigger actor、highest severity、severity counts、P0/P1 summaries 和 GitHub report link

#### Scenario: 未配置 DingTalk webhook
- **WHEN** review 完成但没有配置 `DINGTALK_WEBHOOK`
- **THEN** 系统 SHALL 跳过 DingTalk notification，且不让 review 失败

#### Scenario: DingTalk notification 失败
- **WHEN** 已生成报告后 DingTalk 请求失败
- **THEN** 系统 SHALL 记录通知失败，但不改变 review 结果

### Requirement: Secret 处理
系统 SHALL 避免 AI provider 和 DingTalk credentials 出现在报告或普通日志中。

#### Scenario: 使用 secrets
- **WHEN** 系统调用 AI provider 或 DingTalk webhook
- **THEN** 系统 SHALL 从本地环境变量或 GitHub Secrets 读取 credentials，并 SHALL NOT 在报告或日志中打印完整 secret 值

### Requirement: Diff Size 控制
系统 SHALL 对模型输入的 diff size 设置可配置上限。

#### Scenario: Diff 超过配置上限
- **WHEN** diff 超过配置的最大输入大小
- **THEN** 系统 SHALL 截断或限制模型输入，并在生成的报告中明确标记报告基于有限 diff 内容
