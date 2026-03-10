import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { TOKENS } from '../../tokens';
import { traceStateFlow } from '../../utils/stateflow/traceStateFlow';

type RangeValue = [number, number];
type ThumbKey = 'left' | 'right';

export interface DualHandleSliderProps {
  min?: number;
  max?: number;
  rangeValue?: RangeValue;
  onRangeChange?: (nextRange: RangeValue) => void;
  onRangeChangeEnd?: (nextRange: RangeValue) => void;
  onRangeGapChange?: (gapValue: number) => void;
  dotCount?: number;
  showDots?: boolean;
  snapToDots?: boolean;
  symmetricMove?: boolean;
  debugEnabled?: boolean;
  debugId?: string;
}

const TRACK_HEIGHT = 32;
const TRACK_PADDING = 2;
const TRACK_INNER_HEIGHT = 28;
const THUMB_SIZE = 28;
const THUMB_INNER_SIZE = 20;
const DRAG_START_HIT_SLOP = 14;
const CENTER_RATIO = 0.5;
const HANDLE_TARGET_RADIUS = THUMB_SIZE / 2 + 2;

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const clamp01 = (value: number) => clamp(value, 0, 1);
const clampRatioBySide = (ratio: number, side: ThumbKey) =>
  side === 'left' ? clamp01(clamp(ratio, 0, CENTER_RATIO)) : clamp01(clamp(ratio, CENTER_RATIO, 1));

const normalizeRange = (
  input: RangeValue | undefined,
  min: number,
  max: number
): RangeValue => {
  const leftRaw = input?.[0] ?? min;
  const rightRaw = input?.[1] ?? max;
  const left = clamp(leftRaw, min, max);
  const right = clamp(rightRaw, min, max);
  return left <= right ? [left, right] : [right, left];
};

