import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CapsuleModeSlider, DiscreteSlider } from '../components/Slider';
import type { CapsuleModeValue } from '../components/Slider';
import { TOKENS } from '../tokens';

const SliderScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(2);
  const [capsuleMode, setCapsuleMode] = useState<CapsuleModeValue>('modeA');
  const SLIDER_CONFIG = {
    steps: 6,
    snapEnabled: true,
  };

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
