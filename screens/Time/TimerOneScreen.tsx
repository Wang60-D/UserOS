import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircularTimePicker, TimeAdjustPickerCard, type CircularTimeValue } from '../../components/time';
import { TOKENS } from '../../tokens';

type TimerOneControlType = 0 | 1;

const VIEW_TABS = ['1', '2'] as const;

const formatTime = (value: CircularTimeValue) =>
  `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;

const TimerOneScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TimerOneControlType>(0);
  const [timeValue, setTimeValue] = useState<CircularTimeValue>({ hour: 8, minute: 5 });

  const subtitleText = useMemo(() => formatTime(timeValue), [timeValue]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>定时1</Text>
      </View>

      <View style={styles.contentPlaceholder} />

      <View style={styles.bottomSection}>
        {activeTab === 0 ? (
          <TimeAdjustPickerCard
            title="时间调至"
            hour={timeValue.hour}
            minute={timeValue.minute}
            onChange={(next) => setTimeValue(next)}
            hourRange={[0, 23]}
            minuteRange={[0, 55]}
            hourStep={1}
            minuteStep={5}
          />
        ) : (
          <View style={styles.circularCard}>
            <CircularTimePicker
              title="选择时间"
              mode="single"
              value={timeValue}
              onChange={setTimeValue}
              minuteStep={5}
              size={340}
            />
          </View>
        )}

        <Text style={styles.timePreview}>{subtitleText}</Text>

        <View style={styles.pageSwitchContainer}>
          {VIEW_TABS.map((label, index) => {
            const selected = index === activeTab;
            return (
              <Pressable
                key={label}
                style={[styles.pageButton, selected && styles.pageButtonSelected]}
                onPress={() => setActiveTab(index as TimerOneControlType)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Text style={[styles.pageButtonText, selected && styles.pageButtonTextSelected]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
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
  wheelCard: {
    width: '100%',
    marginBottom: 16,
  },
  circularCard: {
    width: '100%',
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: 20,
    paddingVertical: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: TOKENS.colors.textPrimary,
    marginBottom: 8,
  },
  timePreview: {
    fontSize: 16,
    color: TOKENS.colors.rightText,
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

export default TimerOneScreen;
