import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../../components/Slider';
import { PageSwitchButtonGroup } from '../../../components/PageSwitch';
import { TOKENS } from '../../../tokens';

type TickMarks1Tab = 0 | 1; // 0 温度, 1 色温

const VIEW_TABS = ['温度', '色温'] as const;

const MIN_TEMP = 16;
const MAX_TEMP = 31;
const TEMP_STEP = 0.5;

const MIN_K = 2600;
const MAX_K = 6000;
const DEFAULT_K = 2900;

const TEMP_EQUIPMENT_IMAGE = require('../../../assets/equipment/air-conditioner.png');
const COLOR_TEMP_EQUIPMENT_IMAGE = require('../../../assets/equipment/light.png');
const COLOR_TEMP_TRACK_GRADIENT_STOPS = [
  { offset: 0, color: '#FFAB09' },
  { offset: 14, color: '#FFBF37' },
  { offset: 29, color: '#FFD466' },
  { offset: 43, color: '#FFE894' },
  { offset: 57, color: '#ECF6FF' },
  { offset: 71, color: '#CAE6FF' },
  { offset: 86, color: '#9CCFFF' },
  { offset: 100, color: '#80C2FF' },
];

const clamp = (value: number, minVal: number, maxVal: number) =>
  Math.max(minVal, Math.min(maxVal, value));
const roundHalf = (value: number) => Math.round(value * 2) / 2;

/** 温度滑条：2 个非等分刻度点 */
const TEMP_DOT_POSITIONS = [(20 - MIN_TEMP) / (MAX_TEMP - MIN_TEMP), (27 - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)];
const COLOR_TEMP_DOT_POSITIONS = [0, 0.2, 0.56, 0.82, 1];

const Part2TickMarks1Screen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TickMarks1Tab>(0);
  const [temperatureValue, setTemperatureValue] = useState(23.5);
  const [colorTempValue, setColorTempValue] = useState(DEFAULT_K);

  const tempSubtitle = useMemo(
    () => ` ${clamp(roundHalf(temperatureValue), MIN_TEMP, MAX_TEMP).toFixed(1)}℃`,
    [temperatureValue]
  );
  const colorTempSubtitle = useMemo(
    () => ` ${Math.round(clamp(colorTempValue, MIN_K, MAX_K))}K`,
    [colorTempValue]
  );

  const equipmentImage =
    activeTab === 0 ? TEMP_EQUIPMENT_IMAGE : COLOR_TEMP_EQUIPMENT_IMAGE;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>Tick marks1 推荐值</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={equipmentImage} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        {activeTab === 0 ? (
          <View style={styles.modeCard}>
            <View style={styles.titleRow}>
              <ControlTitleLeft
                titleText="温度调节"
                subtitleEnabled={true}
                subtitleText={tempSubtitle}
                rightEnabled={false}
              />
            </View>
            <View style={styles.controlPanel}>
              <DotSlider
                value={temperatureValue}
                onChange={(next) =>
                  setTemperatureValue(clamp(roundHalf(next), MIN_TEMP, MAX_TEMP))
                }
                min={MIN_TEMP}
                max={MAX_TEMP}
                step={TEMP_STEP}
                showDots={true}
                dotDistribution="custom"
                dotPositions={TEMP_DOT_POSITIONS}
                snapToDots={false}
                showFill={true}
                fillMode="left"
                showEdgeValues={true}
                edgeValues={['16', '31']}
                showTickLabels={false}
                emitChangeWhileDragging={true}
              />
            </View>
          </View>
        ) : (
          <View style={styles.modeCard}>
            <View style={styles.titleRow} pointerEvents="none">
              <ControlTitleLeft
                titleText="色温调节"
                subtitleEnabled={true}
                subtitleText={colorTempSubtitle}
                rightEnabled={false}
              />
            </View>
            <View style={styles.selectedValueRow}>
              <Text style={styles.selectedValueText}>{Math.round(clamp(colorTempValue, MIN_K, MAX_K))}</Text>
              <Text style={styles.selectedValueUnit}>K</Text>
            </View>
            <View style={styles.controlPanel}>
              <DotSlider
                value={colorTempValue}
                onChange={(next) => setColorTempValue(clamp(Math.round(next), MIN_K, MAX_K))}
                min={MIN_K}
                max={MAX_K}
                showDots={true}
                dotDistribution="custom"
                dotPositions={COLOR_TEMP_DOT_POSITIONS}
                snapToDots={false}
                showFill={false}
                fillMode="none"
                showEdgeValues={false}
                showTickLabels={false}
                emitChangeWhileDragging={true}
                trackBaseGradientStops={COLOR_TEMP_TRACK_GRADIENT_STOPS}
              />
            </View>
          </View>
        )}

        <PageSwitchButtonGroup
          labels={[...VIEW_TABS]}
          activeIndex={activeTab}
          onChange={(index) => setActiveTab(index as TickMarks1Tab)}
          gap={8}
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
    paddingVertical: TOKENS.spacing.equipmentPaddingVertical,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equipmentImage: {
    width: '100%',
    height: '100%',
  },
  bottomSection: {
    marginBottom: 0,
  },
  modeCard: {
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 48,
  },
  titleRow: {
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingTop: TOKENS.spacing.cardInnerPaddingV,
    paddingBottom: 6,
  },
  controlPanel: {
    paddingTop: 8,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingBottom: TOKENS.spacing.cardInnerPaddingV,
  },
  selectedValueRow: {
    marginTop: 6,
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
});

export default Part2TickMarks1Screen;
