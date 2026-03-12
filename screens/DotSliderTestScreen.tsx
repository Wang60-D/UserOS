import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DotSlider } from '../components/Slider';
import { TOKENS } from '../tokens';

const MAX_VALUE = 120;

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const DotSliderTestScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [valueA, setValueA] = useState(20);
  const [valueB, setValueB] = useState(20);
  const [valueAEnd, setValueAEnd] = useState(20);
  const [valueBEnd, setValueBEnd] = useState(20);

  const aDisplay = useMemo(() => Math.round(valueA), [valueA]);
  const bDisplay = useMemo(() => Math.round(valueB), [valueB]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>滑条手势测试</Text>
        <Text style={styles.subtitle}>用于复现与验证: 快速拖到右侧后是否回弹到左侧</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.blockTitle}>标准测试区</Text>
        <View style={styles.valueRow}>
          <Text style={styles.valueText}>实时值: {aDisplay}</Text>
          <Text style={styles.valueText}>松手值: {Math.round(valueAEnd)}</Text>
        </View>
        <DotSlider
          value={valueA}
          onChange={(next) => setValueA(clamp(next, 0, MAX_VALUE))}
          onChangeEnd={(next) => setValueAEnd(clamp(next, 0, MAX_VALUE))}
          min={0}
          max={MAX_VALUE}
          showDots={false}
          snapToDots={false}
          showFill={true}
          fillMode="left"
          showEdgeValues={true}
          edgeValues={['0', String(MAX_VALUE)]}
          showTickLabels={false}
          emitChangeWhileDragging={true}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.blockTitle}>边缘压力测试区</Text>
        <View style={styles.valueRow}>
          <Text style={styles.valueText}>实时值: {bDisplay}</Text>
          <Text style={styles.valueText}>松手值: {Math.round(valueBEnd)}</Text>
        </View>
        <View style={styles.edgeStressWrap}>
          <DotSlider
            value={valueB}
            onChange={(next) => setValueB(clamp(next, 0, MAX_VALUE))}
            onChangeEnd={(next) => setValueBEnd(clamp(next, 0, MAX_VALUE))}
            min={0}
            max={MAX_VALUE}
            showDots={false}
            snapToDots={false}
            showFill={true}
            fillMode="left"
            showEdgeValues={true}
            edgeValues={['0', String(MAX_VALUE)]}
            showTickLabels={false}
            emitChangeWhileDragging={true}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.colors.pageBg,
    paddingHorizontal: TOKENS.spacing.pagePaddingH,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: TOKENS.colors.textPrimary,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: 'rgba(0,0,0,0.45)',
  },
  card: {
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  blockTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: TOKENS.colors.textPrimary,
    marginBottom: 10,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  valueText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.55)',
  },
  edgeStressWrap: {
    marginHorizontal: -6,
  },
});

export default DotSliderTestScreen;
