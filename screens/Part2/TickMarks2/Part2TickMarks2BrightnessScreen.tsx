import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import { TOKENS } from '../../../tokens';
import TickMarks2PageLayout from './TickMarks2PageLayout';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const Part2TickMarks2BrightnessScreen: React.FC = () => {
  const [value, setValue] = useState(30);

  return (
    <TickMarks2PageLayout
      imageSource={require('../../../assets/equipment/light.png')}
      activeRoute="Part2TickMarks2Brightness"
    >
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="亮度"
            subtitleEnabled={true}
            subtitleText={` ${Math.round(value)}`}
            rightEnabled={false}
          />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={value}
            onChange={(next) => setValue(clamp(Math.round(next), 0, 100))}
            min={0}
            max={100}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={5}
            snapToDots={false}
            showFill={true}
            fillMode="left"
            showEdgeValues={false}
            showTickLabels={false}
            emitChangeWhileDragging={true}
          />
        </View>
      </View>
    </TickMarks2PageLayout>
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

export default Part2TickMarks2BrightnessScreen;
