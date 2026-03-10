# UserOS 2.0 标准页面骨架规范

## 布局结构

- Header：页面标题、副标题/返回语义区
- Content：设备图或主交互容器
- Controls：核心交互组件区（滑条/开关/按钮组）
- Footer：模式切换、辅助操作、说明文案

## 样式基线

- 页面底色：`CORE_TOKENS.color.surfacePage`
- 水平边距：`COMPONENT_TOKENS.page.paddingH`
- 卡片圆角：`CORE_TOKENS.radius.lg`
- 标题字号：`CORE_TOKENS.typography.titleMD`（场景大标题可用 `titleLG`）

## Token 使用规则（2.0）

- 新增页面与组件一律优先使用 `CORE_TOKENS` / `COMPONENT_TOKENS`。
- `TOKENS` 仅作为 1.0 迁移兼容层，不作为 2.0 新代码基线。
- 若旧组件暂未改造，可通过兼容层运行；重构时必须回收为新 token。

## 交互基线

- 组件交互采用 `onChange + onChangeEnd`
- 页面切换保持无动画或轻量动画一致性
- 状态变化需可回放（可选 debug）

## 可复用页面容器

建议使用公共页面容器（本轮新增）：`screens/shared/StandardPageLayout.tsx`

- 自动处理安全区与默认内边距
- 支持 `header/content/footer` 插槽
- 降低各页面样式重复，提升一致性
