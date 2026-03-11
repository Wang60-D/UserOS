import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { COMPONENT_TOKENS } from '../../tokens';

export interface SquareButtonProps {
  label: string;
  icon?: ImageSourcePropType;
  iconSelected?: ImageSourcePropType;
  iconUnselected?: ImageSourcePropType;
  iconSelectedTintColor?: string;
  iconUnselectedTintColor?: string;
  labelSelectedColor?: string;
  labelUnselectedColor?: string;
  selected?: boolean;
  disabled?: boolean;
  isCompact?: boolean;
  selectedColor?: string;
  onPress?: () => void;
}

const SquareButton: React.FC<SquareButtonProps> = ({
  label,
  icon,
  iconSelected,
  iconUnselected,
  iconSelectedTintColor,
  iconUnselectedTintColor,
  labelSelectedColor,
  labelUnselectedColor,
  selected = false,
  disabled = false,
  isCompact = false,
  selectedColor = COMPONENT_TOKENS.squareButton.selectedColorDefault,
  onPress,
}) => {
  const iconSource = selected ? (iconSelected || icon) : (iconUnselected || icon);
  const surfaceStateStyle = isCompact
    ? selected
      ? [styles.compactSelectedBackground, { backgroundColor: selectedColor }]
      : styles.compactUnselectedBackground
    : selected
      ? { backgroundColor: selectedColor }
      : styles.largeUnselectedBackground;
  const selectedIconTint = iconSelectedTintColor
    || (isCompact ? COMPONENT_TOKENS.squareButton.compactIconColor : COMPONENT_TOKENS.squareButton.iconSelectedColor);
  const unselectedIconTint = iconUnselectedTintColor
    || (isCompact ? COMPONENT_TOKENS.squareButton.compactIconColor : COMPONENT_TOKENS.squareButton.iconUnselectedColor);
  const selectedLabelColor = labelSelectedColor
    || (isCompact ? COMPONENT_TOKENS.squareButton.compactLabelColor : COMPONENT_TOKENS.squareButton.labelSelectedColor);
  const unselectedLabelColor = labelUnselectedColor
    || (isCompact ? COMPONENT_TOKENS.squareButton.compactLabelColor : COMPONENT_TOKENS.squareButton.labelUnselectedColor);

  return (
    <Pressable
      style={styles.pressable}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
    >
      <View
        style={[
          styles.surfaceBase,
          isCompact ? styles.surfaceCompact : styles.surfaceLarge,
          surfaceStateStyle,
        ]}
      >
        {iconSource ? (
          <Image
            source={iconSource}
            resizeMode="contain"
            style={[
              styles.icon,
              selected ? { tintColor: selectedIconTint } : { tintColor: unselectedIconTint },
            ]}
          />
        ) : null}
        <Text
          numberOfLines={1}
          style={[
            styles.label,
            selected ? { color: selectedLabelColor } : { color: unselectedLabelColor },
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  surfaceBase: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: COMPONENT_TOKENS.squareButton.itemPaddingHorizontal,
    paddingTop: COMPONENT_TOKENS.squareButton.itemPaddingTop,
    paddingBottom: COMPONENT_TOKENS.squareButton.itemPaddingBottom,
    gap: COMPONENT_TOKENS.squareButton.itemLabelGap,
  },
  surfaceLarge: {
    borderRadius: COMPONENT_TOKENS.squareButton.largeItemRadius,
  },
  surfaceCompact: {
    borderRadius: COMPONENT_TOKENS.squareButton.compactItemRadius,
  },
  compactSelectedBackground: {
    backgroundColor: COMPONENT_TOKENS.squareButton.compactSelectedBackgroundColor,
    shadowColor: COMPONENT_TOKENS.squareButton.compactSelectedShadowColor,
    shadowOffset: {
      width: 0,
      height: COMPONENT_TOKENS.squareButton.compactSelectedShadowOffsetLgY,
    },
    shadowOpacity: COMPONENT_TOKENS.squareButton.compactSelectedShadowOpacity,
    shadowRadius: COMPONENT_TOKENS.squareButton.compactSelectedShadowRadiusLg,
    elevation: COMPONENT_TOKENS.squareButton.compactSelectedElevation,
  },
  compactUnselectedBackground: {
    backgroundColor: 'transparent',
  },
  largeUnselectedBackground: {
    backgroundColor: COMPONENT_TOKENS.squareButton.largeItemUnselectedBackgroundColor,
  },
  icon: {
    width: COMPONENT_TOKENS.squareButton.iconSize,
    height: COMPONENT_TOKENS.squareButton.iconSize,
    transform: [{ scale: COMPONENT_TOKENS.squareButton.iconScale }],
  },
  label: {
    fontSize: COMPONENT_TOKENS.squareButton.labelFontSize,
    lineHeight: COMPONENT_TOKENS.squareButton.labelLineHeight,
    fontWeight: COMPONENT_TOKENS.squareButton.labelFontWeight,
    textAlign: 'center',
  },
});

export default SquareButton;