const DualHandleSlider: React.FC<DualHandleSliderProps> = ({
  min = 0,
  max = 100,
  rangeValue,
  onRangeChange,
  onRangeChangeEnd,
  onRangeGapChange,
  dotCount = 6,
  showDots = true,
  snapToDots = true,
  symmetricMove = false,
  debugEnabled = false,
  debugId = 'dual-handle-slider',
}) => {
  const isControlled =
    Array.isArray(rangeValue) &&
    rangeValue.length === 2 &&
    typeof rangeValue[0] === 'number' &&
    typeof rangeValue[1] === 'number';

  const span = Math.max(1e-6, max - min);
  const initialRange = useMemo<RangeValue>(
    () => normalizeRange([min + span * 0.25, min + span * 0.75], min, max),
    [min, max, span]
  );

  const [internalRange, setInternalRange] = useState<RangeValue>(initialRange);
  const [optimisticRange, setOptimisticRange] = useState<RangeValue | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [dragRange, setDragRange] = useState<RangeValue | null>(null);

  const leftX = useRef(new Animated.Value(0)).current;
  const rightX = useRef(new Animated.Value(0)).current;

  const trackWidthRef = useRef(0);
  const maxThumbXRef = useRef(0);
  const startLocationXRef = useRef(0);
  const dragTouchOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const activeThumbRef = useRef<ThumbKey>('left');
  const startedOnActiveThumbRef = useRef(false);
  const currentLeftRatioRef = useRef(0.25);
  const currentRightRatioRef = useRef(0.75);
  const committedLeftRatioRef = useRef(0.25);
  const committedRightRatioRef = useRef(0.75);

  const resolvedRange = normalizeRange(
    dragRange ?? optimisticRange ?? (isControlled ? (rangeValue as RangeValue) : internalRange),
    min,
    max
  );

  const committedLeftRatio = clamp01((resolvedRange[0] - min) / span);
  const committedRightRatio = clamp01((resolvedRange[1] - min) / span);

  committedLeftRatioRef.current = committedLeftRatio;
  committedRightRatioRef.current = committedRightRatio;

  const innerWidth = Math.max(0, trackWidth - TRACK_PADDING * 2);
  const maxThumbX = Math.max(0, innerWidth - THUMB_SIZE);
  maxThumbXRef.current = maxThumbX;

  const stops = useMemo(() => {
    const count = Math.max(2, dotCount);
    return Array.from({ length: count }, (_, index) => index / (count - 1));
  }, [dotCount]);

  const ratioToValue = (ratio: number) => min + clamp01(ratio) * span;
  const ratioToThumbX = (ratio: number) => clamp01(ratio) * maxThumbX;
  const ratioToThumbXByMax = (ratio: number, runtimeMaxThumbX: number) =>
    clamp01(ratio) * Math.max(0, runtimeMaxThumbX);

  const locationXToRatio = (locationX: number) => {
    const runtimeTrackWidth = trackWidthRef.current;
    const runtimeInnerWidth = Math.max(0, runtimeTrackWidth - TRACK_PADDING * 2);
    const runtimeMaxThumbX = Math.max(0, runtimeInnerWidth - THUMB_SIZE);
    if (runtimeMaxThumbX <= 0) return 0;
    const thumbX = locationX - TRACK_PADDING - THUMB_SIZE / 2;
    return clamp01(thumbX / runtimeMaxThumbX);
  };

  const getNearestStop = (ratio: number) =>
    stops.reduce((nearest, item) =>
      Math.abs(item - ratio) < Math.abs(nearest - ratio) ? item : nearest
    );

  const getThumbCenters = () => {
    const leftCenterX =
      TRACK_PADDING +
      ratioToThumbXByMax(currentLeftRatioRef.current, maxThumbXRef.current) +
      THUMB_SIZE / 2;
    const rightCenterX =
      TRACK_PADDING +
      ratioToThumbXByMax(currentRightRatioRef.current, maxThumbXRef.current) +
      THUMB_SIZE / 2;
    return { leftCenterX, rightCenterX };
  };

  const resolveActiveThumbByTouch = (touchX: number): ThumbKey => {
    const { leftCenterX, rightCenterX } = getThumbCenters();
    const leftDistance = Math.abs(touchX - leftCenterX);
    const rightDistance = Math.abs(touchX - rightCenterX);

    // 优先使用更小的把手命中热区，避免误控另一侧把手
    const hitLeft = leftDistance <= HANDLE_TARGET_RADIUS;
    const hitRight = rightDistance <= HANDLE_TARGET_RADIUS;
    if (hitLeft && !hitRight) return 'left';
    if (hitRight && !hitLeft) return 'right';
    if (hitLeft && hitRight) return leftDistance <= rightDistance ? 'left' : 'right';

    // 对称模式：未命中把手时按中线左右选中，避免中线附近误选导致方向反转
    if (symmetricMove) {
      return touchX <= trackWidthRef.current * CENTER_RATIO ? 'left' : 'right';
    }

    // 非对称模式：采用 MUI range slider 的“最近把手”策略
    if (leftDistance === rightDistance) {
      return touchX <= trackWidthRef.current * CENTER_RATIO ? 'left' : 'right';
    }
    return leftDistance < rightDistance ? 'left' : 'right';
  };

  const animateToRange = (leftRatio: number, rightRatio: number, immediate = false) => {
    const toLeft = ratioToThumbX(leftRatio);
    const toRight = ratioToThumbX(rightRatio);
    if (immediate) {
      leftX.setValue(toLeft);
      rightX.setValue(toRight);
      return;
    }
    Animated.parallel([
      Animated.spring(leftX, {
        toValue: toLeft,
        useNativeDriver: false,
        tension: TOKENS.motion.springTension,
        friction: TOKENS.motion.springFriction,
      }),
      Animated.spring(rightX, {
        toValue: toRight,
        useNativeDriver: false,
        tension: TOKENS.motion.springTension,
        friction: TOKENS.motion.springFriction,
      }),
    ]).start();
  };

  const applyRange = (leftRatioRaw: number, rightRatioRaw: number, isEnd = false) => {
    let leftRatio = clamp01(leftRatioRaw);
    let rightRatio = clamp01(rightRatioRaw);
    if (leftRatio > rightRatio) {
      [leftRatio, rightRatio] = [rightRatio, leftRatio];
    }

    if (symmetricMove) {
      if (activeThumbRef.current === 'left') {
        leftRatio = clamp01(leftRatio);
        leftRatio = Math.min(leftRatio, CENTER_RATIO);
        rightRatio = 1 - leftRatio;
      } else {
        rightRatio = clamp01(rightRatio);
        rightRatio = Math.max(rightRatio, CENTER_RATIO);
        leftRatio = 1 - rightRatio;
      }
    } else {
      leftRatio = clampRatioBySide(leftRatio, 'left');
      rightRatio = clampRatioBySide(rightRatio, 'right');
    }

    if (snapToDots) {
      if (symmetricMove) {
        if (activeThumbRef.current === 'left') {
          leftRatio = Math.min(getNearestStop(leftRatio), CENTER_RATIO);
          rightRatio = 1 - leftRatio;
        } else {
          rightRatio = Math.max(getNearestStop(rightRatio), CENTER_RATIO);
          leftRatio = 1 - rightRatio;
        }
      } else {
        leftRatio = clampRatioBySide(getNearestStop(leftRatio), 'left');
        rightRatio = clampRatioBySide(getNearestStop(rightRatio), 'right');
        if (leftRatio > rightRatio) {
          [leftRatio, rightRatio] = [rightRatio, leftRatio];
        }
      }
    }

    currentLeftRatioRef.current = leftRatio;
    currentRightRatioRef.current = rightRatio;

    const nextRange: RangeValue = [ratioToValue(leftRatio), ratioToValue(rightRatio)];
    setOptimisticRange(nextRange);
    if (!isControlled) {
      setInternalRange(nextRange);
    }
    onRangeChange?.(nextRange);
    onRangeGapChange?.(Math.abs(nextRange[1] - nextRange[0]));
    if (isEnd) {
      onRangeChangeEnd?.(nextRange);
    }
    animateToRange(leftRatio, rightRatio, false);
  };

  useEffect(() => {
    if (!isControlled) {
      if (optimisticRange !== null) setOptimisticRange(null);
      return;
    }
    if (!optimisticRange || !rangeValue) return;
    const [left, right] = normalizeRange(rangeValue, min, max);
    if (
      Math.abs(left - optimisticRange[0]) < 1e-6 &&
      Math.abs(right - optimisticRange[1]) < 1e-6
    ) {
      setOptimisticRange(null);
    }
  }, [isControlled, max, min, optimisticRange, rangeValue]);

  useEffect(() => {
    if (isDraggingRef.current || dragRange !== null) return;
    animateToRange(committedLeftRatio, committedRightRatio, false);
  }, [committedLeftRatio, committedRightRatio, dragRange, maxThumbX]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setTrackWidth(width);
    trackWidthRef.current = width;
    animateToRange(committedLeftRatio, committedRightRatio, true);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => trackWidthRef.current > 0,
      onStartShouldSetPanResponderCapture: () => trackWidthRef.current > 0,
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        trackWidthRef.current > 0 && Math.hypot(gestureState.dx, gestureState.dy) > 2,
      onMoveShouldSetPanResponderCapture: (_evt, gestureState) =>
        trackWidthRef.current > 0 && Math.hypot(gestureState.dx, gestureState.dy) > 2,
      onPanResponderGrant: (evt) => {
        const startX = evt.nativeEvent.locationX;
        startLocationXRef.current = startX;
        isDraggingRef.current = true;
        hasMovedRef.current = false;
        setDragRange(null);

        const leftRatio = committedLeftRatioRef.current;
        const rightRatio = committedRightRatioRef.current;
        currentLeftRatioRef.current = Math.min(leftRatio, rightRatio);
        currentRightRatioRef.current = Math.max(leftRatio, rightRatio);

        const runtimeMaxThumbX = Math.max(0, maxThumbXRef.current);
        leftX.setValue(ratioToThumbXByMax(currentLeftRatioRef.current, runtimeMaxThumbX));
        rightX.setValue(ratioToThumbXByMax(currentRightRatioRef.current, runtimeMaxThumbX));

        activeThumbRef.current = resolveActiveThumbByTouch(startX);
        traceStateFlow({ enabled: debugEnabled, id: debugId }, 'grant', {
          startX,
          activeThumb: activeThumbRef.current,
        });

        const { leftCenterX, rightCenterX } = getThumbCenters();
        const activeThumbCenter =
          activeThumbRef.current === 'left' ? leftCenterX : rightCenterX;
        const distanceToActiveThumb = Math.abs(startX - activeThumbCenter);
        startedOnActiveThumbRef.current = distanceToActiveThumb <= THUMB_SIZE / 2 + DRAG_START_HIT_SLOP;
        dragTouchOffsetRef.current =
          startedOnActiveThumbRef.current
            ? startX - activeThumbCenter
            : 0;
      },
      onPanResponderMove: (_evt, gestureState) => {
        if (!isDraggingRef.current) return;
        if (Math.hypot(gestureState.dx, gestureState.dy) <= 2) return;
        hasMovedRef.current = true;

        const localX = startLocationXRef.current + gestureState.dx;
        const thumbCenterX = localX - dragTouchOffsetRef.current;
        const thumbX = thumbCenterX - TRACK_PADDING - THUMB_SIZE / 2;
        const runtimeMaxThumbX = maxThumbXRef.current;
        const nextRatio = runtimeMaxThumbX <= 0 ? 0 : clamp01(thumbX / runtimeMaxThumbX);

        let nextLeftRatio = currentLeftRatioRef.current;
        let nextRightRatio = currentRightRatioRef.current;
        if (symmetricMove) {
          if (activeThumbRef.current === 'left') {
            nextLeftRatio = Math.min(nextRatio, CENTER_RATIO);
            nextRightRatio = 1 - nextLeftRatio;
          } else {
            nextRightRatio = Math.max(nextRatio, CENTER_RATIO);
            nextLeftRatio = 1 - nextRightRatio;
          }
        } else if (activeThumbRef.current === 'left') {
          nextLeftRatio = clampRatioBySide(
            Math.min(nextRatio, currentRightRatioRef.current),
            'left'
          );
        } else {
          nextRightRatio = clampRatioBySide(
            Math.max(nextRatio, currentLeftRatioRef.current),
            'right'
          );
        }

        currentLeftRatioRef.current = nextLeftRatio;
        currentRightRatioRef.current = nextRightRatio;
        setDragRange([ratioToValue(nextLeftRatio), ratioToValue(nextRightRatio)]);
        leftX.setValue(ratioToThumbXByMax(nextLeftRatio, runtimeMaxThumbX));
        rightX.setValue(ratioToThumbXByMax(nextRightRatio, runtimeMaxThumbX));
        traceStateFlow({ enabled: debugEnabled, id: debugId }, 'move', {
          nextLeftRatio,
          nextRightRatio,
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        const movedDistance = Math.hypot(gestureState.dx, gestureState.dy);
        const isTapGesture = movedDistance <= 6;
        const tapX = startLocationXRef.current;

        // 点按把手本身（无位移）应保持当前位置，避免 release location 异常时跳回起点
        if (
          isTapGesture &&
          isDraggingRef.current &&
          !hasMovedRef.current &&
          startedOnActiveThumbRef.current
        ) {
          applyRange(currentLeftRatioRef.current, currentRightRatioRef.current, true);
          setDragRange(null);
          isDraggingRef.current = false;
          hasMovedRef.current = false;
          startedOnActiveThumbRef.current = false;
          return;
        }

        if (isTapGesture) {
          const tapRatio = locationXToRatio(tapX);
          activeThumbRef.current = resolveActiveThumbByTouch(tapX);

          let nextLeftRatio = committedLeftRatioRef.current;
          let nextRightRatio = committedRightRatioRef.current;
          if (symmetricMove) {
            if (activeThumbRef.current === 'left') {
              nextLeftRatio = Math.min(tapRatio, CENTER_RATIO);
              nextRightRatio = 1 - nextLeftRatio;
            } else {
              nextRightRatio = Math.max(tapRatio, CENTER_RATIO);
              nextLeftRatio = 1 - nextRightRatio;
            }
          } else if (activeThumbRef.current === 'left') {
            nextLeftRatio = clampRatioBySide(
              Math.min(tapRatio, committedRightRatioRef.current),
              'left'
            );
          } else {
            nextRightRatio = clampRatioBySide(
              Math.max(tapRatio, committedLeftRatioRef.current),
              'right'
            );
          }
          setDragRange(null);
          applyRange(nextLeftRatio, nextRightRatio, true);
          traceStateFlow({ enabled: debugEnabled, id: debugId }, 'release-tap', {
            nextLeftRatio,
            nextRightRatio,
          });
          isDraggingRef.current = false;
          hasMovedRef.current = false;
          startedOnActiveThumbRef.current = false;
          return;
        }

        if (isDraggingRef.current && hasMovedRef.current) {
          applyRange(currentLeftRatioRef.current, currentRightRatioRef.current, true);
          traceStateFlow({ enabled: debugEnabled, id: debugId }, 'release-drag', {
            leftRatio: currentLeftRatioRef.current,
            rightRatio: currentRightRatioRef.current,
          });
          setDragRange(null);
          isDraggingRef.current = false;
          hasMovedRef.current = false;
          startedOnActiveThumbRef.current = false;
          return;
        }

        setDragRange(null);
        isDraggingRef.current = false;
        hasMovedRef.current = false;
        startedOnActiveThumbRef.current = false;
        animateToRange(committedLeftRatioRef.current, committedRightRatioRef.current, false);
      },
      onPanResponderTerminate: () => {
        setDragRange(null);
        if (isDraggingRef.current && hasMovedRef.current) {
          applyRange(currentLeftRatioRef.current, currentRightRatioRef.current, true);
          isDraggingRef.current = false;
          hasMovedRef.current = false;
          startedOnActiveThumbRef.current = false;
          return;
        }
        isDraggingRef.current = false;
        hasMovedRef.current = false;
        startedOnActiveThumbRef.current = false;
        animateToRange(committedLeftRatioRef.current, committedRightRatioRef.current, false);
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const displayLeftRatio = clamp01((resolvedRange[0] - min) / span);
  const displayRightRatio = clamp01((resolvedRange[1] - min) / span);
  const fillLeft = ratioToThumbX(Math.min(displayLeftRatio, displayRightRatio));
  const fillRight = ratioToThumbX(Math.max(displayLeftRatio, displayRightRatio)) + THUMB_SIZE;
  const fillWidth = Math.max(0, fillRight - fillLeft);

  return (
    <View style={styles.container}>
      <View style={styles.trackOuter} onLayout={handleLayout} {...panResponder.panHandlers}>
        <View style={styles.trackBase} />
        <View pointerEvents="none" style={styles.fixedCenterDivider} />

        <View
          style={[
            styles.fillLayer,
            {
              left: TRACK_PADDING + fillLeft,
              width: fillWidth,
            },
          ]}
        />

        {showDots &&
          stops.map((ratio, index) => {
            const dotCenterX = TRACK_PADDING + ratioToThumbX(ratio) + THUMB_SIZE / 2;
            const isActive = ratio >= displayLeftRatio && ratio <= displayRightRatio;
            return (
              <View
                key={`dot-${index}`}
                style={[
                  styles.dot,
                  {
                    left: dotCenterX - 3,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.35)' : '#CDCDCD',
                  },
                ]}
              />
            );
          })}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.thumbOuter,
            {
              left: TRACK_PADDING,
              transform: [{ translateX: leftX }],
            },
          ]}
        >
          <View style={styles.thumbInner} />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.thumbOuter,
            {
              left: TRACK_PADDING,
              transform: [{ translateX: rightX }],
            },
          ]}
        >
          <View style={styles.thumbInner} />
        </Animated.View>
      </View>
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
  fixedCenterDivider: {
    position: 'absolute',
    top: (TRACK_HEIGHT - 8) / 2,
    left: '50%',
    width: 1,
    marginLeft: -0.5,
    height: 8,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.35)',
    zIndex: 3,
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: TOKENS.radius.pill,
    top: (TRACK_HEIGHT - 6) / 2,
  },
  thumbOuter: {
    position: 'absolute',
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
});

export default DualHandleSlider;
