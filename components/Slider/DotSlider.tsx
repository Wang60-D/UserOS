import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';
import { TOKENS } from '../../tokens';
import { traceStateFlow } from '../../utils/stateflow/traceStateFlow';

type DotDistribution = 'even' | 'custom';
type FillMode = 'none' | 'left' | 'between' | 'all';
type InteractionMode = 'drag' | 'tap' | 'both';
type RangeValue = [number, number];
type ThumbKey = 'left' | 'right';

export interface DotSliderProps {
  value?: number;
  onChange?: (nextValue: number) => void;
  onChangeEnd?: (nextValue: number) => void;
  onRangeChange?: (nextRange: RangeValue) => void;
  onRangeChangeEnd?: (nextRange: RangeValue) => void;
  onRangeGapChange?: (gapValue: number) => void;
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
  rangeValue?: RangeValue;
  symmetricRangeMove?: boolean;
  debugId?: string;
  debugEnabled?: boolean;
  thumbOutlineColor?: string;
  thumbOutlineWidth?: number;
  emitChangeWhileDragging?: boolean;
  trackBaseGradientColors?: string[];
  trackBaseGradientStops?: Array<{ color: string; offset: number }>;
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
  rangeValue: undefined as RangeValue | undefined,
  symmetricRangeMove: false,
  thumbOutlineColor: 'transparent',
  thumbOutlineWidth: 0,
  emitChangeWhileDragging: false,
  trackBaseGradientColors: undefined as string[] | undefined,
  trackBaseGradientStops: undefined as Array<{ color: string; offset: number }> | undefined,
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
const DRAG_MOVE_THRESHOLD = 2;
const HORIZONTAL_INTENT_RATIO = 1.15;
const EDGE_TEXT_COLOR_COVERED = 'rgba(255,255,255,0.3)';
const EDGE_TEXT_COLOR_DEFAULT = '#C5C5C5';

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));
const clamp01 = (value: number) => clamp(value, 0, 1);
const normalizeRangeValue = (
  range: RangeValue | undefined,
  min: number,
  max: number
): RangeValue => {
  const leftRaw = range?.[0] ?? min;
  const rightRaw = range?.[1] ?? max;
  const left = clamp(leftRaw, min, max);
  const right = clamp(rightRaw, min, max);
  return left <= right ? [left, right] : [right, left];
};

