import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { CircleButtonGroup } from '../../components/ButtonGroup';
import { SegmentedSquareSlider } from '../../components/Slider';
import { PageTabSwitch } from '../../components/PageSwitch';
import type { CircleButtonGroupItem } from '../../components/ButtonGroup/CircleButtonGroup';
import type { SegmentedSquareSliderItem } from '../../components/Slider';
import { TOKENS } from '../../tokens';

const VIEW_TABS = ['1', '2'] as const;
const AIR_CONDITIONER_EQUIPMENT_IMAGE = require('../../assets/equipment/air-conditioner.png');

type AirMode = 'cool' | 'heat' | 'dehumidify' | 'fan';

const AIR_MODE_ITEMS: Array<{
  key: AirMode;
  label: string;
  iconSelected: any;
  iconUnselected: any;
}> = [
  {
    key: 'cool',
    label: '制冷',
    iconSelected: require('../../assets/icons/cool_white.png'),
    iconUnselected: require('../../assets/icons/cool_black.png'),
  },
  {
    key: 'heat',
    label: '制热',
    iconSelected: require('../../assets/icons/heat_white.png'),
    iconUnselected: require('../../assets/icons/heat_black.png'),
  },
  {
    key: 'dehumidify',
    label: '除湿',
    iconSelected: require('../../assets/icons/dehumidify_white.png'),
    iconUnselected: require('../../assets/icons/dehumidify_black.png'),
  },
  {
    key: 'fan',
    label: '送风',
    iconSelected: require('../../assets/icons/fan_white.png'),
    iconUnselected: require('../../assets/icons/fan_black.png'),
  },
];

const CARD_RADIUS = 20;

const AirConditionerModeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMode, setSelectedMode] = useState<AirMode>('cool');

  const circleItems = useMemo<CircleButtonGroupItem[]>(
    () =>
      AIR_MODE_ITEMS.map((option) => ({
        label: option.label,
        iconSelected: option.iconSelected,
        iconUnselected: option.iconUnselected,
        selected: option.key === selectedMode,
      })),
    [selectedMode]
  );

  const segmentedItems = useMemo<SegmentedSquareSliderItem[]>(
    () =>
      AIR_MODE_ITEMS.map((option) => ({
        label: option.label,
        iconSelected: option.iconSelected,
        iconUnselected: option.iconUnselected,
        selected: option.key === selectedMode,
      })),
    [selectedMode]
  );

  const handleModeChange = (index: number) => {
    const target = AIR_MODE_ITEMS[index];
    if (!target) return;
    setSelectedMode(target.key);
  };

  const isCircleView = activeTab === 0;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.title}>空调</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={AIR_CONDITIONER_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
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

        <PageTabSwitch activeIndex={activeTab} onChange={setActiveTab} labels={[...VIEW_TABS]} />
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
  title: {
    fontSize: TOKENS.fontSize.large,
    fontWeight: '500',
    color: TOKENS.colors.textPrimary,
  },
  contentPlaceholder: {
    flex: 1,
    paddingVertical: 140,
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
    borderRadius: CARD_RADIUS,
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

export default AirConditionerModeScreen;
