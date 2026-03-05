import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { TOKENS } from '../../tokens';

type SliderNumber = number;

export interface NumberValueSliderProps {
  min: number;
  max: number;
  step: number;
  value?: number;
  onChange?: (nextValue: number) => void;
  onChangeEnd?: (nextValue: number) => void;
  iconSource?: ImageSourcePropType;
  edgeBleed?: number;
  showDegreeSymbol?: boolean;
}

const ITEM_WIDTH = 76;
const SELECTED_FONT_SIZE = 34;
const NEAR_FONT_SIZE = 30;
const FAR_FONT_SIZE = 28;
const CONTAINER_HEIGHT = 40;
const BASE_FONT_SIZE = FAR_FONT_SIZE;
const BASE_LINE_HEIGHT = 30;
const SELECTED_SCALE = SELECTED_FONT_SIZE / BASE_FONT_SIZE;
const NEAR_SCALE = NEAR_FONT_SIZE / BASE_FONT_SIZE;

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const countDecimals = (value: number) => {
  const raw = String(value);
  if (!raw.includes('.')) return 0;
  return raw.split('.')[1]?.length ?? 0;
};

const roundToPrecision = (value: number, precision: number) => {
  if (precision <= 0) return Math.round(value);
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

const NumberValueSlider: React.FC<NumberValueSliderProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  onChangeEnd,
  iconSource = require('../../assets/icons/airconditioner/snow.png'),
  edgeBleed = TOKENS.spacing.cardInnerPaddingH,
  showDegreeSymbol = false,
}) => {
  const normalizedMin = Math.min(min, max);
  const normalizedMax = Math.max(min, max);
  const normalizedStep = Math.abs(step) > 1e-6 ? Math.abs(step) : 1;
  const precision = Math.max(
    countDecimals(normalizedMin),
    countDecimals(normalizedMax),
    countDecimals(normalizedStep)
  );

  const values = useMemo<SliderNumber[]>(() => {
    const items: SliderNumber[] = [];
    let current = normalizedMin;
    const maxLoop = 1000;
    let loopCount = 0;
    while (current <= normalizedMax + 1e-6 && loopCount < maxLoop) {
      items.push(roundToPrecision(current, precision));
      current += normalizedStep;
      loopCount += 1;
    }
    if (items.length === 0) {
      return [roundToPrecision(normalizedMin, precision)];
    }
    return items;
  }, [normalizedMin, normalizedMax, normalizedStep, precision]);

  const resolveNearestIndex = (targetValue: number) => {
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    values.forEach((item, index) => {
      const distance = Math.abs(item - targetValue);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    return nearestIndex;
  };

  const isControlled = typeof value === 'number';
  const [internalValue, setInternalValue] = useState(values[0] ?? normalizedMin);
  const resolvedValue = clamp(
    isControlled ? (value as number) : internalValue,
    normalizedMin,
    normalizedMax
  );
  const resolvedIndex = resolveNearestIndex(resolvedValue);

  const [containerWidth, setContainerWidth] = useState(0);
  const [activeFloatIndex, setActiveFloatIndex] = useState(resolvedIndex);
  const safeEdgeBleed = Math.max(0, edgeBleed);
  const viewportWidth = Math.max(0, containerWidth + safeEdgeBleed * 2);

  const listRef = useRef<FlatList<SliderNumber>>(null);
  const hasInitialScrolledRef = useRef(false);

  useEffect(() => {
    if (viewportWidth <= 0 || !listRef.current) return;
    const offset = resolvedIndex * ITEM_WIDTH;
    listRef.current.scrollToOffset({
      offset,
      animated: hasInitialScrolledRef.current,
    });
    setActiveFloatIndex(resolvedIndex);
    hasInitialScrolledRef.current = true;
  }, [resolvedIndex, viewportWidth]);

  const commitByIndex = (index: number, isEnd = false) => {
    const clampedIndex = clamp(index, 0, values.length - 1);
    const nextValue = values[clampedIndex] ?? values[0] ?? normalizedMin;
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
    if (isEnd) {
      onChangeEnd?.(nextValue);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextFloatIndex = offsetX / ITEM_WIDTH;
    setActiveFloatIndex(nextFloatIndex);
  };

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    commitByIndex(index, true);
  };

  const formatValue = (item: number) => {
    if (precision <= 0) return String(Math.round(item));
    return String(roundToPrecision(item, precision));
  };

  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const distance = Math.abs(activeFloatIndex - index);
    const isSelected = distance < 0.5;
    let scale = 1;
    let opacity = 0.2;
    if (distance < 0.5) {
      scale = SELECTED_SCALE;
      opacity = 0.9;
    } else if (distance < 1.5) {
      scale = NEAR_SCALE;
      opacity = 0.5;
    }

    return (
      <View style={styles.itemWrap}>
        <View style={styles.valueRow}>
          <View style={styles.valueTextSlot}>
            <Text
              style={[
                styles.valueText,
                {
                  color: isSelected ? '#333333' : 'rgba(0,0,0,0.8)',
                  opacity,
                  transform: [{ scale }],
                },
              ]}
            >
              {formatValue(item)}
            </Text>
          </View>
          {isSelected ? (
            <View style={styles.decorationCol}>
              {showDegreeSymbol ? <Text style={styles.degreeText}>°</Text> : null}
              <Image source={iconSource} style={styles.selectedIcon} resizeMode="contain" />
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const keyExtractor = (_item: number, index: number) => `number-value-${index}`;
  const sidePadding = Math.max(0, viewportWidth / 2 - ITEM_WIDTH / 2);

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        setContainerWidth(event.nativeEvent.layout.width);
      }}
    >
      <FlatList
        ref={listRef}
        style={[
          styles.flatList,
          {
            width: viewportWidth,
            marginLeft: -safeEdgeBleed,
          },
        ]}
        data={values}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="start"
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        removeClippedSubviews={false}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: CONTAINER_HEIGHT,
    justifyContent: 'center',
  },
  flatList: {
    overflow: 'visible',
  },
  itemWrap: {
    width: ITEM_WIDTH,
    height: CONTAINER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    minHeight: BASE_LINE_HEIGHT + 8,
    overflow: 'visible',
  },
  valueTextSlot: {
    height: BASE_LINE_HEIGHT,
    justifyContent: 'center',
  },
  valueText: {
    fontSize: BASE_FONT_SIZE,
    lineHeight: BASE_LINE_HEIGHT,
    fontWeight: '500',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  decorationCol: {
    marginLeft: 6,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: BASE_LINE_HEIGHT,
  },
  degreeText: {
    fontSize: 16,
    lineHeight: 16,
    color: 'rgba(0,0,0,0.5)',
    fontWeight: '500',
    marginBottom: 0,
    includeFontPadding: false,
  },
  selectedIcon: {
    width: 10,
    height: 10,
    marginBottom: 2,
    tintColor: '#809DE4',
  },
});

export default NumberValueSlider;
