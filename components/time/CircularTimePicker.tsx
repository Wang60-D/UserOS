import React, { useMemo, useRef } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export interface CircularTimeValue {
  hour: number;
  minute: number;
}

type CircularTimeMode = 'single' | 'range';
type ActiveHandle = 'single' | 'start' | 'end';

export interface CircularTimePickerProps {
  title?: string;
  mode?: CircularTimeMode;
  value?: CircularTimeValue;
  onChange?: (nextValue: CircularTimeValue) => void;
  startValue?: CircularTimeValue;
  endValue?: CircularTimeValue;
  onRangeChange?: (nextStart: CircularTimeValue, nextEnd: CircularTimeValue) => void;
  minuteStep?: number;
  minRangeHours?: number;
  maxRangeHours?: number;
  size?: number;
}

const MINUTES_PER_DAY = 24 * 60;
const DEFAULT_SINGLE_VALUE: CircularTimeValue = { hour: 8, minute: 5 };
const DEFAULT_START_VALUE: CircularTimeValue = { hour: 8, minute: 5 };
const DEFAULT_END_VALUE: CircularTimeValue = { hour: 14, minute: 0 };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const normalizeMinutesInDay = (minutes: number) => {
  const mod = minutes % MINUTES_PER_DAY;
  return mod < 0 ? mod + MINUTES_PER_DAY : mod;
};

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

const describeArcPath = (
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number
) => {
  const start = polarPoint(cx, cy, r, startDeg);
  const end = polarPoint(cx, cy, r, endDeg);
  const sweepDelta = (normalizeAngle(endDeg - startDeg) + 360) % 360;
  const largeArcFlag = sweepDelta > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
};

const valueToMinutes = (value: CircularTimeValue) => {
  const hour = clamp(Math.floor(value.hour), 0, 23);
  const minute = clamp(Math.floor(value.minute), 0, 59);
  return hour * 60 + minute;
};

const minutesToValue = (minutes: number): CircularTimeValue => {
  const safe = normalizeMinutesInDay(Math.round(minutes));
  return {
    hour: Math.floor(safe / 60),
    minute: safe % 60,
  };
};

