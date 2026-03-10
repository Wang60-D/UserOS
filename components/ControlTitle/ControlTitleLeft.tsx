import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { TOKENS } from '../../tokens';
import { useControllableState } from '../../utils/stateflow/useControllableState';

type RightMode = 'device' | 'switch';

interface ControlTitleProps {
  titleText: string;
  subtitleText?: string;
  subtitleEnabled: boolean;
  rightEnabled?: boolean;
  rightMode?: RightMode;
  rightText?: string;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  defaultSwitchValue?: boolean;
}

const ControlTitle: React.FC<ControlTitleProps> = ({
  titleText,
  subtitleText,
  subtitleEnabled,
  rightEnabled = true,
  rightMode,
  rightText,
  switchValue,
  onSwitchChange,
  defaultSwitchValue = false,
}) => {
  const resolvedRightMode: RightMode = rightMode ?? 'device';
  const resolvedSubtitleText = subtitleText ?? '';
  const resolvedRightText = rightText ?? '';
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

  const handleToggle = () => {
    if (resolvedRightMode !== 'switch') return;
    setSwitchValue(!isOn);
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        <Text style={styles.titleText} numberOfLines={1}>
          {titleText}
        </Text>
        {subtitleEnabled && (
          <>
            <View style={styles.divider} />
            <Text style={styles.subTitleText} numberOfLines={1}>
              {resolvedSubtitleText}
            </Text>
          </>
        )}
      </View>
      {rightEnabled &&
        (resolvedRightMode === 'device' ? (
          <View style={styles.rightPill}>
            <Text style={styles.rightText} numberOfLines={1}>
              {resolvedRightText}
            </Text>
          </View>
        ) : (
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: isOn }}
            onPress={handleToggle}
            style={styles.switchHit}
          >
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
          </Pressable>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: TOKENS.sizes.controlTitleHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TOKENS.spacing.titleGap,
    flex: 1,
    marginRight: TOKENS.spacing.leftGroupMarginRight,
  },
  titleText: {
    fontSize: TOKENS.fontSize.large,
    color: TOKENS.colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: TOKENS.colors.divider,
  },
  subTitleText: {
    fontSize: TOKENS.fontSize.large,
    color: TOKENS.colors.subtitleText,
    fontWeight: '300',
  },
  rightPill: {
    backgroundColor: TOKENS.colors.rightPillBg,
    paddingHorizontal: TOKENS.spacing.rightPillPaddingH,
    paddingVertical: TOKENS.spacing.rightPillPaddingV,
    borderRadius: TOKENS.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightText: {
    fontSize: TOKENS.fontSize.small,
    color: TOKENS.colors.rightText,
    fontWeight: '400',
  },
  switchHit: {
    padding: 0,
  },
  switchTrack: {
    width: 50,
    height: TOKENS.sizes.controlTitleHeight,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.switchOff,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: TOKENS.radius.pill,
    backgroundColor: TOKENS.colors.switchThumb,
  },
});

export default ControlTitle;
