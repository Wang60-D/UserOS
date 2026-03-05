import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwitchRow, WallSwitch } from '../../components/Switch';
import type { WallSwitchValue } from '../../components/Switch';
import { TOKENS } from '../../tokens';

const SWITCH_ROW_ICONS = {
  floor: require('../../assets/icons/floorswitch.png'),
  power: require('../../assets/icons/power.png'),
} as const;
const WALL_SWITCH_EQUIPMENT_IMAGE = require('../../assets/equipment/wallswitch.png');

const PAGE_TABS = ['1', '2'] as const;
const ENABLE_TAB_STATE_SYNC = true;
const KEY_TITLES = ['左键', '中键', '右键'] as const;
const DEFAULT_ROW_VALUES = [true, false, true] as const;

const WallSwitchScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activePage, setActivePage] = useState(0);
  const [iconValues, setIconValues] = useState<boolean[]>([...DEFAULT_ROW_VALUES]);
  const [switchValues, setSwitchValues] = useState<boolean[]>([...DEFAULT_ROW_VALUES]);
  const isSwitchTab = activePage === 1;

  const currentValues = ENABLE_TAB_STATE_SYNC ? iconValues : isSwitchTab ? switchValues : iconValues;
  const wallSwitchValue: WallSwitchValue = currentValues.every(Boolean)
    ? 'allOn'
    : currentValues.every((item) => !item)
      ? 'allOff'
      : 'none';

  const applyBatchState = (nextValue: boolean) => {
    const nextValues = KEY_TITLES.map(() => nextValue);
    if (ENABLE_TAB_STATE_SYNC) {
      setIconValues(nextValues);
      setSwitchValues(nextValues);
      return;
    }

    if (isSwitchTab) {
      setSwitchValues(nextValues);
      return;
    }

    setIconValues(nextValues);
  };

  const handleRowChange = (index: number, nextValue: boolean) => {
    if (ENABLE_TAB_STATE_SYNC) {
      setIconValues((prev) => prev.map((item, idx) => (idx === index ? nextValue : item)));
      setSwitchValues((prev) => prev.map((item, idx) => (idx === index ? nextValue : item)));
      return;
    }

    if (isSwitchTab) {
      setSwitchValues((prev) => prev.map((item, idx) => (idx === index ? nextValue : item)));
      return;
    }

    setIconValues((prev) => prev.map((item, idx) => (idx === index ? nextValue : item)));
  };

  const handleWallSwitchChange = (value: WallSwitchValue) => {
    if (value === 'allOn') {
      applyBatchState(true);
      return;
    }
    if (value === 'allOff') {
      applyBatchState(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.title}>墙壁开关</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={WALL_SWITCH_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.wallSwitchWrap}>
          <WallSwitch value={wallSwitchValue} onChange={handleWallSwitchChange} />
        </View>

        {KEY_TITLES.map((keyTitle, index) => (
          <View key={keyTitle} style={styles.switchCard}>
            <SwitchRow
              titleText={keyTitle}
              subtitleText="客厅"
              subtitleEnabled={true}
              leftIconEnabled={true}
              leftIconSource={SWITCH_ROW_ICONS.floor}
              leftIconSize={TOKENS.sizes.circleButtonIconSize * 2}
              rightMode={isSwitchTab ? 'switch' : 'icon'}
              rightIconSource={isSwitchTab ? undefined : SWITCH_ROW_ICONS.power}
              switchValue={isSwitchTab ? currentValues[index] : undefined}
              onSwitchChange={isSwitchTab ? (next) => handleRowChange(index, next) : undefined}
              rightButtonOn={!isSwitchTab ? currentValues[index] : undefined}
              onRightButtonChange={!isSwitchTab ? (next) => handleRowChange(index, next) : undefined}
              rowHeight={TOKENS.sizes.switchCardHeight}
              containerBgColor="transparent"
            />
          </View>
        ))}

        <View style={styles.pageSwitchContainer}>
          {PAGE_TABS.map((label, index) => {
            const selected = index === activePage;
            return (
              <Pressable
                key={label}
                style={[styles.pageButton, selected && styles.pageButtonSelected]}
                onPress={() => setActivePage(index)}
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
  title: {
    fontSize: TOKENS.fontSize.large,
    fontWeight: '500',
    color: TOKENS.colors.textPrimary,
  },
  contentPlaceholder: {
    flex: 1,
    paddingVertical: 40,
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
  wallSwitchWrap: {
    marginBottom: 8,
  },
  switchCard: {
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
    height: TOKENS.sizes.switchCardHeight,
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  pageSwitchContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    columnGap: 18,
    marginTop: 48,
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

export default WallSwitchScreen;
