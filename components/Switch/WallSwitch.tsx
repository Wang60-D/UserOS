import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TOKENS } from '../../tokens';

type WallSwitchValue = 'none' | 'allOn' | 'allOff';
export type { WallSwitchValue };

export interface WallSwitchProps {
  value?: WallSwitchValue;
  defaultValue?: WallSwitchValue;
  onChange?: (value: WallSwitchValue) => void;
  leftLabel?: string;
  rightLabel?: string;
}

const WallSwitch: React.FC<WallSwitchProps> = ({
  value,
  defaultValue = 'none',
  onChange,
  leftLabel = '全开',
  rightLabel = '全关',
}) => {
  const isControlled = typeof value === 'string';
  const [internalValue, setInternalValue] = useState<WallSwitchValue>(defaultValue);
  const currentValue = isControlled ? (value as WallSwitchValue) : internalValue;

  const handleSelect = (nextValue: Exclude<WallSwitchValue, 'none'>) => {
    const resolvedValue: WallSwitchValue = currentValue === nextValue ? 'none' : nextValue;
    if (!isControlled) {
      setInternalValue(resolvedValue);
    }
    onChange?.(resolvedValue);
  };

  const leftSelected = currentValue === 'allOn';
  const rightSelected = currentValue === 'allOff';

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, leftSelected && styles.buttonSelected]}
        onPress={() => handleSelect('allOn')}
        accessibilityRole="button"
        accessibilityState={{ selected: leftSelected }}
      >
        <View style={[styles.iconWrap, leftSelected ? styles.iconWrapOn : styles.iconWrapOff]}>
          <View style={[styles.powerRing, leftSelected ? styles.powerRingOn : styles.powerRingOff]} />
        </View>
        <Text style={styles.label}>{leftLabel}</Text>
      </Pressable>

      <Pressable
        style={[styles.button, rightSelected && styles.buttonSelected]}
        onPress={() => handleSelect('allOff')}
        accessibilityRole="button"
        accessibilityState={{ selected: rightSelected }}
      >
        <View style={[styles.iconWrap, rightSelected ? styles.iconWrapAllOffOn : styles.iconWrapOff]}>
          <View style={[styles.powerPill, rightSelected ? styles.powerPillOn : styles.powerPillOff]} />
        </View>
        <Text style={styles.label}>{rightLabel}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '48.5%',
    height: 64,
    borderRadius: 21,
    backgroundColor: TOKENS.colors.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: TOKENS.colors.cardBg,
  },
  iconWrap: {
    width: 41,
    height: 41,
    borderRadius: TOKENS.radius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  iconWrapOn: {
    backgroundColor: '#FD723F33',
  },
  iconWrapOff: {
    backgroundColor: '#F2F2F2',
  },
  iconWrapAllOffOn: {
    backgroundColor: '#B2BDC733',
  },
  powerRing: {
    width: 22,
    height: 22,
    borderRadius: TOKENS.radius.circle,
    borderWidth: 4,
  },
  powerRingOn: {
    borderColor: '#FD723F',
  },
  powerRingOff: {
    borderColor: TOKENS.colors.textPrimary,
  },
  powerPill: {
    width: 6,
    height: 20,
    borderRadius: 3,
  },
  powerPillOn: {
    backgroundColor: TOKENS.colors.mainColor,
  },
  powerPillOff: {
    backgroundColor: TOKENS.colors.textPrimary,
  },
  label: {
    fontSize: 22 / 1.33,
    fontWeight: '500',
    color: TOKENS.colors.textPrimary,
  },
});

export default WallSwitch;
