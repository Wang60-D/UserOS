# UserOS 2.0 通识性代码结构说明书

## 1. 目录职责

- `components`：可复用纯组件，不直接耦合路由业务。
- `screens`：页面编排层，负责组件组合、路由参数、页面级状态。
- `navigation`：路由定义与路由类型。
- `tokens.ts`：设计系统 token 唯一入口（含 2.0 分层与 1.0 兼容）。
- `docs/UserOS2`：规范、迁移、验收文档。

## 2. 分层原则

- **设计层**：token 与视觉规则。
- **交互层**：组件输入/输出与动效时序。
- **页面层**：业务状态与组件装配。
- **路由层**：页面注册与跳转边界。

禁止跨层反向依赖：组件层不依赖具体页面文件。

## 3. 组件标准模板

- Props 分为：
  - `value/onChange`（受控）
  - `defaultValue`（非受控初值）
  - `onChangeEnd`（交互提交）
  - `debugId/debugEnabled`（可观测）
- 样式要求：
  - 颜色/字号/圆角/间距必须来自 token
  - 同一语义只用一个 token 来源
- 行为要求：
  - 实时变化与提交变化分离（拖动中 vs 释放后）
  - 组件内部 optimistic 状态与外部受控值保持可回收

## 4. 状态流规范

统一事件链：

`input(start/move/end) -> resolve next state -> optimistic update -> visual animation -> commit callback`

规则：

- 拖动过程只更新临时态，结束时触发 commit。
- 受控组件以外部值为准；内部 optimistic 值仅用于防抖动。
- 动画参数统一走 `CORE_TOKENS.motion`。

## 5. 可观测性与排障

- 组件支持 `debugEnabled + debugId`。
- 日志按阶段记录：`grant/move/release/commit/terminate`。
- 日志输出应结构化（JSON payload），便于 grep 检索与回放。

## 6. 命名与一致性约定

- 文件命名：组件 `PascalCase.tsx`，工具 `camelCase.ts`。
- 变量命名：
  - 视觉变量：`resolved*`、`active*`、`display*`
  - 手势状态：`isDraggingRef`、`activeThumbRef` 等统一前缀
- 样式分组：容器 -> 结构 -> 文本 -> 状态。

## 7. 新增页面开发流程（必须遵守）

1. 在 `screens` 创建页面，优先复用 `components`。
2. 仅用 token，不新增硬编码样式。
3. 补充路由类型与注册。
4. 对关键交互补充 `onChange/onChangeEnd` 验证。
5. 在 `ComponentLibrary` 或 Part 页面加入入口便于回归。
