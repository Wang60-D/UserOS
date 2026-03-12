import React, { useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import LabelPageLayout from './LabelPageLayout';
import { clamp, labelCardStyles as styles } from './labelStyles';

const Part2LabelCurtainScreen: React.FC = () => {
  const [value, setValue] = useState(40);

  return (
    <LabelPageLayout imageSource={require('../../../assets/equipment/curtain.png')} activeRoute="Part2LabelCurtain">
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="窗帘位置"
            subtitleEnabled={true}
            subtitleText={` ${Math.round(value)}%`}
            rightEnabled={false}
          />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={value}
            onChange={(next) => setValue(clamp(Math.round(next), 0, 100))}
            min={0}
            max={100}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={3}
            snapToDots={false}
            showFill={true}
            fillMode="left"
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={['0', '50', '100']}
            emitChangeWhileDragging={true}
          />
        </View>
      </View>
    </LabelPageLayout>
  );
};

export default Part2LabelCurtainScreen;
