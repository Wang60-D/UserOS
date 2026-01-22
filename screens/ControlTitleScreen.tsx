import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../components/ControlTitle/ControlTitleLeft';
import ControlTitleCenter from '../components/ControlTitle/ControlTitleCenter';
import { TOKENS } from '../tokens';
// 卡片参数
const CARD_BORDER_WIDTH = 2; // 描边宽度
const ITEM_HEIGHT =
  TOKENS.sizes.controlTitleHeight + TOKENS.spacing.cardInnerPaddingV * 2; // 卡片高度
const ITEM_GAP = TOKENS.spacing.itemGap; // 卡片间距
const CENTER_CARD_HEIGHT =
  TOKENS.sizes.controlTitleCenterHeightWithSubtitle +
  TOKENS.spacing.cardInnerPaddingV * 2;
const CENTER_CARD_HEIGHT_NO_SUB =
  TOKENS.sizes.controlTitleCenterHeight + TOKENS.spacing.cardInnerPaddingV * 2;

const ControlTitleScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + TOKENS.spacing.pagePaddingV },
      ]}
    >
      <View style={[styles.itemCard, styles.itemSpacing]}>
        <ControlTitleLeft
          titleText="情景模式"
          subtitleText="副标题"
          subtitleEnabled={true}
          rightMode="device"
          rightText="ARE YOU OK?"
        />
      </View>
      <View style={[styles.itemCard, styles.itemSpacing]}>
        <ControlTitleLeft
          titleText="空调模式"
          subtitleText="副标题"
          subtitleEnabled={false}
          rightMode="switch"
          rightText="xxxxx"
        />
      </View>
      <View style={[styles.itemCard, styles.itemSpacing]}>
        <ControlTitleLeft
          titleText="灯光模式"
          subtitleText="副标题"
          subtitleEnabled={true}
          rightMode="device"
          rightText="HELLO_INDIAN_MIFANS"
        />
      </View>
      <View
        style={[
          styles.itemCard,
          styles.itemSpacing,
          { height: CENTER_CARD_HEIGHT },
        ]}
      >
        <ControlTitleCenter
          titleText="标题"
          subtitleText="副标题副标题"
          subtitleEnabled={true}
        />
      </View>
      <View style={[styles.itemCard, { height: CENTER_CARD_HEIGHT_NO_SUB }]}>
        <ControlTitleCenter
          titleText="标题"
          subtitleText="副标题副标题"
          subtitleEnabled={false}
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
    paddingBottom: TOKENS.spacing.pagePaddingV,
  },
  itemCard: {
    width: '100%',
    height: ITEM_HEIGHT,
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
    //borderColor: TOKENS.colors.borderAccent,
    //borderWidth: CARD_BORDER_WIDTH,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingVertical: TOKENS.spacing.cardInnerPaddingV,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  itemSpacing: {
    marginBottom: ITEM_GAP,
  },
});

export default ControlTitleScreen;
