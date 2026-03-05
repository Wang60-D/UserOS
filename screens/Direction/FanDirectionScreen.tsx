import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { CircleButtonGroup } from '../../components/ButtonGroup';
import type { CircleButtonGroupItem } from '../../components/ButtonGroup/CircleButtonGroup';
import { DualHandleSlider, SegmentedSquareSlider } from '../../components/Slider';
import { PageTabSwitch } from '../../components/PageSwitch';
import type { SegmentedSquareSliderItem } from '../../components/Slider';
import { TOKENS } from '../../tokens';

type FanControlType = 0 | 1 | 2;
type AngleValue = 30 | 60 | 90 | 120;

const VIEW_TABS = ['1', '2', '3'] as const;
const ANGLE_ICON = require('../../assets/icons/earphone/noisecancellation.png');
const FAN_EQUIPMENT_IMAGE = require('../../assets/equipment/fan.png');
const SYMMETRIC_ANGLE_POINTS = [120, 90, 60, 30, 30, 60, 90, 120] as const;

const ANGLE_OPTIONS: Array<{
  value: AngleValue;
  label: string;
}> = [
  { value: 30, label: '30°' },
  { value: 60, label: '60°' },
  { value: 90, label: '90°' },
  { value: 120, label: '120°' },
];

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const resolveSymmetricAngle = (range: [number, number]): AngleValue => {
  const leftIndex = clamp(Math.round(Math.min(range[0], range[1])), 0, 7);
  return SYMMETRIC_ANGLE_POINTS[leftIndex];
};

const FanDirectionScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<FanControlType>(0);
  const [angleValue, setAngleValue] = useState<AngleValue>(60);
  const [angleRange, setAngleRange] = useState<[number, number]>([3, 4]);

  const subtitleText = useMemo(() => {
    if (activeTab === 1) {
      return `${resolveSymmetricAngle(angleRange)}度`;
    }
    return `${angleValue}度`;
  }, [activeTab, angleRange, angleValue]);

  const circleItems = useMemo<CircleButtonGroupItem[]>(
    () =>
      ANGLE_OPTIONS.map((item) => ({
        label: item.label,
        iconSelected: ANGLE_ICON,
        iconUnselected: ANGLE_ICON,
        iconSelectedTintColor: '#FFFFFF',
        iconUnselectedTintColor: TOKENS.colors.rightText,
        selected: angleValue === item.value,
      })),
    [angleValue]
  );

  const segmentedItems = useMemo<SegmentedSquareSliderItem[]>(
    () =>
      ANGLE_OPTIONS.map((item) => ({
        label: item.label,
        iconSelected: ANGLE_ICON,
        iconUnselected: ANGLE_ICON,
        iconSelectedTintColor: '#FFFFFF',
        iconUnselectedTintColor: TOKENS.colors.rightText,
        selected: angleValue === item.value,
      })),
    [angleValue]
  );

  const renderCurrentControl = () => {
    if (activeTab === 0) {
      return (
        <CircleButtonGroup
          items={circleItems}
          itemCount={4}
          showLabel={true}
          onItemPress={(index) => {
            const item = ANGLE_OPTIONS[index];
            if (!item) return;
            setAngleValue(item.value);
          }}
        />
      );
    }

    if (activeTab === 1) {
      return (
        <DualHandleSlider
          rangeValue={angleRange}
          onRangeChange={setAngleRange}
          min={0}
          max={7}
          showDots={true}
          dotCount={8}
          snapToDots={true}
          symmetricMove={true}
        />
      );
    }

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
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>风扇</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={FAN_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft
              titleText="左右扫风角度"
              subtitleEnabled={true}
              subtitleText={subtitleText}
              rightEnabled={false}
            />
          </View>

          <View
            style={
              activeTab === 0 ? styles.circlePanel : activeTab === 1 ? styles.sliderPanel : styles.controlPanel
            }
          >
            {renderCurrentControl()}
          </View>
        </View>

        <PageTabSwitch
          activeIndex={activeTab}
          onChange={(index) => setActiveTab(index as FanControlType)}
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
  sliderPanel: {
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

export default FanDirectionScreen;
