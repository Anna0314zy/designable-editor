# Slides Engine

Slides Engine 是一个面向课件/幻灯片编辑、预览、渲染和课堂任务场景的 monorepo。项目围绕序列化后的 slide/page tree JSON 协作，`editor`、`preview`、`task`、`bridge` 等应用通过这层数据边界交换内容，避免直接共享 UI 状态。

## Tech Stack

- TypeScript、React 18、Vite、Less、Ant Design 5
- pnpm workspaces
- Formily 相关响应式和 schema 能力：`@formily/reactive`、`@formily/json-schema` 等通过 `@slides/*` 别名使用
- 预览、任务端和宿主集成主要使用 iframe、`postMessage` 和 `post-me`
- 后端服务使用 NestJS、Prisma

## Repository Layout

```text
.
├── packages/                 # 编辑器核心、React 绑定、共享基础设施和设置表单
│   ├── core                  # Engine / Workbench / Workspace / Operation 等编辑器内核
│   ├── react                 # React 设计器容器、面板和组件绑定
│   ├── shared                # 共享事件、订阅和工具基础设施
│   └── react-settings-form   # 设置表单控件和课件业务 setter
├── common/                   # 运行时渲染、动画、字体、形状、截图等共享模块
│   ├── render-core
│   ├── render-components
│   ├── render-context
│   └── animate
├── editor/                   # 主幻灯片编辑器应用，包含物料和 behavior 注册
├── preview/                  # 独立预览应用
├── task/                     # 课堂/任务侧应用，消费 slide 数据
├── bridge/                   # 宿主/player 集成 demo 和运行时桥接代码
├── server/                   # NestJS 后端服务
├── serverless/               # 截图等 serverless 支持代码
└── openspec/                 # OpenSpec 项目背景、changes 和 specs
```

> 仓库中存在部分历史目录、demo、生成产物或 vendor-like 代码。修改前请先确认实际 `package.json`、入口文件和调用链，不要只根据目录名判断职责。

## Core Architecture

主要编辑模型：

```text
Engine -> Workbench -> Workspace -> Operation -> TreeNode
```

- `Engine`：编辑器引擎聚合入口。
- `Workbench`：管理多个 `Workspace`。
- `Workspace`：一页课件的完整编辑上下文，包含页面树、选区、主画布交互、大纲交互和历史记录。
- `Operation`：管理运行时节点树、选区、hover、移动辅助、变换辅助、快照和动画集成。
- `TreeNode`：序列化树数据的运行时对象形态。
- `History`：基于 `serialize/from` 快照模式实现 undo/redo，并通过 locking 避免递归写入历史。

新增组件能力时，优先沿用 behavior、schema、renderer 路径扩展；如果同时影响编辑态和预览/运行态，需要同步检查 `editor`、`preview`、`task` 和相关 `common/render-*` 模块。

## Getting Started

安装依赖：

```bash
pnpm install
```

常用启动命令：

```bash
pnpm --dir editor dev
pnpm --dir task dev
npm --prefix preview start
npm --prefix server run dev
```

常用构建和验证命令：

```bash
pnpm --dir editor build
pnpm --dir task build:test
npm --prefix preview run build
npm --prefix server run build
npm --prefix server run test
```

具体命令以对应 package 的 `package.json` 为准。

## Development Workflow

- 开始改动前先查看 `git status --short`，避免覆盖他人或本地已有改动。
- 小修、小 typo、纯文档修正可以直接最小化修改。
- 新增功能、行为变更或跨模块改动应先走 OpenSpec：

```bash
openspec list
openspec status --change <change>
```

如果 `openspec` 不在 PATH，当前机器通常可以使用：

```bash
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
```

高风险区域包括拖拽、选区、resize、transform、history、serialization、TreeNode identity、animation、iframe preview、task binding 等。涉及这些区域时，先说明影响面、兼容策略和验证方式。

## Package Boundaries

- `packages/core` 保持与 React、具体 UI 和应用壳无关。
- 网络、iframe、微前端和宿主通信逻辑放在 app/common adapter 边界处理，不塞进 core。
- 共享逻辑优先放在已有 package 的合适边界内，不随意新增跨层依赖。
- 数据结构变更必须考虑旧数据兼容。新字段尽量可选，并提供明确默认行为。
- 高频交互路径避免不必要重渲染、深拷贝和全树扫描。
- 事件订阅、BroadcastChannel、`postMessage`、iframe handshake、DOM listener 必须考虑清理。

## Historical Links

以下链接来自早期 `designable-editor` demo，可用于追溯历史部署和联调入口：


