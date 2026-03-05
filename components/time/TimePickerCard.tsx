import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import TimeWheelPicker from './TimeWheelPicker';

export interface TimeValue {
  hour: number;
  minute: number;
}

type TimeMode = 'start' | 'end';

export interface TimePickerCardProps {
  title?: string;
  value?: TimeValue;
  onChange?: (nextValue: TimeValue) => void;
  enableRangeMode?: boolean;
  startLabel?: string;
  endLabel?: string;
  startValue?: TimeValue;
  endValue?: TimeValue;
  onStartChange?: (nextValue: TimeValue) => void;
  onEndChange?: (nextValue: TimeValue) => void;
  initialMode?: TimeMode;
  hourRange?: [number, number];
  minuteRange?: [number, number];
  hourStep?: number;
  minuteStep?: number;
}

const TimePickerCard: React.FC<TimePickerCardProps> = ({
  title = '选择时间',
  value,
  onChange,
  enableRangeMode = false,
  startLabel = '开始时间',
  endLabel = '结束时间',
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  initialMode = 'start',
  hourRange,
  minuteRange,
  hourStep,
  minuteStep,
}) => {
  const [mode, setMode] = useState<TimeMode>(initialMode);
  const [internalValue, setInternalValue] = useState<TimeValue>({ hour: 8, minute: 5 });
  const [internalStart, setInternalStart] = useState<TimeValue>({ hour: 8, minute: 5 });
  const [internalEnd, setInternalEnd] = useState<TimeValue>({ hour: 9, minute: 0 });

  const resolvedSingleValue = value ?? internalValue;
  const resolvedStart = startValue ?? internalStart;
  const resolvedEnd = endValue ?? internalEnd;
  const resolvedValue = enableRangeMode ? (mode === 'start' ? resolvedStart : resolvedEnd) : resolvedSingleValue;
  const formatTime = (time: TimeValue) =>
    `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;

  const handleChange = (nextValue: TimeValue) => {
    if (enableRangeMode) {
      if (mode === 'start') {
        if (!startValue) {
          setInternalStart(nextValue);
        }
        onStartChange?.(nextValue);
        return;
      }
      if (!endValue) {
        setInternalEnd(nextValue);
      }
      onEndChange?.(nextValue);
      return;
    }

    if (!value) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {enableRangeMode ? (
        <View>
          <View style={styles.segmentContainer}>
            <Pressable
              style={[styles.segmentButton, mode === 'start' && styles.segmentButtonSelected]}
              onPress={() => setMode('start')}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === 'start' }}
            >
              <Text style={[styles.segmentText, mode === 'start' && styles.segmentTextSelected]}>
                {startLabel}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.segmentButton, mode === 'end' && styles.segmentButtonSelected]}
              onPress={() => setMode('end')}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === 'end' }}
            >
              <Text style={[styles.segmentText, mode === 'end' && styles.segmentTextSelected]}>
                {endLabel}
              </Text>
            </Pressable>
          </View>
          <View style={styles.currentTimeRow}>
            <Text style={[styles.currentTimeText, mode === 'start' && styles.currentTimeTextActive]}>
              {startLabel} {formatTime(resolvedStart)}
            </Text>
            <Text style={[styles.currentTimeText, mode === 'end' && styles.currentTimeTextActive]}>
              {endLabel} {formatTime(resolvedEnd)}
            </Text>
          </View>
        </View>
      ) : null}
      <View style={styles.wheelWrap}>
        <TimeWheelPicker
          hour={resolvedValue.hour}
          minute={resolvedValue.minute}
          onChange={handleChange}
          hourRange={hourRange}
          minuteRange={minuteRange}
          hourStep={hourStep}
          minuteStep={minuteStep}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 21,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 12,
  },
  segmentContainer: {
    width: '100%',
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.06)',
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  segmentButton: {
    flex: 1,
    height: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonSelected: {
    backgroundColor: '#FFFFFF',
  },
  segmentText: {
    fontSize: 14.5,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '400',
  },
  segmentTextSelected: {
    color: '#000000',
    fontWeight: '500',
  },
  currentTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  currentTimeText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '400',
  },
  currentTimeTextActive: {
    color: '#809DE4',
    fontWeight: '500',
  },
  wheelWrap: {
    minHeight: 220,
    justifyContent: 'center',
  },
});

export default TimePickerCard;
