import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { TOKENS } from '../../tokens';

const ICON_ASSET_PATH =
  '/Users/shengyi/Desktop/Xiaomi/Code/UserOS/assets/23a7a4d53fe6848610ce9a51630eadaaca7d2e33.svg';
const CIRCLE_BG_UNSELECTED_PATH =
  '/Users/shengyi/Desktop/Xiaomi/Code/UserOS/assets/89028c14d87175a18947367391e2392ad7b30bc2.svg';
const CIRCLE_BG_SELECTED_PATH =
  '/Users/shengyi/Desktop/Xiaomi/Code/UserOS/assets/9be0972adf7c56077c4a2467a964d7f42671f6ca.svg';

// Figma 导入的 SVG 需要额外的 svg loader 支持。暂时用 emoji 占位，保留路径。
const selectedBgSource: any = null;
const unselectedBgSource: any = null;

export interface CircleButtonProps {
  label: string;
  showLabel?: boolean;
  selected?: boolean;
  iconEmoji?: string;
  iconSelected?: ImageSourcePropType;
  iconUnselected?: ImageSourcePropType;
  onPress?: () => void;
}

const CircleButton: React.FC<CircleButtonProps> = ({
  label,
  showLabel = true,
  selected = false,
  iconEmoji = '❄️',
  iconSelected,
  iconUnselected,
  onPress,
}) => {
  const iconSource = selected ? iconSelected : iconUnselected;

  return (
    <Pressable
      style={styles.itemContainer}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <View style={styles.circleWrapper}>
        {selectedBgSource || unselectedBgSource ? (
          <Image
            source={selected ? selectedBgSource : unselectedBgSource}
            style={styles.circleBg}
            resizeMode="contain"
          />
        ) : (
          <View
            style={[
              styles.circleBgFallback,
              selected ? styles.circleSelected : styles.circleUnselected,
            ]}
          />
        )}
        <View style={styles.iconWrapper}>
          {iconSource ? (
            <Image source={iconSource} style={styles.icon} resizeMode="contain" />
          ) : (
            <Text style={styles.iconEmoji} numberOfLines={1}>
              {iconEmoji}
            </Text>
          )}
        </View>
      </View>
      {showLabel && (
        <Text style={styles.labelText} numberOfLines={1}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: TOKENS.sizes.circleButtonItemWidth,
    height: TOKENS.sizes.circleButtonItemHeight,
    alignItems: 'center',
  },
  circleWrapper: {
    width: TOKENS.sizes.circleButtonSize,
    height: TOKENS.sizes.circleButtonSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBg: {
    position: 'absolute',
    width: TOKENS.sizes.circleButtonSize,
    height: TOKENS.sizes.circleButtonSize,
  },
  circleBgFallback: {
    position: 'absolute',
    width: TOKENS.sizes.circleButtonSize,
    height: TOKENS.sizes.circleButtonSize,
    borderRadius: TOKENS.radius.circle,
  },
  circleSelected: {
    backgroundColor: TOKENS.colors.mainColor,
  },
  circleUnselected: {
    backgroundColor: TOKENS.colors.circleUnselectedBg,
  },
  iconWrapper: {
    width: TOKENS.sizes.circleButtonIconSize,
    height: TOKENS.sizes.circleButtonIconSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: TOKENS.sizes.circleButtonIconSize,
    height: TOKENS.sizes.circleButtonIconSize,
    alignSelf: 'center',
  },
  iconEmoji: {
    fontSize: TOKENS.fontSize.medium,
    lineHeight: TOKENS.sizes.circleButtonIconSize,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  labelText: {
    marginTop: TOKENS.spacing.circleButtonLabelMarginTop,
    fontSize: TOKENS.fontSize.medium,
    color: TOKENS.colors.textPrimary,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },
});

export default CircleButton;
