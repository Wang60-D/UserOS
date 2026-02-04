import React from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { TOKENS } from '../../tokens';
import CircleButton from './CircleButton';

export interface CircleButtonGroupItem {
  label: string;
  iconEmoji?: string;
  iconSelected?: ImageSourcePropType;
  iconUnselected?: ImageSourcePropType;
  selected?: boolean;
}

export interface CircleButtonGroupProps {
  items: CircleButtonGroupItem[];
  showLabel?: boolean;
  itemCount?: number;
  onItemPress?: (index: number) => void;
}

const CircleButtonGroup: React.FC<CircleButtonGroupProps> = ({
  items,
  showLabel = true,
  itemCount,
  onItemPress,
}) => {
  const visibleItems = itemCount ? items.slice(0, itemCount) : items;
  const columns = 4;
  const shouldWrap = visibleItems.length > columns;
  const slotCount = shouldWrap
    ? Math.ceil(visibleItems.length / columns) * columns
    : visibleItems.length;
  const slots = Array.from(
    { length: slotCount },
    (_, index) => visibleItems[index] || null
  );
  const rows = shouldWrap
    ? Array.from({ length: Math.ceil(slots.length / columns) }, (_, rowIndex) =>
        slots.slice(rowIndex * columns, (rowIndex + 1) * columns)
      )
    : [];

  return (
    <View
      style={[
        styles.groupContainer,
        shouldWrap ? styles.groupWrap : styles.groupRow,
      ]}
    >
      {shouldWrap
        ? rows.map((rowItems, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.rowContainer}>
              {rowItems.map((item, index) => (
                <View key={`slot-${rowIndex}-${index}`} style={styles.slotRow}>
                  {item ? (
                    <CircleButton
                      label={item.label}
                      showLabel={showLabel}
                      selected={item.selected}
                      iconEmoji={item.iconEmoji}
                      iconSelected={item.iconSelected}
                      iconUnselected={item.iconUnselected}
                      onPress={
                        onItemPress
                          ? () => onItemPress(rowIndex * columns + index)
                          : undefined
                      }
                    />
                  ) : (
                    <View style={styles.placeholder} />
                  )}
                </View>
              ))}
            </View>
          ))
        : slots.map((item, index) => (
            <View key={`slot-${index}`} style={styles.slotRow}>
              {item ? (
                <CircleButton
                  label={item.label}
                  showLabel={showLabel}
                  selected={item.selected}
                  iconEmoji={item.iconEmoji}
                  iconSelected={item.iconSelected}
                  iconUnselected={item.iconUnselected}
                  onPress={onItemPress ? () => onItemPress(index) : undefined}
                />
              ) : (
                <View style={styles.placeholder} />
              )}
            </View>
          ))}
    </View>
  );
};

const styles = StyleSheet.create({
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupRow: {
    justifyContent: 'space-between',
  },
  groupWrap: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    rowGap: TOKENS.spacing.cardInnerPaddingV,
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slotRow: {
    width: TOKENS.sizes.circleButtonItemWidth,
    alignItems: 'center',
  },
  placeholder: {
    width: TOKENS.sizes.circleButtonItemWidth,
    height: TOKENS.sizes.circleButtonItemHeight,
    opacity: 0,
  },
});

export default CircleButtonGroup;
