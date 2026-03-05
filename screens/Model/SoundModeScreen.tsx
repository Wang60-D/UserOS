import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { CircleButtonGroup, SquareButtonGroup } from '../../components/ButtonGroup';
import type { CircleButtonGroupItem } from '../../components/ButtonGroup/CircleButtonGroup';
import type { SquareButtonGroupItem } from '../../components/ButtonGroup/SquareButtonGroup';
import { TOKENS } from '../../tokens';

type SoundMode = 'balance' | 'outdoor' | 'indoor' | 'romantic' | 'concert' | 'movie' | 'party';

const VIEW_TABS = ['1', '2'] as const;
const ENABLE_TAB_STATE_SYNC = true;
const INITIAL_MODE_VALUES: SoundMode[] = ['balance', 'balance'];
const SOUND_EQUIPMENT_IMAGE = require('../../assets/equipment/sound.png');

const SOUND_ICON_SOURCES = {
  balance: require('../../assets/icons/mode.png'),
  outdoor: require('../../assets/icons/fan_black.png'),
  indoor: require('../../assets/icons/Sound/indoor.png'),
  romantic: require('../../assets/icons/favorite.png'),
  concert: require('../../assets/icons/light.png'),
  movie: require('../../assets/icons/humidity.png'),
  party: require('../../assets/icons/dehumidify_black.png'),
} as const;

const ICON_TINT_COLORS = {
  selected: '#FFFFFF',
  unselected: '#000000CC',
} as const;

const CIRCLE_SOUND_MODES: Array<{ key: SoundMode; label: string; icon: any }> = [
  { key: 'balance', label: '均衡', icon: SOUND_ICON_SOURCES.balance },
  { key: 'outdoor', label: '室外', icon: SOUND_ICON_SOURCES.outdoor },
  { key: 'indoor', label: '室内', icon: SOUND_ICON_SOURCES.indoor },
  { key: 'romantic', label: '浪漫', icon: SOUND_ICON_SOURCES.romantic },
  { key: 'concert', label: '演唱会', icon: SOUND_ICON_SOURCES.concert },
  { key: 'movie', label: '电影', icon: SOUND_ICON_SOURCES.movie },
  { key: 'party', label: '派对', icon: SOUND_ICON_SOURCES.party },
];

const SQUARE_SOUND_MODES: Array<{ key: SoundMode; label: string; icon: any }> = [
  { key: 'balance', label: '均衡', icon: SOUND_ICON_SOURCES.balance },
  { key: 'outdoor', label: '室外', icon: SOUND_ICON_SOURCES.outdoor },
  { key: 'indoor', label: '休闲', icon: SOUND_ICON_SOURCES.indoor },
  { key: 'romantic', label: '浪漫', icon: SOUND_ICON_SOURCES.romantic },
  { key: 'concert', label: '演唱会', icon: SOUND_ICON_SOURCES.concert },
  { key: 'movie', label: '电影', icon: SOUND_ICON_SOURCES.movie },
  { key: 'party', label: '派对', icon: SOUND_ICON_SOURCES.party },
];

const SoundModeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const [modeValues, setModeValues] = useState<SoundMode[]>([...INITIAL_MODE_VALUES]);
  const [sharedMode, setSharedMode] = useState<SoundMode>(INITIAL_MODE_VALUES[0]);
  const selectedMode = ENABLE_TAB_STATE_SYNC ? sharedMode : modeValues[activeTab];
  const isCircleView = activeTab === 0;

  const circleItems = useMemo<CircleButtonGroupItem[]>(
    () =>
      CIRCLE_SOUND_MODES.map((item) => ({
        label: item.label,
        iconSelected: item.icon,
        iconUnselected: item.icon,
        iconSelectedTintColor: ICON_TINT_COLORS.selected,
        iconUnselectedTintColor: ICON_TINT_COLORS.unselected,
        selected: item.key === selectedMode,
      })),
    [selectedMode]
  );

  const squareItems = useMemo<SquareButtonGroupItem[]>(
    () =>
      SQUARE_SOUND_MODES.map((item) => ({
        label: item.label,
        iconSelected: item.icon,
        iconUnselected: item.icon,
        iconSelectedTintColor: ICON_TINT_COLORS.selected,
        iconUnselectedTintColor: ICON_TINT_COLORS.unselected,
        selected: item.key === selectedMode,
      })),
    [selectedMode]
  );

  const updateModeState = (nextMode: SoundMode) => {
    if (ENABLE_TAB_STATE_SYNC) {
      setSharedMode(nextMode);
      setModeValues((prev) => prev.map(() => nextMode));
      return;
    }
    setModeValues((prev) => prev.map((value, index) => (index === activeTab ? nextMode : value)));
  };

  const handleModeChange = (index: number) => {
    const source = isCircleView ? CIRCLE_SOUND_MODES : SQUARE_SOUND_MODES;
    const target = source[index];
    if (!target) return;
    updateModeState(target.key);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>音效</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={SOUND_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft titleText="音效模式" subtitleEnabled={false} rightEnabled={false} />
          </View>

          <View style={isCircleView ? styles.circlePanel : styles.squarePanel}>
            {isCircleView ? (
              <CircleButtonGroup items={circleItems} itemCount={7} onItemPress={handleModeChange} />
            ) : (
              <SquareButtonGroup items={squareItems} onItemPress={handleModeChange} />
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

export default SoundModeScreen;
