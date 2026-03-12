import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import LabelPageLayout from './LabelPageLayout';
import { clamp, labelCardStyles as styles } from './labelStyles';

const ANGLE_POINTS = [120, 90, 60, 30, 30, 60, 90, 120];

const Part2LabelSweepAngleScreen: React.FC = () => {
  const [range, setRange] = useState<[number, number]>([3, 4]);

  const subtitleValue = useMemo(() => {
    const left = ANGLE_POINTS[range[0]] ?? ANGLE_POINTS[0];
    const right = ANGLE_POINTS[range[1]] ?? ANGLE_POINTS[ANGLE_POINTS.length - 1];
    return Math.min(left, right);
  }, [range]);

  return (
    <LabelPageLayout
      imageSource={require('../../../assets/equipment/air-conditioner.png')}
      activeRoute="Part2LabelSweepAngle"
    >
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="左右扫风角度"
            subtitleEnabled={true}
            subtitleText={` ${subtitleValue}度`}
            rightEnabled={false}
          />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            isRange={true}
            symmetricRangeMove={true}
            rangeValue={range}
            onRangeChange={(next) =>
              setRange([
                clamp(Math.round(next[0]), 0, ANGLE_POINTS.length - 1),
                clamp(Math.round(next[1]), 0, ANGLE_POINTS.length - 1),
              ])
            }
            min={0}
            max={ANGLE_POINTS.length - 1}
            step={1}
            showDots={true}
            dotDistribution="even"
            dotCount={ANGLE_POINTS.length}
            snapToDots={true}
            showFill={true}
            fillMode="between"
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={ANGLE_POINTS.map((item) => String(item))}
          />
        </View>
      </View>
    </LabelPageLayout>
  );
};

export default Part2LabelSweepAngleScreen;
