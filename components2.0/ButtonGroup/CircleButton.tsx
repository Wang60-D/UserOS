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

export interface CircleButtonProps {
  label: string;
  icon: ImageSourcePropType;
  selected?: boolean;
  disabled?: boolean;
  showLabel?: boolean;
  onPress?: () => void;
}

const CircleButton: React.FC<CircleButtonProps> = ({
  label,
  icon,
  selected = false,
  disabled = false,
  showLabel = true,
  onPress,
}) => {
  return (
    <Pressable
      style={styles.pressable}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
    >
      <View style={[styles.button, selected ? styles.buttonSelected : styles.buttonUnselected]}>
        <Image
          source={icon}
          style={[styles.icon, selected ? styles.iconSelected : styles.iconUnselected]}
          resizeMode="contain"
        />
      </View>
      {showLabel ? (
        <Text numberOfLines={1} style={styles.label}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: COMPONENT_TOKENS.circleButton.itemPadding,
    gap: COMPONENT_TOKENS.circleButton.itemLabelGap,
  },
  button: {
    width: COMPONENT_TOKENS.circleButton.buttonSize,
    height: COMPONENT_TOKENS.circleButton.buttonSize,
    borderRadius: COMPONENT_TOKENS.circleButton.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSelected: {
    backgroundColor: COMPONENT_TOKENS.circleButton.buttonSelectedBackgroundColor,
  },
  buttonUnselected: {
    backgroundColor: COMPONENT_TOKENS.circleButton.buttonUnselectedBackgroundColor,
  },
  icon: {
    width: COMPONENT_TOKENS.circleButton.iconSize,
    height: COMPONENT_TOKENS.circleButton.iconSize,
    transform: [{ scale: 1 }],
  },
  iconSelected: {
    tintColor: COMPONENT_TOKENS.circleButton.iconSelectedColor,
  },
  iconUnselected: {
    tintColor: COMPONENT_TOKENS.circleButton.iconUnselectedColor,
  },
  label: {
    fontSize: COMPONENT_TOKENS.circleButton.labelFontSize,
    fontWeight: COMPONENT_TOKENS.circleButton.labelFontWeight,
    color: COMPONENT_TOKENS.circleButton.labelColor,
    textAlign: 'center',
    lineHeight: COMPONENT_TOKENS.circleButton.labelLineHeight,
  },
});

export default CircleButton;
