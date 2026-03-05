import React, { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DotSlider } from '../../components/Slider';
import { TOKENS } from '../../tokens';

type SettingTab = 0 | 1;

interface SingleValueWheelProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
}

export interface SettingAdjustConfig {
  pageTitle: string;
  adjustTitle: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
  sliderLeftLabel: string;
  sliderRightLabel: string;
}

const STEP_HEIGHT = 52;
const VISIBLE_COUNT = 5;
const SIDE_COUNT = Math.floor(VISIBLE_COUNT / 2);
const PAGE_TABS = ['1', '2'] as const;

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const formatInt = (value: number) => `${Math.round(value)}`;

const quantize = (value: number, minValue: number, step: number) => {
  const safeStep = Math.max(1, step);
  const index = Math.round((value - minValue) / safeStep);
  return minValue + index * safeStep;
};

const SingleValueWheel: React.FC<SingleValueWheelProps> = ({
  value,
  min,
  max,
  step,
  onChange,
}) => {
  const values = useMemo(() => {
    const list: number[] = [];
    const safeStep = Math.max(1, step);
    for (let current = min; current <= max + 1e-6; current += safeStep) {
      list.push(Math.round(current));
    }
    return list;
  }, [max, min, step]);

  const nearestIndex = useMemo(() => {
    let result = 0;
    let minDistance = Number.POSITIVE_INFINITY;
    values.forEach((item, index) => {
      const distance = Math.abs(item - value);
      if (distance < minDistance) {
        minDistance = distance;
        result = index;
      }
    });
    return result;
  }, [value, values]);

  const [activeFloatIndex, setActiveFloatIndex] = useState(nearestIndex);
  const listRef = useRef<FlatList<number>>(null);

  const clampIndex = (index: number) => clamp(index, 0, values.length - 1);
  const commitByIndex = (index: number) => {
    const safeIndex = clampIndex(index);
    const nextValue = values[safeIndex];
    if (typeof nextValue === 'number') onChange(nextValue);
  };

  React.useEffect(() => {
    setActiveFloatIndex(nearestIndex);
    listRef.current?.scrollToOffset({
      offset: nearestIndex * STEP_HEIGHT,
      animated: true,
    });
  }, [nearestIndex]);

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / STEP_HEIGHT);
    commitByIndex(index);
    setActiveFloatIndex(index);
  };

  return (
    <View style={styles.wheelWrap}>
      <FlatList
        ref={listRef}
        data={values}
        keyExtractor={(item) => `setting-wheel-${item}`}
        showsVerticalScrollIndicator={false}
        bounces={false}
        decelerationRate="fast"
        snapToInterval={STEP_HEIGHT}
        snapToAlignment="start"
        contentContainerStyle={{ paddingVertical: STEP_HEIGHT * SIDE_COUNT }}
        getItemLayout={(_, index) => ({
          length: STEP_HEIGHT,
          offset: STEP_HEIGHT * index,
          index,
        })}
        onScroll={(event) => {
          const y = event.nativeEvent.contentOffset.y;
          setActiveFloatIndex(y / STEP_HEIGHT);
        }}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item, index }) => {
          const distance = Math.abs(activeFloatIndex - index);
          const isCenter = distance < 0.5;
          return (
            <Pressable
              style={styles.wheelItem}
              onPress={() => {
                listRef.current?.scrollToOffset({
                  offset: index * STEP_HEIGHT,
                  animated: true,
                });
                commitByIndex(index);
              }}
            >
              <Text
                style={[
                  isCenter ? styles.wheelCenterText : styles.wheelSideText,
                  distance >= 1.5 && styles.wheelFarText,
                ]}
              >
                {formatInt(item)}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const SettingAdjustScreenBase: React.FC<{ config: SettingAdjustConfig }> = ({ config }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<SettingTab>(0);
  const [value, setValue] = useState<number>(config.defaultValue);

  const safeStep = Math.max(1, Math.floor(Math.abs(config.step ?? 1)));
  const safeValue = useMemo(
    () => clamp(quantize(value, config.min, safeStep), config.min, config.max),
    [config.max, config.min, safeStep, value]
  );
  const centerText = formatInt(safeValue);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>{config.pageTitle}</Text>
      </View>

      <View style={styles.contentPlaceholder} />

      <View style={styles.bottomSection}>
        {activeTab === 0 ? (
          <View style={styles.pickerCard}>
            <Text style={styles.adjustTitle}>{config.adjustTitle}</Text>
            <View style={styles.pickerContent}>
              <SingleValueWheel
                value={safeValue}
                min={config.min}
                max={config.max}
                step={safeStep}
                onChange={setValue}
              />
              <Text style={styles.centerUnit}>{config.unit}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.sliderCard}>
            <Text style={styles.adjustTitle}>{config.adjustTitle}</Text>
            <View style={styles.selectedValueRow}>
              <Text style={styles.selectedValueText}>{centerText}</Text>
              <Text style={styles.selectedValueUnit}>{config.unit}</Text>
            </View>
            <View style={styles.sliderPanel}>
              <DotSlider
                value={safeValue}
                onChange={(next) => {
                  setValue(clamp(quantize(next, config.min, safeStep), config.min, config.max));
                }}
                min={config.min}
                max={config.max}
                showDots={true}
                dotCount={2}
                snapToDots={false}
                showFill={true}
                fillMode="left"
                showEdgeValues={false}
                showTickLabels={true}
                tickLabels={[config.sliderLeftLabel, config.sliderRightLabel]}
                emitChangeWhileDragging={true}
              />
            </View>
          </View>
        )}

        <View style={styles.pageSwitchContainer}>
          {PAGE_TABS.map((label, index) => {
            const selected = index === activeTab;
            return (
              <Pressable
                key={label}
                style={[styles.pageButton, selected && styles.pageButtonSelected]}
                onPress={() => setActiveTab(index as SettingTab)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Text style={[styles.pageButtonText, selected && styles.pageButtonTextSelected]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
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
    paddingBottom: 80,
  },
  header: {
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: TOKENS.fontSize.large,
    fontWeight: '500',
    color: TOKENS.colors.textPrimary,
  },
  contentPlaceholder: {
    flex: 1,
  },
  bottomSection: {
    marginBottom: 0,
  },
  pickerCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22.654,
    paddingTop: 14,
    paddingBottom: 14,
    alignItems: 'center',
    marginBottom: 48,
  },
  adjustTitle: {
    fontSize: 20,
    lineHeight: 27,
    color: '#000000',
    fontWeight: '500',
    textAlign: 'center',
  },
  pickerContent: {
    width: 220.7,
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelWrap: {
    width: '100%',
    height: STEP_HEIGHT * VISIBLE_COUNT,
    overflow: 'hidden',
  },
  wheelItem: {
    width: '100%',
    height: STEP_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelCenterText: {
    fontSize: 32,
    color: '#000000',
    fontWeight: '600',
  },
  wheelSideText: {
    fontSize: 27,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '500',
  },
  wheelFarText: {
    fontSize: 22,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '400',
  },
  centerUnit: {
    position: 'absolute',
    right: 49,
    top: STEP_HEIGHT * 2 + 11,
    fontSize: 11,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '600',
  },
  sliderCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 48,
    paddingTop: 20,
    paddingBottom: 14,
  },
  selectedValueRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  selectedValueText: {
    fontSize: 36,
    lineHeight: 44,
    color: '#000000',
    fontWeight: '600',
  },
  selectedValueUnit: {
    marginLeft: 2,
    marginBottom: 8,
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '600',
  },
  sliderPanel: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  pageSwitchContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    columnGap: 18,
  },
  pageButton: {
    width: 54,
    height: 54,
    borderRadius: TOKENS.radius.circle,
    backgroundColor: TOKENS.colors.circleUnselectedBg,
    borderWidth: 1,
    borderColor: TOKENS.colors.pageBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageButtonSelected: {
    backgroundColor: TOKENS.colors.pageBg,
    borderColor: TOKENS.colors.mainColor,
    borderWidth: 2,
  },
  pageButtonText: {
    fontSize: 17,
    color: '#666666',
    fontWeight: '400',
  },
  pageButtonTextSelected: {
    color: '#0A6EFF',
  },
});

export default SettingAdjustScreenBase;
