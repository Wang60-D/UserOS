import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { TOKENS } from '../../tokens';
import { traceStateFlow } from '../../utils/stateflow/traceStateFlow';
import { useControllableState } from '../../utils/stateflow/useControllableState';

type IconTone = 'neutral' | 'accent';
type RightMode = 'icon' | 'switch';

export interface SwitchRowProps {
  titleText: string;
  subtitleText?: string;
  subtitleEnabled?: boolean;
  leftIconEnabled?: boolean;
  leftIconSource?: ImageSourcePropType;
  leftIconSize?: number;
  rightMode: RightMode;
  rightIconSource?: ImageSourcePropType;
  rightIconTone?: IconTone;
  rightButtonOn?: boolean;
  defaultRightButtonOn?: boolean;
  onRightButtonChange?: (value: boolean) => void;
  switchValue?: boolean;
  defaultSwitchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  rowHeight?: number;
  containerBgColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  debugEnabled?: boolean;
  debugId?: string;
}

// 参数集中定义，便于按设计稿统一调整
const UI_PARAMS = {
  containerRadius: 16,
  containerPaddingHorizontal: 12,
  titleFontSize: TOKENS.fontSize.large,
  leftIconSize: TOKENS.sizes.circleButtonIconSize,
  iconSize: TOKENS.sizes.circleButtonIconSize,
  iconButtonSize: TOKENS.sizes.circleButtonSize,
  switchTrackWidth: TOKENS.sizes.switchTrackWidth,
  switchTrackHeight: TOKENS.sizes.controlTitleHeight,
  switchThumbSize: TOKENS.sizes.switchThumbSize,
  switchTrackPaddingHorizontal: TOKENS.spacing.switchTrackPaddingH,
  inlineGap: 8,
} as const;

const SwitchRow: React.FC<SwitchRowProps> = ({
  titleText,
  subtitleText = '',
  subtitleEnabled = false,
  leftIconEnabled = false,
  leftIconSource,
  leftIconSize = UI_PARAMS.leftIconSize,
  rightMode,
  rightIconSource,
  rightIconTone = 'neutral',
  rightButtonOn,
  defaultRightButtonOn = false,
  onRightButtonChange,
  switchValue,
  defaultSwitchValue = false,
  onSwitchChange,
  rowHeight,
  containerBgColor = TOKENS.colors.cardBg,
  onPress,
  disabled = false,
  debugEnabled = false,
  debugId = 'switch-row',
}) => {
  const { value: isRightButtonActive, setValue: setRightButtonActive } =
    useControllableState<boolean>({
      value: rightButtonOn,
      defaultValue: defaultRightButtonOn,
      onChange: onRightButtonChange,
    });

  const { value: isOn, setValue: setSwitchValue } = useControllableState<boolean>({
    value: switchValue,
    defaultValue: defaultSwitchValue,
    onChange: onSwitchChange,
  });
  const animatedValue = useRef(new Animated.Value(isOn ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: TOKENS.motion.normal,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, isOn]);

  const switchTrackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [TOKENS.colors.switchOff, TOKENS.colors.mainColor],
  });

  const switchThumbTranslateX = useMemo(
    () =>
      animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 22],
      }),
    [animatedValue]
  );

  const handlePress = () => {
    if (disabled) return;
    traceStateFlow({ enabled: debugEnabled, id: debugId }, 'press', {
      rightMode,
      isOn,
      isRightButtonActive,
    });
    if (rightMode === 'switch') {
      setSwitchValue(!isOn);
    } else {
      const nextValue = !isRightButtonActive;
      setRightButtonActive(nextValue);
      onPress?.();
      return;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: containerBgColor, height: rowHeight },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole={rightMode === 'switch' ? 'switch' : 'button'}
      accessibilityState={rightMode === 'switch' ? { checked: isOn, disabled } : { disabled }}
    >
      <View style={styles.leftArea}>
        {leftIconEnabled && leftIconSource ? (
          <View style={[styles.leftIconSlot, { width: leftIconSize, height: leftIconSize }]}>
            <Image
              source={leftIconSource}
              style={[styles.leftIcon, { width: leftIconSize, height: leftIconSize }]}
              resizeMode="contain"
            />
          </View>
        ) : null}
        <View style={styles.textGroup}>
          <Text style={styles.titleText} numberOfLines={1}>
            {titleText}
          </Text>
          {subtitleEnabled ? (
            <Text style={styles.subtitleText} numberOfLines={1}>
              {subtitleText}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightArea}>
        {rightMode === 'switch' ? (
          <Animated.View style={[styles.switchTrack, { backgroundColor: switchTrackColor }]}>
            <Animated.View
              style={[
                styles.switchThumb,
                {
                  transform: [{ translateX: switchThumbTranslateX }],
                },
              ]}
            />
          </Animated.View>
        ) : rightIconSource ? (
          <View
            style={[
              styles.iconButton,
              styles.iconButtonOff,
              isRightButtonActive &&
                (rightIconTone === 'accent' ? styles.iconButtonAccent : styles.iconButtonNeutral),
            ]}
          >
            <Image
              source={rightIconSource}
              style={[styles.icon, isRightButtonActive ? styles.iconOn : styles.iconOff]}
              resizeMode="contain"
            />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: UI_PARAMS.containerRadius,
    backgroundColor: TOKENS.colors.cardBg,
    paddingHorizontal: UI_PARAMS.containerPaddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.86,
  },
  disabled: {
    opacity: 0.5,
  },
  leftArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_PARAMS.inlineGap,
    marginRight: UI_PARAMS.inlineGap,
  },
  rightArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_PARAMS.inlineGap,
  },
  titleText: {
    fontSize: UI_PARAMS.titleFontSize,
    color: TOKENS.colors.textPrimary,
    fontWeight: '500',
  },
  textGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitleText: {
    fontSize: TOKENS.fontSize.small,
    color: TOKENS.colors.subtitleText,
    fontWeight: '400',
    marginTop: 2,
  },
  leftIconSlot: {
    width: UI_PARAMS.leftIconSize,
    height: UI_PARAMS.leftIconSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    width: UI_PARAMS.leftIconSize,
    height: UI_PARAMS.leftIconSize,
  },
  iconButton: {
    width: UI_PARAMS.iconButtonSize,
    height: UI_PARAMS.iconButtonSize,
    borderRadius: TOKENS.radius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonNeutral: {
    backgroundColor: TOKENS.colors.mainColor,
  },
  iconButtonAccent: {
    backgroundColor: TOKENS.colors.mainColor,
  },
  iconButtonOff: {
    backgroundColor: TOKENS.colors.circleUnselectedBg,
  },
  icon: {
    width: UI_PARAMS.iconSize,
    height: UI_PARAMS.iconSize,
  },
  iconOn: {
    tintColor: '#FFFFFF',
  },
  iconOff: {
    tintColor: TOKENS.colors.textPrimary,
  },
  switchTrack: {
    width: UI_PARAMS.switchTrackWidth,
    height: UI_PARAMS.switchTrackHeight,
    borderRadius: TOKENS.radius.pill,
    justifyContent: 'center',
    paddingHorizontal: UI_PARAMS.switchTrackPaddingHorizontal,
  },
  switchThumb: {
    width: UI_PARAMS.switchThumbSize,
    height: UI_PARAMS.switchThumbSize,
    borderRadius: TOKENS.radius.circle,
    backgroundColor: TOKENS.colors.switchThumb,
  },
});

export default SwitchRow;
