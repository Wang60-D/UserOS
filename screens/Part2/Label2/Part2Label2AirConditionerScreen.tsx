import React, { useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import Label2PageLayout from './Label2PageLayout';
import { clamp, labelCardStyles as styles } from '../Label/labelStyles';

const Part2Label2AirConditionerScreen: React.FC = () => {
  const [value, setValue] = useState(23.5);

  return (
    <Label2PageLayout
      imageSource={require('../../../assets/equipment/air-conditioner.png')}
      activeRoute="Part2Label2AirConditioner"
    >
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="温度调节"
            subtitleEnabled={true}
            subtitleText={` ${value.toFixed(1)}℃`}
            rightEnabled={false}
          />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={value}
            onChange={(next) => setValue(clamp(Math.round(next * 10) / 10, 16, 31))}
            min={16}
            max={31}
            step={0.1}
            showDots={true}
            dotDistribution="custom"
            dotPositions={[0, 0.4, 0.8, 1]}
            snapToDots={false}
            showFill={true}
            fillMode="left"
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={['16', '22', '28', '31']}
            emitChangeWhileDragging={true}
          />
        </View>
      </View>
    </Label2PageLayout>
  );
};

export default Part2Label2AirConditionerScreen;
