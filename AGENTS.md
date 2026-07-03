# AGENTS.md

## 适用范围

本文件适用于仓库根目录下的所有代码、文档和 OpenSpec artifacts。它面向 AI agent 优先，同时保持人类开发者可读。

如更深层目录未来出现新的 `AGENTS.md`，以更深层规则为准。

## 上下文读取策略

不要一开始读取全仓库。按任务风险和范围逐层展开上下文：

1. **先读基础上下文**
   - `AGENTS.md`
   - `openspec/config.yaml`
   - `README.md`
   - 根目录 `package.json`
   - 与任务直接相关 package 的 `package.json`

2. **再按任务展开**
   - 需求不清楚：读相关 OpenSpec change 的 `proposal.md`、`design.md`、`tasks.md` 和 spec。
   - 定位代码：先用 `rg` 找调用点、类型定义、事件名，再读“关键入口索引”。
   - 跨端变更：按影响面继续读 `editor`、`preview`、`task`、`bridge`、`common/render-*`、`common/animate`。
   - 历史目录、demo、bundle、lockfile、生成产物、vendor-like 文件，只有被引用时才读。

如果上下文不够，说明还需要读取的范围和理由；不要为了“全面了解”一次性展开无关目录。

## 项目定位

Slides Engine 是一个面向课件/幻灯片编辑、预览、渲染和课堂任务场景的 monorepo。

核心数据契约是序列化后的 slide/page tree JSON。`editor`、`preview`、`task`、`bridge` 等应用应通过这层数据边界协作，不要直接共享 UI 状态。

## 工作规则

- 默认用中文沟通、总结和编写项目说明；代码标识符、类型、API 名称保持英文。
- 修改前先读相关调用链，不要只看单个文件就下结论。
- 优先沿用已有抽象和本地风格，不新增不必要的架构层。
- 不做无关重构，不大范围格式化，不主动清理历史代码或生成产物。
- 不覆盖用户已有改动。开始前和关键编辑后查看 `git status --short`。
- 手工编辑优先使用 patch，避免用脚本粗暴重写人工维护文件。

## 代码规范

- 优先沿用当前文件和相邻模块的 TypeScript/React 写法，不为单次改动引入新风格。
- 类型、接口和数据结构要表达真实领域含义；避免用 `any` 掩盖不确定性。
- 共享逻辑优先放在已有 package 的合适边界内，不随意新增跨层依赖。
- 不随意新增依赖；如确需新增，先说明现有能力为什么不够。
- 注释只写有助于理解复杂逻辑的内容，不写重复代码含义的空注释。

## 样式规范

- UI 改动优先沿用现有 Less、Ant Design 和项目组件风格。
- 不引入新的视觉体系、全局主题或大范围样式重置，除非需求明确要求。
- 编辑器类界面保持工具型产品风格：信息密度适中、层级清晰、交互直接。
- 新增样式应尽量限制在相关组件或模块内，避免无意影响 editor、preview、task 其他页面。
- 涉及预览/运行态展示时，要同时检查编辑态样式和 preview/task 渲染效果。

## OpenSpec 规则

- 新增功能、修改行为、跨模块改动前，优先走 OpenSpec。
- 需求不清楚时先用 `/opsx:explore`。
- 需求明确时先用 `/opsx:propose <change>` 生成 proposal/design/tasks。
- 只有 proposal/design/tasks 明确后，才用 `/opsx:apply <change>` 实现。
- 小修、小 typo、纯文档修正可以不走 OpenSpec，但要保持改动最小。
- OpenSpec 项目背景在 `openspec/config.yaml`；稳定背景变化时同步更新。

## Monorepo 边界

- `packages/core`：编辑器引擎内核，尽量保持与 React、具体 UI 和应用壳无关。
- `packages/react`：React 绑定层，以及消费 engine API 的设计器容器、面板和组件。
- `packages/shared`：共享事件、订阅和工具基础设施。
- `packages/react-settings-form`：设置表单控件，包含与课件业务相关的 setter。
- `common/render-core`、`common/render-components`、`common/render-context`：运行时渲染和预览侧共享模块。
- `common/animate`：编辑态和预览/运行态动画引擎。
- `editor`：主幻灯片编辑器应用，包含物料和 behavior 注册。
- `preview`：独立预览应用。
- `task`：课堂/任务侧应用，消费 slide 数据。
- `server`、`serverless`：后端与截图等支持代码。
- `bridge`：宿主/player 集成 demo 和运行时桥接代码。

