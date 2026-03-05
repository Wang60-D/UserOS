import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { CircleButtonGroup } from '../../components/ButtonGroup';
import type { CircleButtonGroupItem } from '../../components/ButtonGroup/CircleButtonGroup';
import { SegmentedSquareSlider } from '../../components/Slider';
import type { SegmentedSquareSliderItem } from '../../components/Slider';
import { TOKENS } from '../../tokens';

type RangehoodControlType = 0 | 1;

const VIEW_TABS = ['1', '2'] as const;

const RANGEHOOD_ITEMS = [
  {
    value: 1,
    shortLabel: '低风速',
    fullLabel: '低风速',
    icon: require('../../assets/icons/Rangehood/1.png'),
  },
  {
    value: 2,
    shortLabel: '中风速',
    fullLabel: '中风速',
    icon: require('../../assets/icons/Rangehood/2.png'),
  },
  {
    value: 3,
    shortLabel: '高风速',
    fullLabel: '高风速',
    icon: require('../../assets/icons/Rangehood/3.png'),
  },
  {
    value: 4,
    shortLabel: '爆炒',
    fullLabel: '爆炒',
    icon: require('../../assets/icons/Rangehood/4.png'),
  },
] as const;
const RANGEHOOD_EQUIPMENT_IMAGE = require('../../assets/equipment/rangehood.png');

const RangehoodGearScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<RangehoodControlType>(0);
  const [gearValue, setGearValue] = useState(2);

  const subtitleText = RANGEHOOD_ITEMS.find((item) => item.value === gearValue)?.fullLabel ?? '';

  const circleItems = useMemo<CircleButtonGroupItem[]>(
    () =>
      RANGEHOOD_ITEMS.map((item) => ({
        label: item.shortLabel,
        iconSelected: item.icon,
        iconUnselected: item.icon,
        iconSelectedTintColor: '#FFFFFF',
        iconUnselectedTintColor: TOKENS.colors.rightText,
        selected: gearValue === item.value,
      })),
    [gearValue]
  );

  const segmentedItems = useMemo<SegmentedSquareSliderItem[]>(
    () =>
      RANGEHOOD_ITEMS.map((item) => ({
        label: item.shortLabel,
        iconSelected: item.icon,
        iconUnselected: item.icon,
        iconSelectedTintColor: '#FFFFFF',
        iconUnselectedTintColor: TOKENS.colors.rightText,
        selected: gearValue === item.value,
      })),
    [gearValue]
  );

  const renderCurrentControl = () => {
    if (activeTab === 0) {
      return (
        <CircleButtonGroup
          items={circleItems}
          itemCount={4}
          showLabel={true}
          onItemPress={(index) => {
            const item = RANGEHOOD_ITEMS[index];
            if (!item) return;
            setGearValue(item.value);
          }}
        />
      );
    }

    return (
      <SegmentedSquareSlider
        items={segmentedItems}
        onItemPress={(index) => {
          const item = RANGEHOOD_ITEMS[index];
          if (!item) return;
          setGearValue(item.value);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>净烟机</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={RANGEHOOD_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft
              titleText="挡位选择"
              subtitleEnabled={true}
              subtitleText={subtitleText}
              rightEnabled={false}
            />
          </View>

          <View style={activeTab === 0 ? styles.circlePanel : styles.controlPanel}>
            {renderCurrentControl()}
          </View>
        </View>

        <View style={styles.pageSwitchContainer}>
          {VIEW_TABS.map((label, index) => {
            const selected = index === activeTab;
            return (
              <Pressable
                key={label}
                style={[styles.pageButton, selected && styles.pageButtonSelected]}
                onPress={() => setActiveTab(index as RangehoodControlType)}
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
  controlPanel: {
    paddingTop: 8,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingBottom: TOKENS.spacing.cardInnerPaddingV,
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

export default RangehoodGearScreen;
