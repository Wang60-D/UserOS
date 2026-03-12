import React, { useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import LabelPageLayout from './LabelPageLayout';
import { clamp, labelCardStyles as styles } from './labelStyles';

const Part2LabelLevel6Screen: React.FC = () => {
  const [value, setValue] = useState(2);

  return (
    <LabelPageLayout imageSource={require('../../../assets/equipment/fan.png')} activeRoute="Part2LabelLevel6">
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="挡位选择"
            subtitleEnabled={true}
            subtitleText={` ${Math.round(value)}挡`}
            rightEnabled={false}
          />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={value}
            onChange={(next) => setValue(clamp(Math.round(next), 1, 6))}
            min={1}
            max={6}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={6}
            snapToDots={true}
            showFill={true}
            fillMode="left"
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={['1', '2', '3', '4', '5', '6']}
          />
        </View>
      </View>
    </LabelPageLayout>
  );
};

export default Part2LabelLevel6Screen;
