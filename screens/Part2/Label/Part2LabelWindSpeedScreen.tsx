import React, { useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import LabelPageLayout from './LabelPageLayout';
import { clamp, labelCardStyles as styles } from './labelStyles';

const Part2LabelWindSpeedScreen: React.FC = () => {
  const [value, setValue] = useState(40);

  return (
    <LabelPageLayout imageSource={require('../../../assets/equipment/fan.png')} activeRoute="Part2LabelWindSpeed">
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="风速"
            subtitleEnabled={true}
            subtitleText={` ${Math.round(value)}挡`}
            rightEnabled={false}
          />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={value}
            onChange={(next) => setValue(clamp(Math.round(next), 1, 100))}
            min={1}
            max={100}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={5}
            snapToDots={false}
            showFill={true}
            fillMode="left"
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={['1', '25', '50', '75', '100']}
            emitChangeWhileDragging={true}
          />
        </View>
      </View>
    </LabelPageLayout>
  );
};

export default Part2LabelWindSpeedScreen;
