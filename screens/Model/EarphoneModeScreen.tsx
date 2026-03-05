import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { CircleButtonGroup } from '../../components/ButtonGroup';
import CapsuleModeSlider, { type CapsuleModeValue } from '../../components/Slider/CapsuleModeSlider';
import type { CircleButtonGroupItem } from '../../components/ButtonGroup/CircleButtonGroup';
import { TOKENS } from '../../tokens';

type EarphoneControlType = 0 | 1 | 2;

const VIEW_TABS = ['1', '2', '3'] as const;
const ENABLE_TAB_STATE_SYNC = true;
const INITIAL_VALUES: CapsuleModeValue[] = ['modeA', 'modeA', 'modeA'];
const EARPHONE_EQUIPMENT_IMAGE = require('../../assets/equipment/earphone.png');

const EARPHONE_ICONS = {
  off: require('../../assets/icons/earphone/earphoneoff.png'),
  modeA: require('../../assets/icons/earphone/noisecancellation.png'),
  modeB: require('../../assets/icons/earphone/Transparency.png'),
} as const;

const ICON_TINT_COLORS = {
  selected: '#FFFFFF',
  unselected: '#000000CC',
} as const;

const CIRCLE_MODE_ITEMS: Array<{ value: CapsuleModeValue; label: string; icon: any }> = [
  { value: 'off', label: '关闭', icon: EARPHONE_ICONS.off },
  { value: 'modeA', label: '降噪', icon: EARPHONE_ICONS.modeA },
  { value: 'modeB', label: '通透', icon: EARPHONE_ICONS.modeB },
];

const EarphoneModeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<EarphoneControlType>(0);
  const [tabValues, setTabValues] = useState<CapsuleModeValue[]>([...INITIAL_VALUES]);
  const [sharedValue, setSharedValue] = useState<CapsuleModeValue>(INITIAL_VALUES[0]);

  const selectedValue = ENABLE_TAB_STATE_SYNC ? sharedValue : tabValues[activeTab];

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
          modeALabel="降噪"
          modeBLabel="通透"
          offIcon={EARPHONE_ICONS.off}
          modeAIcon={EARPHONE_ICONS.modeA}
          modeBIcon={EARPHONE_ICONS.modeB}
        />
      );
    }

    return (
      <CapsuleModeSlider
        splitTracks={false}
        value={selectedValue}
        onChange={updateValue}
        offLabel="关闭"
        modeALabel="降噪"
        modeBLabel="通透"
        offIcon={EARPHONE_ICONS.off}
        modeAIcon={EARPHONE_ICONS.modeA}
        modeBIcon={EARPHONE_ICONS.modeB}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>耳机</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={EARPHONE_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft titleText="耳机模式" subtitleEnabled={false} rightEnabled={false} />
          </View>

          <View style={activeTab === 0 ? styles.circlePanel : styles.sliderPanel}>{renderControl()}</View>
        </View>

        <View style={styles.pageSwitchContainer}>
          {VIEW_TABS.map((label, index) => {
            const selected = index === activeTab;
            return (
              <Pressable
                key={label}
                style={[styles.pageButton, selected && styles.pageButtonSelected]}
                onPress={() => setActiveTab(index as EarphoneControlType)}
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

export default EarphoneModeScreen;
