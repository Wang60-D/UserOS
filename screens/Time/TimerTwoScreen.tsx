import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircularTimePicker, TimePickerCard, type CircularTimeValue, type TimeValue } from '../../components/time';
import { PageTabSwitch } from '../../components/PageSwitch';
import { TOKENS } from '../../tokens';

type TimerTwoControlType = 0 | 1;

const VIEW_TABS = ['1', '2'] as const;

const formatTime = (value: TimeValue) =>
  `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;

const TimerTwoScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TimerTwoControlType>(0);
  const [startTime, setStartTime] = useState<TimeValue>({ hour: 8, minute: 5 });
  const [endTime, setEndTime] = useState<TimeValue>({ hour: 14, minute: 0 });

  const subtitleText = useMemo(
    () => `${formatTime(startTime)} - ${formatTime(endTime)}`,
    [endTime, startTime]
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>定时2</Text>
      </View>

      <View style={styles.contentPlaceholder} />

      <View style={styles.bottomSection}>
        {activeTab === 0 ? (
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
        ) : (
          <View style={styles.circularCard}>
            <CircularTimePicker
              title="选择时间"
              mode="range"
              startValue={startTime as CircularTimeValue}
              endValue={endTime as CircularTimeValue}
              onRangeChange={(nextStart, nextEnd) => {
                setStartTime(nextStart);
                setEndTime(nextEnd);
              }}
              minuteStep={5}
              minRangeHours={1}
              maxRangeHours={20}
              size={340}
            />
          </View>
        )}

        <Text style={styles.timePreview}>{subtitleText}</Text>

        <PageTabSwitch
          activeIndex={activeTab}
          onChange={(index) => setActiveTab(index as TimerTwoControlType)}
          labels={[...VIEW_TABS]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.colors.pageBg,
    paddingHorizontal: TOKENS.spacing.pagePaddingH,
    paddingBottom: 80,
  },
  header: {
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: TOKENS.fontSize.large,
    fontWeight: '500',
    color: TOKENS.colors.textPrimary,
  },
  contentPlaceholder: {
    flex: 1,
  },
  bottomSection: {
    marginBottom: 0,
    alignItems: 'center',
  },
  circularCard: {
    width: '100%',
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: 20,
    paddingVertical: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  timePreview: {
    fontSize: 16,
    color: TOKENS.colors.rightText,
    marginTop: 16,
    marginBottom: 20,
  },
  pageSwitchContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    columnGap: 18,
  },
  pageButton: {
    width: 54,
    height: 54,
    borderRadius: TOKENS.radius.circle,
    backgroundColor: TOKENS.colors.circleUnselectedBg,
    borderWidth: 1,
    borderColor: TOKENS.colors.pageBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageButtonSelected: {
    backgroundColor: TOKENS.colors.pageBg,
    borderColor: TOKENS.colors.mainColor,
    borderWidth: 2,
  },
  pageButtonText: {
    fontSize: 17,
    color: '#666666',
    fontWeight: '400',
  },
  pageButtonTextSelected: {
    color: '#0A6EFF',
  },
});

export default TimerTwoScreen;
