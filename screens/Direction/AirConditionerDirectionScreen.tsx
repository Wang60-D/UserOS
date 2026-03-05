import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { CircleButtonGroup } from '../../components/ButtonGroup';
import type { CircleButtonGroupItem } from '../../components/ButtonGroup/CircleButtonGroup';
import { DotSlider } from '../../components/Slider';
import { TOKENS } from '../../tokens';

type AirConditionerControlType = 0 | 1 | 2;

const VIEW_TABS = ['1', '2', '3'] as const;
const AIR_CONDITIONER_EQUIPMENT_IMAGE = require('../../assets/equipment/air-conditioner.png');

const ANGLE_OPTIONS = [
  { label: '上定格', icon: require('../../assets/icons/airconditioner/angletop.png') },
  { label: '偏上定格', icon: require('../../assets/icons/airconditioner/angleup.png') },
  { label: '中上定格', icon: require('../../assets/icons/airconditioner/anglemidup.png') },
  { label: '中定格', icon: require('../../assets/icons/airconditioner/anglemid.png') },
  { label: '中下定格', icon: require('../../assets/icons/airconditioner/anglemiddown.png') },
  { label: '偏下定格', icon: require('../../assets/icons/airconditioner/angledown.png') },
  { label: '下定格', icon: require('../../assets/icons/airconditioner/anglebuttom.png') },
] as const;

const AirConditionerDirectionScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<AirConditionerControlType>(0);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const subtitleText = ANGLE_OPTIONS[selectedIndex]?.label ?? '';

  const circleItems = useMemo<CircleButtonGroupItem[]>(
    () =>
      ANGLE_OPTIONS.map((item, index) => ({
        label: item.label,
        iconSelected: item.icon,
        iconUnselected: item.icon,
        iconSelectedTintColor: '#FFFFFF',
        iconUnselectedTintColor: TOKENS.colors.rightText,
        selected: index === selectedIndex,
      })),
    [selectedIndex]
  );

  const handleSelect = (index: number) => {
    if (index < 0 || index >= ANGLE_OPTIONS.length) return;
    setSelectedIndex(index);
  };

  const renderGridSelector = () => (
    <View style={styles.gridWrap}>
      {ANGLE_OPTIONS.map((item, index) => {
        const isSelected = index === selectedIndex;
        return (
          <Pressable
            key={`air-grid-${item.label}`}
            style={[styles.gridItem, isSelected && styles.gridItemSelected]}
            onPress={() => handleSelect(index)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >
            <Image
              source={item.icon}
              style={[
                styles.gridIcon,
                isSelected ? styles.gridIconSelected : styles.gridIconUnselected,
              ]}
              resizeMode="contain"
            />
            <Text style={[styles.gridLabel, isSelected && styles.gridLabelSelected]} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderCurrentControl = () => {
    if (activeTab === 0) return renderGridSelector();
    if (activeTab === 1) {
      return (
        <DotSlider
          value={selectedIndex}
          onChange={(next) => handleSelect(Math.round(next))}
          min={0}
          max={6}
          showDots={true}
          snapToDots={true}
          dotDistribution="even"
          dotCount={7}
          showFill={false}
          fillMode="none"
          showTickLabels={false}
          showEdgeValues={true}
          edgeValues={['上', '下']}
          thumbOutlineColor={TOKENS.colors.mainColor}
          thumbOutlineWidth={4}
        />
      );
    }
    return (
      <CircleButtonGroup
        items={circleItems}
        itemCount={7}
        columns={4}
        showLabel={true}
        onItemPress={handleSelect}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>空调</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={AIR_CONDITIONER_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft
              titleText="上下扫风定格位置"
              subtitleEnabled={true}
              subtitleText={subtitleText}
              rightEnabled={false}
            />
          </View>

          <View
            style={
              activeTab === 0
                ? styles.gridPanel
                : activeTab === 1
                  ? styles.sliderPanel
                  : styles.circlePanel
            }
          >
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
                onPress={() => setActiveTab(index as AirConditionerControlType)}
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
  gridPanel: {
    paddingTop: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  sliderPanel: {
    paddingTop: 8,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingBottom: TOKENS.spacing.cardInnerPaddingV,
  },
  circlePanel: {
    paddingTop: 8,
    paddingHorizontal: 14,
    paddingBottom: 18,
  },
  gridWrap: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '25%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minHeight: 64,
  },
  gridItemSelected: {
    backgroundColor: TOKENS.colors.mainColor,
  },
  gridIcon: {
    width: 22,
    height: 22,
    marginBottom: 8,
  },
  gridIconSelected: {
    tintColor: '#FFFFFF',
  },
  gridIconUnselected: {
    tintColor: TOKENS.colors.rightText,
  },
  gridLabel: {
    fontSize: 12,
    color: TOKENS.colors.textPrimary,
    fontWeight: '500',
  },
  gridLabelSelected: {
    color: '#FFFFFF',
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

export default AirConditionerDirectionScreen;
