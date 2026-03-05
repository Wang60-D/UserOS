import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwitchRow } from '../../components/Switch';
import type { SwitchRowProps } from '../../components/Switch';
import { TOKENS } from '../../tokens';

const CLOTHRACK_ICONS = {
  feature: require('../../assets/icons/clothrack/icon.png'),
} as const;
const CLOTHRACK_EQUIPMENT_IMAGE = require('../../assets/equipment/Clothesrack.png');

const PAGE_TABS = ['1', '2'] as const;
const ENABLE_TAB_STATE_SYNC = true;

type DynamicSwitchProps = Pick<
  SwitchRowProps,
  | 'leftIconEnabled'
  | 'leftIconSource'
  | 'rightMode'
  | 'rightIconSource'
  | 'rightButtonOn'
  | 'switchValue'
  | 'onRightButtonChange'
  | 'onSwitchChange'
>;

const ClothrackSwitchScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activePage, setActivePage] = useState(0);
  const [sharedOn, setSharedOn] = useState(true);
  const [iconOn, setIconOn] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);

  const isSwitchTab = activePage === 1;
  const currentOn = ENABLE_TAB_STATE_SYNC ? sharedOn : isSwitchTab ? switchOn : iconOn;

  const handleStateChange = (nextValue: boolean) => {
    if (ENABLE_TAB_STATE_SYNC) {
      setSharedOn(nextValue);
      setIconOn(nextValue);
      setSwitchOn(nextValue);
      return;
    }

    if (isSwitchTab) {
      setSwitchOn(nextValue);
    } else {
      setIconOn(nextValue);
    }
  };

  const currentSwitchProps: DynamicSwitchProps = isSwitchTab
    ? {
        leftIconEnabled: true,
        leftIconSource: CLOTHRACK_ICONS.feature,
        rightMode: 'switch',
        switchValue: currentOn,
        onSwitchChange: handleStateChange,
      }
    : {
        leftIconEnabled: false,
        rightMode: 'icon',
        rightIconSource: CLOTHRACK_ICONS.feature,
        rightButtonOn: currentOn,
        onRightButtonChange: handleStateChange,
      };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.title}>晾衣架</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={CLOTHRACK_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.switchCard}>
          <SwitchRow
            titleText="除菌"
            rowHeight={TOKENS.sizes.switchCardHeight}
            containerBgColor="transparent"
            {...currentSwitchProps}
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
  switchCard: {
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
    height: TOKENS.sizes.switchCardHeight,
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 48,
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

export default ClothrackSwitchScreen;
