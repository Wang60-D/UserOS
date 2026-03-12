import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import Label3PageLayout from './Label3PageLayout';
import { clamp, labelCardStyles as styles } from '../Label/labelStyles';

const formatDelayHours = (value: number) => {
  const totalMinutes = Math.round(value * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h <= 0) return ` ${m}分钟`;
  if (m <= 0) return ` ${h}小时`;
  return ` ${h}小时${m}分钟`;
};

const Part2Label3DelayShortScreen: React.FC = () => {
  const [value, setValue] = useState(4 / 3);
  const subtitle = useMemo(() => formatDelayHours(value), [value]);

  return (
    <Label3PageLayout
      imageSource={require('../../../assets/equipment/air-conditioner.png')}
      activeRoute="Part2Label3DelayShort"
    >
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft titleText="延时开启" subtitleEnabled={true} subtitleText={subtitle} rightEnabled={false} />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={value}
            onChange={(next) => setValue(clamp(Math.round(next * 10) / 10, 0, 2))}
            min={0}
            max={2}
            step={0.1}
            showDots={true}
            dotDistribution="even"
            dotCount={5}
            snapToDots={false}
            showFill={true}
            fillMode="left"
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={['0', '0.5', '1', '1.5', '2']}
            emitChangeWhileDragging={true}
          />
        </View>
      </View>
    </Label3PageLayout>
  );
};

export default Part2Label3DelayShortScreen;
