import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../components/Slider';
import { TimeAdjustPickerCard, type TimeValue } from '../../components/time';
import { TOKENS } from '../../tokens';

type DelayControlType = 0 | 1;

const VIEW_TABS = ['1', '2'] as const;
const MAX_DELAY_MINUTES = 12 * 60;

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const minutesToTime = (minutes: number): TimeValue => {
  const safeMinutes = clamp(Math.round(minutes), 0, MAX_DELAY_MINUTES);
  return {
    hour: Math.floor(safeMinutes / 60),
    minute: safeMinutes % 60,
  };
};

const timeToMinutes = (time: TimeValue) => clamp(time.hour * 60 + time.minute, 0, MAX_DELAY_MINUTES);

const formatDuration = (minutes: number) => {
  const safeMinutes = clamp(Math.round(minutes), 0, MAX_DELAY_MINUTES);
  const hour = Math.floor(safeMinutes / 60);
  const minute = safeMinutes % 60;
  if (hour === 0) return `${minute}分钟`;
  if (minute === 0) return `${hour}小时`;
  return `${hour}小时${minute}分钟`;
};

const DelayScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<DelayControlType>(0);
  const [delayMinutes, setDelayMinutes] = useState(52);

  const delayTime = useMemo(() => minutesToTime(delayMinutes), [delayMinutes]);
  const subtitleText = useMemo(() => formatDuration(delayMinutes), [delayMinutes]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>倒计时</Text>
      </View>

      <View style={styles.contentPlaceholder} />

      <View style={styles.bottomSection}>
        {activeTab === 0 ? (
          <TimeAdjustPickerCard
            title="时间调至"
            hour={delayTime.hour}
            minute={delayTime.minute}
            onChange={(next) => setDelayMinutes(timeToMinutes(next))}
            hourRange={[0, 12]}
            minuteRange={[0, 59]}
            hourStep={1}
            minuteStep={1}
          />
        ) : (
          <View style={styles.sliderCard}>
            <View style={styles.titleRow}>
              <ControlTitleLeft
                titleText="延时开启"
                subtitleEnabled={true}
                subtitleText={subtitleText}
                rightEnabled={false}
              />
            </View>
            <View style={styles.sliderPanel}>
              <DotSlider
                value={delayMinutes}
                onChange={(next) => setDelayMinutes(clamp(Math.round(next), 0, MAX_DELAY_MINUTES))}
                min={0}
                max={MAX_DELAY_MINUTES}
                showDots={false}
                snapToDots={false}
                showFill={true}
                fillMode="left"
                showEdgeValues={true}
                edgeValues={['', '12h']}
                showTickLabels={false}
                emitChangeWhileDragging={true}
              />
            </View>
          </View>
        )}

        <View style={styles.pageSwitchContainer}>
          {VIEW_TABS.map((label, index) => {
            const selected = index === activeTab;
            return (
              <Pressable
                key={label}
                style={[styles.pageButton, selected && styles.pageButtonSelected]}
                onPress={() => setActiveTab(index as DelayControlType)}
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
  },
  wheelCard: {
    width: '100%',
    marginBottom: 48,
  },
  wheelTitle: {
    textAlign: 'center',
    fontSize: 20,
    color: TOKENS.colors.textPrimary,
    fontWeight: '500',
    marginBottom: 8,
  },
  sliderCard: {
    width: '100%',
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 48,
  },
  titleRow: {
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingTop: TOKENS.spacing.cardInnerPaddingV,
    paddingBottom: 6,
  },
  sliderPanel: {
    paddingTop: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
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

export default DelayScreen;
