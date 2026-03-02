import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { TOKENS } from '../../tokens';

export interface SegmentedSquareSliderItem {
  label: string;
  iconSelected?: ImageSourcePropType;
  iconUnselected?: ImageSourcePropType;
  iconSelectedTintColor?: string;
  iconUnselectedTintColor?: string;
  selected?: boolean;
}

export interface SegmentedSquareSliderProps {
  items: SegmentedSquareSliderItem[];
  onItemPress?: (index: number) => void;
}

const OUTER_HEIGHT = 76;
const TRACK_PADDING = 4;

const SegmentedSquareSlider: React.FC<SegmentedSquareSliderProps> = ({ items, onItemPress }) => {
  return (
    <View style={styles.track}>
      <View style={styles.row}>
        {items.map((item, index) => {
          const iconSource = item.selected ? item.iconSelected : item.iconUnselected;
          const iconTintColor = item.selected
            ? item.iconSelectedTintColor
            : item.iconUnselectedTintColor;
          return (
            <Pressable
              key={`segment-${item.label}-${index}`}
              style={[styles.segment, item.selected && styles.segmentSelected]}
              onPress={onItemPress ? () => onItemPress(index) : undefined}
              accessibilityRole="button"
              accessibilityState={{ selected: !!item.selected }}
            >
              <View style={styles.iconWrapper}>
                {iconSource ? (
                  <Image
                    source={iconSource}
                    style={[styles.icon, iconTintColor ? { tintColor: iconTintColor } : null]}
                  />
                ) : null}
              </View>
              <Text style={[styles.label, item.selected ? styles.labelSelected : styles.labelUnselected]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: OUTER_HEIGHT,
    borderRadius: TOKENS.radius.card,
    backgroundColor: TOKENS.colors.rightPillBg,
    paddingHorizontal: TRACK_PADDING,
    paddingVertical: TRACK_PADDING,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: TOKENS.radius.card - TRACK_PADDING,
  },
  segmentSelected: {
    backgroundColor: TOKENS.colors.mainColor,
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

export default SegmentedSquareSlider;
