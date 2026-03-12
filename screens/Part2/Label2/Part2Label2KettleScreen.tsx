import React, { useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import Label2PageLayout from './Label2PageLayout';
import { clamp, labelCardStyles as styles } from '../Label/labelStyles';

const Part2Label2KettleScreen: React.FC = () => {
  const [value, setValue] = useState(45);

  return (
    <Label2PageLayout imageSource={require('../../../assets/equipment/kettle.png')} activeRoute="Part2Label2Kettle">
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="设定温度"
            subtitleEnabled={true}
            subtitleText={` ${Math.round(value)}℃`}
            rightEnabled={false}
          />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={value}
            onChange={(next) => setValue(clamp(Math.round(next), 40, 90))}
            min={40}
            max={90}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={6}
            snapToDots={false}
            showFill={true}
            fillMode="left"
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={['40', '50', '60', '70', '80', '90']}
            emitChangeWhileDragging={true}
          />
        </View>
      </View>
    </Label2PageLayout>
  );
};

export default Part2Label2KettleScreen;
