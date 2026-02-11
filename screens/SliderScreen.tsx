import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DiscreteSlider } from '../components/Slider';
import { TOKENS } from '../tokens';

const SliderScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(2);
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
});

export default SliderScreen;
