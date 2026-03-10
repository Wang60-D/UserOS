import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import { TOKENS } from '../../../tokens';
import TickMarks3PageLayout from './TickMarks3PageLayout';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const Part2TickMarks3FridgeTempScreen: React.FC = () => {
  const [coldValue, setColdValue] = useState(3);
  const [freezeValue, setFreezeValue] = useState(-8);

  return (
    <TickMarks3PageLayout
      imageSource={require('../../../assets/equipment/fridge.png')}
      activeRoute="Part2TickMarks3FridgeTemp"
    >
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="冷藏室"
            subtitleEnabled={true}
            subtitleText={` ${Math.round(coldValue)}℃`}
            rightEnabled={false}
          />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={coldValue}
            onChange={(next) => setColdValue(clamp(Math.round(next), 2, 8))}
            min={2}
            max={8}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={4}
            snapToDots={false}
            showFill={true}
            fillMode="left"
            showEdgeValues={true}
            edgeValues={['2', '8']}
            showTickLabels={false}
            emitChangeWhileDragging={true}
          />
        </View>
      </View>

      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="冷冻室"
            subtitleEnabled={true}
            subtitleText={` ${Math.round(freezeValue)}℃`}
            rightEnabled={false}
          />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={freezeValue}
            onChange={(next) => setFreezeValue(clamp(Math.round(next), -24, 16))}
            min={-24}
            max={16}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={5}
            snapToDots={false}
            showFill={true}
            fillMode="left"
            showEdgeValues={true}
            edgeValues={['-24', '16']}
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

export default Part2TickMarks3FridgeTempScreen;
