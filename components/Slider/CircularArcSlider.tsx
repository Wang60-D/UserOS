import React, { useMemo, useRef } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

type SliderMode = 'single' | 'range';
type ActiveFillStyle = 'none' | 'arc' | 'sector';
type HandleStyle = 'solid' | 'hollow';

type GradientStop = {
  offset: string;
  color: string;
};

type TickDot = {
  value: number;
  radius?: number;
  color?: string;
};

type TickLabel = {
  value: number;
  text: string;
  offsetX?: number;
  offsetY?: number;
  color?: string;
  fontSize?: number;
};

export interface CircularArcSliderProps {
  mode?: SliderMode;
  min: number;
  max: number;
  step?: number;
  value?: number;
  rangeValue?: [number, number];
  symmetricRange?: boolean;
  onChange?: (nextValue: number) => void;
  onChangeEnd?: (nextValue: number) => void;
  onRangeChange?: (nextRange: [number, number]) => void;
  onRangeChangeEnd?: (nextRange: [number, number]) => void;

  size?: number;
  centerX?: number;
  centerY?: number;
  radius?: number;
  trackWidth?: number;
  startAngle: number;
  endAngle: number;
  clockwise?: boolean;

  baseTrackColor?: string;
  activeTrackColor?: string;
  activeTrackGradient?: GradientStop[];
  activeFillStyle?: ActiveFillStyle;
  sectorFillColor?: string;

  handleStyle?: HandleStyle;
  handleRadius?: number;
  handleColor?: string;
  handleBorderColor?: string;
  handleBorderWidth?: number;
  hitSlopPx?: number;

  tickDots?: TickDot[];
  tickLabels?: TickLabel[];
  showCenterGuide?: boolean;

