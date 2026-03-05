import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

type NumberRange = [number, number];
type ColumnKey = 'hour' | 'minute';

export interface TimeWheelPickerProps {
  hour: number;
  minute: number;
  onChange: (next: { hour: number; minute: number }) => void;
  hourRange?: NumberRange;
  minuteRange?: NumberRange;
  hourStep?: number;
  minuteStep?: number;
}

const STEP_HEIGHT = 52;
const VISIBLE_COUNT = 5;
const SIDE_COUNT = Math.floor(VISIBLE_COUNT / 2);

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const normalizeRange = (range: NumberRange): NumberRange => {
  const [a, b] = range;
  return a <= b ? [a, b] : [b, a];
};

const formatTwoDigits = (value: number) => String(value).padStart(2, '0');

interface SwipeColumnProps {
  unitLabel: string;
  value: number;
  range: NumberRange;
  step: number;
  onValueChange: (nextValue: number) => void;
}

const SwipeColumn: React.FC<SwipeColumnProps> = ({
  unitLabel,
  value,
  range,
  step,
  onValueChange,
}) => {
  const [minValue, maxValue] = normalizeRange(range);
  const safeValue = clamp(value, minValue, maxValue);
  const values = useMemo(() => {
    const list: number[] = [];
    const safeStep = Math.max(1, step);
    for (let current = minValue; current <= maxValue + 1e-6; current += safeStep) {
      list.push(Math.round(current));
    }
    return list;
  }, [maxValue, minValue, step]);

  const nearestIndex = useMemo(() => {
    let result = 0;
    let minDistance = Number.POSITIVE_INFINITY;
    values.forEach((item, index) => {
      const distance = Math.abs(item - safeValue);
      if (distance < minDistance) {
        minDistance = distance;
        result = index;
      }
    });
    return result;
  }, [safeValue, values]);

  const [activeFloatIndex, setActiveFloatIndex] = useState(nearestIndex);
  const listRef = useRef<FlatList<number>>(null);
  const isProgrammaticScrollRef = useRef(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    setActiveFloatIndex(nearestIndex);
    if (!listRef.current) return;
    isProgrammaticScrollRef.current = true;
    listRef.current.scrollToOffset({
      offset: nearestIndex * STEP_HEIGHT,
      animated: initializedRef.current,
    });
    if (!initializedRef.current) {
      initializedRef.current = true;
    }
    const timer = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 180);
    return () => clearTimeout(timer);
  }, [nearestIndex]);

  const clampIndex = (index: number) => clamp(index, 0, values.length - 1);
  const commitByIndex = (index: number) => {
    const safeIndex = clampIndex(index);
    const nextValue = values[safeIndex];
    if (typeof nextValue === 'number') {
      onValueChange(nextValue);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    setActiveFloatIndex(y / STEP_HEIGHT);
  };

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / STEP_HEIGHT);
    commitByIndex(index);
    setActiveFloatIndex(index);
  };

  const handleItemPress = (index: number) => {
    if (!listRef.current) return;
    const safeIndex = clampIndex(index);
    isProgrammaticScrollRef.current = true;
    listRef.current.scrollToOffset({
      offset: safeIndex * STEP_HEIGHT,
      animated: true,
    });
    setActiveFloatIndex(safeIndex);
    commitByIndex(safeIndex);
    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 180);
  };

  const sidePadding = STEP_HEIGHT * SIDE_COUNT;

  return (
    <View style={styles.column}>
      <Text style={styles.unitText}>{unitLabel}</Text>
      <View style={styles.wheelViewport}>
        <FlatList
          ref={listRef}
          data={values}
          keyExtractor={(item) => `${unitLabel}-${item}`}
          showsVerticalScrollIndicator={false}
          bounces={false}
          decelerationRate="fast"
          snapToInterval={STEP_HEIGHT}
          snapToAlignment="start"
          contentContainerStyle={{ paddingVertical: sidePadding }}
          getItemLayout={(_, index) => ({
            length: STEP_HEIGHT,
            offset: STEP_HEIGHT * index,
            index,
          })}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumEnd}
          renderItem={({ item, index }) => {
            const distance = Math.abs(activeFloatIndex - index);
            const isCenter = distance < 0.5;
            const opacity = distance < 0.5 ? 1 : distance < 1.5 ? 0.65 : 0.32;
            const scale = distance < 0.5 ? 1 : distance < 1.5 ? 0.9 : 0.78;

            return (
              <Pressable style={styles.valueItem} onPress={() => handleItemPress(index)}>
                <Text
                  style={[
                    isCenter ? styles.selectedValue : styles.unselectedValue,
                    { opacity, transform: [{ scale }] },
                  ]}
                >
                  {formatTwoDigits(item)}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
};

const TimeWheelPicker: React.FC<TimeWheelPickerProps> = ({
  hour,
  minute,
  onChange,
  hourRange = [0, 23],
  minuteRange = [0, 59],
  hourStep = 1,
  minuteStep = 5,
}) => {
  const safeHourStep = Math.max(1, Math.floor(Math.abs(hourStep)));
  const safeMinuteStep = Math.max(1, Math.floor(Math.abs(minuteStep)));

  const [hourMin, hourMax] = normalizeRange(hourRange);
  const [minuteMin, minuteMax] = normalizeRange(minuteRange);

  const safeHour = useMemo(() => clamp(Math.round(hour), hourMin, hourMax), [hour, hourMax, hourMin]);
  const safeMinute = useMemo(
    () => clamp(Math.round(minute), minuteMin, minuteMax),
    [minute, minuteMax, minuteMin]
  );

  const handleColumnChange = (column: ColumnKey, nextValue: number) => {
    if (column === 'hour') {
      onChange({ hour: nextValue, minute: safeMinute });
      return;
    }
    onChange({ hour: safeHour, minute: nextValue });
  };

  return (
    <View style={styles.row}>
      <SwipeColumn
        unitLabel="时"
        value={safeHour}
        range={hourRange}
        step={safeHourStep}
        onValueChange={(nextValue) => handleColumnChange('hour', nextValue)}
      />
      <SwipeColumn
        unitLabel="分"
        value={safeMinute}
        range={minuteRange}
        step={safeMinuteStep}
        onValueChange={(nextValue) => handleColumnChange('minute', nextValue)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 84,
    position: 'relative',
  },
  column: {
    width: 46,
    alignItems: 'center',
    rowGap: 12,
    paddingVertical: 18,
  },
  wheelViewport: {
    width: '100%',
    height: STEP_HEIGHT * 5,
    overflow: 'hidden',
  },
  valueItem: {
    width: '100%',
    height: STEP_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitText: {
    fontSize: 19,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '400',
  },
  selectedValue: {
    fontSize: 34,
    color: '#809DE4',
    fontWeight: '500',
    lineHeight: 40,
  },
  unselectedValue: {
    fontSize: 28,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '500',
    lineHeight: 34,
  },
});

export default TimeWheelPicker;
