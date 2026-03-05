import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  enableContinuousPress?: boolean;
}

const CONTROL_HEIGHT = 36;
const BUTTON_WIDTH = 103;
const BUTTON_GAP = 12;
const OUTER_RADIUS = 60;
const CONTINUOUS_STEP_INTERVAL_MS = 120;

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
  enableContinuousPress = false,
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
  const currentValueRef = useRef(currentValue);
  const continuousTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const longPressTriggeredRef = useRef(false);

  useEffect(() => {
    currentValueRef.current = currentValue;
  }, [currentValue]);

  const valueText = useMemo(() => {
    if (Number.isInteger(currentValue)) return String(currentValue);
    return String(Number(currentValue.toFixed(2)));
  }, [currentValue]);

  const commitValue = (nextValue: number) => {
    const snapped = clamp(snapToStep(nextValue, rangeStart, resolvedStep), rangeStart, rangeEnd);
    currentValueRef.current = snapped;
    if (!isControlled) {
      setInternalValue(snapped);
    }
    onChange?.(snapped);
  };

  const stopContinuousAdjust = () => {
    if (continuousTimerRef.current) {
      clearInterval(continuousTimerRef.current);
      continuousTimerRef.current = null;
    }
  };

  useEffect(
    () => () => {
      if (continuousTimerRef.current) {
        clearInterval(continuousTimerRef.current);
        continuousTimerRef.current = null;
      }
    },
    []
  );

  const stepBy = (delta: number) => {
    const previous = currentValueRef.current;
    const next = clamp(
      snapToStep(previous + delta, rangeStart, resolvedStep),
      rangeStart,
      rangeEnd
    );

    if (Math.abs(next - previous) < 1e-6) {
      stopContinuousAdjust();
      return;
    }
    commitValue(next);
  };

  const handleDecrease = () => {
    if (!canDecrease) return;
    stepBy(-resolvedStep);
  };

  const handleIncrease = () => {
    if (!canIncrease) return;
    stepBy(resolvedStep);
  };

  const startContinuousAdjust = (delta: number) => {
    if (!enableContinuousPress) return;
    longPressTriggeredRef.current = true;
    stopContinuousAdjust();
    stepBy(delta);
    continuousTimerRef.current = setInterval(() => {
      stepBy(delta);
    }, CONTINUOUS_STEP_INTERVAL_MS);
  };

  const handlePressOut = () => {
    stopContinuousAdjust();
  };

  const handleDecreasePress = () => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    handleDecrease();
  };

  const handleIncreasePress = () => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    handleIncrease();
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.sideButton, !canDecrease && styles.disabledButton]}
        onPress={handleDecreasePress}
        onLongPress={() => startContinuousAdjust(-resolvedStep)}
        onPressOut={handlePressOut}
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
        onPress={handleIncreasePress}
        onLongPress={() => startContinuousAdjust(resolvedStep)}
        onPressOut={handlePressOut}
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
