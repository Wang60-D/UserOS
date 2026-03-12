import React, { useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import LabelPageLayout from './LabelPageLayout';
import { clamp, labelCardStyles as styles } from './labelStyles';

const Part2LabelLevel4Screen: React.FC = () => {
  const [value, setValue] = useState(2);

  return (
    <LabelPageLayout imageSource={require('../../../assets/equipment/fan.png')} activeRoute="Part2LabelLevel4">
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
            onChange={(next) => setValue(clamp(Math.round(next), 1, 4))}
            min={1}
            max={4}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={4}
            snapToDots={true}
            showFill={true}
            fillMode="left"
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={['1', '2', '3', '4']}
          />
        </View>
      </View>
    </LabelPageLayout>
  );
};

export default Part2LabelLevel4Screen;
