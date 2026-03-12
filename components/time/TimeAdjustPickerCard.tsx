import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TimeWheelPicker, { type TimeWheelPickerProps } from './TimeWheelPicker';

export interface TimeAdjustPickerCardProps extends TimeWheelPickerProps {
  title?: string;
}

const TimeAdjustPickerCard: React.FC<TimeAdjustPickerCardProps> = ({
  title = '时间调至',
  hour,
  minute,
  onChange,
  onChangeWithSource,
  hourRange,
  minuteRange,
  hourStep,
  minuteStep,
  maxTotalMinutes,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.pickerWrap}>
        <TimeWheelPicker
          hour={hour}
          minute={minute}
          onChange={onChange}
          onChangeWithSource={onChangeWithSource}
          hourRange={hourRange}
          minuteRange={minuteRange}
          hourStep={hourStep}
          minuteStep={minuteStep}
          maxTotalMinutes={maxTotalMinutes}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 22.654,
    backgroundColor: '#FFFFFF',
    paddingTop: 14,
    paddingBottom: 14,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    lineHeight: 27,
    color: '#000000',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 6,
  },
  pickerWrap: {
    width: '100%',
  },
});

export default TimeAdjustPickerCard;
