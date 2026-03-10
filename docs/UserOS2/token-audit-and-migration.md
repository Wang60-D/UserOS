# UserOS 2.0 Token 审计与迁移清单

## 1. 审计范围

- 目录：`components`、`screens`、`navigation`、`tokens.ts`
- 核心目标：
  - 收敛硬编码颜色/尺寸到语义 token
  - 建立 `1.0 命名 -> 2.0 语义 token` 的稳定映射
  - 支持渐进迁移，不阻断已有页面

## 2. 现状问题（1.0）

- **颜色散落**：大量 `#XXXXXX` 与 `rgba(...)` 直接写在组件中，尤其在 `Slider`、`time`、`Entry` 相关页面。
- **尺寸散落**：`borderRadius`、`fontSize`、`padding` 固定数字较多，复用性弱。
- **语义不一致**：同一视觉语义在不同组件命名不同（例如主色、弱分割线、次级文案色）。
- **动效参数内联**：动画时长/弹簧参数分散在组件内部，难统一调优。

## 3. 2.0 Token 分层

- `CORE_TOKENS`（全局基础）
  - `color`、`spacing`、`radius`、`size`、`typography`、`motion`、`zIndex`
- `COMPONENT_TOKENS`（组件语义）
  - `controlTitle`、`pageSwitch`、`circleButtonGroup`、`slider`、`page`
- `TOKENS`（兼容层）
  - 保持 1.0 API 不变，内部映射到 2.0 token

## 4. 已执行迁移（本轮）

- 在 `tokens.ts` 新增：
  - `CORE_TOKENS`
  - `COMPONENT_TOKENS`
  - 兼容 `TOKENS`（向后兼容）
- 结果：
  - 新代码可优先引用 `CORE_TOKENS/COMPONENT_TOKENS`
  - 旧代码无需立即重构，仍可正常运行

## 5. 重点硬编码热点（后续替换优先级）

- **P0（高频基础组件）**
  - `components/Slider/DotSlider.tsx`
  - `components/Slider/DualHandleSlider.tsx`
  - `components/Slider/BaseArcSlider.tsx`
  - `components/ControlTitle/ControlTitleLeft.tsx`
  - `components/Switch/Switch.tsx`
- **P1（场景页面）**
  - `screens/Part2/TickMarks1/Part2TickMarks1Screen.tsx`
  - `screens/Part2/TickMarks2/Part2TickMarks2ColorTempScreen.tsx`
  - `screens/Entry/FeatureEntryStyle1Screen.tsx`
- **P2（长尾组件）**
  - `components/time/*`
  - `screens/Entry/*DrawerScreen.tsx`

## 6. 命名规范（2.0）

- 颜色：`surface*`、`text*`、`border*`、`brand*`、`state*`
- 尺寸：优先 `size.*` + `spacing.*`，避免裸数字
- 组件语义：仅在 `COMPONENT_TOKENS` 定义结构特有值
- 动效：统一从 `CORE_TOKENS.motion` 读取

## 7. 迁移策略

1. **先兼容后替换**：保留 `TOKENS`，新增语义 token。
2. **组件优先**：先改基础组件，再改业务页面。
3. **每轮可回归**：每次仅替换一类 token，保留视觉等价。
4. **禁增硬编码**：新增代码禁止新增裸 `#hex/rgba/固定尺寸`（渐进治理）。
