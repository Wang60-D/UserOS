import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TOKENS } from '../../tokens';

type NumericRange = [number, number];

export interface RemoteControlStepperProps {
  range: NumericRange;
  step: number;
  value?: number;
  defaultValue?: number;
  onChange?: (nextValue: number) => void;
  unitLabel?: string;
}

const CONTROL_HEIGHT = 36;
const BUTTON_WIDTH = 103;
const BUTTON_GAP = 12;
const OUTER_RADIUS = 60;

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const snapToStep = (value: number, min: number, step: number) => {
  if (step <= 0) return value;
  const count = Math.round((value - min) / step);
  return min + count * step;
};

const RemoteControlStepper: React.FC<RemoteControlStepperProps> = ({
  range,
  step,
  value,
  defaultValue,
  onChange,
  unitLabel = '挡',
}) => {
  const [rangeStartRaw, rangeEndRaw] = range;
  const rangeStart = Math.min(rangeStartRaw, rangeEndRaw);
  const rangeEnd = Math.max(rangeStartRaw, rangeEndRaw);
  const resolvedStep = Math.abs(step) > 1e-6 ? Math.abs(step) : 1;
  const initialValue = clamp(
    snapToStep(defaultValue ?? rangeStart, rangeStart, resolvedStep),
    rangeStart,
    rangeEnd
  );
  const [internalValue, setInternalValue] = useState(initialValue);
  const isControlled = typeof value === 'number';
  const currentValue = clamp(
    snapToStep(isControlled ? (value as number) : internalValue, rangeStart, resolvedStep),
    rangeStart,
    rangeEnd
  );

  const canDecrease = currentValue > rangeStart + 1e-6;
  const canIncrease = currentValue < rangeEnd - 1e-6;

  const valueText = useMemo(() => {
    if (Number.isInteger(currentValue)) return String(currentValue);
    return String(Number(currentValue.toFixed(2)));
  }, [currentValue]);

  const commitValue = (nextValue: number) => {
    const snapped = clamp(snapToStep(nextValue, rangeStart, resolvedStep), rangeStart, rangeEnd);
    if (!isControlled) {
      setInternalValue(snapped);
    }
    onChange?.(snapped);
  };

  const handleDecrease = () => {
    if (!canDecrease) return;
    commitValue(currentValue - resolvedStep);
  };

  const handleIncrease = () => {
    if (!canIncrease) return;
    commitValue(currentValue + resolvedStep);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.sideButton, !canDecrease && styles.disabledButton]}
        onPress={handleDecrease}
        disabled={!canDecrease}
        accessibilityRole="button"
        accessibilityLabel="减小"
      >
        <View style={styles.minusIcon} />
      </Pressable>

      <View style={styles.centerInfo}>
        <Text style={styles.valueText}>{valueText}</Text>
        <Text style={styles.unitText}>{unitLabel}</Text>
      </View>

      <Pressable
        style={[styles.sideButton, !canIncrease && styles.disabledButton]}
        onPress={handleIncrease}
        disabled={!canIncrease}
        accessibilityRole="button"
        accessibilityLabel="增大"
      >
        <View style={styles.plusIconHorizontal} />
        <View style={styles.plusIconVertical} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: CONTROL_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    columnGap: BUTTON_GAP,
  },
  sideButton: {
    width: BUTTON_WIDTH,
    height: CONTROL_HEIGHT,
    borderRadius: OUTER_RADIUS,
    backgroundColor: TOKENS.colors.rightPillBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.45,
  },
  centerInfo: {
    width: BUTTON_WIDTH,
    height: CONTROL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  valueText: {
    color: TOKENS.colors.rightText,
    fontSize: 28,
    fontWeight: '500',
    lineHeight: 28,
  },
  unitText: {
    position: 'absolute',
    top: 2,
    right: 14,
    color: TOKENS.colors.subtitleText,
    fontSize: 10,
    lineHeight: 12,
  },
  minusIcon: {
    width: 15,
    height: 2,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.rightText,
  },
  plusIconHorizontal: {
    position: 'absolute',
    width: 15,
    height: 2,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.rightText,
  },
  plusIconVertical: {
    position: 'absolute',
    width: 2,
    height: 15,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.rightText,
  },
});

export default RemoteControlStepper;
