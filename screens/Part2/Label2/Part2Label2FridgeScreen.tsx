import React, { useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import Label2PageLayout from './Label2PageLayout';
import { clamp, labelCardStyles as styles } from '../Label/labelStyles';

const Part2Label2FridgeScreen: React.FC = () => {
  const [coldValue, setColdValue] = useState(3);
  const [freezeValue, setFreezeValue] = useState(-8);

  return (
    <Label2PageLayout imageSource={require('../../../assets/equipment/fridge.png')} activeRoute="Part2Label2Fridge">
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
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={['2', '4', '6', '8']}
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
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={['-24', '-14', '-4', '6', '16']}
            emitChangeWhileDragging={true}
          />
        </View>
      </View>
    </Label2PageLayout>
  );
};

export default Part2Label2FridgeScreen;
