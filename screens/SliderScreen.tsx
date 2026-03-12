import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CapsuleModeSlider,
  DiscreteSlider,
  DotSlider,
  DualHandleSlider,
  NumberCapsuleSlider,
  NumberValueSlider,
} from '../components/Slider';
import { RemoteControlStepper } from '../components/RemoteControlStepper';
import type { CapsuleModeValue } from '../components/Slider';
import { TOKENS } from '../tokens';

const SliderScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(2);
  const [capsuleMode, setCapsuleMode] = useState<CapsuleModeValue>('modeA');
  const [numberSliderIndex, setNumberSliderIndex] = useState(2);
  const [dotSliderAValue, setDotSliderAValue] = useState(0);
  const [dotSliderBValue, setDotSliderBValue] = useState(16);
  const [dotSliderCValue, setDotSliderCValue] = useState(16);
  const [rangeValue, setRangeValue] = useState<[number, number]>([25, 75]);
  const [symmetricRangeValue, setSymmetricRangeValue] = useState<[number, number]>([35, 65]);
  const [remoteGear, setRemoteGear] = useState(2);
  const [temperatureValue, setTemperatureValue] = useState(23);
  const SLIDER_CONFIG = {
    steps: 6,
    snapEnabled: true,
  };
  const NUMBER_SLIDER_STEPS = 4;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + TOKENS.spacing.pagePaddingV },
      ]}
    >
      <View style={[styles.card, styles.cardSpacing]}>
        <CapsuleModeSlider
          value={capsuleMode}
          onChange={setCapsuleMode}
          offLabel="关闭"
          modeALabel="降噪"
          modeBLabel="通透"
          offIcon={require('../assets/icons/mode.png')}
          modeAIcon={require('../assets/icons/Sound/indoor.png')}
          modeBIcon={require('../assets/icons/Sound/outdoor.png')}
        />
      </View>
      <View style={[styles.card, styles.cardSpacing]}>
        <NumberCapsuleSlider
          steps={NUMBER_SLIDER_STEPS}
          value={numberSliderIndex}
          onChange={setNumberSliderIndex}
        />
      </View>
      <View style={[styles.card, styles.cardSpacing]}>
        <DotSlider
          value={dotSliderAValue}
          onChange={setDotSliderAValue}
          min={0}
          max={100}
          showDots={true}
          snapToDots={true}
          dotDistribution="even"
          dotCount={5}
          showFill={true}
          fillMode="left"
          showTickLabels={false}
          showEdgeValues={false}
          debugEnabled={false}
          debugId="dot-a"
        />
      </View>
      <View style={[styles.card, styles.cardSpacing]}>
        <DotSlider
          value={dotSliderBValue}
          onChange={setDotSliderBValue}
          min={16}
          max={31}
          showDots={true}
          snapToDots={true}
          dotDistribution="custom"
          dotPositions={[0, 0.35, 0.5, 0.76, 1]}
          showFill={true}
          fillMode="left"
          showEdgeValues={true}
          edgeValues={['16', '31']}
          showTickLabels={true}
          tickLabels={['16', '22', '28', '31']}
          debugEnabled={false}
          debugId="dot-b"
        />
      </View>
      <View style={[styles.card, styles.cardSpacing]}>
        <DotSlider
          value={dotSliderCValue}
          onChange={setDotSliderCValue}
          min={16}
          max={31}
          showDots={false}
          snapToDots={false}
          showFill={true}
          fillMode="left"
          showEdgeValues={true}
          edgeValues={['16', '31']}
          showTickLabels={false}
          debugEnabled={false}
          debugId="dot-c"
        />
      </View>
      <View style={[styles.card, styles.cardSpacing]}>
        <RemoteControlStepper
          range={[1, 5]}
          step={1}
          value={remoteGear}
          onChange={setRemoteGear}
          unitLabel="档"
        />
      </View>
      <View style={[styles.card, styles.cardSpacing]}>
        <RemoteControlStepper
          range={[16, 31]}
          step={0.5}
          value={temperatureValue}
          onChange={setTemperatureValue}
          unitLabel="℃"
          showDegreeSymbol={true}
          showCornerIcon={true}
        />
      </View>
      <View style={[styles.card, styles.cardSpacing]}>
        <NumberValueSlider
          min={16}
          max={31}
          step={0.5}
          value={temperatureValue}
          onChange={setTemperatureValue}
          onChangeEnd={setTemperatureValue}
          temperatureIconMode="snow"
        />
      </View>
      <View style={[styles.card, styles.cardSpacing]}>
        <DualHandleSlider
          rangeValue={rangeValue}
          onRangeChange={setRangeValue}
          min={0}
          max={100}
          showDots={true}
          snapToDots={true}
          dotCount={6}
          symmetricMove={false}
        />
      </View>
      <View style={[styles.card, styles.cardSpacing]}>
        <DualHandleSlider
          rangeValue={symmetricRangeValue}
          onRangeChange={setSymmetricRangeValue}
          min={0}
          max={100}
          showDots={true}
          snapToDots={true}
          dotCount={6}
          symmetricMove={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.colors.pageBg,
    paddingHorizontal: TOKENS.spacing.pagePaddingH,
    paddingBottom: TOKENS.spacing.pagePaddingV,
  },
  card: {
    width: '100%',
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingVertical: TOKENS.spacing.cardInnerPaddingV,
  },
  cardSpacing: {
    marginTop: TOKENS.spacing.itemGap,
  },
});

export default SliderScreen;