const formatTime = (value: CircularTimeValue) =>
  `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;

const quantizeMinutes = (minutes: number, step: number) => {
  const safeStep = Math.max(1, Math.floor(step));
  return Math.round(minutes / safeStep) * safeStep;
};

const minutesToAngle = (minutes: number) => -90 + (minutes / MINUTES_PER_DAY) * 360;

const angleToMinutes = (angle: number) => {
  const normalized = normalizeAngle(angle + 90);
  return (normalized / 360) * MINUTES_PER_DAY;
};

const getCircularDelta = (current: number, previous: number) => {
  let delta = current - previous;
  if (delta > MINUTES_PER_DAY / 2) delta -= MINUTES_PER_DAY;
  if (delta < -MINUTES_PER_DAY / 2) delta += MINUTES_PER_DAY;
  return delta;
};

const circularDistance = (a: number, b: number) => {
  const aNorm = normalizeMinutesInDay(a);
  const bNorm = normalizeMinutesInDay(b);
  const diff = Math.abs(aNorm - bNorm);
  return Math.min(diff, MINUTES_PER_DAY - diff);
};

const pickNearestEquivalent = (targetInDay: number, anchor: number) => {
  const base = Math.round((anchor - targetInDay) / MINUTES_PER_DAY);
  let best = targetInDay + base * MINUTES_PER_DAY;
  let bestDistance = Math.abs(best - anchor);
  for (let k = base - 2; k <= base + 2; k += 1) {
    const candidate = targetInDay + k * MINUTES_PER_DAY;
    const distance = Math.abs(candidate - anchor);
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }
  return best;
};

const resolveSyncedEnd = (
  targetEndInDay: number,
  syncedStart: number,
  anchorEnd: number,
  minGap: number,
  maxGap: number
) => {
  const base = Math.round((anchorEnd - targetEndInDay) / MINUTES_PER_DAY);
  let bestCandidate: number | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let k = base - 3; k <= base + 3; k += 1) {
    const candidate = targetEndInDay + k * MINUTES_PER_DAY;
    const gap = candidate - syncedStart;
    if (gap < minGap || gap > maxGap) continue;
    const distance = Math.abs(candidate - anchorEnd);
    if (distance < bestDistance) {
      bestCandidate = candidate;
      bestDistance = distance;
    }
  }
  if (bestCandidate != null) return bestCandidate;
  const fallback = targetEndInDay + base * MINUTES_PER_DAY;
  return clamp(fallback, syncedStart + minGap, syncedStart + maxGap);
};

const normalizeUnwrappedRange = (start: number, end: number): [number, number] => {
  const shift = Math.floor(start / MINUTES_PER_DAY);
  return [start - shift * MINUTES_PER_DAY, end - shift * MINUTES_PER_DAY];
};

const CircularTimePicker: React.FC<CircularTimePickerProps> = ({
  title = '选择时间',
  mode = 'single',
  value,
  onChange,
  startValue,
  endValue,
  onRangeChange,
  minuteStep = 5,
  minRangeHours = 1,
  maxRangeHours = 20,
  size = 300,
}) => {
  const center = size / 2;
  const outerTrackRadius = size * 0.37;
  const activeTrackRadius = outerTrackRadius;
  const outerTrackWidth = size * 0.12;
  const innerDiskRadius = size * 0.31;
  const handleRadius = size * 0.055;
  const handleHitRadius = handleRadius;

  const safeSingle = value ?? DEFAULT_SINGLE_VALUE;
  const safeStart = startValue ?? DEFAULT_START_VALUE;
  const safeEnd = endValue ?? DEFAULT_END_VALUE;

  const step = Math.max(1, Math.floor(minuteStep));
  const minGapMin = Math.max(60, Math.round(minRangeHours * 60));
  const maxGapMin = Math.max(minGapMin, Math.min(MINUTES_PER_DAY - 1, Math.round(maxRangeHours * 60)));

  const singleMinutes = quantizeMinutes(valueToMinutes(safeSingle), step);
  const startMinutesRaw = quantizeMinutes(valueToMinutes(safeStart), step);
  const endMinutesRaw = quantizeMinutes(valueToMinutes(safeEnd), step);

  const activeHandleRef = useRef<ActiveHandle>('single');
  const modeRef = useRef<CircularTimeMode>(mode);
  const singleMinutesRef = useRef(singleMinutes);
  const startMinutesRef = useRef(startMinutesRaw);
  const endMinutesRef = useRef(
    clamp(
      endMinutesRaw <= startMinutesRaw ? endMinutesRaw + MINUTES_PER_DAY : endMinutesRaw,
      startMinutesRaw + minGapMin,
      startMinutesRaw + maxGapMin
    )
  );
  const minGapMinRef = useRef(minGapMin);
  const maxGapMinRef = useRef(maxGapMin);
  const stepRef = useRef(step);
  const onChangeRef = useRef(onChange);
  const onRangeChangeRef = useRef(onRangeChange);
  const lastTouchMinutesRef = useRef<number | null>(null);

  modeRef.current = mode;
  singleMinutesRef.current = singleMinutes;
  if (mode === 'range') {
    const syncedStart = pickNearestEquivalent(startMinutesRaw, startMinutesRef.current);
    const syncedEnd = resolveSyncedEnd(
      endMinutesRaw,
      syncedStart,
      endMinutesRef.current,
      minGapMin,
      maxGapMin
    );
    const [normStart, normEnd] = normalizeUnwrappedRange(syncedStart, syncedEnd);
    startMinutesRef.current = normStart;
    endMinutesRef.current = normEnd;
  }
  minGapMinRef.current = minGapMin;
  maxGapMinRef.current = maxGapMin;
  stepRef.current = step;
  onChangeRef.current = onChange;
  onRangeChangeRef.current = onRangeChange;

  const resolveTouchToMinutes = (touchX: number, touchY: number) => {
    const rawAngle = (Math.atan2(touchY - center, touchX - center) * 180) / Math.PI;
    return angleToMinutes(rawAngle);
  };

  const resolveActiveHandle = (touchX: number, touchY: number) => {
    const currentStart = startMinutesRef.current;
    const currentEnd = endMinutesRef.current;
    const startPoint = polarPoint(
      center,
      center,
      outerTrackRadius,
      minutesToAngle(normalizeMinutesInDay(currentStart))
    );
    const endPoint = polarPoint(
      center,
      center,
      outerTrackRadius,
      minutesToAngle(normalizeMinutesInDay(currentEnd))
    );
    const startDistance = Math.hypot(touchX - startPoint.x, touchY - startPoint.y);
    const endDistance = Math.hypot(touchX - endPoint.x, touchY - endPoint.y);

    if (startDistance <= handleHitRadius || endDistance <= handleHitRadius) {
      return startDistance <= endDistance ? 'start' : 'end';
    }

    const touchMinutes = quantizeMinutes(resolveTouchToMinutes(touchX, touchY), stepRef.current);
    return circularDistance(touchMinutes, currentStart) <= circularDistance(touchMinutes, currentEnd)
      ? 'start'
      : 'end';
  };

  const applyRangeDelta = (delta: number) => {
    let s = startMinutesRef.current;
    let e = endMinutesRef.current;
    const active = activeHandleRef.current;
    const minGap = minGapMinRef.current;
    const maxGap = maxGapMinRef.current;

    if (active === 'end') {
      const minEnd = s + minGap;
      const maxEnd = s + maxGap;
      const minDelta = minEnd - e;
      const maxDelta = maxEnd - e;
      if (delta < minDelta) {
        const shift = delta - minDelta;
        e = minEnd + shift;
        s += shift;
      } else if (delta > maxDelta) {
        const shift = delta - maxDelta;
        e = maxEnd + shift;
        s += shift;
      } else {
        e += delta;
      }
    } else if (active === 'start') {
      const minStart = e - maxGap;
      const maxStart = e - minGap;
      const minDelta = minStart - s;
      const maxDelta = maxStart - s;
      if (delta < minDelta) {
        const shift = delta - minDelta;
        s = minStart + shift;
        e += shift;
      } else if (delta > maxDelta) {
        const shift = delta - maxDelta;
        s = maxStart + shift;
        e += shift;
      } else {
        s += delta;
      }
    } else {
      return;
    }

    if (e - s < minGap) e = s + minGap;
    if (e - s > maxGap) e = s + maxGap;
    [s, e] = normalizeUnwrappedRange(s, e);
    startMinutesRef.current = s;
    endMinutesRef.current = e;

    onRangeChangeRef.current?.(
      minutesToValue(quantizeMinutes(s, stepRef.current)),
      minutesToValue(quantizeMinutes(e, stepRef.current))
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, gesture) => Math.hypot(gesture.dx, gesture.dy) > 1.5,
      onPanResponderGrant: (evt) => {
        const x = evt.nativeEvent.locationX;
        const y = evt.nativeEvent.locationY;
        const touchMinutes = resolveTouchToMinutes(x, y);
        lastTouchMinutesRef.current = touchMinutes;
        if (modeRef.current === 'single') {
          activeHandleRef.current = 'single';
          onChangeRef.current?.(
            minutesToValue(quantizeMinutes(touchMinutes, stepRef.current))
          );
        } else {
          activeHandleRef.current = resolveActiveHandle(x, y);
        }
      },
      onPanResponderMove: (evt) => {
        const touchMinutes = resolveTouchToMinutes(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
        if (modeRef.current === 'single') {
          onChangeRef.current?.(
            minutesToValue(quantizeMinutes(touchMinutes, stepRef.current))
          );
          lastTouchMinutesRef.current = touchMinutes;
          return;
        }
        const prevTouch = lastTouchMinutesRef.current;
        if (prevTouch == null) {
          lastTouchMinutesRef.current = touchMinutes;
          return;
        }
        const delta = getCircularDelta(touchMinutes, prevTouch);
        lastTouchMinutesRef.current = touchMinutes;
        if (Math.abs(delta) < 0.01) return;
        applyRangeDelta(delta);
      },
      onPanResponderRelease: (evt) => {
        const touchMinutes = resolveTouchToMinutes(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
        if (modeRef.current === 'single') {
          onChangeRef.current?.(
            minutesToValue(quantizeMinutes(touchMinutes, stepRef.current))
          );
        } else if (lastTouchMinutesRef.current != null) {
          const delta = getCircularDelta(touchMinutes, lastTouchMinutesRef.current);
          if (Math.abs(delta) >= 0.01) {
            applyRangeDelta(delta);
          }
        }
        lastTouchMinutesRef.current = null;
      },
      onPanResponderTerminate: (evt) => {
        const touchMinutes = resolveTouchToMinutes(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
        if (modeRef.current === 'single') {
          onChangeRef.current?.(
            minutesToValue(quantizeMinutes(touchMinutes, stepRef.current))
          );
        }
        lastTouchMinutesRef.current = null;
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const singleHandlePoint = useMemo(
    () => polarPoint(center, center, outerTrackRadius, minutesToAngle(normalizeMinutesInDay(singleMinutes))),
    [center, outerTrackRadius, singleMinutes]
  );

  const startMinutesDisplay = normalizeMinutesInDay(startMinutesRef.current);
  const endMinutesDisplay = normalizeMinutesInDay(endMinutesRef.current);
  const startHandlePoint = useMemo(
    () => polarPoint(center, center, activeTrackRadius, minutesToAngle(startMinutesDisplay)),
    [activeTrackRadius, center, startMinutesDisplay]
  );
  const endHandlePoint = useMemo(
    () => polarPoint(center, center, activeTrackRadius, minutesToAngle(endMinutesDisplay)),
    [activeTrackRadius, center, endMinutesDisplay]
  );

  const rangeArcPath = describeArcPath(
    center,
    center,
    activeTrackRadius,
    minutesToAngle(startMinutesDisplay),
    minutesToAngle(endMinutesDisplay)
  );

  const hourLabels = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const hour = (index * 2) % 24;
        const minutes = hour * 60;
        const point = polarPoint(center, center, innerDiskRadius * 0.86, minutesToAngle(minutes));
        return { hour, point };
      }),
    [center, innerDiskRadius]
  );

  const labelSingle = minutesToValue(singleMinutes);
  const labelStart = minutesToValue(startMinutesRef.current);
  const labelEnd = minutesToValue(endMinutesRef.current);

  const renderHandle = (x: number, y: number) => (
    <>
      <Circle cx={x} cy={y} r={handleRadius} fill="#809DE4" />
      <Circle cx={x} cy={y} r={handleRadius * 0.45} fill="#FFFFFF" />
    </>
  );

  return (
    <View style={[styles.container, { width: size }]} {...panResponder.panHandlers}>
      <Text style={styles.title}>{title}</Text>
      {mode === 'single' ? (
        <Text style={styles.singleTime}>{formatTime(labelSingle)}</Text>
      ) : (
        <View style={styles.rangeHeader}>
          <View style={styles.rangeHeaderItem}>
            <Text style={styles.rangeHeaderLabel}>开始</Text>
            <Text style={styles.rangeHeaderValue}>{formatTime(labelStart)}</Text>
          </View>
          <View style={styles.rangeHeaderItem}>
            <Text style={styles.rangeHeaderLabel}>结束</Text>
            <Text style={styles.rangeHeaderValue}>{formatTime(labelEnd)}</Text>
          </View>
        </View>
      )}

      <View style={styles.dialWrap}>
        <Svg width={size} height={size}>
          <Circle cx={center} cy={center} r={outerTrackRadius} fill="none" stroke="#ECECEC" strokeWidth={outerTrackWidth} />
          <Circle cx={center} cy={center} r={innerDiskRadius} fill="#E3E3E3" />

          {mode === 'range' ? (
            <Path d={rangeArcPath} stroke="#809DE4" strokeWidth={outerTrackWidth} strokeLinecap="round" fill="none" />
          ) : null}

          {hourLabels.map((item) => (
            <Circle
              key={`tick-${item.hour}`}
              cx={polarPoint(center, center, outerTrackRadius + outerTrackWidth * 0.16, minutesToAngle(item.hour * 60)).x}
              cy={polarPoint(center, center, outerTrackRadius + outerTrackWidth * 0.16, minutesToAngle(item.hour * 60)).y}
              r={2.2}
              fill="rgba(0,0,0,0.2)"
            />
          ))}

          {mode === 'single' ? renderHandle(singleHandlePoint.x, singleHandlePoint.y) : null}
          {mode === 'range' ? renderHandle(startHandlePoint.x, startHandlePoint.y) : null}
          {mode === 'range' ? renderHandle(endHandlePoint.x, endHandlePoint.y) : null}
        </Svg>

        <View style={[styles.labelLayer, { width: size, height: size }]}>
          {hourLabels.map((item) => (
            <Text
              key={`label-${item.hour}`}
              style={[
                styles.hourLabel,
                {
                  left: item.point.x - 11,
                  top: item.point.y - 12,
                },
              ]}
            >
              {item.hour}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    paddingTop: 18,
    paddingBottom: 18,
    alignItems: 'center',
    alignSelf: 'center',
  },
  title: {
    fontSize: 21,
    lineHeight: 28,
    color: '#000000',
    fontWeight: '500',
  },
  singleTime: {
    marginTop: 8,
    fontSize: 46,
    lineHeight: 56,
    color: '#000000',
    fontWeight: '500',
  },
  rangeHeader: {
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  rangeHeaderItem: {
    alignItems: 'flex-start',
  },
  rangeHeaderLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '400',
  },
  rangeHeaderValue: {
    marginTop: 2,
    fontSize: 34,
    lineHeight: 40,
    color: '#000000',
    fontWeight: '500',
  },
  dialWrap: {
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelLayer: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  hourLabel: {
    position: 'absolute',
    width: 22,
    textAlign: 'center',
    fontSize: 32 / 2,
    lineHeight: 18,
    color: '#363636',
    fontWeight: '500',
  },
});

export default CircularTimePicker;
