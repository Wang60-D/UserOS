import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TimePickerCard, type TimeValue } from '../components/time';
import { TOKENS } from '../tokens';

const TimePickerScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [singleTime, setSingleTime] = useState<TimeValue>({ hour: 8, minute: 5 });
  const [startTime, setStartTime] = useState<TimeValue>({ hour: 8, minute: 5 });
  const [endTime, setEndTime] = useState<TimeValue>({ hour: 9, minute: 0 });

  return (
    <View style={[styles.container, { paddingTop: insets.top + TOKENS.spacing.pagePaddingV }]}>
      <View style={styles.scrollContent}>
        <View style={[styles.card, styles.cardSpacing]}>
          <TimePickerCard
            title="选择时间"
            value={singleTime}
            onChange={setSingleTime}
            hourRange={[0, 23]}
            minuteRange={[0, 55]}
            hourStep={1}
            minuteStep={5}
          />
        </View>

        <View style={[styles.card, styles.cardSpacing]}>
          <TimePickerCard
            title="选择时间"
            enableRangeMode={true}
            startLabel="开始时间"
            endLabel="结束时间"
            startValue={startTime}
            endValue={endTime}
            onStartChange={setStartTime}
            onEndChange={setEndTime}
            hourRange={[0, 23]}
            minuteRange={[0, 55]}
            hourStep={1}
            minuteStep={5}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.colors.pageBg,
    paddingHorizontal: TOKENS.spacing.pagePaddingH,
  },
  scrollContent: {
    paddingBottom: TOKENS.spacing.pagePaddingV,
  },
  card: {
    width: '100%',
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: 'hidden',
  },
  cardSpacing: {
    marginBottom: TOKENS.spacing.itemGap,
  },
});

export default TimePickerScreen;
