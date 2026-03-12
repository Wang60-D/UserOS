import React, { useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import { TOKENS } from '../../../tokens';
import LabelPageLayout from './LabelPageLayout';
import { clamp, labelCardStyles as styles } from './labelStyles';

const Part2LabelBrightnessScreen: React.FC = () => {
  const [value, setValue] = useState(120);

  return (
    <LabelPageLayout
      imageSource={require('../../../assets/equipment/air-conditioner.png')}
      activeRoute="Part2LabelBrightness"
    >
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="调光"
            subtitleEnabled={true}
            subtitleText={` ${Math.round(value)}°`}
            rightEnabled={false}
          />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={value}
            onChange={(next) => setValue(clamp(Math.round(next), 0, 180))}
            min={0}
            max={180}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={5}
            snapToDots={true}
            showFill={false}
            fillMode="none"
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={['0', '45', '90', '135', '180']}
            trackBaseGradientColors={[TOKENS.colors.mainColor, TOKENS.colors.mainColor]}
            emitChangeWhileDragging={true}
          />
        </View>
      </View>
    </LabelPageLayout>
  );
};

export default Part2LabelBrightnessScreen;
