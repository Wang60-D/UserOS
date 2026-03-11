import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { CircleButtonGroup, SquareButtonGroup } from '../../components2.0/ButtonGroup';
import { PageTabSwitch } from '../../components/PageSwitch';
import type { CircleButtonGroupItem, SquareButtonGroupItem } from '../../components2.0/ButtonGroup';
import { TOKENS } from '../../tokens';

type LightSceneMode =
  | 'reading'
  | 'bright'
  | 'relax'
  | 'sunrise'
  | 'soft'
  | 'night'
  | 'ambient';

const VIEW_TABS = ['1', '2'] as const;
const ENABLE_TAB_STATE_SYNC = true;
const INITIAL_MODE_VALUES: LightSceneMode[] = ['reading', 'reading'];
const LIGHT_EQUIPMENT_IMAGE = require('../../assets/equipment/light.png');

const LIGHT_ICON_SOURCES = {
  reading: require('../../assets/icons/read.png'),
  bright: require('../../assets/icons/heat_black.png'),
  relax: require('../../assets/icons/favorite.png'),
  sunrise: require('../../assets/icons/sunrise.png'),
  soft: require('../../assets/icons/bed.png'),
  night: require('../../assets/icons/sleep.png'),
  ambient: require('../../assets/icons/Atmosphere.png'),
} as const;

const ICON_TINT_COLORS = {
  selected: '#FFFFFF',
  unselected: '#000000CC',
} as const;

const LIGHT_SCENE_MODES: Array<{ key: LightSceneMode; label: string; icon: any }> = [
  { key: 'reading', label: '阅读', icon: LIGHT_ICON_SOURCES.reading },
  { key: 'bright', label: '明亮', icon: LIGHT_ICON_SOURCES.bright },
  { key: 'relax', label: '休闲', icon: LIGHT_ICON_SOURCES.relax },
  { key: 'sunrise', label: '晨光', icon: LIGHT_ICON_SOURCES.sunrise },
  { key: 'soft', label: '柔光', icon: LIGHT_ICON_SOURCES.soft },
  { key: 'night', label: '夜灯', icon: LIGHT_ICON_SOURCES.night },
  { key: 'ambient', label: '氛围', icon: LIGHT_ICON_SOURCES.ambient },
];

const LightModeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const [modeValues, setModeValues] = useState<LightSceneMode[]>([...INITIAL_MODE_VALUES]);
  const [sharedMode, setSharedMode] = useState<LightSceneMode>(INITIAL_MODE_VALUES[0]);
  const selectedMode = ENABLE_TAB_STATE_SYNC ? sharedMode : modeValues[activeTab];

  const circleItems = useMemo<CircleButtonGroupItem[]>(
    () =>
      LIGHT_SCENE_MODES.map((item) => ({
        label: item.label,
        icon: item.icon,
        selected: item.key === selectedMode,
      })),
    [selectedMode]
  );

  const squareItems = useMemo<SquareButtonGroupItem[]>(
    () =>
      LIGHT_SCENE_MODES.map((item) => ({
        label: item.label,
        iconSelected: item.icon,
        iconUnselected: item.icon,
        iconSelectedTintColor: ICON_TINT_COLORS.selected,
        iconUnselectedTintColor: ICON_TINT_COLORS.unselected,
        selected: item.key === selectedMode,
      })),
    [selectedMode]
  );

  const updateModeState = (nextMode: LightSceneMode) => {
    if (ENABLE_TAB_STATE_SYNC) {
      setSharedMode(nextMode);
      setModeValues((prev) => prev.map(() => nextMode));
      return;
    }
    setModeValues((prev) => prev.map((value, index) => (index === activeTab ? nextMode : value)));
  };

  const handleModeChange = (index: number) => {
    const target = LIGHT_SCENE_MODES[index];
    if (!target) return;
    updateModeState(target.key);
  };

  const isCircleView = activeTab === 0;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>灯光</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={LIGHT_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft titleText="情景模式" subtitleEnabled={false} rightEnabled={false} />
          </View>

          <View style={isCircleView ? styles.circlePanel : styles.squarePanel}>
            {isCircleView ? (
              <CircleButtonGroup items={circleItems} onItemPress={handleModeChange} />
            ) : (
              <SquareButtonGroup
                items={squareItems}
                isCompact={true}
                selectedColor={TOKENS.colors.mainColor}
                onItemPress={handleModeChange}
              />
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
  squarePanel: {
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

export default LightModeScreen;
