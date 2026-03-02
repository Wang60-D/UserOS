import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CapsuleModeSlider, DiscreteSlider, DotSlider, NumberCapsuleSlider } from '../components/Slider';
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
      <View style={styles.card}>
        <DiscreteSlider
          steps={SLIDER_CONFIG.steps}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
          snapEnabled={SLIDER_CONFIG.snapEnabled}
        />
      </View>
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
          debugEnabled={true}
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
          debugEnabled={true}
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
          debugEnabled={true}
          debugId="dot-c"
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