不要只根据目录名猜职责。这个仓库存在历史命名和包名不一致的情况，修改前要读对应 `package.json`、入口文件和调用链。

## 关键入口索引

- `packages/core/src/models/Engine.ts`：引擎聚合入口。
- `packages/core/src/models/Workbench.ts`：多 Workspace 管理。
- `packages/core/src/models/Workspace.ts`：单页课件编辑上下文、viewport/outline、事件上下文。
- `packages/core/src/models/Operation.ts`：TreeNode 操作、选区、快照、动画入口。
- `packages/core/src/models/History.ts`：undo/redo 快照历史。
- `packages/core/src/models/TreeNode.ts`：运行时节点模型。
- `packages/core/src/presets.ts`：默认 drivers/effects/shortcuts 注册。
- `packages/react/src/containers/Designer.tsx`：React 设计器入口。
- `packages/react/src/context.ts`：React context 边界。
- `editor/src/RegistryBehaviors.ts`：编辑器物料/behavior 注册。
- `editor/src/components/Preview/index.tsx`：编辑器到预览 iframe 通信。
- `task/src/pages/Preview/index.tsx`：任务端接收预览数据。
- `common/render-core`：运行时渲染核心。
- `common/render-components`：预览/运行态组件。
- `common/animate`：编辑态和预览态动画引擎。

关键入口索引不是完整文件清单。需要定位代码时，优先使用 `rg`、`rg --files` 和调用链搜索。

## 核心模型和架构规则

- `Engine -> Workbench -> Workspace -> Operation` 是主要编辑模型。
- `Workspace` 表示一页课件的完整编辑上下文，包含页面树、选区、主画布交互、大纲交互和历史记录。
- `Operation` 管理 TreeNode 运行时树、选区、hover、移动辅助、变换辅助、快照和动画集成。
- `TreeNode` 是序列化树数据的运行时对象形态。clone、move、delete 节点时，要保持 `parent/root/operation` 身份和全局查找行为一致。
- `History` 使用 `serialize/from` 快照模式，并通过 locking 避免 undo/redo 期间递归写入历史记录。
- 网络、iframe、微前端、宿主通信等问题应放在 app/common adapter 边界处理，不塞进 core。
- 新增组件能力时，优先通过 behavior/schema/renderer 路径扩展，并同步检查 editor、preview、task 是否受影响。

## 高风险规则

涉及以下区域时，先说明影响面，再动手：

- 拖拽、选区、resize、transform。
- history、serialization、TreeNode identity。
- animation 编辑态与预览态。
- iframe preview、postMessage、post-me handshake。
- task binding、`elementId` 关联。
- `packages/core/src/models/Operation.ts`。
- `packages/core/src/models/TreeNode.ts`。
- `packages/core/src/models/History.ts`。
- `packages/core/src/models/Workspace.ts`。

数据结构变更必须考虑旧数据兼容。新字段尽量可选，并提供明确默认行为。

高频交互路径避免不必要重渲染、深拷贝和全树扫描。事件订阅、BroadcastChannel、postMessage、iframe handshake、DOM listener 必须考虑清理。

## 启动与验证

常用命令以实际 package scripts 为准，执行前先读对应 `package.json`。

- 启动 editor：`pnpm --dir editor dev`
- 启动 preview：`pnpm --dir preview dev`
- 启动 server：`npm --prefix server run dev`
- 安装 server 依赖：`npm --prefix server install`
- 查看 OpenSpec 状态：`openspec list`
- 查看 OpenSpec change：`openspec status --change <change>`

如果 `openspec` 不在 PATH，当前机器上的可执行文件通常在：

```bash
$HOME/.nvm/versions/node/v20.20.2/bin/openspec
```

可临时修复：

```bash
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
```

验证要求：

- 能跑自动验证就跑对应 package 的 lint/build/test。
- 没有测试脚本或测试覆盖不足时，写清人工验证步骤。
- UI/交互改动至少验证 editor 行为；影响预览或任务端时，也要验证 preview/task 路径。
- 高风险变更需要说明未验证项和剩余风险。

## 禁止事项

- 禁止绕过 OpenSpec 直接实现大型行为变更。
- 禁止把 React/UI/app shell 逻辑塞进 `packages/core`。
- 禁止无关重构、大范围格式化、批量重排 import。
- 禁止主动清理历史包、生成产物或 vendor-like 目录。
- 禁止只改 editor 而不检查 preview/task 是否受影响。
- 禁止修改序列化数据结构却不考虑兼容和消费方。