const DotSlider: React.FC<DotSliderProps> = ({
  value,
  onChange,
  onChangeEnd,
  onRangeChange,
  onRangeChangeEnd,
  onRangeGapChange,
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
  rangeValue = DEFAULT_DOT_SLIDER_CONFIG.rangeValue,
  symmetricRangeMove = DEFAULT_DOT_SLIDER_CONFIG.symmetricRangeMove,
  debugId = 'dot-slider',
  debugEnabled = false,
  thumbOutlineColor = DEFAULT_DOT_SLIDER_CONFIG.thumbOutlineColor,
  thumbOutlineWidth = DEFAULT_DOT_SLIDER_CONFIG.thumbOutlineWidth,
  emitChangeWhileDragging = DEFAULT_DOT_SLIDER_CONFIG.emitChangeWhileDragging,
  trackBaseGradientColors = DEFAULT_DOT_SLIDER_CONFIG.trackBaseGradientColors,
  trackBaseGradientStops = DEFAULT_DOT_SLIDER_CONFIG.trackBaseGradientStops,
}) => {
  const canDrag = interactionMode === 'drag' || interactionMode === 'both';
  const canTap = interactionMode === 'tap' || interactionMode === 'both';
  const isControlled = typeof value === 'number';
  const isRangeControlled =
    isRange &&
    Array.isArray(rangeValue) &&
    rangeValue.length === 2 &&
    typeof rangeValue[0] === 'number' &&
    typeof rangeValue[1] === 'number';

  const [internalValue, setInternalValue] = useState(min);
  const [optimisticValue, setOptimisticValue] = useState<number | null>(null);
  const [internalRangeValue, setInternalRangeValue] = useState<RangeValue>(
    normalizeRangeValue(rangeValue, min, max)
  );
  const [optimisticRangeValue, setOptimisticRangeValue] = useState<RangeValue | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [dragRatio, setDragRatio] = useState<number | null>(null);
  const [rangeDragRatios, setRangeDragRatios] = useState<RangeValue | null>(null);

  const translateX = useRef(new Animated.Value(0)).current;
  const leftTranslateX = useRef(new Animated.Value(0)).current;
  const rightTranslateX = useRef(new Animated.Value(0)).current;
  const trackWidthRef = useRef(0);
  const gradientIdRef = useRef(
    `dot-slider-track-gradient-${Math.random().toString(36).slice(2, 10)}`
  );
  const maxThumbXRef = useRef(0);
  const committedRatioRef = useRef(0);
  const committedLeftRatioRef = useRef(0);
  const committedRightRatioRef = useRef(1);
  const canDragRef = useRef(canDrag);
  const canTapRef = useRef(canTap);
  const isDraggingRef = useRef(false);
  const isThumbDragRef = useRef(false);
  const activeThumbRef = useRef<ThumbKey | null>(null);
  const dragTouchOffsetRef = useRef(0);
  const currentRatioRef = useRef(0);
  const currentLeftRatioRef = useRef(0);
  const currentRightRatioRef = useRef(1);
  const startLocationXRef = useRef(0);
  const startPageXRef = useRef(0);
  const didMoveDuringDragRef = useRef(false);

  const logDebug = (phase: string, payload: Record<string, unknown>) =>
    traceStateFlow({ enabled: debugEnabled, id: debugId }, phase, payload);

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

  const resolvedRangeValue = normalizeRangeValue(
    optimisticRangeValue ??
      (isRangeControlled ? (rangeValue as RangeValue) : internalRangeValue),
    min,
    max
  );
  const activeValue = optimisticValue ?? (isControlled ? (value as number) : internalValue);
  const clampedValue = clamp(activeValue, min, max);
  const valueRange = Math.max(1e-6, max - min);
  const committedRatio = clamp01((clampedValue - min) / valueRange);
  const committedLeftRatio = clamp01((resolvedRangeValue[0] - min) / valueRange);
  const committedRightRatio = clamp01((resolvedRangeValue[1] - min) / valueRange);
  const displayRatio = dragRatio ?? committedRatio;
  const displayLeftRatio = rangeDragRatios?.[0] ?? committedLeftRatio;
  const displayRightRatio = rangeDragRatios?.[1] ?? committedRightRatio;
  const innerWidth = Math.max(0, trackWidth - TRACK_PADDING * 2);
  const maxThumbX = Math.max(0, innerWidth - THUMB_SIZE);
  const edgeLabelValues: [string | number, string | number] = edgeValues ?? [min, max];
  const resolvedThumbOutlineWidth = Math.max(0, thumbOutlineWidth);
  const hasThumbOutline = resolvedThumbOutlineWidth > 0 && thumbOutlineColor !== 'transparent';
  const hasTrackGradientStops =
    Array.isArray(trackBaseGradientStops) && trackBaseGradientStops.length >= 2;
  const hasTrackGradientColors =
    Array.isArray(trackBaseGradientColors) && trackBaseGradientColors.length >= 2;
  const hasTrackGradient = hasTrackGradientStops || hasTrackGradientColors;
  const thumbOutlineSize = THUMB_INNER_SIZE + resolvedThumbOutlineWidth * 2;
  maxThumbXRef.current = maxThumbX;
  committedRatioRef.current = committedRatio;
  committedLeftRatioRef.current = committedLeftRatio;
  committedRightRatioRef.current = committedRightRatio;
  canDragRef.current = canDrag;
  canTapRef.current = canTap;

  useEffect(() => {
    currentRatioRef.current = displayRatio;
  }, [displayRatio]);

  useEffect(() => {
    currentLeftRatioRef.current = displayLeftRatio;
    currentRightRatioRef.current = displayRightRatio;
  }, [displayLeftRatio, displayRightRatio]);

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
  const resolveLocalX = (gestureDx: number, moveX?: number, pageX?: number) => {
    // Prefer dx as stable baseline. moveX/pageX may be reset to 0 on release/terminate.
    const localByDx = startLocationXRef.current + gestureDx;
    const minReasonableX = -THUMB_SIZE;
    const maxReasonableX = trackWidthRef.current + THUMB_SIZE;

    const resolveFromPageX = (sourceX: number) => {
      const localBySourceX = startLocationXRef.current + (sourceX - startPageXRef.current);
      const inRange = localBySourceX >= minReasonableX && localBySourceX <= maxReasonableX;
      const nearDx = Math.abs(localBySourceX - localByDx) <= 48;
      return inRange && nearDx ? localBySourceX : null;
    };

    if (typeof moveX === 'number' && Number.isFinite(moveX) && moveX > 0) {
      const resolved = resolveFromPageX(moveX);
      if (resolved !== null) return resolved;
    }
    if (typeof pageX === 'number' && Number.isFinite(pageX) && pageX > 0) {
      const resolved = resolveFromPageX(pageX);
      if (resolved !== null) return resolved;
    }
    return localByDx;
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
      tension: TOKENS.motion.springTension,
      friction: TOKENS.motion.springFriction,
    }).start();
  };

  const animateRangeToRatios = (nextRange: RangeValue, immediate = false) => {
    const toLeftValue = ratioToThumbX(nextRange[0]);
    const toRightValue = ratioToThumbX(nextRange[1]);
    if (immediate) {
      leftTranslateX.setValue(toLeftValue);
      rightTranslateX.setValue(toRightValue);
      return;
    }
    Animated.parallel([
      Animated.spring(leftTranslateX, {
        toValue: toLeftValue,
        useNativeDriver: false,
        tension: TOKENS.motion.springTension,
        friction: TOKENS.motion.springFriction,
      }),
      Animated.spring(rightTranslateX, {
        toValue: toRightValue,
        useNativeDriver: false,
        tension: TOKENS.motion.springTension,
        friction: TOKENS.motion.springFriction,
      }),
    ]).start();
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

  const commitRangeRatios = (
    rawLeftRatio: number,
    rawRightRatio: number,
    fromRelease = false
  ) => {
    let nextLeftRatio = clamp01(rawLeftRatio);
    let nextRightRatio = clamp01(rawRightRatio);
    if (nextLeftRatio > nextRightRatio) {
      [nextLeftRatio, nextRightRatio] = [nextRightRatio, nextLeftRatio];
    }

    const applySnap = (ratio: number) => (snapToDots ? getNearestStop(ratio) : ratio);
    if (symmetricRangeMove) {
      const activeThumb = activeThumbRef.current ?? 'left';
      if (activeThumb === 'left') {
        nextLeftRatio = applySnap(Math.min(nextLeftRatio, 0.5));
        nextRightRatio = 1 - nextLeftRatio;
      } else {
        nextRightRatio = applySnap(Math.max(nextRightRatio, 0.5));
        nextLeftRatio = 1 - nextRightRatio;
      }
    } else {
      nextLeftRatio = applySnap(nextLeftRatio);
      nextRightRatio = applySnap(nextRightRatio);
      if (nextLeftRatio > nextRightRatio) {
        [nextLeftRatio, nextRightRatio] = [nextRightRatio, nextLeftRatio];
      }
    }

    const nextRangeValue: RangeValue = [
      ratioToValue(nextLeftRatio),
      ratioToValue(nextRightRatio),
    ];
    logDebug('commit-range', {
      rawLeftRatio,
      rawRightRatio,
      nextLeftRatio,
      nextRightRatio,
      nextRangeValue,
      symmetricRangeMove,
      fromRelease,
      isRangeControlled,
    });
    setOptimisticRangeValue(nextRangeValue);
    if (!isRangeControlled) {
      setInternalRangeValue(nextRangeValue);
    }
    onRangeChange?.(nextRangeValue);
    onRangeGapChange?.(Math.abs(nextRangeValue[1] - nextRangeValue[0]));
    if (fromRelease) {
      onRangeChangeEnd?.(nextRangeValue);
    }
    setRangeDragRatios([nextLeftRatio, nextRightRatio]);
    currentLeftRatioRef.current = nextLeftRatio;
    currentRightRatioRef.current = nextRightRatio;
    animateRangeToRatios([nextLeftRatio, nextRightRatio], false);
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
    if (!isRange) return;
    if (!isRangeControlled) {
      if (optimisticRangeValue !== null) setOptimisticRangeValue(null);
      return;
    }
    if (optimisticRangeValue === null || !Array.isArray(rangeValue)) return;
    const [nextLeft, nextRight] = normalizeRangeValue(rangeValue, min, max);
    if (
      Math.abs(nextLeft - optimisticRangeValue[0]) < 1e-6 &&
      Math.abs(nextRight - optimisticRangeValue[1]) < 1e-6
    ) {
      setOptimisticRangeValue(null);
    }
  }, [isRange, isRangeControlled, max, min, optimisticRangeValue, rangeValue]);

  useEffect(() => {
    if (isDraggingRef.current) return;
    if (isRange) {
      animateRangeToRatios([committedLeftRatio, committedRightRatio], false);
      return;
    }
    animateToRatio(committedRatio, false);
  }, [committedLeftRatio, committedRatio, committedRightRatio, isRange, maxThumbX]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setTrackWidth(width);
    trackWidthRef.current = width;
    logDebug('layout', {
      width,
      committedRatio,
      maxThumbX,
    });
    if (isRange) {
      animateRangeToRatios([committedLeftRatio, committedRightRatio], true);
    } else {
      animateToRatio(committedRatio, true);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => canTap || canDrag,
      onStartShouldSetPanResponderCapture: () => canTap || canDrag,
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        canDrag &&
        trackWidthRef.current > 0 &&
        Math.hypot(gestureState.dx, gestureState.dy) > DRAG_MOVE_THRESHOLD &&
        Math.abs(gestureState.dx) >= Math.abs(gestureState.dy) * HORIZONTAL_INTENT_RATIO,
      onMoveShouldSetPanResponderCapture: (_evt, gestureState) =>
        canDrag &&
        trackWidthRef.current > 0 &&
        Math.hypot(gestureState.dx, gestureState.dy) > DRAG_MOVE_THRESHOLD &&
        Math.abs(gestureState.dx) >= Math.abs(gestureState.dy) * HORIZONTAL_INTENT_RATIO,
      onPanResponderGrant: (evt) => {
        if (isRange) {
          isDraggingRef.current = false;
          isThumbDragRef.current = false;
          activeThumbRef.current = null;
          const startX = evt.nativeEvent.locationX;
          startPageXRef.current = evt.nativeEvent.pageX;
          startLocationXRef.current = startX;
          leftTranslateX.stopAnimation((leftXValue) => {
            rightTranslateX.stopAnimation((rightXValue) => {
              const runtimeMaxThumbX = Math.max(1e-6, maxThumbXRef.current);
              const leftRatioFromThumb = clamp01((leftXValue ?? 0) / runtimeMaxThumbX);
              const rightRatioFromThumb = clamp01((rightXValue ?? 0) / runtimeMaxThumbX);
              currentLeftRatioRef.current = Math.min(leftRatioFromThumb, rightRatioFromThumb);
              currentRightRatioRef.current = Math.max(leftRatioFromThumb, rightRatioFromThumb);
              const leftCenterX =
                TRACK_PADDING +
                ratioToThumbXByMax(currentLeftRatioRef.current, maxThumbXRef.current) +
                THUMB_SIZE / 2;
              const rightCenterX =
                TRACK_PADDING +
                ratioToThumbXByMax(currentRightRatioRef.current, maxThumbXRef.current) +
                THUMB_SIZE / 2;
              const leftDistance = Math.abs(startX - leftCenterX);
              const rightDistance = Math.abs(startX - rightCenterX);
              const activeThumb: ThumbKey = leftDistance <= rightDistance ? 'left' : 'right';
              activeThumbRef.current = activeThumb;
              const touchingThumbDistance = Math.min(leftDistance, rightDistance);
              const targetCenterX = activeThumb === 'left' ? leftCenterX : rightCenterX;
              isDraggingRef.current =
                canDragRef.current &&
                touchingThumbDistance <= THUMB_SIZE / 2 + DRAG_START_HIT_SLOP;
              isThumbDragRef.current = isDraggingRef.current;
              dragTouchOffsetRef.current = startX - targetCenterX;
              setRangeDragRatios([
                currentLeftRatioRef.current,
                currentRightRatioRef.current,
              ]);
              logDebug('grant-range', {
                startX,
                activeThumb,
                leftCenterX,
                rightCenterX,
                leftDistance,
                rightDistance,
                isDragging: isDraggingRef.current,
                dragTouchOffset: dragTouchOffsetRef.current,
              });
            });
          });
          return;
        }

        isDraggingRef.current = false;
        isThumbDragRef.current = false;
        didMoveDuringDragRef.current = false;

        const startX = evt.nativeEvent.locationX;
        startPageXRef.current = evt.nativeEvent.pageX;
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
          didMoveDuringDragRef.current = false;
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
        if (isRange) {
          const movedDistance = Math.hypot(gestureState.dx, gestureState.dy);
          const hasHorizontalIntent =
            Math.abs(gestureState.dx) >= Math.abs(gestureState.dy) * HORIZONTAL_INTENT_RATIO;
          if (
            !isDraggingRef.current &&
            canDragRef.current &&
            movedDistance > DRAG_MOVE_THRESHOLD &&
            hasHorizontalIntent
          ) {
            // MUI-like pointer capture: allow entering drag even when touch didn't start on thumb.
            const localX = resolveLocalX(gestureState.dx, gestureState.moveX, evt.nativeEvent.pageX);
            const leftCenterX =
              TRACK_PADDING +
              ratioToThumbXByMax(currentLeftRatioRef.current, maxThumbXRef.current) +
              THUMB_SIZE / 2;
            const rightCenterX =
              TRACK_PADDING +
              ratioToThumbXByMax(currentRightRatioRef.current, maxThumbXRef.current) +
              THUMB_SIZE / 2;
            activeThumbRef.current =
              Math.abs(localX - leftCenterX) <= Math.abs(localX - rightCenterX) ? 'left' : 'right';
            isDraggingRef.current = true;
            isThumbDragRef.current = true;
            // Follow finger directly once captured from track.
            dragTouchOffsetRef.current = 0;
          }
          if (
            !isDraggingRef.current ||
            !isThumbDragRef.current ||
            !canDragRef.current ||
            !activeThumbRef.current
          )
            return;
          if (movedDistance <= DRAG_MOVE_THRESHOLD) return;
          const localX = resolveLocalX(gestureState.dx, gestureState.moveX, evt.nativeEvent.pageX);
          const thumbCenterX = localX - dragTouchOffsetRef.current;
          const thumbX = thumbCenterX - TRACK_PADDING - THUMB_SIZE / 2;
          const runtimeMaxThumbX = maxThumbXRef.current;
          const nextRatio =
            runtimeMaxThumbX <= 0 ? 0 : clamp01(thumbX / runtimeMaxThumbX);
          let nextLeftRatio = currentLeftRatioRef.current;
          let nextRightRatio = currentRightRatioRef.current;
          if (symmetricRangeMove) {
            if (activeThumbRef.current === 'left') {
              nextLeftRatio = Math.min(nextRatio, 0.5);
              nextRightRatio = 1 - nextLeftRatio;
            } else {
              nextRightRatio = Math.max(nextRatio, 0.5);
              nextLeftRatio = 1 - nextRightRatio;
            }
          } else if (activeThumbRef.current === 'left') {
            nextLeftRatio = Math.min(nextRatio, currentRightRatioRef.current);
          } else {
            nextRightRatio = Math.max(nextRatio, currentLeftRatioRef.current);
          }
          currentLeftRatioRef.current = nextLeftRatio;
          currentRightRatioRef.current = nextRightRatio;
          setRangeDragRatios([nextLeftRatio, nextRightRatio]);
          leftTranslateX.setValue(ratioToThumbXByMax(nextLeftRatio, runtimeMaxThumbX));
          rightTranslateX.setValue(ratioToThumbXByMax(nextRightRatio, runtimeMaxThumbX));
          logDebug('move-range', {
            locationX: evt.nativeEvent.locationX,
            dx: gestureState.dx,
            activeThumb: activeThumbRef.current,
            nextLeftRatio,
            nextRightRatio,
          });
          return;
        }

        if (
          !isDraggingRef.current ||
          !isThumbDragRef.current ||
          !canDragRef.current
        ) {
          const movedDistance = Math.hypot(gestureState.dx, gestureState.dy);
          const hasHorizontalIntent =
            Math.abs(gestureState.dx) >= Math.abs(gestureState.dy) * HORIZONTAL_INTENT_RATIO;
          if (
            canDragRef.current &&
            movedDistance > DRAG_MOVE_THRESHOLD &&
            hasHorizontalIntent
          ) {
            // MUI-like pointer capture: start dragging from rail as soon as intent is horizontal.
            isDraggingRef.current = true;
            isThumbDragRef.current = true;
            didMoveDuringDragRef.current = true;
            dragTouchOffsetRef.current = 0;
            setDragRatio(currentRatioRef.current);
            translateX.stopAnimation();
          } else {
            return;
          }
        }
        const movedDistance = Math.hypot(gestureState.dx, gestureState.dy);
        if (movedDistance <= DRAG_MOVE_THRESHOLD)
          return;
        const localX = resolveLocalX(gestureState.dx, gestureState.moveX, evt.nativeEvent.pageX);
        const thumbCenterX = localX - dragTouchOffsetRef.current;
        const thumbX = thumbCenterX - TRACK_PADDING - THUMB_SIZE / 2;
        const runtimeMaxThumbX = maxThumbXRef.current;
        const nextRatio =
          runtimeMaxThumbX <= 0 ? 0 : clamp01(thumbX / runtimeMaxThumbX);
        didMoveDuringDragRef.current = true;
        setDragRatio(nextRatio);
        currentRatioRef.current = nextRatio;
        translateX.setValue(ratioToThumbXByMax(nextRatio, runtimeMaxThumbX));
        if (emitChangeWhileDragging) {
          const nextValue = ratioToValue(nextRatio);
          onChange?.(nextValue);
        }
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
        if (isRange) {
          const movedDistance = Math.hypot(gestureState.dx, gestureState.dy);
          const isTapGesture = movedDistance <= 6;
          const tapLocationX = startLocationXRef.current;
          logDebug('release-range-start', {
            locationX: evt.nativeEvent.locationX,
            tapLocationX,
            dx: gestureState.dx,
            dy: gestureState.dy,
            movedDistance,
            isTapGesture,
            isDragging: isDraggingRef.current,
            activeThumb: activeThumbRef.current,
          });

          if (isDraggingRef.current && isThumbDragRef.current && activeThumbRef.current) {
            const finalLeftRatio = currentLeftRatioRef.current;
            const finalRightRatio = currentRightRatioRef.current;
            isDraggingRef.current = false;
            isThumbDragRef.current = false;
            commitRangeRatios(finalLeftRatio, finalRightRatio, true);
            activeThumbRef.current = null;
            return;
          }

          if (canTapRef.current && isTapGesture) {
            const tapRatio = locationXToRatio(tapLocationX);
            const leftDistance = Math.abs(tapRatio - committedLeftRatioRef.current);
            const rightDistance = Math.abs(tapRatio - committedRightRatioRef.current);
            const activeThumb: ThumbKey = leftDistance <= rightDistance ? 'left' : 'right';
            activeThumbRef.current = activeThumb;
            let nextLeftRatio = committedLeftRatioRef.current;
            let nextRightRatio = committedRightRatioRef.current;
            if (symmetricRangeMove) {
              if (activeThumb === 'left') {
                nextLeftRatio = Math.min(tapRatio, 0.5);
                nextRightRatio = 1 - nextLeftRatio;
              } else {
                nextRightRatio = Math.max(tapRatio, 0.5);
                nextLeftRatio = 1 - nextRightRatio;
              }
            } else if (activeThumb === 'left') {
              nextLeftRatio = Math.min(tapRatio, committedRightRatioRef.current);
            } else {
              nextRightRatio = Math.max(tapRatio, committedLeftRatioRef.current);
            }
            commitRangeRatios(nextLeftRatio, nextRightRatio, true);
            activeThumbRef.current = null;
            return;
          }

          setRangeDragRatios(null);
          isDraggingRef.current = false;
          isThumbDragRef.current = false;
          activeThumbRef.current = null;
          animateRangeToRatios(
            [committedLeftRatioRef.current, committedRightRatioRef.current],
            false
          );
          return;
        }

        const movedDistance = Math.hypot(gestureState.dx, gestureState.dy);
        const isTapGesture = movedDistance <= 6;
        const tapLocationX = startLocationXRef.current;
        logDebug('release-start', {
          locationX: evt.nativeEvent.locationX,
          tapLocationX,
          dx: gestureState.dx,
          dy: gestureState.dy,
          movedDistance,
          isTapGesture,
          isDragging: isDraggingRef.current,
          isThumbDrag: isThumbDragRef.current,
          currentRatio: currentRatioRef.current,
        });

        if (isDraggingRef.current && isThumbDragRef.current) {
          const runtimeMaxThumbX = maxThumbXRef.current;
          const movedEnoughForReleaseCalc =
            Math.hypot(gestureState.dx, gestureState.dy) > DRAG_MOVE_THRESHOLD;
          const localXFromGesture = resolveLocalX(
            gestureState.dx,
            gestureState.moveX,
            evt.nativeEvent.pageX
          );
          const thumbCenterXFromGesture = localXFromGesture - dragTouchOffsetRef.current;
          const thumbXFromGesture = thumbCenterXFromGesture - TRACK_PADDING - THUMB_SIZE / 2;
          const finalRatioFromGesture =
            runtimeMaxThumbX <= 0
              ? currentRatioRef.current
              : clamp01(thumbXFromGesture / runtimeMaxThumbX);
          const usedMoveRatio = didMoveDuringDragRef.current;
          const finalRatio = usedMoveRatio
            ? currentRatioRef.current
            : movedEnoughForReleaseCalc
              ? finalRatioFromGesture
              : currentRatioRef.current;
          setDragRatio(null);
          isDraggingRef.current = false;
          isThumbDragRef.current = false;
          didMoveDuringDragRef.current = false;
          logDebug('release-drag', {
            finalRatio,
            finalRatioFromGesture,
            usedMoveRatio,
            movedEnoughForReleaseCalc,
            runtimeMaxThumbX,
          });
          commitRatio(finalRatio, true);
          return;
        }

        if (canDragRef.current && movedDistance > DRAG_MOVE_THRESHOLD) {
          // Fallback commit: even if drag flags are missed, settle by end touch position.
          // This prevents a hard snap-back to origin after a valid horizontal slide.
          const runtimeMaxThumbX = maxThumbXRef.current;
          const localXFromGesture = resolveLocalX(
            gestureState.dx,
            gestureState.moveX,
            evt.nativeEvent.pageX
          );
          const maxLocalX = trackWidthRef.current;
          let finalRatio = currentRatioRef.current;
          if (runtimeMaxThumbX > 0) {
            if (localXFromGesture >= maxLocalX - 1) {
              finalRatio = 1;
            } else if (localXFromGesture <= 1) {
              finalRatio = 0;
            } else {
              const thumbCenterX = localXFromGesture;
              const thumbX = thumbCenterX - TRACK_PADDING - THUMB_SIZE / 2;
              finalRatio = clamp01(thumbX / runtimeMaxThumbX);
            }
          }
          setDragRatio(null);
          isDraggingRef.current = false;
          isThumbDragRef.current = false;
          didMoveDuringDragRef.current = false;
          commitRatio(finalRatio, true);
          return;
        }

        if (canTapRef.current && isTapGesture) {
          const tapRatio = locationXToRatio(tapLocationX);
          setDragRatio(null);
          logDebug('release-tap', {
            tapRatio,
            tapLocationX,
          });
          commitRatio(tapRatio, true);
          return;
        }

        setDragRatio(null);
        isDraggingRef.current = false;
        isThumbDragRef.current = false;
        didMoveDuringDragRef.current = false;
        logDebug('release-cancel', {
          committedRatio: committedRatioRef.current,
        });
        animateToRatio(committedRatioRef.current, false);
      },
      onPanResponderTerminate: (evt, gestureState) => {
        if (isRange) {
          if (isDraggingRef.current && isThumbDragRef.current && activeThumbRef.current) {
            let finalLeftRatio = currentLeftRatioRef.current;
            let finalRightRatio = currentRightRatioRef.current;
            setRangeDragRatios(null);
            isDraggingRef.current = false;
            isThumbDragRef.current = false;
            activeThumbRef.current = null;
            logDebug('terminate-range-commit', {
              finalLeftRatio,
              finalRightRatio,
            });
            commitRangeRatios(finalLeftRatio, finalRightRatio, true);
            return;
          }
          setRangeDragRatios(null);
          isDraggingRef.current = false;
          isThumbDragRef.current = false;
          activeThumbRef.current = null;
          animateRangeToRatios(
            [committedLeftRatioRef.current, committedRightRatioRef.current],
            false
          );
          return;
        }
        if (isDraggingRef.current && isThumbDragRef.current) {
          const finalRatio = currentRatioRef.current;
          setDragRatio(null);
          isDraggingRef.current = false;
          isThumbDragRef.current = false;
          didMoveDuringDragRef.current = false;
          logDebug('terminate-commit', {
            finalRatio,
          });
          commitRatio(finalRatio, true);
          return;
        }
        setDragRatio(null);
        isDraggingRef.current = false;
        isThumbDragRef.current = false;
        didMoveDuringDragRef.current = false;
        logDebug('terminate', {
          committedRatio: committedRatioRef.current,
        });
        animateToRatio(committedRatioRef.current, false);
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const fillVisible = showFill && fillMode !== 'none';
  const fillStartRatio = isRange
    ? displayLeftRatio
    : fillMode === 'between'
      ? displayRatio
      : 0;
  const fillEndRatio = isRange ? displayRightRatio : fillMode === 'all' ? 1 : displayRatio;
  const fillMinRatio = Math.min(fillStartRatio, fillEndRatio);
  const fillMaxRatio = Math.max(fillStartRatio, fillEndRatio);
  const leftEdgeCovered = fillVisible && fillMinRatio <= 0.001;
  const rightEdgeCovered = fillVisible && fillMaxRatio >= 0.999;
  const fillLeft = ratioToThumbX(Math.min(fillStartRatio, fillEndRatio));
  const fillRight = ratioToThumbX(Math.max(fillStartRatio, fillEndRatio)) + THUMB_SIZE;
  const fillWidth = fillMode === 'none' ? 0 : Math.max(0, fillRight - fillLeft);

  const isDotActive = (ratio: number) => {
    if (!fillVisible) return false;
    if (isRange) {
      return ratio >= displayLeftRatio && ratio <= displayRightRatio;
    }
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
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.trackOuter} onLayout={handleLayout}>
        <View
          style={[styles.trackBase, hasTrackGradient && styles.trackBaseNoBg]}
          pointerEvents={hasTrackGradient ? 'none' : 'auto'}
        >
          {hasTrackGradient ? (
            <Svg
              style={styles.trackGradientSvg}
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              pointerEvents="none"
            >
              <Defs>
                <SvgLinearGradient id={gradientIdRef.current} x1="0%" y1="0%" x2="100%" y2="0%">
                  {hasTrackGradientStops
                    ? trackBaseGradientStops!.map((stop, index) => (
                        <Stop
                          key={`track-stop-${stop.color}-${index}`}
                          offset={`${Math.max(0, Math.min(100, stop.offset))}%`}
                          stopColor={stop.color}
                        />
                      ))
                    : trackBaseGradientColors!.map((color, index) => (
                        <Stop
                          key={`track-stop-${color}-${index}`}
                          offset={`${(index / (trackBaseGradientColors!.length - 1)) * 100}%`}
                          stopColor={color}
                        />
                      ))}
                </SvgLinearGradient>
              </Defs>
              <Rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx={TRACK_INNER_HEIGHT / 2}
                ry={TRACK_INNER_HEIGHT / 2}
                fill={`url(#${gradientIdRef.current})`}
              />
            </Svg>
          ) : null}
        </View>
        {isRange ? <View pointerEvents="none" style={styles.fixedCenterDivider} /> : null}
        {fillVisible &&
          (isRange ? (
            <View
              pointerEvents="none"
              style={[
                styles.fillLayer,
                {
                  left: TRACK_PADDING + fillLeft,
                  width: fillWidth,
                },
              ]}
            />
          ) : fillMode === 'left' || fillMode === 'between' ? (
            <Animated.View
              pointerEvents="none"
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
              pointerEvents="none"
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
            // 仅在刻度点真正位于轨道两端（0/1）时隐藏，避免 custom 分布时误隐藏
            const atTrackEdge = ratio <= 0.01 || ratio >= 0.99;
            const hideEdgeDot = showEdgeValues && atTrackEdge;
            if (hideEdgeDot) return null;
            const dotCenterX = TRACK_PADDING + ratioToThumbX(ratio) + THUMB_SIZE / 2;
            return (
              <View
                key={`dot-${index}`}
                pointerEvents="none"
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
            <Text
              pointerEvents="none"
              style={[
                styles.edgeValue,
                styles.leftEdgeValue,
                { color: leftEdgeCovered ? EDGE_TEXT_COLOR_COVERED : EDGE_TEXT_COLOR_DEFAULT },
              ]}
            >
              {String(edgeLabelValues[0])}
            </Text>
            <Text
              pointerEvents="none"
              style={[
                styles.edgeValue,
                styles.rightEdgeValue,
                { color: rightEdgeCovered ? EDGE_TEXT_COLOR_COVERED : EDGE_TEXT_COLOR_DEFAULT },
              ]}
            >
              {String(edgeLabelValues[1])}
            </Text>
          </>
        )}

        {isRange ? (
          <>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.thumbOuter,
                {
                  left: TRACK_PADDING,
                  transform: [{ translateX: leftTranslateX }],
                },
              ]}
            >
              <View style={styles.thumbInnerWrap}>
                {hasThumbOutline && (
                  <View
                    style={[
                      styles.thumbOutline,
                      {
                        width: thumbOutlineSize,
                        height: thumbOutlineSize,
                        borderRadius: thumbOutlineSize / 2,
                        borderColor: thumbOutlineColor,
                        borderWidth: resolvedThumbOutlineWidth,
                      },
                    ]}
                  />
                )}
                <View style={styles.thumbInner} />
              </View>
            </Animated.View>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.thumbOuter,
                {
                  left: TRACK_PADDING,
                  transform: [{ translateX: rightTranslateX }],
                },
              ]}
            >
              <View style={styles.thumbInnerWrap}>
                {hasThumbOutline && (
                  <View
                    style={[
                      styles.thumbOutline,
                      {
                        width: thumbOutlineSize,
                        height: thumbOutlineSize,
                        borderRadius: thumbOutlineSize / 2,
                        borderColor: thumbOutlineColor,
                        borderWidth: resolvedThumbOutlineWidth,
                      },
                    ]}
                  />
                )}
                <View style={styles.thumbInner} />
              </View>
            </Animated.View>
          </>
        ) : (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.thumbOuter,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <View style={styles.thumbInnerWrap}>
              {hasThumbOutline && (
                <View
                  style={[
                    styles.thumbOutline,
                    {
                      width: thumbOutlineSize,
                      height: thumbOutlineSize,
                      borderRadius: thumbOutlineSize / 2,
                      borderColor: thumbOutlineColor,
                      borderWidth: resolvedThumbOutlineWidth,
                    },
                  ]}
                />
              )}
              <View style={styles.thumbInner} />
            </View>
          </Animated.View>
        )}

        {/* 渐变时子视图可能抢触摸：手势已绑定在外层容器，轨道子节点统一 pointerEvents="none" */}
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

      {isRange && (
        <Text style={styles.rangeHint}>
          区间值：{Number(Math.abs(resolvedRangeValue[1] - resolvedRangeValue[0]).toFixed(2))}
        </Text>
      )}
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
    position: 'relative',
  },
  trackBase: {
    position: 'absolute',
    left: TRACK_PADDING,
    right: TRACK_PADDING,
    height: TRACK_INNER_HEIGHT,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.rightPillBg,
    overflow: 'hidden',
  },
  trackBaseNoBg: {
    backgroundColor: 'transparent',
  },
  trackGradientSvg: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  fillLayer: {
    position: 'absolute',
    height: TRACK_INNER_HEIGHT,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.mainColor,
    overflow: 'hidden',
  },
  fixedCenterDivider: {
    position: 'absolute',
    top: (TRACK_HEIGHT - 8) / 2,
    left: '50%',
    width: 1,
    marginLeft: -0.5,
    height: 8,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: 'rgba(0,0,0,0.12)',
    zIndex: 3,
  },
  rangeDivider: {
    width: 1,
    height: 8,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.35)',
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
    color: EDGE_TEXT_COLOR_DEFAULT,
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
  thumbInnerWrap: {
    width: THUMB_INNER_SIZE,
    height: THUMB_INNER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbOutline: {
    position: 'absolute',
    backgroundColor: 'transparent',
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
