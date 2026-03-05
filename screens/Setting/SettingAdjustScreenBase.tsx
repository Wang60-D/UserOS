import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DotSlider, VerticalNumberSlider, type DotSliderProps } from '../../components/Slider';
import { PageTabSwitch } from '../../components/PageSwitch';
import { TOKENS } from '../../tokens';

type SettingTab = 0 | 1;

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
  trackBaseGradientColors?: string[];
  trackBaseGradientStops?: Array<{ color: string; offset: number }>;
  sliderShowFill?: boolean;
  sliderFillMode?: DotSliderProps['fillMode'];
}

const PAGE_TABS = ['1', '2'] as const;

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const formatInt = (value: number) => `${Math.round(value)}`;

const quantize = (value: number, minValue: number, step: number) => {
  const safeStep = Math.max(1, step);
  const index = Math.round((value - minValue) / safeStep);
  return minValue + index * safeStep;
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
              <VerticalNumberSlider
                value={safeValue}
                min={config.min}
                max={config.max}
                step={safeStep}
                unitLabel={config.unit}
                onChange={setValue}
              />
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
                showFill={config.sliderShowFill ?? true}
                fillMode={config.sliderFillMode ?? 'left'}
                showEdgeValues={false}
                showTickLabels={true}
                tickLabels={[config.sliderLeftLabel, config.sliderRightLabel]}
                emitChangeWhileDragging={true}
                trackBaseGradientColors={config.trackBaseGradientColors}
                trackBaseGradientStops={config.trackBaseGradientStops}
              />
            </View>
          </View>
        )}

        <PageTabSwitch
          activeIndex={activeTab}
          onChange={(index) => setActiveTab(index as SettingTab)}
          labels={[...PAGE_TABS]}
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
    paddingTop: TOKENS.spacing.cardInnerPaddingV,
    paddingBottom: TOKENS.spacing.cardInnerPaddingV,
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
  sliderCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 48,
    paddingTop: 20,
    paddingBottom: TOKENS.spacing.cardInnerPaddingV,
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
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
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
