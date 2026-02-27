import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwitchRow } from '../../components/Switch';
import type { SwitchRowProps } from '../../components/Switch';
import { TOKENS } from '../../tokens';

const DEHUMIDIFIER_ICONS = {
  power: require('../../assets/icons/power.png'),
  feature: require('../../assets/icons/humidity.png'),
} as const;

const PAGE_TABS = ['1', '2', '3', '4'] as const;
const ENABLE_TAB_STATE_SYNC = true;

const POWER_MODES: Array<SwitchRowProps['rightMode']> = ['icon', 'icon', 'switch', 'switch'];
const FEATURE_MODES: Array<SwitchRowProps['rightMode']> = ['switch', 'icon', 'switch', 'icon'];
const FEATURE_LEFT_ICON_ENABLED = [true, false, true, false] as const;
const FEATURE_TITLES = ['热敷', '除菌', '除菌', '除菌'] as const;

const INITIAL_POWER_VALUES = [true, true, true, true] as const;
const INITIAL_FEATURE_VALUES = [false, true, true, true] as const;

type DynamicRowProps = Pick<
  SwitchRowProps,
  'rightMode' | 'rightIconSource' | 'rightButtonOn' | 'switchValue' | 'onRightButtonChange' | 'onSwitchChange'
>;

const DehumidifierScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activePage, setActivePage] = useState(0);
  const [powerValues, setPowerValues] = useState<boolean[]>([...INITIAL_POWER_VALUES]);
  const [featureValues, setFeatureValues] = useState<boolean[]>([...INITIAL_FEATURE_VALUES]);
  const [sharedPowerOn, setSharedPowerOn] = useState<boolean>(INITIAL_POWER_VALUES[0]);
  const [sharedFeatureOn, setSharedFeatureOn] = useState<boolean>(INITIAL_FEATURE_VALUES[0]);

  const powerMode = POWER_MODES[activePage];
  const featureMode = FEATURE_MODES[activePage];
  const featureWithLeftIcon = FEATURE_LEFT_ICON_ENABLED[activePage];
  const featureTitle = FEATURE_TITLES[activePage];

  const currentPowerOn = ENABLE_TAB_STATE_SYNC ? sharedPowerOn : powerValues[activePage];
  const currentFeatureOn = ENABLE_TAB_STATE_SYNC ? sharedFeatureOn : featureValues[activePage];

  const updatePowerState = (nextValue: boolean) => {
    if (ENABLE_TAB_STATE_SYNC) {
      setSharedPowerOn(nextValue);
      setPowerValues((prev) => prev.map(() => nextValue));
      return;
    }

    setPowerValues((prev) => prev.map((item, index) => (index === activePage ? nextValue : item)));
  };

  const updateFeatureState = (nextValue: boolean) => {
    if (ENABLE_TAB_STATE_SYNC) {
      setSharedFeatureOn(nextValue);
      setFeatureValues((prev) => prev.map(() => nextValue));
      return;
    }

    setFeatureValues((prev) => prev.map((item, index) => (index === activePage ? nextValue : item)));
  };

  const powerRowProps: DynamicRowProps =
    powerMode === 'switch'
      ? {
          rightMode: 'switch',
          switchValue: currentPowerOn,
          onSwitchChange: updatePowerState,
        }
      : {
          rightMode: 'icon',
          rightIconSource: DEHUMIDIFIER_ICONS.power,
          rightButtonOn: currentPowerOn,
          onRightButtonChange: updatePowerState,
        };

  const featureRowProps: DynamicRowProps =
    featureMode === 'switch'
      ? {
          rightMode: 'switch',
          switchValue: currentFeatureOn,
          onSwitchChange: updateFeatureState,
        }
      : {
          rightMode: 'icon',
          rightIconSource: DEHUMIDIFIER_ICONS.feature,
          rightButtonOn: currentFeatureOn,
          onRightButtonChange: updateFeatureState,
        };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.title}>除湿机</Text>
      </View>

      <View style={styles.contentPlaceholder} />

      <View style={styles.bottomSection}>
        <View style={styles.switchCard}>
          <SwitchRow
            titleText="关机"
            rowHeight={TOKENS.sizes.switchCardHeight}
            containerBgColor="transparent"
            {...powerRowProps}
          />
        </View>

        <View style={styles.switchCard}>
          <SwitchRow
            titleText={featureTitle}
            leftIconEnabled={featureWithLeftIcon}
            leftIconSource={featureWithLeftIcon ? DEHUMIDIFIER_ICONS.feature : undefined}
            rowHeight={TOKENS.sizes.switchCardHeight}
            containerBgColor="transparent"
            {...featureRowProps}
          />
        </View>

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
  },
  bottomSection: {
    marginBottom: 0,
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

export default DehumidifierScreen;
