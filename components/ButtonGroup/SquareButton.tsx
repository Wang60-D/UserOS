import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { TOKENS } from '../../tokens';

export interface SquareButtonProps {
  label: string;
  selected?: boolean;
  iconSelected?: ImageSourcePropType;
  iconUnselected?: ImageSourcePropType;
  iconSelectedTintColor?: string;
  iconUnselectedTintColor?: string;
  onPress?: () => void;
}

const SquareButton: React.FC<SquareButtonProps> = ({
  label,
  selected = false,
  iconSelected,
  iconUnselected,
  iconSelectedTintColor,
  iconUnselectedTintColor,
  onPress,
}) => {
  const iconSource = selected ? iconSelected : iconUnselected;
  const iconTintColor = selected ? iconSelectedTintColor : iconUnselectedTintColor;

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <View style={[styles.surface, styles.surfaceDefault, selected ? styles.selected : styles.unselected]}>
        <View style={styles.iconWrapper}>
          {iconSource ? (
            <Image
              source={iconSource}
              style={[styles.icon, iconTintColor ? { tintColor: iconTintColor } : null]}
            />
          ) : null}
        </View>
        <Text style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 76,
    borderRadius: TOKENS.radius.card,
  },
  surface: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  surfaceDefault: {
    borderRadius: TOKENS.radius.card,
  },
  selected: {
    backgroundColor: TOKENS.colors.mainColor,
  },
  unselected: {
    backgroundColor: TOKENS.colors.cardBg,
  },
  iconWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: TOKENS.fontSize.medium,
    fontWeight: '500',
    textAlign: 'center',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
  labelUnselected: {
    color: TOKENS.colors.textPrimary,
  },
});

export default SquareButton;
