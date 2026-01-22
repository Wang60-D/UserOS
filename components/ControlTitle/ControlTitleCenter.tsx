import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TOKENS } from '../../tokens';

interface ControlTitleCenterProps {
  titleText: string;
  subtitleText: string;
  subtitleEnabled: boolean;
}

const ControlTitleCenter: React.FC<ControlTitleCenterProps> = ({
  titleText,
  subtitleText,
  subtitleEnabled,
}) => {
  const containerHeight = subtitleEnabled
    ? TOKENS.sizes.controlTitleCenterHeightWithSubtitle
    : TOKENS.sizes.controlTitleCenterHeight;

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      <Text style={styles.titleText} numberOfLines={1}>
        {titleText}
      </Text>
      {subtitleEnabled && (
        <Text style={styles.subTitleText} numberOfLines={1}>
          {subtitleText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: undefined,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: TOKENS.fontSize.large,
    color: TOKENS.colors.textPrimary,
    fontWeight: '500',
    textAlign: 'center',
  },
  subTitleText: {
    marginTop: 4,
    fontSize: TOKENS.fontSize.large,
    color: TOKENS.colors.subtitleText,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default ControlTitleCenter;
