import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { TOKENS } from '../../tokens';

type RightMode = 'device' | 'switch';

interface ControlTitleProps {
  titleText: string;
  subtitleText: string;
  subtitleEnabled: boolean;
  rightMode: RightMode;
  rightText: string;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

const ControlTitle: React.FC<ControlTitleProps> = ({
  titleText,
  subtitleText,
  subtitleEnabled,
  rightMode,
  rightText,
  switchValue,
  onSwitchChange,
}) => {
  const isControlled = typeof switchValue === 'boolean';
  const [internalValue, setInternalValue] = useState(false);
  const isOn = isControlled ? (switchValue as boolean) : internalValue;
  const animatedValue = useRef(new Animated.Value(isOn ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, isOn]);

  const handleToggle = () => {
    if (rightMode !== 'switch') return;
    const nextValue = !isOn;
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    if (onSwitchChange) {
      onSwitchChange(nextValue);
    }
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
              {subtitleText}
            </Text>
          </>
        )}
      </View>
      {rightMode === 'device' ? (
        <View style={styles.rightPill}>
          <Text style={styles.rightText} numberOfLines={1}>
            {rightText}
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
      )}
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
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  titleText: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  subTitleText: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '400',
  },
  rightPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 5.5,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightText: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.8)',
    fontWeight: '400',
  },
  switchHit: {
    padding: 0,
  },
  switchTrack: {
    width: 50,
    height: TOKENS.sizes.controlTitleHeight,
    borderRadius: 999,
    backgroundColor: TOKENS.colors.switchOff,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
});

export default ControlTitle;
