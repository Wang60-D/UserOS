import React, { useState } from 'react';
import { View } from 'react-native';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import Label3PageLayout from './Label3PageLayout';
import { clamp, labelCardStyles as styles } from '../Label/labelStyles';

const COLOR_TEMP_STOPS = [2600, 3500, 4500, 6000];

const Part2Label3ColorTempScreen: React.FC = () => {
  const [value, setValue] = useState(2900);

  return (
    <Label3PageLayout
      imageSource={require('../../../assets/equipment/air-conditioner.png')}
      activeRoute="Part2Label3ColorTemp"
    >
      <View style={styles.modeCard}>
        <View style={styles.titleRow} pointerEvents="none">
          <ControlTitleLeft
            titleText="色温"
            subtitleEnabled={true}
            subtitleText={` ${Math.round(value)}K`}
            rightEnabled={false}
          />
        </View>
        <View style={styles.controlPanel}>
          <DotSlider
            value={value}
            onChange={(next) => setValue(clamp(Math.round(next), 2600, 6000))}
            min={2600}
            max={6000}
            step={1}
            showDots={true}
            dotDistribution="custom"
            dotPositions={[0, 0.257, 0.543, 1]}
            snapToDots={false}
            showFill={false}
            fillMode="none"
            showEdgeValues={false}
            showTickLabels={true}
            tickLabels={COLOR_TEMP_STOPS.map((item) => String(item))}
            trackBaseGradientStops={[
              { color: '#F8A300', offset: 0 },
              { color: '#F3D97A', offset: 35 },
              { color: '#DCE6EE', offset: 62 },
              { color: '#7FB3E2', offset: 100 },
            ]}
            thumbOutlineColor="#F5CF6A"
            thumbOutlineWidth={3}
            emitChangeWhileDragging={true}
          />
        </View>
      </View>
    </Label3PageLayout>
  );
};

export default Part2Label3ColorTempScreen;
