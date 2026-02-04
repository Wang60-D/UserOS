import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { TOKENS } from '../../tokens';

export interface SquareButtonProps {
  label: string;
  selected?: boolean;
  iconSelected?: ImageSourcePropType;
  iconUnselected?: ImageSourcePropType;
  onPress?: () => void;
}

const SquareButton: React.FC<SquareButtonProps> = ({
  label,
  selected = false,
  iconSelected,
  iconUnselected,
  onPress,
}) => {
  const iconSource = selected ? iconSelected : iconUnselected;

  return (
    <Pressable
      style={[styles.container, selected ? styles.selected : styles.unselected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <View style={styles.iconWrapper}>
        {iconSource ? <Image source={iconSource} style={styles.icon} /> : null}
      </View>
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 76,
    borderRadius: TOKENS.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 10,
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
