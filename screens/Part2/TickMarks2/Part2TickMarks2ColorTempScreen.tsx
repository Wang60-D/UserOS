import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import { TOKENS } from '../../../tokens';
import TickMarks2PageLayout from './TickMarks2PageLayout';

const COLOR_TEMP_TRACK_GRADIENT_STOPS = [
  { offset: 0, color: '#FFAB09' },
  { offset: 14, color: '#FFBF37' },
  { offset: 29, color: '#FFD466' },
  { offset: 43, color: '#FFE894' },
  { offset: 57, color: '#ECF6FF' },
  { offset: 71, color: '#CAE6FF' },
  { offset: 86, color: '#9CCFFF' },
  { offset: 100, color: '#80C2FF' },
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const Part2TickMarks2ColorTempScreen: React.FC = () => {
  const [value, setValue] = useState(2900);

  return (
    <TickMarks2PageLayout
      imageSource={require('../../../assets/equipment/light.png')}
      activeRoute="Part2TickMarks2ColorTemp"
    >
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="色温"
            subtitleEnabled={true}
            subtitleText={` ${Math.round(value)}K`}
            rightEnabled={false}
          />
        </View>
        <View style={styles.bigValueRow}>
          <Text style={styles.bigValueText}>{Math.round(value)}</Text>
          <Text style={styles.bigValueUnit}>K</Text>
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={value}
            onChange={(next) => setValue(clamp(Math.round(next), 2600, 6000))}
            min={2600}
            max={6000}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={5}
            snapToDots={false}
            showFill={false}
            fillMode="none"
            showEdgeValues={false}
            showTickLabels={false}
            emitChangeWhileDragging={true}
            trackBaseGradientStops={COLOR_TEMP_TRACK_GRADIENT_STOPS}
            thumbOutlineColor="#FFD58F"
            thumbOutlineWidth={2}
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
  bigValueRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bigValueText: {
    fontSize: 36,
    lineHeight: 44,
    color: '#000000',
    fontWeight: '600',
  },
  bigValueUnit: {
    marginLeft: 2,
    marginBottom: 8,
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '600',
  },
  controlPanel: {
    paddingTop: 8,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingBottom: TOKENS.spacing.cardInnerPaddingV,
  },
});

export default Part2TickMarks2ColorTempScreen;
