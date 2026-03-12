import React, { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

export interface VerticalNumberSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  unitLabel?: string;
  onChange: (next: number) => void;
}

const STEP_HEIGHT = 52;
const VISIBLE_COUNT = 5;
const SIDE_COUNT = Math.floor(VISIBLE_COUNT / 2);

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const formatInt = (value: number) => `${Math.round(value)}`;

const VerticalNumberSlider: React.FC<VerticalNumberSliderProps> = ({
  value,
  min,
  max,
  step,
  unitLabel,
  onChange,
}) => {
  const values = useMemo(() => {
    const list: number[] = [];
    const safeStep = Math.max(1, step);
    for (let current = min; current <= max + 1e-6; current += safeStep) {
      list.push(Math.round(current));
    }
    return list;
  }, [max, min, step]);

  const nearestIndex = useMemo(() => {
    let result = 0;
    let minDistance = Number.POSITIVE_INFINITY;
    values.forEach((item, index) => {
      const distance = Math.abs(item - value);
      if (distance < minDistance) {
        minDistance = distance;
        result = index;
      }
    });
    return result;
  }, [value, values]);

  const [activeFloatIndex, setActiveFloatIndex] = useState(nearestIndex);
  const listRef = useRef<FlatList<number>>(null);

  const clampIndex = (index: number) => clamp(index, 0, values.length - 1);
  const commitByIndex = (index: number) => {
    const safeIndex = clampIndex(index);
    const nextValue = values[safeIndex];
    if (typeof nextValue === 'number') onChange(nextValue);
  };

  React.useEffect(() => {
    setActiveFloatIndex(nearestIndex);
    listRef.current?.scrollToOffset({
      offset: nearestIndex * STEP_HEIGHT,
      animated: true,
    });
  }, [nearestIndex]);

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / STEP_HEIGHT);
    commitByIndex(index);
    setActiveFloatIndex(index);
  };

  return (
    <View style={styles.wheelWrap}>
      <FlatList
        ref={listRef}
        data={values}
        keyExtractor={(item) => `vertical-number-${item}`}
        showsVerticalScrollIndicator={false}
        bounces={false}
        decelerationRate="fast"
        snapToInterval={STEP_HEIGHT}
        snapToAlignment="start"
        contentContainerStyle={{ paddingVertical: STEP_HEIGHT * SIDE_COUNT }}
        getItemLayout={(_, index) => ({
          length: STEP_HEIGHT,
          offset: STEP_HEIGHT * index,
          index,
        })}
        onScroll={(event) => {
          const y = event.nativeEvent.contentOffset.y;
          setActiveFloatIndex(y / STEP_HEIGHT);
        }}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item, index }) => {
          const distance = Math.abs(activeFloatIndex - index);
          const isCenter = distance < 0.5;
          const valueTextStyle = [
            isCenter ? styles.wheelCenterText : styles.wheelSideText,
            distance >= 1.5 && styles.wheelFarText,
          ];
          return (
            <View style={styles.wheelItem}>
              <View style={styles.centerRow}>
                <View style={styles.sideSlot} />
                <View style={styles.valueSlot}>
                  <Text style={valueTextStyle}>{formatInt(item)}</Text>
                </View>
                <View style={styles.sideSlot}>
                  {isCenter && unitLabel ? <Text style={styles.unitText}>{unitLabel}</Text> : null}
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wheelWrap: {
    width: '100%',
    height: STEP_HEIGHT * VISIBLE_COUNT,
    overflow: 'hidden',
  },
  wheelItem: {
    width: '100%',
    height: STEP_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerRow: {
    width: 128,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  sideSlot: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  valueSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelCenterText: {
    fontSize: 32,
    color: '#000000',
    fontWeight: '600',
  },
  wheelSideText: {
    fontSize: 27,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '500',
  },
  wheelFarText: {
    fontSize: 22,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '400',
  },
  unitText: {
    marginBottom: 7,
    fontSize: 11,
    lineHeight: 12,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '600',
    includeFontPadding: false,
  },
});

export default VerticalNumberSlider;