  titleText?: string;
  subtitleText?: string;
  valueFormatter?: (value: number) => string;
  rangeValueFormatter?: (range: [number, number]) => string;
  centerValueText?: string;
  centerValueUnitText?: string;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const normalizeAngle = (angle: number) => {
  const mod = angle % 360;
  return mod < 0 ? mod + 360 : mod;
};

const toRad = (deg: number) => (deg * Math.PI) / 180;

const polarPoint = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = toRad(angleDeg);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const roundByStep = (value: number, min: number, step: number) => {
  if (step <= 0) return value;
  const count = Math.round((value - min) / step);
  return min + count * step;
};

const describeArcPath = (
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
  clockwise: boolean
) => {
  const start = polarPoint(cx, cy, r, startDeg);
  const end = polarPoint(cx, cy, r, endDeg);
  const sweepDelta = clockwise
    ? (normalizeAngle(endDeg - startDeg) + 360) % 360
    : (normalizeAngle(startDeg - endDeg) + 360) % 360;
  const largeArcFlag = sweepDelta > 180 ? 1 : 0;
  const sweepFlag = clockwise ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
};

const describeSectorPath = (
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
  clockwise: boolean
) => {
  const start = polarPoint(cx, cy, r, startDeg);
  const end = polarPoint(cx, cy, r, endDeg);
  const sweepDelta = clockwise
    ? (normalizeAngle(endDeg - startDeg) + 360) % 360
    : (normalizeAngle(startDeg - endDeg) + 360) % 360;
  const largeArcFlag = sweepDelta > 180 ? 1 : 0;
  const sweepFlag = clockwise ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y} Z`;
};

const CircularArcSlider: React.FC<CircularArcSliderProps> = ({
  mode = 'single',
  min,
  max,
  step = 1,
  value,
  rangeValue,
  symmetricRange = false,
  onChange,
  onChangeEnd,
  onRangeChange,
  onRangeChangeEnd,
  size = 300,
  centerX,
  centerY,
  radius,
  trackWidth = 30,
  startAngle,
  endAngle,
  clockwise = true,
  baseTrackColor = 'rgba(0,0,0,0.08)',
  activeTrackColor = '#809DE4',
  activeTrackGradient,
  activeFillStyle = 'arc',
  sectorFillColor = 'rgba(128,157,228,0.28)',
  handleStyle = 'solid',
  handleRadius = 12,
  handleColor = '#809DE4',
  handleBorderColor = '#FFFFFF',
  handleBorderWidth = 4,
  hitSlopPx = 26,
  tickDots = [],
  tickLabels = [],
  showCenterGuide = false,
  titleText,
  subtitleText,
  valueFormatter,
  rangeValueFormatter,
  centerValueText,
  centerValueUnitText,
}) => {
  const safeMin = Math.min(min, max);
  const safeMax = Math.max(min, max);
  const safeStep = Math.abs(step) > 1e-6 ? Math.abs(step) : 1;
  const span = Math.max(1e-6, safeMax - safeMin);
  const cx = centerX ?? size / 2;
  const cy = centerY ?? size / 2;
  const r = radius ?? size * 0.38;

  const sweep = useMemo(() => {
    const start = normalizeAngle(startAngle);
    const end = normalizeAngle(endAngle);
    const raw = clockwise ? (end - start + 360) % 360 : (start - end + 360) % 360;
    return raw <= 0 ? 360 : raw;
  }, [clockwise, endAngle, startAngle]);

  const valueToT = (rawValue: number) => clamp((rawValue - safeMin) / span, 0, 1);
  const tToValue = (t: number) => {
    const linear = safeMin + clamp(t, 0, 1) * span;
    return clamp(roundByStep(linear, safeMin, safeStep), safeMin, safeMax);
  };
  const tToAngle = (t: number) => {
    const start = normalizeAngle(startAngle);
    const offset = sweep * clamp(t, 0, 1);
    return clockwise ? normalizeAngle(start + offset) : normalizeAngle(start - offset);
  };
  const angleToT = (angle: number) => {
    const a = normalizeAngle(angle);
    const start = normalizeAngle(startAngle);
    if (clockwise) {
      const delta = (a - start + 360) % 360;
      return clamp(delta / sweep, 0, 1);
    }
    const delta = (start - a + 360) % 360;
    return clamp(delta / sweep, 0, 1);
  };

  const resolvedValue = clamp(value ?? safeMin, safeMin, safeMax);
  const resolvedRange: [number, number] = rangeValue
    ? [clamp(rangeValue[0], safeMin, safeMax), clamp(rangeValue[1], safeMin, safeMax)]
    : [safeMin, safeMax];
  const orderedRange: [number, number] =
    resolvedRange[0] <= resolvedRange[1] ? resolvedRange : [resolvedRange[1], resolvedRange[0]];

  const singleT = valueToT(resolvedValue);
  const rangeT: [number, number] = [valueToT(orderedRange[0]), valueToT(orderedRange[1])];
  const activeHandleRef = useRef<'single' | 'left' | 'right'>('single');

  const commitSingle = (nextT: number, isEnd: boolean) => {
    const nextValue = tToValue(nextT);
    onChange?.(nextValue);
    if (isEnd) onChangeEnd?.(nextValue);
  };

  const commitRange = (nextA: number, nextB: number, isEnd: boolean) => {
    let left = clamp(nextA, 0, 1);
    let right = clamp(nextB, 0, 1);
    if (symmetricRange) {
      const active = activeHandleRef.current === 'right' ? 'right' : 'left';
      if (active === 'left') {
        left = clamp(left, 0, 0.5);
        right = 1 - left;
      } else {
        right = clamp(right, 0.5, 1);
        left = 1 - right;
      }
    } else if (left > right) {
      [left, right] = [right, left];
    }
    const nextRange: [number, number] = [tToValue(left), tToValue(right)];
    onRangeChange?.(nextRange);
    if (isEnd) onRangeChangeEnd?.(nextRange);
  };

  const resolveTouch = (x: number, y: number, isEnd: boolean) => {
    const rawAngle = normalizeAngle((Math.atan2(y - cy, x - cx) * 180) / Math.PI);
    const touchT = angleToT(rawAngle);

    if (mode === 'single') {
      activeHandleRef.current = 'single';
      commitSingle(touchT, isEnd);
      return;
    }

    const leftPoint = polarPoint(cx, cy, r, tToAngle(rangeT[0]));
    const rightPoint = polarPoint(cx, cy, r, tToAngle(rangeT[1]));
    const leftDistance = Math.hypot(x - leftPoint.x, y - leftPoint.y);
    const rightDistance = Math.hypot(x - rightPoint.x, y - rightPoint.y);

    if (leftDistance <= hitSlopPx || rightDistance <= hitSlopPx) {
      activeHandleRef.current = leftDistance <= rightDistance ? 'left' : 'right';
    } else {
      activeHandleRef.current =
        Math.abs(touchT - rangeT[0]) <= Math.abs(touchT - rangeT[1]) ? 'left' : 'right';
    }

    if (activeHandleRef.current === 'left') {
      commitRange(touchT, rangeT[1], isEnd);
    } else {
      commitRange(rangeT[0], touchT, isEnd);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, gesture) =>
        Math.hypot(gesture.dx, gesture.dy) > 2,
      onPanResponderGrant: (evt) => {
        resolveTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY, false);
      },
      onPanResponderMove: (evt) => {
        resolveTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY, false);
      },
      onPanResponderRelease: (evt) => {
        resolveTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY, true);
      },
      onPanResponderTerminate: (evt) => {
        resolveTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY, true);
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const baseArc = describeArcPath(cx, cy, r, startAngle, endAngle, clockwise);
  const activeStartT = mode === 'single' ? 0 : rangeT[0];
  const activeEndT = mode === 'single' ? singleT : rangeT[1];
  const activeStartAngle = tToAngle(activeStartT);
  const activeEndAngle = tToAngle(activeEndT);
  const activeArc = describeArcPath(cx, cy, r, activeStartAngle, activeEndAngle, clockwise);
  const sectorPath = describeSectorPath(cx, cy, r, activeStartAngle, activeEndAngle, clockwise);

  const singleHandle = polarPoint(cx, cy, r, tToAngle(singleT));
  const leftHandle = polarPoint(cx, cy, r, tToAngle(rangeT[0]));
  const rightHandle = polarPoint(cx, cy, r, tToAngle(rangeT[1]));
  const gradientId = useMemo(
    () => `arc-gradient-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  const renderHandle = (x: number, y: number) => (
    <G>
      <Circle
        cx={x}
        cy={y}
        r={handleRadius}
        fill={handleStyle === 'hollow' ? '#FFFFFF' : handleColor}
        stroke={handleStyle === 'hollow' ? handleColor : handleBorderColor}
        strokeWidth={handleStyle === 'hollow' ? handleBorderWidth : 0}
      />
      {handleStyle === 'solid' ? (
        <Circle
          cx={x}
          cy={y}
          r={Math.max(2, handleRadius - 6)}
          fill="#FFFFFF"
          opacity={0.9}
        />
      ) : null}
    </G>
  );

