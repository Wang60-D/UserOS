import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import Label2PageLayout from './Label2PageLayout';
import { clamp, labelCardStyles as styles } from '../Label/labelStyles';

const AREA_LABELS = ['10', '45', '120'];

const formatAreaSubtitle = (value: number) => {
  if (value < 45) return ' 适用面积 22-34㎡';
  if (value < 120) return ' 适用面积 35-54㎡';
  return ' 适用面积 55-80㎡';
};

const Part2Label2AreaScreen: React.FC = () => {
  const [value, setValue] = useState(34);
  const subtitle = useMemo(() => formatAreaSubtitle(value), [value]);

  return (
    <Label2PageLayout imageSource={require('../../../assets/equipment/fan.png')} activeRoute="Part2Label2Area">
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft titleText="风速" subtitleEnabled={true} subtitleText={subtitle} rightEnabled={false} />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={value}
            onChange={(next) => setValue(clamp(Math.round(next), 10, 120))}
            min={10}
            max={120}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={3}
            snapToDots={false}
            showFill={true}
            fillMode="left"
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={AREA_LABELS}
            emitChangeWhileDragging={true}
          />
        </View>
      </View>
    </Label2PageLayout>
  );
};

export default Part2Label2AreaScreen;
