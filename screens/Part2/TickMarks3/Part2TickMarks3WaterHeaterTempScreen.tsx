import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import { TOKENS } from '../../../tokens';
import TickMarks3PageLayout from './TickMarks3PageLayout';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const Part2TickMarks3WaterHeaterTempScreen: React.FC = () => {
  const [value, setValue] = useState(47);

  return (
    <TickMarks3PageLayout
      imageSource={require('../../../assets/equipment/waterhearter.png')}
      activeRoute="Part2TickMarks3WaterHeaterTemp"
    >
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="温度调节"
            subtitleEnabled={true}
            subtitleText={` ${Math.round(value)}°C`}
            rightEnabled={false}
          />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={value}
            onChange={(next) => setValue(clamp(Math.round(next), 35, 65))}
            min={35}
            max={65}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={4}
            snapToDots={false}
            showFill={true}
            fillMode="left"
            showEdgeValues={true}
            edgeValues={['35', '65']}
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

export default Part2TickMarks3WaterHeaterTempScreen;
