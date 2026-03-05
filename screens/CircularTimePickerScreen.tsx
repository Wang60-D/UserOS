import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircularTimePicker, type CircularTimeValue } from '../components/time';
import { TOKENS } from '../tokens';

const CircularTimePickerScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [singleTime, setSingleTime] = useState<CircularTimeValue>({ hour: 8, minute: 5 });
  const [startTime, setStartTime] = useState<CircularTimeValue>({ hour: 8, minute: 5 });
  const [endTime, setEndTime] = useState<CircularTimeValue>({ hour: 14, minute: 0 });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + TOKENS.spacing.pagePaddingV }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <CircularTimePicker
            title="选择时间"
            mode="single"
            value={singleTime}
            onChange={setSingleTime}
            minuteStep={5}
          />
        </View>

        <View style={[styles.card, styles.cardSpacing]}>
          <CircularTimePicker
            title="选择时间"
            mode="range"
            startValue={startTime}
            endValue={endTime}
            onRangeChange={(nextStart, nextEnd) => {
              setStartTime(nextStart);
              setEndTime(nextEnd);
            }}
            minuteStep={5}
            minRangeHours={1}
            maxRangeHours={20}
          />
        </View>
      </ScrollView>
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
    alignItems: 'center',
  },
  cardSpacing: {
    marginTop: TOKENS.spacing.itemGap,
  },
});

export default CircularTimePickerScreen;