  const centerText =
    centerValueText ??
    (mode === 'single'
      ? valueFormatter?.(resolvedValue) ?? `${Math.round(resolvedValue)}`
      : rangeValueFormatter?.(orderedRange) ??
        `${Math.round(orderedRange[0])}-${Math.round(orderedRange[1])}`);

  return (
    <View style={[styles.container, { width: size, height: size }]} {...panResponder.panHandlers}>
      <Svg width={size} height={size}>
        <Defs>
          {activeTrackGradient && activeTrackGradient.length > 0 ? (
            <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              {activeTrackGradient.map((stop, index) => (
                <Stop key={`stop-${index}`} offset={stop.offset} stopColor={stop.color} />
              ))}
            </LinearGradient>
          ) : null}
        </Defs>

        {showCenterGuide ? (
          <Circle cx={cx} cy={cy} r={r + trackWidth / 2 + 8} stroke="rgba(0,0,0,0.05)" strokeWidth={2} fill="none" />
        ) : null}

        <Path
          d={baseArc}
          stroke={baseTrackColor}
          strokeWidth={trackWidth}
          strokeLinecap="round"
          fill="none"
        />

        {activeFillStyle === 'sector' ? (
          <Path d={sectorPath} fill={sectorFillColor} />
        ) : null}

        {activeFillStyle !== 'none' ? (
          <Path
            d={activeArc}
            stroke={activeTrackGradient?.length ? `url(#${gradientId})` : activeTrackColor}
            strokeWidth={trackWidth}
            strokeLinecap="round"
            fill="none"
          />
        ) : null}

        {tickDots.map((dot, index) => {
          const point = polarPoint(cx, cy, r, tToAngle(valueToT(dot.value)));
          return (
            <Circle
              key={`tick-dot-${index}`}
              cx={point.x}
              cy={point.y}
              r={dot.radius ?? 3}
              fill={dot.color ?? 'rgba(0,0,0,0.18)'}
            />
          );
        })}

        {tickLabels.map((label, index) => {
          const point = polarPoint(cx, cy, r + trackWidth * 0.7, tToAngle(valueToT(label.value)));
          return (
            <SvgText
              key={`tick-label-${index}`}
              x={point.x + (label.offsetX ?? 0)}
              y={point.y + (label.offsetY ?? 0)}
              textAnchor="middle"
              fontSize={label.fontSize ?? 12}
              fill={label.color ?? 'rgba(0,0,0,0.35)'}
            >
              {label.text}
            </SvgText>
          );
        })}

        {mode === 'single' ? renderHandle(singleHandle.x, singleHandle.y) : null}
        {mode === 'range' ? renderHandle(leftHandle.x, leftHandle.y) : null}
        {mode === 'range' ? renderHandle(rightHandle.x, rightHandle.y) : null}
      </Svg>

      {titleText ? <Text style={styles.title}>{titleText}</Text> : null}
      {subtitleText ? <Text style={styles.subtitle}>{subtitleText}</Text> : null}

      <View style={styles.centerValueRow}>
        <Text style={styles.centerValueText}>{centerText}</Text>
        {centerValueUnitText ? <Text style={styles.centerValueUnit}>{centerValueUnitText}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    position: 'absolute',
    top: 18,
    textAlign: 'center',
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  subtitle: {
    position: 'absolute',
    top: 44,
    textAlign: 'center',
    fontSize: 16,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '400',
  },
  centerValueRow: {
    position: 'absolute',
    bottom: 74,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerValueText: {
    fontSize: 45,
    color: '#000000',
    fontWeight: '500',
    lineHeight: 48,
  },
  centerValueUnit: {
    marginLeft: 4,
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    lineHeight: 28,
  },
});

export default CircularArcSlider;
