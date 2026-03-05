# CircularArcSlider

统一圆弧滑条组件，支持单把手、双把手对称范围、渐变轨道、扇形高亮、刻度点/刻度文案与中心值显示。

## Props（核心）

- `mode`: `'single' | 'range'`
- `min` / `max` / `step`
- `value` / `onChange` / `onChangeEnd`
- `rangeValue` / `onRangeChange` / `onRangeChangeEnd`
- `symmetricRange`: 双把手镜像

- `startAngle` / `endAngle` / `clockwise`
- `size` / `centerX` / `centerY` / `radius` / `trackWidth`

- `baseTrackColor`
- `activeTrackColor`
- `activeTrackGradient`: `[{ offset, color }]`
- `activeFillStyle`: `'none' | 'arc' | 'sector'`
- `sectorFillColor`

- `handleStyle`: `'solid' | 'hollow'`
- `handleRadius` / `handleColor` / `handleBorderColor` / `handleBorderWidth`
- `hitSlopPx`

- `tickDots`: `[{ value, radius?, color? }]`
- `tickLabels`: `[{ value, text, offsetX?, offsetY?, color?, fontSize? }]`
- `showCenterGuide`

- `titleText` / `subtitleText`
- `valueFormatter` / `rangeValueFormatter`
- `centerValueText` / `centerValueUnitText`

## 示例（单把手）

```tsx
<CircularArcSlider
  mode="single"
  min={0}
  max={180}
  step={1}
  value={angle}
  onChange={setAngle}
  startAngle={180}
  endAngle={360}
  trackWidth={34}
  titleText="调光"
  subtitleText={`${angle}°`}
  valueFormatter={(v) => `${Math.round(v)}`}
  centerValueUnitText="°"
/>
```

## 示例（双把手对称）

```tsx
<CircularArcSlider
  mode="range"
  min={0}
  max={120}
  step={30}
  rangeValue={range}
  onRangeChange={setRange}
  symmetricRange={true}
  startAngle={215}
  endAngle={325}
  activeFillStyle="sector"
  rangeValueFormatter={(r) => `${Math.round((r[1] - r[0]) / 2)}°`}
/>
```
