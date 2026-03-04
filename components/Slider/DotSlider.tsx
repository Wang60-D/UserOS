import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { TOKENS } from '../../tokens';

type DotDistribution = 'even' | 'custom';
type FillMode = 'none' | 'left' | 'between' | 'all';
type InteractionMode = 'drag' | 'tap' | 'both';

export interface DotSliderProps {
  value?: number;
  onChange?: (nextValue: number) => void;
  onChangeEnd?: (nextValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showDots?: boolean;
  snapToDots?: boolean;
  dotDistribution?: DotDistribution;
  dotPositions?: number[];
  dotVisibleMask?: boolean[];
  dotCount?: number;
  showEdgeValues?: boolean;
  edgeValues?: [string | number, string | number];
  showTickLabels?: boolean;
  tickLabels?: Array<string | number>;
  showFill?: boolean;
  fillMode?: FillMode;
  interactionMode?: InteractionMode;
  isRange?: boolean;
  rangeValue?: [number, number];
  debugId?: string;
  debugEnabled?: boolean;
}

export const DEFAULT_DOT_SLIDER_CONFIG = {
  min: 0,
  max: 100,
  step: 1,
  showDots: true,
  snapToDots: true,
  dotDistribution: 'even' as DotDistribution,
  dotPositions: undefined as number[] | undefined,
  dotVisibleMask: undefined as boolean[] | undefined,
  dotCount: 5,
  showEdgeValues: false,
  edgeValues: undefined as [string | number, string | number] | undefined,
  showTickLabels: false,
  tickLabels: undefined as Array<string | number> | undefined,
  showFill: true,
  fillMode: 'left' as FillMode,
  interactionMode: 'both' as InteractionMode,
  isRange: false,
  rangeValue: undefined as [number, number] | undefined,
} as const;

const TRACK_HEIGHT = 32;
const TRACK_PADDING = 2;
const TRACK_INNER_HEIGHT = 28;
const THUMB_SIZE = 28;
const THUMB_INNER_SIZE = 20;
const LABEL_ROW_HEIGHT = 13;
const MIN_STOPS = 2;
const MAX_STOPS = 8;
const DRAG_START_HIT_SLOP = 14;

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));
const clamp01 = (value: number) => clamp(value, 0, 1);

