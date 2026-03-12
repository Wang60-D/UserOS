import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type PanResponderGestureState,
} from 'react-native';
import { COMPONENT_TOKENS } from '../../tokens';

export interface BasicSliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  dotCount?: number;
  onChange?: (nextValue: number) => void;
  onChangeEnd?: (nextValue: number) => void;
}

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const BasicSlider: React.FC<BasicSliderProps> = ({
  value,
  defaultValue,
  min = 0,
  max = 100,
  dotCount = COMPONENT_TOKENS.basicSlider.defaultDotCount,
  onChange,
  onChangeEnd,
}) => {
  const token = COMPONENT_TOKENS.basicSlider;
  const safeMin = Math.min(min, max);
  const safeMax = Math.max(min, max);
  const isControlled = typeof value === 'number';
  const [internalValue, setInternalValue] = useState(
    clamp(defaultValue ?? safeMin, safeMin, safeMax)
  );
  const [trackWidth, setTrackWidth] = useState(0);
  const [dragRatio, setDragRatio] = useState<number | null>(null);

  const valueRange = Math.max(1e-6, safeMax - safeMin);
  const committedValue = isControlled ? clamp(value as number, safeMin, safeMax) : internalValue;
  const committedRatio = clamp((committedValue - safeMin) / valueRange, 0, 1);
  const displayRatio = dragRatio ?? committedRatio;
  const thumbTravel = Math.max(
    0,
    trackWidth - token.trackPaddingHorizontal * 2 - token.thumbSize
  );

  const gestureStartLocationXRef = useRef(0);
  const gestureStartPageXRef = useRef(0);
  const dragTouchOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const didMoveRef = useRef(false);
  const currentRatioRef = useRef(committedRatio);

  useEffect(() => {
    currentRatioRef.current = displayRatio;
  }, [displayRatio]);

  useEffect(() => {
    if (isControlled) return;
    setInternalValue((prev) => clamp(prev, safeMin, safeMax));
  }, [isControlled, safeMin, safeMax]);

  const ratioToValue = (ratio: number) => safeMin + clamp(ratio, 0, 1) * valueRange;
  const ratioToThumbX = (ratio: number) => clamp(ratio, 0, 1) * thumbTravel;
  const commitValue = (ratio: number, emitEnd: boolean) => {
    const nextRatio = clamp(ratio, 0, 1);
    const nextValue = ratioToValue(nextRatio);
    setDragRatio(null);
    currentRatioRef.current = nextRatio;
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
    if (emitEnd) {
      onChangeEnd?.(nextValue);
    }
  };

  const locationXToRatio = (locationX: number) => {
    if (thumbTravel <= 0) return 0;
    const thumbX = locationX - token.trackPaddingHorizontal - token.thumbSize / 2;
    return clamp(thumbX / thumbTravel, 0, 1);
  };

  const resolveLocalX = (
    _evt: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => {
    const byDx = gestureStartLocationXRef.current + gestureState.dx;
    const byMoveX = gestureStartLocationXRef.current + (gestureState.moveX - gestureStartPageXRef.current);
    if (!Number.isFinite(byMoveX)) return byDx;
    // moveX 在边缘中断时偶发异常；和 dx 偏差过大时回退到 dx。
    return Math.abs(byMoveX - byDx) <= 48 ? byMoveX : byDx;
  };

  const handlePanGrant = (evt: GestureResponderEvent) => {
    const startX = evt.nativeEvent.locationX;
    gestureStartLocationXRef.current = startX;
    gestureStartPageXRef.current = evt.nativeEvent.pageX;
    didMoveRef.current = false;
    isDraggingRef.current = false;

    const thumbCenterX =
      token.trackPaddingHorizontal + ratioToThumbX(currentRatioRef.current) + token.thumbSize / 2;
    const distanceToThumb = Math.abs(startX - thumbCenterX);
    const touchHitRange = token.thumbSize / 2 + token.touchMoveThreshold * 6;
    if (distanceToThumb <= touchHitRange) {
      isDraggingRef.current = true;
      dragTouchOffsetRef.current = startX - thumbCenterX;
      setDragRatio(currentRatioRef.current);
    } else {
      dragTouchOffsetRef.current = 0;
    }
  };

  const handlePanMove = (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
    const movedDistance = Math.hypot(gestureState.dx, gestureState.dy);
    if (movedDistance <= token.touchMoveThreshold) return;
    const hasHorizontalIntent =
      Math.abs(gestureState.dx) >= Math.abs(gestureState.dy) * token.horizontalIntentRatio;
    if (!hasHorizontalIntent) return;

    if (!isDraggingRef.current) {
      // Rail capture: 不点中把手也可开始拖拽，行为与 MUI 类似。
      isDraggingRef.current = true;
      dragTouchOffsetRef.current = 0;
      setDragRatio(currentRatioRef.current);
    }

    const localX = resolveLocalX(evt, gestureState);
    const thumbCenterX = localX - dragTouchOffsetRef.current;
    const thumbX = thumbCenterX - token.trackPaddingHorizontal - token.thumbSize / 2;
    const nextRatio = thumbTravel <= 0 ? 0 : clamp(thumbX / thumbTravel, 0, 1);
    didMoveRef.current = true;
    setDragRatio(nextRatio);
    currentRatioRef.current = nextRatio;
    onChange?.(ratioToValue(nextRatio));
  };

  const handlePanRelease = (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
    const movedDistance = Math.hypot(gestureState.dx, gestureState.dy);
    const localX = resolveLocalX(evt, gestureState);
    const trackRight = trackWidth;
    const movedEnough = movedDistance > token.touchMoveThreshold;
    const isTap = movedDistance <= token.tapThreshold;

    if (isDraggingRef.current && movedEnough) {
      if (localX >= trackRight - 1) {
        commitValue(1, true);
      } else if (localX <= 1) {
        commitValue(0, true);
      } else {
        commitValue(currentRatioRef.current, true);
      }
      isDraggingRef.current = false;
      return;
    }

    if (isTap) {
      commitValue(locationXToRatio(gestureStartLocationXRef.current), true);
      isDraggingRef.current = false;
      return;
    }

    if (didMoveRef.current) {
      commitValue(currentRatioRef.current, true);
      isDraggingRef.current = false;
      return;
    }

    setDragRatio(null);
    isDraggingRef.current = false;
  };

  const handlePanTerminate = () => {
    if (didMoveRef.current || isDraggingRef.current) {
      commitValue(currentRatioRef.current, true);
    } else {
      setDragRatio(null);
    }
    isDraggingRef.current = false;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        Math.hypot(gestureState.dx, gestureState.dy) > token.touchMoveThreshold &&
        Math.abs(gestureState.dx) >= Math.abs(gestureState.dy) * token.horizontalIntentRatio,
      onMoveShouldSetPanResponderCapture: (_evt, gestureState) =>
        Math.hypot(gestureState.dx, gestureState.dy) > token.touchMoveThreshold &&
        Math.abs(gestureState.dx) >= Math.abs(gestureState.dy) * token.horizontalIntentRatio,
      onPanResponderGrant: handlePanGrant,
      onPanResponderMove: handlePanMove,
      onPanResponderRelease: handlePanRelease,
      onPanResponderTerminate: handlePanTerminate,
      onPanResponderTerminationRequest: () => !isDraggingRef.current,
    })
  ).current;

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const dotStops = useMemo(() => {
    const safeCount = Math.max(2, dotCount);
    return Array.from({ length: safeCount }, (_, index) => index / (safeCount - 1));
  }, [dotCount]);

  const fillWidth = ratioToThumbX(displayRatio) + token.thumbSize;
  const thumbLeft = token.trackPaddingHorizontal + ratioToThumbX(displayRatio);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.trackOuter} onLayout={handleLayout}>
        <View style={styles.trackBase} pointerEvents="none" />
        <View pointerEvents="none" style={[styles.fillLayer, { width: fillWidth }]} />

        <View pointerEvents="none" style={styles.dotRow}>
          {dotStops.map((ratio, index) => {
            const dotCenterX =
              token.trackPaddingHorizontal + ratioToThumbX(ratio) + token.thumbSize / 2;
            const active = ratio <= displayRatio;
            return (
              <View
                key={`basic-slider-dot-${index}`}
                style={[
                  styles.dot,
                  {
                    left: dotCenterX - token.dotSize / 2,
                    backgroundColor: active ? token.dotActiveColor : token.dotInactiveColor,
                  },
                ]}
              />
            );
          })}
        </View>

        <View pointerEvents="none" style={[styles.thumbOuter, { left: thumbLeft }]}>
          <View style={styles.thumbInner} />
        </View>
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
    height: COMPONENT_TOKENS.basicSlider.containerHeight,
    justifyContent: 'center',
  },
  trackBase: {
    position: 'absolute',
    left: COMPONENT_TOKENS.basicSlider.trackPaddingHorizontal,
    right: COMPONENT_TOKENS.basicSlider.trackPaddingHorizontal,
    height: COMPONENT_TOKENS.basicSlider.trackHeight,
    borderRadius: COMPONENT_TOKENS.basicSlider.trackRadius,
    backgroundColor: COMPONENT_TOKENS.basicSlider.trackBackgroundColor,
    overflow: 'hidden',
  },
  fillLayer: {
    position: 'absolute',
    left: COMPONENT_TOKENS.basicSlider.trackPaddingHorizontal,
    height: COMPONENT_TOKENS.basicSlider.trackHeight,
    borderRadius: COMPONENT_TOKENS.basicSlider.trackRadius,
    backgroundColor: COMPONENT_TOKENS.basicSlider.fillBackgroundColor,
    overflow: 'hidden',
  },
  dotRow: {
    ...StyleSheet.absoluteFillObject,
  },
  dot: {
    position: 'absolute',
    top:
      (COMPONENT_TOKENS.basicSlider.containerHeight - COMPONENT_TOKENS.basicSlider.dotSize) / 2,
    width: COMPONENT_TOKENS.basicSlider.dotSize,
    height: COMPONENT_TOKENS.basicSlider.dotSize,
    borderRadius: COMPONENT_TOKENS.basicSlider.dotSize / 2,
  },
  thumbOuter: {
    position: 'absolute',
    top: (COMPONENT_TOKENS.basicSlider.containerHeight - COMPONENT_TOKENS.basicSlider.thumbSize) / 2,
    width: COMPONENT_TOKENS.basicSlider.thumbSize,
    height: COMPONENT_TOKENS.basicSlider.thumbSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbInner: {
    width: COMPONENT_TOKENS.basicSlider.thumbInnerSize,
    height: COMPONENT_TOKENS.basicSlider.thumbInnerSize,
    borderRadius: COMPONENT_TOKENS.basicSlider.thumbInnerSize / 2,
    backgroundColor: COMPONENT_TOKENS.basicSlider.thumbInnerBackgroundColor,
    shadowColor: COMPONENT_TOKENS.basicSlider.thumbShadowColor,
    shadowOpacity: COMPONENT_TOKENS.basicSlider.thumbShadowOpacity,
    shadowRadius: COMPONENT_TOKENS.basicSlider.thumbShadowRadius,
    shadowOffset: {
      width: COMPONENT_TOKENS.basicSlider.thumbShadowOffsetX,
      height: COMPONENT_TOKENS.basicSlider.thumbShadowOffsetY,
    },
  },
});

export default BasicSlider;
