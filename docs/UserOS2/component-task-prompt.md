# UserOS 2.0 组件任务统一 Prompt（给任意 Agent）

你是本项目 `UserOS 2.0` 的代码代理。请严格按以下规则实现“新增组件”或“修改组件”任务。

## 1) 项目目标

- 在 1.0 基础上提升组件还原度、代码一致性、可维护性。
- 保持交互稳定，避免引入难排查问题。
- 优先复用现有组件与结构，不做无必要重写。

## 2) 强制规则（必须遵守）

### Token 规则

- 新代码必须优先使用 `CORE_TOKENS` / `COMPONENT_TOKENS`（定义在 `tokens.ts`）。
- `TOKENS` 仅作为 1.0 兼容层，不能作为 2.0 新代码基线。
- 禁止新增硬编码样式值（颜色、圆角、间距、字号、动效参数）。

### 结构规则

- 可复用逻辑放 `components`，页面编排放 `screens`，路由在 `navigation`。
- 组件应支持受控/非受控模式（如适用）。
- 交互类组件应区分 `onChange`（过程）与 `onChangeEnd`（提交）。
- 标准页面优先复用 `screens/shared/StandardPageLayout.tsx`。

### 状态流与可观测性

- 状态流遵循：`input -> optimistic update -> animation -> commit callback`。
- 动效参数统一来自 token（例如 `CORE_TOKENS.motion`）。
- 关键交互支持调试追踪：`debugEnabled` / `debugId`（如适用）。

### 代码质量

- 命名语义化，避免缩写和歧义。
- 修改应最小侵入，不破坏现有功能。
- 增量改造优先，不做大范围无关重构。

## 3) 任务执行步骤（按顺序）

1. 若提供了 Figma 链接，先执行第 5 节的「Figma MCP 读取与确认流程」。
2. 阅读目标文件及其依赖，识别现有模式与边界。
3. 先做最小改动设计：列出将修改的文件与理由。
4. 实施改动：
   - 先 token 化
   - 再状态流/交互
   - 最后结构清理
5. 自检：
   - 无硬编码新增
   - 类型检查/ lint 通过（至少不引入新错误）
   - 关键交互路径可用
6. 输出变更说明（见第 6 节输出格式）。

## 4) 本项目关键参考文件

- `tokens.ts`
- `docs/UserOS2/token-audit-and-migration.md`
- `docs/UserOS2/code-architecture-guide.md`
- `docs/UserOS2/standard-page-spec.md`
- `utils/stateflow/useControllableState.ts`
- `utils/stateflow/traceStateFlow.ts`

## 5) Figma MCP 读取与确认流程（必须）

当用户提供 Figma 链接（`figma.com/design/...`、`figma.com/board/...`、`figma.com/make/...`）时，必须先执行：

1. 读取链接并解析 `fileKey`、`nodeId`（若有 `node-id`，将 `-` 转为 `:`）。
2. 通过 Figma MCP 获取设计上下文（优先读取节点设计信息与截图）。
3. 输出“设计规则提取清单”，至少包含：
   - 布局规则（间距、对齐、层级）
   - 视觉规则（颜色、圆角、字号、描边、阴影）
   - 交互规则（状态、动效、禁用态、反馈）
   - 组件映射建议（应复用的现有组件）
   - token 映射建议（映射到 `CORE_TOKENS` / `COMPONENT_TOKENS`）
4. 明确向用户请求确认：  
   “以上是我从 Figma MCP 读取到的规则，请确认是否按此执行编码。”
5. 在用户明确确认前，禁止进入 coding。

## 6) Agent 输出格式（必须）

- 变更概述（1-3 条）
- 修改文件清单（逐文件一句说明）
- 规则符合性确认：
  - 是否仅用新 token（若否，列出原因与后续计划）
  - 是否保持受控/非受控一致性
  - 是否区分 onChange/onChangeEnd
- 验证结果：
  - lint/tsc 结果
  - 手动验证路径
- 风险与后续建议（可选）

## 7) 直接可用的任务输入模板

将下面模板连同你的具体需求一起发给 Agent：

```md
请在 UserOS 2.0 中完成以下组件任务：

【任务类型】
- 新增组件 / 修改组件

【目标文件】
- <填写文件路径>

【设计/交互要求】
- <填写视觉要求>
- <填写交互要求>

【Figma 参考】
- <填写 figma 链接，可多个>

【必须遵守】
- 使用 CORE_TOKENS / COMPONENT_TOKENS，不新增硬编码
- 遵守 docs/UserOS2 下三份规范文档
- 若提供 Figma 链接，必须先用 MCP 读取并回传“规则提取清单”，经我确认后再 coding
- 保持受控/非受控模式一致（如适用）
- 区分 onChange 与 onChangeEnd（如适用）
- 产出包含：改动说明 + 文件清单 + 验证结果
```

