import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type LayoutChangeEvent,
} from 'react-native';
import { TOKENS } from '../../tokens';

export type CapsuleModeValue = 'off' | 'modeA' | 'modeB';

export interface CapsuleModeSliderProps {
  value?: CapsuleModeValue;
  onChange?: (nextValue: CapsuleModeValue) => void;
  splitTracks?: boolean;
  iconSize?: number;
  offLabel?: string;
  modeALabel?: string;
  modeBLabel?: string;
  offIcon?: ImageSourcePropType;
  modeAIcon?: ImageSourcePropType;
  modeBIcon?: ImageSourcePropType;
}

const TRACK_HEIGHT = 40;
const TRACK_GAP = 8;
const TRACK_PADDING = 2;
const SINGLE_TRACK_OPTION_COUNT = 3;
const SPLIT_RIGHT_OPTION_COUNT = 2;
const VALUE_ORDER: CapsuleModeValue[] = ['off', 'modeA', 'modeB'];

const CapsuleModeSlider: React.FC<CapsuleModeSliderProps> = ({
  value,
  onChange,
  splitTracks = false,
  iconSize = 20,
  offLabel = '关闭',
  modeALabel = '降噪',
  modeBLabel = '通透',
  offIcon,
  modeAIcon,
  modeBIcon,
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<CapsuleModeValue>('modeA');
  const resolvedValue = isControlled ? (value as CapsuleModeValue) : internalValue;
  const [singleTrackWidth, setSingleTrackWidth] = useState(0);
  const [rightTrackWidth, setRightTrackWidth] = useState(0);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const singleTranslateX = useRef(new Animated.Value(0)).current;
  const splitRightTranslateX = useRef(new Animated.Value(0)).current;
  const splitRightOpacity = useRef(new Animated.Value(resolvedValue === 'off' ? 0 : 1)).current;
  const splitOffOpacity = useRef(new Animated.Value(resolvedValue === 'off' ? 1 : 0)).current;
  const splitTracksRef = useRef(splitTracks);
  const resolvedValueRef = useRef<CapsuleModeValue>(resolvedValue);
  const singlePanRef = useRef({
    dragStartX: 0,
    touchStartX: 0,
    maxX: 0,
    segmentWidth: 0,
  });
  const splitPanRef = useRef({
    touchStartX: 0,
    trackWidth: 0,
  });

  useEffect(() => {
    splitTracksRef.current = splitTracks;
  }, [splitTracks]);

  useEffect(() => {
    resolvedValueRef.current = resolvedValue;
  }, [resolvedValue]);

  const selectedIndex = useMemo(
    () => VALUE_ORDER.findIndex((item) => item === resolvedValue),
    [resolvedValue]
  );
  const safeSelectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
  const currentDisplayValue =
    draggingIndex === null ? resolvedValue : VALUE_ORDER[draggingIndex] || resolvedValue;
  const singleSegmentWidth = Math.max(
    0,
    (singleTrackWidth - TRACK_PADDING * 2) / SINGLE_TRACK_OPTION_COUNT
  );
  const splitRightSegmentWidth = Math.max(
    0,
    (rightTrackWidth - TRACK_PADDING * 2) / SPLIT_RIGHT_OPTION_COUNT
  );

  const applySingleTrackWidth = (width: number) => {
    const safeWidth = Math.max(0, width);
    if (safeWidth <= 0) return;
    setSingleTrackWidth(safeWidth);
    const currentSegmentWidth = Math.max(
      0,
      (safeWidth - TRACK_PADDING * 2) / SINGLE_TRACK_OPTION_COUNT
    );
    singlePanRef.current.segmentWidth = currentSegmentWidth;
    singlePanRef.current.maxX = Math.max(0, currentSegmentWidth * (SINGLE_TRACK_OPTION_COUNT - 1));
  };

  const commitValue = (nextValue: CapsuleModeValue) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const animateSingleToIndex = (index: number, immediate = false) => {
    if (singleSegmentWidth <= 0) return;
    const clampedIndex = Math.max(0, Math.min(SINGLE_TRACK_OPTION_COUNT - 1, index));
    const toValue = clampedIndex * singleSegmentWidth;
    if (immediate) {
      singleTranslateX.setValue(toValue);
      return;
    }
    Animated.spring(singleTranslateX, {
      toValue,
      useNativeDriver: true,
      tension: 90,
      friction: 12,
    }).start();
  };

  const animateSplit = (nextValue: CapsuleModeValue, immediate = false) => {
    const animations: Animated.CompositeAnimation[] = [];
    if (nextValue === 'off') {
      animations.push(
        Animated.timing(splitOffOpacity, {
          toValue: 1,
          duration: immediate ? 0 : 180,
          useNativeDriver: true,
        }),
        Animated.timing(splitRightOpacity, {
          toValue: 0,
          duration: immediate ? 0 : 180,
          useNativeDriver: true,
        })
      );
    } else {
      const rightIndex = nextValue === 'modeA' ? 0 : 1;
      const toValue = rightIndex * splitRightSegmentWidth;
      if (immediate) {
        splitRightTranslateX.setValue(toValue);
      } else {
        animations.push(
          Animated.spring(splitRightTranslateX, {
            toValue,
            useNativeDriver: true,
            tension: 90,
            friction: 12,
          })
        );
      }
      animations.push(
        Animated.timing(splitOffOpacity, {
          toValue: 0,
          duration: immediate ? 0 : 180,
          useNativeDriver: true,
        }),
        Animated.timing(splitRightOpacity, {
          toValue: 1,
          duration: immediate ? 0 : 180,
          useNativeDriver: true,
        })
      );
    }
    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  };

  useEffect(() => {
    if (!splitTracks) {
      animateSingleToIndex(safeSelectedIndex, false);
    }
  }, [safeSelectedIndex, splitTracks, singleSegmentWidth]);

  useEffect(() => {
    if (!splitTracks && singleTrackWidth <= 0 && splitPanRef.current.trackWidth > 0) {
      applySingleTrackWidth(splitPanRef.current.trackWidth);
      animateSingleToIndex(safeSelectedIndex, true);
    }
  }, [splitTracks, singleTrackWidth, safeSelectedIndex]);

  useEffect(() => {
    if (splitTracks) {
      animateSplit(resolvedValue, false);
    }
  }, [splitTracks, resolvedValue, splitRightSegmentWidth]);

  const handleSingleTrackLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    applySingleTrackWidth(width);
    animateSingleToIndex(safeSelectedIndex, true);
  };

  const handleSplitRightTrackLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setRightTrackWidth(width);
    animateSplit(resolvedValue, true);
  };

  const handleSplitTopRowLayout = (event: LayoutChangeEvent) => {
    splitPanRef.current.trackWidth = event.nativeEvent.layout.width;
  };

  const getSplitValueByPosition = (positionX: number): CapsuleModeValue => {
    const width = splitPanRef.current.trackWidth;
    if (width <= 0) return resolvedValueRef.current;
    const clampedX = Math.max(0, Math.min(width, positionX));
    const sectionWidth = width / 3;
    if (clampedX < sectionWidth) return 'off';
    if (clampedX < sectionWidth * 2) return 'modeA';
    return 'modeB';
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        !splitTracksRef.current && Math.abs(gestureState.dx) > 2,
      onMoveShouldSetPanResponderCapture: (_evt, gestureState) =>
        !splitTracksRef.current && Math.abs(gestureState.dx) > 2,
      onPanResponderGrant: (evt) => {
        singlePanRef.current.touchStartX = evt.nativeEvent.locationX;
        singleTranslateX.stopAnimation((valueX) => {
          singlePanRef.current.dragStartX = valueX;
        });
        setDraggingIndex(safeSelectedIndex);
      },
      onPanResponderMove: (_evt, gestureState) => {
        const { dragStartX, maxX, segmentWidth: widthPerSegment } = singlePanRef.current;
        const nextX = Math.max(0, Math.min(maxX, dragStartX + gestureState.dx));
        singleTranslateX.setValue(nextX);
        if (widthPerSegment > 0) {
          const nextIndex = Math.max(
            0,
            Math.min(
              SINGLE_TRACK_OPTION_COUNT - 1,
              Math.round(nextX / widthPerSegment)
            )
          );
          setDraggingIndex(nextIndex);
        }
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const {
          dragStartX,
          touchStartX,
          maxX,
          segmentWidth: widthPerSegment,
        } = singlePanRef.current;
        if (widthPerSegment <= 0) {
          setDraggingIndex(null);
          return;
        }
        const isTap = Math.abs(gestureState.dx) < 2 && Math.abs(gestureState.dy) < 2;
        const releasedX = isTap
          ? Math.max(0, Math.min(maxX, touchStartX - TRACK_PADDING))
          : Math.max(0, Math.min(maxX, dragStartX + gestureState.dx));
        const nextIndex = Math.max(
          0,
          Math.min(
            SINGLE_TRACK_OPTION_COUNT - 1,
            Math.round(releasedX / widthPerSegment)
          )
        );
        const nextValue = VALUE_ORDER[nextIndex];
        setDraggingIndex(null);
        animateSingleToIndex(nextIndex, false);
        if (nextValue) {
          commitValue(nextValue);
        }
      },
      onPanResponderTerminate: () => {
        setDraggingIndex(null);
        animateSingleToIndex(safeSelectedIndex, false);
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const splitPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        splitTracksRef.current && Math.abs(gestureState.dx) > 2,
      onMoveShouldSetPanResponderCapture: (_evt, gestureState) =>
        splitTracksRef.current && Math.abs(gestureState.dx) > 2,
      onPanResponderGrant: (evt) => {
        splitPanRef.current.touchStartX = evt.nativeEvent.locationX;
      },
      onPanResponderMove: (_evt, gestureState) => {
        const currentX = splitPanRef.current.touchStartX + gestureState.dx;
        const nextValue = getSplitValueByPosition(currentX);
        if (nextValue !== resolvedValueRef.current) {
          commitValue(nextValue);
        }
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const releaseX = splitPanRef.current.touchStartX + gestureState.dx;
        const nextValue = getSplitValueByPosition(releaseX);
        if (nextValue !== resolvedValueRef.current) {
          commitValue(nextValue);
        } else {
          animateSplit(nextValue, false);
        }
      },
      onPanResponderTerminate: () => {
        animateSplit(resolvedValueRef.current, false);
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const renderIcon = (icon?: ImageSourcePropType, selected = false) => {
    if (!icon) return null;
    return (
      <Image
        source={icon}
        style={[
          styles.icon,
          { width: iconSize, height: iconSize },
          selected ? styles.iconSelected : styles.iconUnselected,
        ]}
        resizeMode="contain"
      />
    );
  };

  return (
    <View style={styles.container}>
      {splitTracks ? (
        <View
          style={styles.topRow}
          onLayout={handleSplitTopRowLayout}
          {...splitPanResponder.panHandlers}
        >
          <Pressable
            style={styles.offButton}
            onPress={() => commitValue('off')}
            accessibilityRole="button"
            accessibilityState={{ selected: resolvedValue === 'off' }}
          >
            <Animated.View style={[styles.splitOffActivePill, { opacity: splitOffOpacity }]} />
            {renderIcon(offIcon, resolvedValue === 'off')}
          </Pressable>

          <View style={styles.rightTrack} onLayout={handleSplitRightTrackLayout}>
            {splitRightSegmentWidth > 0 && (
              <Animated.View
                style={[
                  styles.splitRightActivePill,
                  {
                    width: splitRightSegmentWidth,
                    opacity: splitRightOpacity,
                    transform: [{ translateX: splitRightTranslateX }],
                  },
                ]}
              />
            )}
            <Pressable
              style={styles.modeButton}
              onPress={() => commitValue('modeA')}
              accessibilityRole="button"
              accessibilityState={{ selected: resolvedValue === 'modeA' }}
            >
              {renderIcon(modeAIcon, resolvedValue === 'modeA')}
            </Pressable>
            <Pressable
              style={styles.modeButton}
              onPress={() => commitValue('modeB')}
              accessibilityRole="button"
              accessibilityState={{ selected: resolvedValue === 'modeB' }}
            >
              {renderIcon(modeBIcon, resolvedValue === 'modeB')}
            </Pressable>
          </View>
        </View>
      ) : (
        <View
          style={styles.singleTrack}
          onLayout={handleSingleTrackLayout}
          {...panResponder.panHandlers}
        >
          {singleSegmentWidth > 0 && (
            <Animated.View
              style={[
                styles.singleTrackActivePill,
                {
                  width: singleSegmentWidth,
                  transform: [{ translateX: singleTranslateX }],
                },
              ]}
            />
          )}
          <Pressable
            style={styles.singleTrackButton}
            onPress={() => commitValue('off')}
            accessibilityRole="button"
            accessibilityState={{ selected: currentDisplayValue === 'off' }}
          >
            {renderIcon(offIcon, currentDisplayValue === 'off')}
          </Pressable>
          <Pressable
            style={styles.singleTrackButton}
            onPress={() => commitValue('modeA')}
            accessibilityRole="button"
            accessibilityState={{ selected: currentDisplayValue === 'modeA' }}
          >
            {renderIcon(modeAIcon, currentDisplayValue === 'modeA')}
          </Pressable>
          <Pressable
            style={styles.singleTrackButton}
            onPress={() => commitValue('modeB')}
            accessibilityRole="button"
            accessibilityState={{ selected: currentDisplayValue === 'modeB' }}
          >
            {renderIcon(modeBIcon, currentDisplayValue === 'modeB')}
          </Pressable>
        </View>
      )}

      <View style={styles.bottomRow}>
        <View style={styles.labelWrapper}>
          <View style={styles.labelTextWrap}>
            <Text style={styles.label}>{offLabel}</Text>
          </View>
        </View>
        <View style={styles.rightLabels}>
          <View style={styles.labelTextWrap}>
            <Text style={styles.label}>{modeALabel}</Text>
          </View>
          <View style={styles.labelTextWrap}>
            <Text style={styles.label}>{modeBLabel}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    gap: TRACK_GAP,
  },
  offButton: {
    flex: 1,
    height: TRACK_HEIGHT,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.rightPillBg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  rightTrack: {
    flex: 2,
    height: TRACK_HEIGHT,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.rightPillBg,
    padding: TRACK_PADDING,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  singleTrack: {
    width: '100%',
    height: TRACK_HEIGHT,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.rightPillBg,
    padding: TRACK_PADDING,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  singleTrackActivePill: {
    position: 'absolute',
    top: TRACK_PADDING,
    bottom: TRACK_PADDING,
    left: TRACK_PADDING,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.mainColor,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  splitOffActivePill: {
    position: 'absolute',
    top: TRACK_PADDING,
    left: TRACK_PADDING,
    right: TRACK_PADDING,
    bottom: TRACK_PADDING,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.mainColor,
  },
  splitRightActivePill: {
    position: 'absolute',
    top: TRACK_PADDING,
    left: TRACK_PADDING,
    bottom: TRACK_PADDING,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.mainColor,
  },
  singleTrackButton: {
    flex: 1,
    borderRadius: TOKENS.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  modeButton: {
    flex: 1,
    borderRadius: TOKENS.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  icon: {
    width: 20,
    height: 20,
  },
  iconSelected: {
    tintColor: '#FFFFFF',
  },
  iconUnselected: {
    tintColor: TOKENS.colors.rightText,
  },
  bottomRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: TRACK_GAP,
  },
  rightLabels: {
    flex: 2,
    flexDirection: 'row',
  },
  labelWrapper: {
    flex: 1,
  },
  labelTextWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    fontSize: TOKENS.fontSize.small,
    color: TOKENS.colors.rightText,
    fontWeight: '500',
  },
});

export default CapsuleModeSlider;
