import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import { TOKENS } from '../../../tokens';
import TickMarks3PageLayout from './TickMarks3PageLayout';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const formatDelay = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h <= 0) return ` ${m}分钟`;
  if (m <= 0) return ` ${h}小时`;
  return ` ${h}小时${m}分钟`;
};

const Part2TickMarks3DelayShortScreen: React.FC = () => {
  const [value, setValue] = useState(80);

  return (
    <TickMarks3PageLayout
      imageSource={require('../../../assets/equipment/air-conditioner.png')}
      activeRoute="Part2TickMarks3DelayShort"
    >
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="延时开启"
            subtitleEnabled={true}
            subtitleText={formatDelay(value)}
            rightEnabled={false}
          />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={value}
            onChange={(next) => setValue(clamp(Math.round(next), 0, 120))}
            min={0}
            max={120}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={7}
            snapToDots={false}
            showFill={true}
            fillMode="left"
            showEdgeValues={false}
            showTickLabels={false}
            emitChangeWhileDragging={true}
          />
        </View>
      </View>
    </TickMarks3PageLayout>
  );
};

const styles = StyleSheet.create({
  modeCard: {
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  titleRow: {
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingTop: TOKENS.spacing.cardInnerPaddingV,
    paddingBottom: 6,
  },
  controlPanel: {
    paddingTop: 8,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingBottom: TOKENS.spacing.cardInnerPaddingV,
  },
});

export default Part2TickMarks3DelayShortScreen;
