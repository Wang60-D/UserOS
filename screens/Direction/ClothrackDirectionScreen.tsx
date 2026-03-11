import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { CircleButtonGroup } from '../../components2.0/ButtonGroup';
import type { CircleButtonGroupItem } from '../../components2.0/ButtonGroup';
import { SegmentedSquareSlider } from '../../components/Slider';
import { PageTabSwitch } from '../../components/PageSwitch';
import type { SegmentedSquareSliderItem } from '../../components/Slider';
import { TOKENS } from '../../tokens';

type DirectionControlType = 0 | 1;
type DirectionValue = 'left' | 'all' | 'right';

const VIEW_TABS = ['1', '2'] as const;
const CLOTHRACK_EQUIPMENT_IMAGE = require('../../assets/equipment/Clothesrack.png');

const DIRECTION_OPTIONS: Array<{
  value: DirectionValue;
  label: string;
  subtitle: string;
  icon: any;
}> = [
  {
    value: 'left',
    label: '偏左',
    subtitle: '左出风',
    icon: require('../../assets/icons/clothrack/left.png'),
  },
  {
    value: 'all',
    label: '全局',
    subtitle: '全局出风',
    icon: require('../../assets/icons/clothrack/all.png'),
  },
  {
    value: 'right',
    label: '偏右',
    subtitle: '右出风',
    icon: require('../../assets/icons/clothrack/right.png'),
  },
];

const ClothrackDirectionScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<DirectionControlType>(0);
  const [directionValue, setDirectionValue] = useState<DirectionValue>('left');

  const subtitleText =
    DIRECTION_OPTIONS.find((item) => item.value === directionValue)?.subtitle ?? '';

  const circleItems = useMemo<CircleButtonGroupItem[]>(
    () =>
      DIRECTION_OPTIONS.map((item) => ({
        label: item.label,
        icon: item.icon,
        selected: directionValue === item.value,
      })),
    [directionValue]
  );

  const segmentedItems = useMemo<SegmentedSquareSliderItem[]>(
    () =>
      DIRECTION_OPTIONS.map((item) => ({
        label: item.label,
        iconSelected: item.icon,
        iconUnselected: item.icon,
        iconSelectedTintColor: '#FFFFFF',
        iconUnselectedTintColor: TOKENS.colors.rightText,
        selected: directionValue === item.value,
      })),
    [directionValue]
  );

  const renderCurrentControl = () => {
    if (activeTab === 0) {
      return (
        <CircleButtonGroup
          items={circleItems}
          showLabel={true}
          onItemPress={(index) => {
            const item = DIRECTION_OPTIONS[index];
            if (!item) return;
            setDirectionValue(item.value);
          }}
        />
      );
    }

    return (
      <SegmentedSquareSlider
        items={segmentedItems}
        onItemPress={(index) => {
          const item = DIRECTION_OPTIONS[index];
          if (!item) return;
          setDirectionValue(item.value);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>晾衣架</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={CLOTHRACK_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft
              titleText="出风方向"
              subtitleEnabled={true}
              subtitleText={subtitleText}
              rightEnabled={false}
            />
          </View>

          <View style={activeTab === 0 ? styles.circlePanel : styles.controlPanel}>
            {renderCurrentControl()}
          </View>
        </View>

        <PageTabSwitch
          activeIndex={activeTab}
          onChange={(index) => setActiveTab(index as DirectionControlType)}
          labels={[...VIEW_TABS]}
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

export default ClothrackDirectionScreen;
