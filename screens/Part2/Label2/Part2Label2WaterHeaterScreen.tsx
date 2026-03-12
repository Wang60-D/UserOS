import React, { useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import Label2PageLayout from './Label2PageLayout';
import { clamp, labelCardStyles as styles } from '../Label/labelStyles';

const Part2Label2WaterHeaterScreen: React.FC = () => {
  const [value, setValue] = useState(47);

  return (
    <Label2PageLayout
      imageSource={require('../../../assets/equipment/waterhearter.png')}
      activeRoute="Part2Label2WaterHeater"
    >
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="温度调节"
            subtitleEnabled={true}
            subtitleText={` ${Math.round(value)}℃`}
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
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={['35', '45', '55', '65']}
            emitChangeWhileDragging={true}
          />
        </View>
      </View>
    </Label2PageLayout>
  );
};

export default Part2Label2WaterHeaterScreen;
