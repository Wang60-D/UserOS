import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type ImageSourcePropType,
  type LayoutChangeEvent,
  type PanResponderGestureState,
} from 'react-native';
import { TOKENS } from '../../tokens';

const TRACK_HEIGHT = 32;
const TRACK_PADDING = 2;
const MIN_STEPS = 2;
const MAX_STEPS = 8;

export interface NumberCapsuleSliderProps {
  steps: number;
  value?: number;
  onChange?: (nextIndex: number) => void;
  labels?: Array<string | number>;
  iconLabels?: ImageSourcePropType[];
  labelIconSize?: number;
}

const NumberCapsuleSlider: React.FC<NumberCapsuleSliderProps> = ({
  steps,
  value,
  onChange,
  labels,
  iconLabels,
  labelIconSize = 12,
}) => {
  const resolvedSteps = Math.max(MIN_STEPS, Math.min(MAX_STEPS, Math.floor(steps)));
  const isControlled = typeof value === 'number';
  const [internalIndex, setInternalIndex] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const translateX = useRef(new Animated.Value(0)).current;
  const panStateRef = useRef({
    dragStartX: 0,
    maxX: 0,
    segmentWidth: 0,
  });

  const fallbackLabels = useMemo(
    () => Array.from({ length: resolvedSteps }, (_, index) => index + 1),
    [resolvedSteps]
  );
  const displayLabels = labels && labels.length === resolvedSteps ? labels : fallbackLabels;
  const displayIconLabels = iconLabels && iconLabels.length === resolvedSteps ? iconLabels : undefined;
  const selectedIndex = Math.max(
    0,
    Math.min(resolvedSteps - 1, isControlled ? (value as number) : internalIndex)
  );
  const currentDisplayIndex = draggingIndex === null ? selectedIndex : draggingIndex;
  const segmentWidth = Math.max(0, (trackWidth - TRACK_PADDING * 2) / resolvedSteps);

  const commitIndex = (nextIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(resolvedSteps - 1, nextIndex));
    if (!isControlled) {
      setInternalIndex(clampedIndex);
    }
    onChange?.(clampedIndex);
  };

  const animateToIndex = (nextIndex: number, immediate = false) => {
    if (segmentWidth <= 0) return;
    const clampedIndex = Math.max(0, Math.min(resolvedSteps - 1, nextIndex));
    const toValue = clampedIndex * segmentWidth;
    if (immediate) {
      translateX.setValue(toValue);
      return;
    }
    Animated.spring(translateX, {
      toValue,
      useNativeDriver: true,
      tension: 90,
      friction: 12,
    }).start();
  };

  useEffect(() => {
    animateToIndex(selectedIndex, false);
  }, [selectedIndex, segmentWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setTrackWidth(width);
    const widthPerSegment = Math.max(0, (width - TRACK_PADDING * 2) / resolvedSteps);
    panStateRef.current.segmentWidth = widthPerSegment;
    panStateRef.current.maxX = Math.max(0, widthPerSegment * (resolvedSteps - 1));
    animateToIndex(selectedIndex, true);
  };

  const onRelease = (
    _evt: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => {
    const { dragStartX, maxX, segmentWidth: widthPerSegment } = panStateRef.current;
    if (widthPerSegment <= 0) {
      setDraggingIndex(null);
      return;
    }
    const releasedX = Math.max(0, Math.min(maxX, dragStartX + gestureState.dx));
    const nextIndex = Math.max(
      0,
      Math.min(resolvedSteps - 1, Math.round(releasedX / widthPerSegment))
    );
    setDraggingIndex(null);
    animateToIndex(nextIndex, false);
    commitIndex(nextIndex);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, gestureState) => Math.abs(gestureState.dx) > 2,
      onMoveShouldSetPanResponderCapture: (_evt, gestureState) => Math.abs(gestureState.dx) > 2,
      onPanResponderGrant: () => {
        translateX.stopAnimation((valueX) => {
          panStateRef.current.dragStartX = valueX;
        });
        setDraggingIndex(selectedIndex);
      },
      onPanResponderMove: (_evt, gestureState) => {
        const { dragStartX, maxX, segmentWidth: widthPerSegment } = panStateRef.current;
        const nextX = Math.max(0, Math.min(maxX, dragStartX + gestureState.dx));
        translateX.setValue(nextX);
        if (widthPerSegment > 0) {
          const nextIndex = Math.max(
            0,
            Math.min(resolvedSteps - 1, Math.round(nextX / widthPerSegment))
          );
          setDraggingIndex(nextIndex);
        }
      },
      onPanResponderRelease: onRelease,
      onPanResponderTerminate: () => {
        setDraggingIndex(null);
        animateToIndex(selectedIndex, false);
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.track} onLayout={handleLayout} {...panResponder.panHandlers}>
        {segmentWidth > 0 && (
          <Animated.View
            style={[
              styles.activePill,
              {
                width: segmentWidth,
                transform: [{ translateX }],
              },
            ]}
          />
        )}
        {displayLabels.map((item, index) => {
          const isSelected = currentDisplayIndex === index;
          return (
            <Pressable
              key={`number-segment-${index}`}
              style={styles.segmentButton}
              onPress={() => commitIndex(index)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              {displayIconLabels?.[index] ? (
                <Image
                  source={displayIconLabels[index]}
                  resizeMode="contain"
                  style={[
                    styles.labelIcon,
                    { width: labelIconSize, height: labelIconSize },
                    isSelected ? styles.labelIconSelected : styles.labelIconUnselected,
                  ]}
                />
              ) : (
                <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelUnselected]}>
                  {String(item)}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    width: '100%',
    height: TRACK_HEIGHT,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.rightPillBg,
    padding: TRACK_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  activePill: {
    position: 'absolute',
    top: TRACK_PADDING,
    bottom: TRACK_PADDING,
    left: TRACK_PADDING,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.mainColor,
  },
  segmentButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  label: {
    fontSize: TOKENS.fontSize.medium,
    fontWeight: '500',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
  labelUnselected: {
    color: TOKENS.colors.rightText,
  },
  labelIcon: {
    width: 12,
    height: 12,
  },
  labelIconSelected: {
    tintColor: '#FFFFFF',
  },
  labelIconUnselected: {
    tintColor: TOKENS.colors.rightText,
  },
});

export default NumberCapsuleSlider;
