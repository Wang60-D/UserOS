import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BasicSlider } from '../../components2.0/Slider';
import { TOKENS } from '../../tokens';

const MAX_VALUE = 120;

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const Components2SliderScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [controlledValue, setControlledValue] = useState(36);
  const [controlledEndValue, setControlledEndValue] = useState(36);
  const [uncontrolledEndValue, setUncontrolledEndValue] = useState(24);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + TOKENS.spacing.pagePaddingV },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Slider 2.0</Text>
        <Text style={styles.pageSubtitle}>基础滑条组件（Figma 976:45972）</Text>

        <View style={styles.card}>
          <Text style={styles.blockTitle}>受控模式</Text>
          <View style={styles.valueRow}>
            <Text style={styles.valueText}>实时值: {Math.round(controlledValue)}</Text>
            <Text style={styles.valueText}>松手值: {Math.round(controlledEndValue)}</Text>
          </View>
          <BasicSlider
            min={0}
            max={MAX_VALUE}
            value={controlledValue}
            onChange={(next) => setControlledValue(clamp(next, 0, MAX_VALUE))}
            onChangeEnd={(next) => setControlledEndValue(clamp(next, 0, MAX_VALUE))}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.blockTitle}>非受控模式</Text>
          <View style={styles.valueRow}>
            <Text style={styles.valueText}>松手值: {Math.round(uncontrolledEndValue)}</Text>
          </View>
          <BasicSlider
            min={0}
            max={MAX_VALUE}
            defaultValue={24}
            onChangeEnd={(next) => setUncontrolledEndValue(clamp(next, 0, MAX_VALUE))}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.colors.pageBg,
    paddingHorizontal: TOKENS.spacing.pagePaddingH,
  },
  scrollContent: {
    paddingBottom: TOKENS.spacing.pagePaddingV,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: TOKENS.colors.textPrimary,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: TOKENS.colors.subtitleText,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingVertical: TOKENS.spacing.cardInnerPaddingV,
    marginBottom: TOKENS.spacing.itemGap,
  },
  blockTitle: {
    fontSize: TOKENS.fontSize.medium,
    fontWeight: '500',
    color: TOKENS.colors.textPrimary,
    marginBottom: TOKENS.spacing.titleGap,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  valueText: {
    fontSize: TOKENS.fontSize.small,
    color: TOKENS.colors.subtitleText,
  },
});

export default Components2SliderScreen;
