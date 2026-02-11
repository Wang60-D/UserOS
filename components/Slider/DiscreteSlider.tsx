import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  LayoutChangeEvent,
  Animated,
  PanResponder,
} from 'react-native';
import { TOKENS } from '../../tokens';

type DiscreteSliderProps = {
  steps?: number;
  activeIndex?: number;
  onChange?: (nextIndex: number) => void;
  snapEnabled?: boolean;
  onValueChange?: (value: number) => void;
};

const THUMB_SIZE = 32;
const THUMB_INNER_SIZE = 20;
const TRACK_HEIGHT = 32;
const WRAPPER_PADDING_V = 2;

const DiscreteSlider: React.FC<DiscreteSliderProps> = ({
  steps = 6,
  activeIndex = 2,
  onChange,
  snapEnabled = true,
  onValueChange,
}) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const stateRef = useRef({
    trackWidth: 0,
    steps,
    activeIndex,
    dragStartX: 0,
    touchOffset: THUMB_SIZE / 2,
  });

  const clampedIndex = useMemo(() => {
    if (steps <= 1) return 0;
    return Math.max(0, Math.min(steps - 1, activeIndex));
  }, [steps, activeIndex]);

  const clampThumbX = (value: number, width: number) => {
    const maxX = Math.max(0, width - THUMB_SIZE);
    return Math.max(0, Math.min(maxX, value));
  };

  const moveToIndex = (index: number, width: number, animated = true) => {
    const targetX = clampThumbX(index * (width / steps), width);
    if (animated) {
      Animated.spring(translateX, {
        toValue: targetX,
        useNativeDriver: false,
        tension: 60,
        friction: 10,
      }).start();
    } else {
      translateX.setValue(targetX);
    }
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setTrackWidth(width);
    stateRef.current.trackWidth = width;
    moveToIndex(stateRef.current.activeIndex, width, false);
  };

  useEffect(() => {
    stateRef.current.steps = steps;
    stateRef.current.activeIndex = clampedIndex;
  }, [steps, clampedIndex]);

  useEffect(() => {
    if (trackWidth > 0 && snapEnabled) {
      moveToIndex(clampedIndex, trackWidth);
    }
  }, [clampedIndex, trackWidth, snapEnabled]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX } = evt.nativeEvent;
        translateX.stopAnimation((value) => {
          const isTouchingThumb =
            locationX >= value && locationX <= value + THUMB_SIZE;
          const offset = isTouchingThumb ? locationX - value : THUMB_SIZE / 2;
          stateRef.current.dragStartX = isTouchingThumb
            ? value
            : clampThumbX(locationX - THUMB_SIZE / 2, stateRef.current.trackWidth);
          stateRef.current.touchOffset = offset;
          if (!isTouchingThumb) {
            translateX.setValue(stateRef.current.dragStartX);
          }
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        const width = stateRef.current.trackWidth;
        const { locationX } = evt.nativeEvent;
        const startX = stateRef.current.dragStartX;
        const target = clampThumbX(
          locationX - stateRef.current.touchOffset,
          width
        );
        const nextValue = Math.abs(gestureState.dx) < 1 ? startX : target;
        translateX.setValue(target);
        if (!snapEnabled && width > 0) {
          onValueChange?.(
            Math.max(0, Math.min(1, (nextValue + THUMB_SIZE) / width))
          );
        }
      },
      onPanResponderRelease: () => {
        const width = stateRef.current.trackWidth;
        if (width <= 0) return;
        translateX.stopAnimation((value) => {
          if (snapEnabled) {
            const nextIndex = Math.round(value / (width / steps));
            moveToIndex(nextIndex, width);
            onChange?.(nextIndex);
          } else {
            onValueChange?.(
              Math.max(0, Math.min(1, (value + THUMB_SIZE) / width))
            );
          }
        });
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const activeTrackWidth = Animated.add(translateX, THUMB_SIZE);

  return (
    <View style={styles.wrapper}>
      <View
        style={styles.track}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        <Animated.View style={[styles.activeTrack, { width: activeTrackWidth }]} />
        <View style={styles.stepRow}>
          {Array.from({ length: steps }).map((_, index) => (
            <Pressable
              key={`step-${index}`}
              style={styles.step}
              onPress={() => {
                if (trackWidth > 0) {
                  if (snapEnabled) {
                    moveToIndex(index, trackWidth);
                    onChange?.(index);
                  } else {
                    const target = clampThumbX(index * (trackWidth / steps), trackWidth);
                    translateX.setValue(target);
                    onValueChange?.(
                      Math.max(0, Math.min(1, (target + THUMB_SIZE) / trackWidth))
                    );
                  }
                }
              }}
            />
          ))}
        </View>
        <Animated.View style={[styles.thumb, { left: translateX }]} pointerEvents="none">
          <View style={styles.thumbInner} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: WRAPPER_PADDING_V,
    borderRadius: 100,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: 100,
    backgroundColor: TOKENS.colors.rightPillBg,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  activeTrack: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: TOKENS.colors.mainColor,
    borderRadius: 100,
  },
  stepRow: {
    flexDirection: 'row',
    height: '100%',
  },
  step: {
    flex: 1,
  },
  thumb: {
    position: 'absolute',
    top: (TRACK_HEIGHT - THUMB_SIZE) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbInner: {
    width: THUMB_INNER_SIZE,
    height: THUMB_INNER_SIZE,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
});

export default DiscreteSlider;
