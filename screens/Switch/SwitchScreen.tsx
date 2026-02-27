import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwitchRow, WallSwitch } from '../../components/Switch';
import { TOKENS } from '../../tokens';

const SWITCH_ROW_ICONS = {
  light: require('../../assets/icons/fan_black.png'),
  power: require('../../assets/icons/heat_black.png'),
  floor: require('../../assets/icons/floorswitch.png'),
} as const;

const CARD_HEIGHT = TOKENS.sizes.switchCardHeight;
const CARD_GAP = TOKENS.spacing.itemGap;

const SwitchScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: insets.top + TOKENS.spacing.pagePaddingV },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.itemCard, styles.itemSpacing]}>
        <SwitchRow
          titleText="关机"
          rightMode="icon"
          rightIconSource={SWITCH_ROW_ICONS.power}
          defaultRightButtonOn={true}
          rowHeight={CARD_HEIGHT}
          containerBgColor="transparent"
        />
      </View>

      <View style={[styles.itemCard, styles.itemSpacing]}>
        <SwitchRow
          titleText="关机"
          rightMode="switch"
          defaultSwitchValue={true}
          rowHeight={CARD_HEIGHT}
          containerBgColor="transparent"
        />
      </View>

      <View style={[styles.itemCard, styles.itemSpacing]}>
        <SwitchRow
          titleText="照明"
          leftIconEnabled={true}
          leftIconSource={SWITCH_ROW_ICONS.light}
          rightMode="switch"
          defaultSwitchValue={false}
          rowHeight={CARD_HEIGHT}
          containerBgColor="transparent"
        />
      </View>

      <View style={[styles.itemCard, styles.itemSpacing]}>
        <SwitchRow
          titleText="照明"
          rightMode="icon"
          rightIconSource={SWITCH_ROW_ICONS.light}
          rightIconTone="accent"
          defaultRightButtonOn={true}
          rowHeight={CARD_HEIGHT}
          containerBgColor="transparent"
        />
      </View>

      <View style={[styles.itemCard, styles.itemSpacing]}>
        <SwitchRow
          titleText="左键"
          subtitleText="客厅"
          subtitleEnabled={true}
          leftIconEnabled={true}
          leftIconSource={SWITCH_ROW_ICONS.floor}
          leftIconSize={TOKENS.sizes.circleButtonIconSize * 2}
          rightMode="icon"
          rightIconSource={SWITCH_ROW_ICONS.power}
          defaultRightButtonOn={true}
          rowHeight={CARD_HEIGHT}
          containerBgColor="transparent"
        />
      </View>

      <View style={[styles.wallSwitchCard, styles.itemSpacing]}>
        <WallSwitch />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.colors.pageBg,
    paddingHorizontal: TOKENS.spacing.pagePaddingH,
  },
  scrollContent: {
    paddingBottom: TOKENS.spacing.pagePaddingV,
  },
  itemCard: {
    width: '100%',
    height: CARD_HEIGHT,
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  itemSpacing: {
    marginBottom: CARD_GAP,
  },
  wallSwitchCard: {
    width: '100%',
  },
});

export default SwitchScreen;
