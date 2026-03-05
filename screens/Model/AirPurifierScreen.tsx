import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { CircleButtonGroup } from '../../components/ButtonGroup';
import { SegmentedSquareSlider } from '../../components/Slider';
import type { CircleButtonGroupItem } from '../../components/ButtonGroup/CircleButtonGroup';
import type { SegmentedSquareSliderItem } from '../../components/Slider';
import { TOKENS } from '../../tokens';

type PurifierMode = 'auto' | 'sleep' | 'favorite' | 'level';

const VIEW_TABS = ['1', '2'] as const;
const ENABLE_TAB_STATE_SYNC = true;
const INITIAL_MODE_VALUES: PurifierMode[] = ['auto', 'auto'];
const AIR_PURIFIER_EQUIPMENT_IMAGE = require('../../assets/equipment/airpuffier.png');

const CIRCLE_MODE_CONFIG: Array<{
  key: PurifierMode;
  label: string;
  icon: any;
  iconSelectedTintColor: string;
  iconUnselectedTintColor: string;
}> = [
  {
    key: 'auto',
    label: '自动',
    icon: require('../../assets/icons/auto.png'),
    iconSelectedTintColor: '#FFFFFF',
    iconUnselectedTintColor: '#000000CC',
  },
  {
    key: 'sleep',
    label: '睡眠',
    icon: require('../../assets/icons/sleep.png'),
    iconSelectedTintColor: '#FFFFFF',
    iconUnselectedTintColor: '#000000CC',
  },
  {
    key: 'favorite',
    label: '最爱',
    icon: require('../../assets/icons/favorite.png'),
    iconSelectedTintColor: '#FFFFFF',
    iconUnselectedTintColor: '#000000CC',
  },
  {
    key: 'level',
    label: '挡位',
    icon: require('../../assets/icons/mode.png'),
    iconSelectedTintColor: '#FFFFFF',
    iconUnselectedTintColor: '#000000CC',
  },
];

const SEGMENT_MODE_CONFIG: Array<{
  key: PurifierMode;
  label: string;
  iconSelected: any;
  iconUnselected: any;
  iconSelectedTintColor: string;
  iconUnselectedTintColor: string;
}> = [
  {
    key: 'auto',
    label: '自动',
    iconSelected: require('../../assets/icons/mode.png'),
    iconUnselected: require('../../assets/icons/mode.png'),
    iconSelectedTintColor: '#FFFFFF',
    iconUnselectedTintColor: '#000000CC',
  },
  {
    key: 'sleep',
    label: '睡眠',
    iconSelected: require('../../assets/icons/mode.png'),
    iconUnselected: require('../../assets/icons/mode.png'),
    iconSelectedTintColor: '#FFFFFF',
    iconUnselectedTintColor: '#000000CC',
  },
  {
    key: 'favorite',
    label: '最爱',
    iconSelected: require('../../assets/icons/mode.png'),
    iconUnselected: require('../../assets/icons/mode.png'),
    iconSelectedTintColor: '#FFFFFF',
    iconUnselectedTintColor: '#000000CC',
  },
  {
    key: 'level',
    label: '挡位',
    iconSelected: require('../../assets/icons/mode.png'),
    iconUnselected: require('../../assets/icons/mode.png'),
    iconSelectedTintColor: '#FFFFFF',
    iconUnselectedTintColor: '#000000CC',
  },
];

const AirPurifierScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const [modeValues, setModeValues] = useState<PurifierMode[]>([...INITIAL_MODE_VALUES]);
  const [sharedMode, setSharedMode] = useState<PurifierMode>(INITIAL_MODE_VALUES[0]);
  const isCircleView = activeTab === 0;
  const selectedMode = ENABLE_TAB_STATE_SYNC ? sharedMode : modeValues[activeTab];

  const circleItems = useMemo<CircleButtonGroupItem[]>(
    () =>
      CIRCLE_MODE_CONFIG.map((item) => ({
        label: item.label,
        iconSelected: item.icon,
        iconUnselected: item.icon,
        iconSelectedTintColor: item.iconSelectedTintColor,
        iconUnselectedTintColor: item.iconUnselectedTintColor,
        selected: item.key === selectedMode,
      })),
    [selectedMode]
  );

  const segmentedItems = useMemo<SegmentedSquareSliderItem[]>(
    () =>
      SEGMENT_MODE_CONFIG.map((item) => ({
        label: item.label,
        iconSelected: item.iconSelected,
        iconUnselected: item.iconUnselected,
        iconSelectedTintColor: item.iconSelectedTintColor,
        iconUnselectedTintColor: item.iconUnselectedTintColor,
        selected: item.key === selectedMode,
      })),
    [selectedMode]
  );

  const updateModeState = (nextMode: PurifierMode) => {
    if (ENABLE_TAB_STATE_SYNC) {
      setSharedMode(nextMode);
      setModeValues((prev) => prev.map(() => nextMode));
      return;
    }
    setModeValues((prev) => prev.map((item, index) => (index === activeTab ? nextMode : item)));
  };

  const handleModeChange = (index: number) => {
    const source = isCircleView ? CIRCLE_MODE_CONFIG : SEGMENT_MODE_CONFIG;
    const target = source[index];
    if (!target) return;
    updateModeState(target.key);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>空气净化器</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={AIR_PURIFIER_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft titleText="模式" subtitleEnabled={false} rightEnabled={false} />
          </View>

          <View style={isCircleView ? styles.circlePanel : styles.sliderPanel}>
            {isCircleView ? (
              <CircleButtonGroup items={circleItems} itemCount={4} onItemPress={handleModeChange} />
            ) : (
              <SegmentedSquareSlider items={segmentedItems} onItemPress={handleModeChange} />
            )}
          </View>
        </View>

        <View style={styles.pageSwitchContainer}>
          {VIEW_TABS.map((label, index) => {
            const selected = index === activeTab;
            return (
              <Pressable
                key={label}
                style={[styles.pageButton, selected && styles.pageButtonSelected]}
                onPress={() => setActiveTab(index)}
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
  circlePanel: {
    paddingTop: 8,
    paddingHorizontal: 14,
    paddingBottom: 18,
  },
  sliderPanel: {
    paddingTop: 8,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingBottom: 16,
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

export default AirPurifierScreen;
