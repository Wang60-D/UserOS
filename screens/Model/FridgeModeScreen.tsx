import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { CircleButtonGroup } from '../../components/ButtonGroup';
import CapsuleModeSlider, { type CapsuleModeValue } from '../../components/Slider/CapsuleModeSlider';
import { PageTabSwitch } from '../../components/PageSwitch';
import type { CircleButtonGroupItem } from '../../components/ButtonGroup/CircleButtonGroup';
import { TOKENS } from '../../tokens';

type FridgeControlType = 0 | 1 | 2;

const VIEW_TABS = ['1', '2', '3'] as const;
const ENABLE_TAB_STATE_SYNC = true;
const INITIAL_VALUES: CapsuleModeValue[] = ['modeA', 'modeA', 'modeA'];
const FRIDGE_EQUIPMENT_IMAGE = require('../../assets/equipment/fridge.png');

const FRIDGE_ICONS = {
  off: require('../../assets/icons/frage/off.png'),
  modeA: require('../../assets/icons/frage/normal.png'),
  modeB: require('../../assets/icons/frage/fast.png'),
} as const;

const ICON_TINT_COLORS = {
  selected: '#FFFFFF',
  unselected: '#000000CC',
} as const;

const CIRCLE_MODE_ITEMS: Array<{ value: CapsuleModeValue; label: string; icon: any }> = [
  { value: 'off', label: '关闭', icon: FRIDGE_ICONS.off },
  { value: 'modeA', label: '正常', icon: FRIDGE_ICONS.modeA },
  { value: 'modeB', label: '快速', icon: FRIDGE_ICONS.modeB },
];

const SUBTITLE_BY_VALUE: Record<CapsuleModeValue, string> = {
  off: '关闭',
  modeA: '正常制冰中',
  modeB: '快速制冰中',
};

const FridgeModeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<FridgeControlType>(0);
  const [tabValues, setTabValues] = useState<CapsuleModeValue[]>([...INITIAL_VALUES]);
  const [sharedValue, setSharedValue] = useState<CapsuleModeValue>(INITIAL_VALUES[0]);

  const selectedValue = ENABLE_TAB_STATE_SYNC ? sharedValue : tabValues[activeTab];
  const subtitleText = SUBTITLE_BY_VALUE[selectedValue];

  const updateValue = (nextValue: CapsuleModeValue) => {
    if (ENABLE_TAB_STATE_SYNC) {
      setSharedValue(nextValue);
      setTabValues((prev) => prev.map(() => nextValue));
      return;
    }
    setTabValues((prev) => prev.map((value, index) => (index === activeTab ? nextValue : value)));
  };

  const circleItems = useMemo<CircleButtonGroupItem[]>(
    () =>
      CIRCLE_MODE_ITEMS.map((item) => ({
        label: item.label,
        iconSelected: item.icon,
        iconUnselected: item.icon,
        iconSelectedTintColor: ICON_TINT_COLORS.selected,
        iconUnselectedTintColor: ICON_TINT_COLORS.unselected,
        selected: item.value === selectedValue,
      })),
    [selectedValue]
  );

  const renderControl = () => {
    if (activeTab === 0) {
      return (
        <CircleButtonGroup
          items={circleItems}
          itemCount={3}
          onItemPress={(index) => {
            const target = CIRCLE_MODE_ITEMS[index];
            if (!target) return;
            updateValue(target.value);
          }}
        />
      );
    }

    if (activeTab === 1) {
      return (
        <CapsuleModeSlider
          splitTracks={true}
          value={selectedValue}
          onChange={updateValue}
          offLabel="关闭"
          modeALabel="正常"
          modeBLabel="快速"
          offIcon={FRIDGE_ICONS.off}
          modeAIcon={FRIDGE_ICONS.modeA}
          modeBIcon={FRIDGE_ICONS.modeB}
        />
      );
    }

    return (
      <CapsuleModeSlider
        splitTracks={false}
        value={selectedValue}
        onChange={updateValue}
        offLabel="关闭"
        modeALabel="正常"
        modeBLabel="快速"
        offIcon={FRIDGE_ICONS.off}
        modeAIcon={FRIDGE_ICONS.modeA}
        modeBIcon={FRIDGE_ICONS.modeB}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>冰箱</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={FRIDGE_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft
              titleText="制冰室"
              subtitleEnabled={true}
              subtitleText={subtitleText}
              rightEnabled={false}
            />
          </View>

          <View style={activeTab === 0 ? styles.circlePanel : styles.sliderPanel}>{renderControl()}</View>
        </View>

        <PageTabSwitch
          activeIndex={activeTab}
          onChange={(index) => setActiveTab(index as FridgeControlType)}
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

export default FridgeModeScreen;