const DotSlider: React.FC<DotSliderProps> = ({
  value,
  onChange,
  onChangeEnd,
  min = DEFAULT_DOT_SLIDER_CONFIG.min,
  max = DEFAULT_DOT_SLIDER_CONFIG.max,
  step = DEFAULT_DOT_SLIDER_CONFIG.step,
  showDots = DEFAULT_DOT_SLIDER_CONFIG.showDots,
  snapToDots = DEFAULT_DOT_SLIDER_CONFIG.snapToDots,
  dotDistribution = DEFAULT_DOT_SLIDER_CONFIG.dotDistribution,
  dotPositions = DEFAULT_DOT_SLIDER_CONFIG.dotPositions,
  dotVisibleMask = DEFAULT_DOT_SLIDER_CONFIG.dotVisibleMask,
  dotCount = DEFAULT_DOT_SLIDER_CONFIG.dotCount,
  showEdgeValues = DEFAULT_DOT_SLIDER_CONFIG.showEdgeValues,
  edgeValues = DEFAULT_DOT_SLIDER_CONFIG.edgeValues,
  showTickLabels = DEFAULT_DOT_SLIDER_CONFIG.showTickLabels,
  tickLabels = DEFAULT_DOT_SLIDER_CONFIG.tickLabels,
  showFill = DEFAULT_DOT_SLIDER_CONFIG.showFill,
  fillMode = DEFAULT_DOT_SLIDER_CONFIG.fillMode,
  interactionMode = DEFAULT_DOT_SLIDER_CONFIG.interactionMode,
  isRange = DEFAULT_DOT_SLIDER_CONFIG.isRange,
  debugId = 'dot-slider',
  debugEnabled = false,
}) => {
  const canDrag = interactionMode === 'drag' || interactionMode === 'both';
  const canTap = interactionMode === 'tap' || interactionMode === 'both';
  const isControlled = typeof value === 'number';

  const [internalValue, setInternalValue] = useState(min);
  const [optimisticValue, setOptimisticValue] = useState<number | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [dragRatio, setDragRatio] = useState<number | null>(null);

  const translateX = useRef(new Animated.Value(0)).current;
  const trackWidthRef = useRef(0);
  const maxThumbXRef = useRef(0);
  const committedRatioRef = useRef(0);
  const canDragRef = useRef(canDrag);
  const canTapRef = useRef(canTap);
  const isDraggingRef = useRef(false);
  const isThumbDragRef = useRef(false);
  const dragTouchOffsetRef = useRef(0);
  const currentRatioRef = useRef(0);
  const startLocationXRef = useRef(0);

  const logDebug = (phase: string, payload: Record<string, unknown>) => {
    if (!debugEnabled) return;
    const body = {
      ts: Date.now(),
      id: debugId,
      phase,
      ...payload,
    };
    console.log(`[DotSliderDebug] ${JSON.stringify(body)}`);
  };

  const resolvedStops = useMemo(() => {
    if (dotDistribution === 'custom' && dotPositions && dotPositions.length >= MIN_STOPS) {
      const normalized = Array.from(
        new Set(dotPositions.map((item) => clamp01(item)).sort((a, b) => a - b))
      );
      return normalized.length >= MIN_STOPS ? normalized : [0, 1];
    }
    const countFromLabels = tickLabels?.length ?? 0;
    const rawCount = Math.max(dotCount, countFromLabels, MIN_STOPS);
    const count = Math.min(MAX_STOPS, rawCount);
    return Array.from({ length: count }, (_, index) => index / (count - 1));
  }, [dotCount, dotDistribution, dotPositions, tickLabels]);

  const stops = useMemo(
    () => (resolvedStops.length >= MIN_STOPS ? resolvedStops : [0, 1]),
    [resolvedStops]
  );

  const activeValue = optimisticValue ?? (isControlled ? (value as number) : internalValue);
  const clampedValue = clamp(activeValue, min, max);
  const valueRange = Math.max(1e-6, max - min);
  const committedRatio = clamp01((clampedValue - min) / valueRange);
  const displayRatio = dragRatio ?? committedRatio;
  const innerWidth = Math.max(0, trackWidth - TRACK_PADDING * 2);
  const maxThumbX = Math.max(0, innerWidth - THUMB_SIZE);
  const edgeLabelValues: [string | number, string | number] = edgeValues ?? [min, max];
  maxThumbXRef.current = maxThumbX;
  committedRatioRef.current = committedRatio;
  canDragRef.current = canDrag;
  canTapRef.current = canTap;

  useEffect(() => {
    currentRatioRef.current = displayRatio;
  }, [displayRatio]);

  const ratioToThumbX = (ratio: number) => clamp01(ratio) * maxThumbX;
  const ratioToThumbXByMax = (ratio: number, currentMaxThumbX: number) =>
    clamp01(ratio) * Math.max(0, currentMaxThumbX);
  const ratioToValue = (ratio: number) => min + clamp01(ratio) * (max - min);
  const locationXToRatio = (locationX: number) => {
    const safeTrackWidth = trackWidthRef.current;
    const currentInnerWidth = Math.max(0, safeTrackWidth - TRACK_PADDING * 2);
    const currentMaxThumbX = Math.max(0, currentInnerWidth - THUMB_SIZE);
    if (currentMaxThumbX <= 0) return 0;
    const thumbX = locationX - TRACK_PADDING - THUMB_SIZE / 2;
    return clamp01(thumbX / currentMaxThumbX);
  };

  const getNearestStop = (ratio: number) =>
    stops.reduce((nearest, item) =>
      Math.abs(item - ratio) < Math.abs(nearest - ratio) ? item : nearest
    );

  const animateToRatio = (ratio: number, immediate = false) => {
    const toValue = ratioToThumbX(ratio);
    if (immediate) {
      translateX.setValue(toValue);
      return;
    }
    Animated.spring(translateX, {
      toValue,
      useNativeDriver: false,
      tension: 90,
      friction: 12,
    }).start();
  };

  const commitRatio = (ratio: number, fromRelease = false) => {
    const normalized = clamp01(ratio);
    const targetRatio = snapToDots ? getNearestStop(normalized) : normalized;
    const nextValue = ratioToValue(targetRatio);
    logDebug('commit', {
      ratioInput: ratio,
      normalized,
      targetRatio,
      nextValue,
      fromRelease,
      isControlled,
    });
    setOptimisticValue(nextValue);
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
    if (fromRelease) {
      onChangeEnd?.(nextValue);
    }
    animateToRatio(targetRatio, false);
  };

  useEffect(() => {
    if (!isControlled) {
      if (optimisticValue !== null) setOptimisticValue(null);
      return;
    }
    if (optimisticValue === null || typeof value !== 'number') return;
    if (Math.abs(value - optimisticValue) < 1e-6) {
      setOptimisticValue(null);
    }
  }, [isControlled, optimisticValue, value]);

  useEffect(() => {
    if (isDraggingRef.current) return;
    animateToRatio(committedRatio, false);
  }, [committedRatio, maxThumbX]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setTrackWidth(width);
    trackWidthRef.current = width;
    logDebug('layout', {
      width,
      committedRatio,
      maxThumbX,
    });
    animateToRatio(committedRatio, true);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => canTap || canDrag,
      onStartShouldSetPanResponderCapture: () => canTap || canDrag,
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        canDrag && Math.hypot(gestureState.dx, gestureState.dy) > 2,
      onMoveShouldSetPanResponderCapture: (_evt, gestureState) =>
        canDrag && Math.hypot(gestureState.dx, gestureState.dy) > 2,
      onPanResponderGrant: (evt) => {
        isDraggingRef.current = false;
        isThumbDragRef.current = false;

        const startX = evt.nativeEvent.locationX;
        startLocationXRef.current = startX;
        const thumbCenterX =
          TRACK_PADDING +
          ratioToThumbXByMax(committedRatioRef.current, maxThumbXRef.current) +
          THUMB_SIZE / 2;
        const distanceToThumb = Math.abs(startX - thumbCenterX);
        logDebug('grant', {
          startX,
          thumbCenterX,
          distanceToThumb,
          committedRatio: committedRatioRef.current,
          canDrag: canDragRef.current,
          canTap: canTapRef.current,
          maxThumbX: maxThumbXRef.current,
        });

        if (
          canDragRef.current &&
          distanceToThumb <= THUMB_SIZE / 2 + DRAG_START_HIT_SLOP
        ) {
          isDraggingRef.current = true;
          isThumbDragRef.current = true;
          dragTouchOffsetRef.current = startX - thumbCenterX;
          setDragRatio(committedRatioRef.current);
          currentRatioRef.current = committedRatioRef.current;
          translateX.stopAnimation();
          logDebug('grant-thumb-drag-enabled', {
            dragTouchOffset: dragTouchOffsetRef.current,
          });
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (
          !isDraggingRef.current ||
          !isThumbDragRef.current ||
          !canDragRef.current
        )
          return;
        if (Math.hypot(gestureState.dx, gestureState.dy) <= 2) return;
        const localX = startLocationXRef.current + gestureState.dx;
        const thumbCenterX = localX - dragTouchOffsetRef.current;
        const thumbX = thumbCenterX - TRACK_PADDING - THUMB_SIZE / 2;
        const runtimeMaxThumbX = maxThumbXRef.current;
        const nextRatio =
          runtimeMaxThumbX <= 0 ? 0 : clamp01(thumbX / runtimeMaxThumbX);
        setDragRatio(nextRatio);
        currentRatioRef.current = nextRatio;
        translateX.setValue(ratioToThumbXByMax(nextRatio, runtimeMaxThumbX));
        logDebug('move', {
          locationX: evt.nativeEvent.locationX,
          dx: gestureState.dx,
          dy: gestureState.dy,
          localX,
          thumbCenterX,
          thumbX,
          runtimeMaxThumbX,
          nextRatio,
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        const movedDistance = Math.hypot(gestureState.dx, gestureState.dy);
        const isTapGesture = movedDistance <= 6;
        logDebug('release-start', {
          locationX: evt.nativeEvent.locationX,
          dx: gestureState.dx,
          dy: gestureState.dy,
          movedDistance,
          isTapGesture,
          isDragging: isDraggingRef.current,
          isThumbDrag: isThumbDragRef.current,
          currentRatio: currentRatioRef.current,
        });

        if (isDraggingRef.current && isThumbDragRef.current) {
          const localX = startLocationXRef.current + gestureState.dx;
          const thumbCenterX = localX - dragTouchOffsetRef.current;
          const thumbX = thumbCenterX - TRACK_PADDING - THUMB_SIZE / 2;
          const runtimeMaxThumbX = maxThumbXRef.current;
          const finalRatio =
            runtimeMaxThumbX <= 0
              ? currentRatioRef.current
              : clamp01(thumbX / runtimeMaxThumbX);
          setDragRatio(null);
          isDraggingRef.current = false;
          isThumbDragRef.current = false;
          logDebug('release-drag', {
            finalRatio,
            runtimeMaxThumbX,
          });
          commitRatio(finalRatio, true);
          return;
        }

        if (canTapRef.current && isTapGesture) {
          const tapRatio = locationXToRatio(evt.nativeEvent.locationX);
          setDragRatio(null);
          logDebug('release-tap', {
            tapRatio,
          });
          commitRatio(tapRatio, true);
          return;
        }

        setDragRatio(null);
        isDraggingRef.current = false;
        isThumbDragRef.current = false;
        logDebug('release-cancel', {
          committedRatio: committedRatioRef.current,
        });
        animateToRatio(committedRatioRef.current, false);
      },
      onPanResponderTerminate: () => {
        setDragRatio(null);
        isDraggingRef.current = false;
        isThumbDragRef.current = false;
        logDebug('terminate', {
          committedRatio: committedRatioRef.current,
        });
        animateToRatio(committedRatioRef.current, false);
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const fillVisible = showFill && fillMode !== 'none';
  const fillStartRatio = fillMode === 'between' ? displayRatio : 0;
  const fillEndRatio = fillMode === 'all' ? 1 : displayRatio;
  const fillLeft = ratioToThumbX(Math.min(fillStartRatio, fillEndRatio));
  const fillRight = ratioToThumbX(Math.max(fillStartRatio, fillEndRatio)) + THUMB_SIZE;
  const fillWidth = fillMode === 'none' ? 0 : Math.max(0, fillRight - fillLeft);

  const isDotActive = (ratio: number) => {
    if (!fillVisible) return false;
    if (fillMode === 'all') return true;
    return ratio <= displayRatio;
  };

  const displayedTickLabels = useMemo(() => {
    if (tickLabels && tickLabels.length === stops.length) {
      return tickLabels.map((item) => String(item));
    }
    return stops.map((ratio) => {
      const rawValue = min + ratio * (max - min);
      if (Math.abs(step) < 1e-6) return String(Math.round(rawValue));
      const snapped = Math.round(rawValue / step) * step;
      return String(Number(snapped.toFixed(3)));
    });
  }, [max, min, step, stops, tickLabels]);

  const animatedFillWidth = Animated.add(translateX, THUMB_SIZE);

  return (
    <View style={styles.container}>
      <View style={styles.trackOuter} onLayout={handleLayout} {...panResponder.panHandlers}>
        <View style={styles.trackBase} />
        {fillVisible &&
          (fillMode === 'left' || fillMode === 'between' ? (
            <Animated.View
              style={[
                styles.fillLayer,
                {
                  left: TRACK_PADDING,
                  width: animatedFillWidth,
                },
              ]}
            />
          ) : (
            <View
              style={[
                styles.fillLayer,
                {
                  left: TRACK_PADDING + fillLeft,
                  width: fillWidth,
                },
              ]}
            />
          ))}

        {showDots &&
          stops.map((ratio, index) => {
            const visible = dotVisibleMask ? dotVisibleMask[index] !== false : true;
            if (!visible) return null;
            const dotCenterX = TRACK_PADDING + ratioToThumbX(ratio) + THUMB_SIZE / 2;
            return (
              <View
                key={`dot-${index}`}
                style={[
                  styles.dot,
                  {
                    left: dotCenterX - 3,
                    backgroundColor: isDotActive(ratio) ? 'rgba(255,255,255,0.35)' : '#CDCDCD',
                  },
                ]}
              />
            );
          })}

        {showEdgeValues && (
          <>
            <Text style={[styles.edgeValue, styles.leftEdgeValue]}>{String(edgeLabelValues[0])}</Text>
            <Text style={[styles.edgeValue, styles.rightEdgeValue]}>{String(edgeLabelValues[1])}</Text>
          </>
        )}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.thumbOuter,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={styles.thumbInner} />
        </Animated.View>
      </View>

      {showTickLabels && (
        <View style={styles.labelRow}>
          {stops.map((ratio, index) => {
            const centerX = TRACK_PADDING + ratioToThumbX(ratio) + THUMB_SIZE / 2;
            return (
              <View key={`tick-${index}`} style={[styles.tickLabelWrap, { left: centerX - 14 }]}>
                <Text style={styles.tickLabel}>{displayedTickLabels[index]}</Text>
              </View>
            );
          })}
        </View>
      )}

      {isRange && <Text style={styles.rangeHint}>范围滑条模式将在 Phase 2 补齐</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  trackOuter: {
    width: '100%',
    height: TRACK_HEIGHT,
    justifyContent: 'center',
  },
  trackBase: {
    position: 'absolute',
    left: TRACK_PADDING,
    right: TRACK_PADDING,
    height: TRACK_INNER_HEIGHT,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.rightPillBg,
  },
  fillLayer: {
    position: 'absolute',
    height: TRACK_INNER_HEIGHT,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.mainColor,
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: TOKENS.radius.pill,
    top: (TRACK_HEIGHT - 6) / 2,
  },
  edgeValue: {
    position: 'absolute',
    top: 10,
    fontSize: 10,
    fontWeight: '500',
    color: '#C5C5C5',
  },
  leftEdgeValue: {
    left: 8,
  },
  rightEdgeValue: {
    right: 8,
  },
  thumbOuter: {
    position: 'absolute',
    left: TRACK_PADDING,
    top: (TRACK_HEIGHT - THUMB_SIZE) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: TOKENS.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbInner: {
    width: THUMB_INNER_SIZE,
    height: THUMB_INNER_SIZE,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  labelRow: {
    marginTop: 4,
    height: LABEL_ROW_HEIGHT,
    position: 'relative',
  },
  tickLabelWrap: {
    position: 'absolute',
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.4)',
  },
  rangeHint: {
    marginTop: 6,
    fontSize: 10,
    color: 'rgba(0,0,0,0.35)',
  },
});

export default DotSlider;
