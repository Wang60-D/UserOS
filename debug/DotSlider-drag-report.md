# DotSlider 拖动测试报告

## 测试说明
- 测试动作：将 `dot-a`、`dot-b`、`dot-c` 把手从最左拖到最右；并尝试点击最右端。
- 日志来源：运行终端 `1.txt` 中 `"[DotSliderDebug]"` 结构化日志。

## 关键结论

### 1) 旧问题根因已定位
- 在早期日志中，`move` 阶段出现大量 `nextRatio: 0`，即使 `thumbX` 已很大。
- 这说明回调内部使用了旧闭包中的 `maxThumbX=0`，导致比例始终算成 0。
- 该问题会直接造成“拖动无反馈/松手回原点”。

### 2) 修复后行为（同一日志后段）已出现正确轨迹
- 出现 `grant` 日志包含 `maxThumbX: 306`（不再是 0）。
- `dot-a` 拖动多次提交：
  - `targetRatio: 0.25 -> nextValue: 25`
  - `targetRatio: 0.5 -> nextValue: 50`
  - `targetRatio: 0.75 -> nextValue: 75`
  - `targetRatio: 1 -> nextValue: 100`
- 说明修复后该滑条可从左逐段拖到最右并吸附。

### 3) `dot-b` 当前日志样本
- 采样中一次释放提交为：
  - `ratioInput: 0.2745`
  - `targetRatio: 0.35`
  - `nextValue: 21.25`
- 这与 `dot-b` 的 `dotPositions=[0,0.35,0.5,0.76,1]` 一致（吸附到 0.35）。

## 代表性日志片段

```text
[DotSliderDebug] {"id":"dot-a","phase":"grant","committedRatio":0,"maxThumbX":306,...}
[DotSliderDebug] {"id":"dot-a","phase":"release-drag","finalRatio":0.7516339869281045,"runtimeMaxThumbX":306}
[DotSliderDebug] {"id":"dot-a","phase":"commit","targetRatio":0.75,"nextValue":75,...}
[DotSliderDebug] {"id":"dot-a","phase":"release-drag","finalRatio":1,"runtimeMaxThumbX":306}
[DotSliderDebug] {"id":"dot-a","phase":"commit","targetRatio":1,"nextValue":100,...}
[DotSliderDebug] {"id":"dot-b","phase":"commit","targetRatio":0.35,"nextValue":21.25,...}
```

## 下一步建议
- 用当前最新代码再按同样流程复测一次三条滑条。
- 若仍异常，请提供这三条滑条各自的最后一组日志（`grant/move/release-start/release-drag/commit`），可快速定位是：
  - 手势未进入拖动分支
  - 吸附点配置导致未到最右
  - 外部受控值回写覆盖
