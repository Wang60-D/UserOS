import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { TOKENS } from '../../tokens';

export interface ToggleButtonProps {
  title: string;
  subtitle: string;
  enabled: boolean;
  icon: ImageSourcePropType;
  onPress?: () => void;
  onTitlePress?: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  title,
  subtitle,
  enabled,
  icon,
  onPress,
  onTitlePress,
}) => {
  return (
    <Pressable
      style={[styles.container, enabled ? styles.enabled : styles.disabled]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: enabled }}
    >
      <View style={styles.content}>
        <Image
          source={icon}
          style={[styles.icon, enabled ? styles.iconEnabled : styles.iconDisabled]}
          resizeMode="contain"
        />
        <View style={styles.textGroup}>
          <Pressable
            style={styles.titleRow}
            onPress={enabled ? onTitlePress : undefined}
            disabled={!enabled}
            accessibilityRole="button"
          >
            <Text
              style={[styles.titleText, enabled ? styles.titleEnabled : styles.titleDisabled]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <View style={[styles.caret, enabled ? styles.caretEnabled : styles.caretDisabled]} />
          </Pressable>
          <Text
            style={[styles.subtitleText, enabled ? styles.subtitleEnabled : styles.subtitleDisabled]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 9,
  },
  enabled: {
    backgroundColor: 'rgba(128, 157, 228, 0.1)',
  },
  disabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  content: {
    alignItems: 'center',
    gap: 4,
    width: '100%',
  },
  icon: {
    width: 20,
    height: 20,
  },
  iconEnabled: {
    tintColor: TOKENS.colors.mainColor,
  },
  iconDisabled: {
    tintColor: '#000000',
  },
  textGroup: {
    alignItems: 'center',
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    width: '100%',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: TOKENS.fontSize.medium,
    fontWeight: '500',
    textAlign: 'center',
    flexShrink: 1,
    maxWidth: '100%',
  },
  titleEnabled: {
    color: TOKENS.colors.mainColor,
  },
  titleDisabled: {
    color: '#000000',
  },
  caret: {
    width: 0,
    height: 0,
    borderLeftWidth: 2.5,
    borderRightWidth: 2.5,
    borderTopWidth: 3,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: 1,
  },
  caretEnabled: {
    borderTopColor: TOKENS.colors.mainColor,
  },
  caretDisabled: {
    borderTopColor: '#000000',
  },
  subtitleText: {
    fontSize: TOKENS.fontSize.small,
    fontWeight: '500',
    textAlign: 'center',
  },
  subtitleEnabled: {
    color: TOKENS.colors.mainColor,
  },
  subtitleDisabled: {
    color: 'rgba(0, 0, 0, 0.25)',
  },
});

export default ToggleButton;
