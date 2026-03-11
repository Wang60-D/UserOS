import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { COMPONENT_TOKENS, CORE_TOKENS } from '../../tokens';
import { traceStateFlow } from '../../utils/stateflow/traceStateFlow';
import { useControllableState } from '../../utils/stateflow/useControllableState';

type RightMode = 'button' | 'switch';
type TitleRightIconType = 'switch' | 'arrow';

export interface SwitchRow2Props {
  titleText: string;
  subtitleText?: string;
  subtitleEnabled?: boolean;
  titleRightArrowEnabled?: boolean;
  titleRightIconType?: TitleRightIconType;
  leftIconEnabled?: boolean;
  leftIconSource?: ImageSourcePropType;
  rightMode: RightMode;
  rightButtonIconSource?: ImageSourcePropType;
  rightButtonOn?: boolean;
  defaultRightButtonOn?: boolean;
  onRightButtonChange?: (value: boolean) => void;
  onRightButtonChangeEnd?: (value: boolean) => void;
  switchValue?: boolean;
  defaultSwitchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onSwitchChangeEnd?: (value: boolean) => void;
  onPress?: () => void;
  disabled?: boolean;
  debugEnabled?: boolean;
  debugId?: string;
}

const SwitchRow: React.FC<SwitchRow2Props> = ({
  titleText,
  subtitleText = '',
  subtitleEnabled = false,
  titleRightArrowEnabled = false,
  titleRightIconType = 'arrow',
  leftIconEnabled = false,
  leftIconSource,
  rightMode,
  rightButtonIconSource,
  rightButtonOn,
  defaultRightButtonOn = false,
  onRightButtonChange,
  onRightButtonChangeEnd,
  switchValue,
  defaultSwitchValue = false,
  onSwitchChange,
  onSwitchChangeEnd,
  onPress,
  disabled = false,
  debugEnabled = false,
  debugId = 'switch-row-2',
}) => {
  const token = COMPONENT_TOKENS.switchRow;
  const { value: isRightButtonOn, setValue: setRightButtonOn } = useControllableState<boolean>({
    value: rightButtonOn,
    defaultValue: defaultRightButtonOn,
    onChange: onRightButtonChange,
  });
  const { value: isSwitchOn, setValue: setSwitchValue } = useControllableState<boolean>({
    value: switchValue,
    defaultValue: defaultSwitchValue,
    onChange: onSwitchChange,
  });
  const switchAnimatedValue = useRef(new Animated.Value(isSwitchOn ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(switchAnimatedValue, {
      toValue: isSwitchOn ? 1 : 0,
      duration: CORE_TOKENS.motion.normal,
      useNativeDriver: false,
    }).start();
  }, [isSwitchOn, switchAnimatedValue]);

  const switchThumbTranslateMax =
    token.switchTrackWidth - token.switchTrackPaddingHorizontal * 2 - token.switchThumbSize;
  const switchTrackColor = switchAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [token.switchTrackOffBackgroundColor, token.switchTrackOnBackgroundColor],
  });
  const switchThumbTranslateX = useMemo(
    () =>
      switchAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, switchThumbTranslateMax],
      }),
    [switchAnimatedValue, switchThumbTranslateMax]
  );

  const toggleButton = () => {
    const nextValue = !isRightButtonOn;
    setRightButtonOn(nextValue);
    onRightButtonChangeEnd?.(nextValue);
  };

  const toggleSwitch = () => {
    const nextValue = !isSwitchOn;
    setSwitchValue(nextValue);
    onSwitchChangeEnd?.(nextValue);
  };

  const handlePress = () => {
    if (disabled) return;
    traceStateFlow({ enabled: debugEnabled, id: debugId }, 'press', {
      rightMode,
      isRightButtonOn,
      isSwitchOn,
    });
    if (rightMode === 'button') {
      toggleButton();
    } else {
      toggleSwitch();
    }
    onPress?.();
  };

  const shouldShowTitleRightIcon = titleRightArrowEnabled;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole={rightMode === 'switch' ? 'switch' : 'button'}
      accessibilityState={rightMode === 'switch' ? { checked: isSwitchOn, disabled } : { disabled }}
    >
      <View style={styles.leftArea}>
        {leftIconEnabled && leftIconSource ? (
          <View style={styles.leftIconContainer}>
            <Image source={leftIconSource} style={styles.leftIcon} resizeMode="contain" />
          </View>
        ) : null}
        <View style={styles.textGroup}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText} numberOfLines={1}>
              {titleText}
            </Text>
            {shouldShowTitleRightIcon ? (
              <View style={styles.titleRightIconContainer}>
                {titleRightIconType === 'switch' ? (
                  <View style={styles.switchIconContainer}>
                    <View style={[styles.switchIconLine, styles.switchTopLeft]} />
                    <View style={[styles.switchIconLine, styles.switchTopRight]} />
                    <View style={[styles.switchIconLine, styles.switchBottomLeft]} />
                    <View style={[styles.switchIconLine, styles.switchBottomRight]} />
                  </View>
                ) : (
                  <View style={styles.arrowIconContainer}>
                    <View style={[styles.arrowIconLine, styles.arrowTopLine]} />
                    <View style={[styles.arrowIconLine, styles.arrowBottomLine]} />
                  </View>
                )}
              </View>
            ) : null}
          </View>
          {subtitleEnabled ? (
            <Text style={styles.subtitleText} numberOfLines={1}>
              {subtitleText}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.rightArea}>
        {rightMode === 'switch' ? (
          <View style={styles.switchContainer}>
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
          </View>
        ) : rightButtonIconSource ? (
          <View style={[styles.buttonIconContainer, isRightButtonOn ? styles.buttonIconOn : styles.buttonIconOff]}>
            <Image
              source={rightButtonIconSource}
              style={[styles.buttonIcon, isRightButtonOn ? styles.buttonIconImageOn : styles.buttonIconImageOff]}
              resizeMode="contain"
            />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

const token = COMPONENT_TOKENS.switchRow;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: token.containerRadius,
    backgroundColor: CORE_TOKENS.color.surfaceCard,
    paddingHorizontal: token.containerPaddingHorizontal,
    paddingVertical: token.containerPaddingVertical,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: token.contentGap,
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
    gap: token.contentGap,
  },
  leftIconContainer: {
    width: token.leftIconContainerSize,
    height: token.leftIconContainerSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    width: token.leftIconSize,
    height: token.leftIconSize,
  },
  textGroup: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: CORE_TOKENS.spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: token.titleRightIconGap,
  },
  titleText: {
    flexShrink: 1,
    fontSize: token.titleFontSize,
    color: token.titleColor,
    fontWeight: token.titleFontWeight,
  },
  titleRightIconContainer: {
    width: token.titleRightIconSize,
    height: token.titleRightIconSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIconContainer: {
    width: token.titleRightIconSize,
    height: token.titleRightIconSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIconLine: {
    position: 'absolute',
    width: 7,
    height: token.titleRightIconStrokeWidth,
    borderRadius: token.titleRightIconStrokeWidth / 2,
    backgroundColor: token.titleRightIconColor,
  },
  arrowTopLine: {
    transform: [{ rotate: '45deg' }, { translateX: 1 }, { translateY: -2 }],
  },
  arrowBottomLine: {
    transform: [{ rotate: '-45deg' }, { translateX: 1 }, { translateY: 2 }],
  },
  switchIconContainer: {
    width: token.titleRightIconSize,
    height: token.titleRightIconSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchIconLine: {
    position: 'absolute',
    width: 5,
    height: token.titleRightIconStrokeWidth,
    borderRadius: token.titleRightIconStrokeWidth / 2,
    backgroundColor: token.titleRightIconColor,
  },
  switchTopLeft: {
    transform: [{ rotate: '35deg' }, { translateX: -2.6 }, { translateY: -3.6 }],
  },
  switchTopRight: {
    transform: [{ rotate: '-35deg' }, { translateX: 2.6 }, { translateY: -3.6 }],
  },
  switchBottomLeft: {
    transform: [{ rotate: '-35deg' }, { translateX: -2.6 }, { translateY: 3.6 }],
  },
  switchBottomRight: {
    transform: [{ rotate: '35deg' }, { translateX: 2.6 }, { translateY: 3.6 }],
  },
  subtitleText: {
    fontSize: token.subtitleFontSize,
    color: token.subtitleColor,
    fontWeight: token.subtitleFontWeight,
  },
  rightArea: {
    minWidth: token.switchTrackWidth,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonIconContainer: {
    width: token.rightButtonSize,
    height: token.rightButtonSize,
    borderRadius: token.rightButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIconOn: {
    backgroundColor: token.rightButtonOnBackgroundColor,
  },
  buttonIconOff: {
    backgroundColor: token.rightButtonOffBackgroundColor,
  },
  buttonIcon: {
    width: token.rightButtonIconSize,
    height: token.rightButtonIconSize,
  },
  buttonIconImageOn: {
    tintColor: token.rightButtonIconOnColor,
  },
  buttonIconImageOff: {
    tintColor: token.rightButtonIconOffColor,
  },
  switchTrack: {
    width: token.switchTrackWidth,
    height: token.switchTrackInnerHeight,
    borderRadius: token.switchTrackRadius,
    justifyContent: 'center',
    paddingHorizontal: token.switchTrackPaddingHorizontal,
  },
  switchContainer: {
    width: token.switchTrackWidth,
    height: token.switchTrackHeight,
    justifyContent: 'center',
  },
  switchThumb: {
    width: token.switchThumbSize,
    height: token.switchThumbSize,
    borderRadius: token.switchThumbRadius,
    backgroundColor: token.switchThumbColor,
  },
});

export default SwitchRow;
