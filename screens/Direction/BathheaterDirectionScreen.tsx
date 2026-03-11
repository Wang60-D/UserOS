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

type BathheaterControlType = 0 | 1;
type AngleValue = 60 | 70 | 80 | 90;

const VIEW_TABS = ['1', '2'] as const;
const BATHHEATER_EQUIPMENT_IMAGE = require('../../assets/equipment/bathlight.png');

const ANGLE_OPTIONS: Array<{
  value: AngleValue;
  label: string;
  subtitle: string;
  icon: any;
}> = [
  {
    value: 60,
    label: '60°',
    subtitle: '出风角度60度',
    icon: require('../../assets/icons/Bathheater/60.png'),
  },
  {
    value: 70,
    label: '70°',
    subtitle: '出风角度70度',
    icon: require('../../assets/icons/Bathheater/70.png'),
  },
  {
    value: 80,
    label: '80°',
    subtitle: '出风角度80度',
    icon: require('../../assets/icons/Bathheater/80.png'),
  },
  {
    value: 90,
    label: '90°',
    subtitle: '出风角度90度',
    icon: require('../../assets/icons/Bathheater/90.png'),
  },
];

const BathheaterDirectionScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<BathheaterControlType>(0);
  const [angleValue, setAngleValue] = useState<AngleValue>(70);

  const subtitleText = ANGLE_OPTIONS.find((item) => item.value === angleValue)?.subtitle ?? '';

  const segmentedItems = useMemo<SegmentedSquareSliderItem[]>(
    () =>
      ANGLE_OPTIONS.map((item) => ({
        label: item.label,
        iconSelected: item.icon,
        iconUnselected: item.icon,
        iconSelectedTintColor: '#FFFFFF',
        iconUnselectedTintColor: TOKENS.colors.rightText,
        selected: angleValue === item.value,
      })),
    [angleValue]
  );

  const circleItems = useMemo<CircleButtonGroupItem[]>(
    () =>
      ANGLE_OPTIONS.map((item) => ({
        label: item.label,
        icon: item.icon,
        selected: angleValue === item.value,
      })),
    [angleValue]
  );

  const renderCurrentControl = () => {
    if (activeTab === 0) {
      return (
        <SegmentedSquareSlider
          items={segmentedItems}
          onItemPress={(index) => {
            const item = ANGLE_OPTIONS[index];
            if (!item) return;
            setAngleValue(item.value);
          }}
        />
      );
    }

    return (
      <CircleButtonGroup
        items={circleItems}
        showLabel={true}
        onItemPress={(index) => {
          const item = ANGLE_OPTIONS[index];
          if (!item) return;
          setAngleValue(item.value);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>浴霸</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={BATHHEATER_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft
              titleText="风向"
              subtitleEnabled={true}
              subtitleText={subtitleText}
              rightEnabled={false}
            />
          </View>

          <View style={activeTab === 0 ? styles.controlPanel : styles.circlePanel}>
            {renderCurrentControl()}
          </View>
        </View>

        <PageTabSwitch
          activeIndex={activeTab}
          onChange={(index) => setActiveTab(index as BathheaterControlType)}
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

export default BathheaterDirectionScreen;
