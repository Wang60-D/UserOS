import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import { TOKENS } from '../../../tokens';
import LabelPageLayout from './LabelPageLayout';
import { clamp, labelCardStyles as styles } from './labelStyles';

const POSITION_LABELS = ['上', '偏上', '中上', '中', '中下', '偏下', '下'];

const Part2LabelSweepFixedScreen: React.FC = () => {
  const [value, setValue] = useState(1);

  const subtitle = useMemo(() => `${POSITION_LABELS[value]}定格`, [value]);

  return (
    <LabelPageLayout
      imageSource={require('../../../assets/equipment/air-conditioner.png')}
      activeRoute="Part2LabelSweepFixed"
    >
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="上下扫风定格位置"
            subtitleEnabled={true}
            subtitleText={` ${subtitle}`}
            rightEnabled={false}
          />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={value}
            onChange={(next) => setValue(clamp(Math.round(next), 0, 6))}
            min={0}
            max={6}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={7}
            snapToDots={true}
            showFill={false}
            fillMode="none"
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={POSITION_LABELS}
            thumbOutlineColor={TOKENS.colors.mainColor}
            thumbOutlineWidth={6}
          />
        </View>
      </View>
    </LabelPageLayout>
  );
};

export default Part2LabelSweepFixedScreen;
