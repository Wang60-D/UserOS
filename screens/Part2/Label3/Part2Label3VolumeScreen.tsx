import React, { useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import Label3PageLayout from './Label3PageLayout';
import { clamp, labelCardStyles as styles } from '../Label/labelStyles';

const Part2Label3VolumeScreen: React.FC = () => {
  const [value, setValue] = useState(70);

  return (
    <Label3PageLayout
      imageSource={require('../../../assets/equipment/air-conditioner.png')}
      activeRoute="Part2Label3Volume"
    >
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="音量"
            subtitleEnabled={true}
            subtitleText={` ${Math.round(value)}`}
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
    </Label3PageLayout>
  );
};

export default Part2Label3VolumeScreen;
