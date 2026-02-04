import React from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { TOKENS } from '../../tokens';
import SquareButton from './SquareButton';

export interface SquareButtonGroupItem {
  label: string;
  iconSelected?: ImageSourcePropType;
  iconUnselected?: ImageSourcePropType;
  selected?: boolean;
}

export interface SquareButtonGroupProps {
  items: SquareButtonGroupItem[];
  onItemPress?: (index: number) => void;
}

const SquareButtonGroup: React.FC<SquareButtonGroupProps> = ({ items, onItemPress }) => {
  const columns = 4;
  const shouldWrap = items.length > columns;
  const slotCount = shouldWrap ? Math.ceil(items.length / columns) * columns : items.length;
  const slots = Array.from({ length: slotCount }, (_, index) => items[index] || null);
  const rows = shouldWrap
    ? Array.from({ length: Math.ceil(slots.length / columns) }, (_, rowIndex) =>
        slots.slice(rowIndex * columns, (rowIndex + 1) * columns)
      )
    : [];

  return (
    <View style={styles.groupContainer}>
      {shouldWrap
        ? rows.map((rowItems, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.rowContainer}>
              {rowItems.map((item, index) => {
                const isLast = index === rowItems.length - 1;
                return (
                  <View key={`slot-${rowIndex}-${index}`} style={[styles.slot, !isLast && styles.slotGap]}>
                    {item ? (
                      <SquareButton
                        label={item.label}
                        selected={item.selected}
                        iconSelected={item.iconSelected}
                        iconUnselected={item.iconUnselected}
                        onPress={onItemPress ? () => onItemPress(rowIndex * columns + index) : undefined}
                      />
                    ) : (
                      <View style={[styles.placeholder, styles.placeholderFill]} />
                    )}
                  </View>
                );
              })}
            </View>
          ))
        : (
            <View style={styles.rowContainer}>
              {slots.map((item, index) => {
                const isLast = index === slots.length - 1;
                return (
                  <View key={`slot-${index}`} style={[styles.slot, !isLast && styles.slotGap]}>
                    {item ? (
                      <SquareButton
                        label={item.label}
                        selected={item.selected}
                        iconSelected={item.iconSelected}
                        iconUnselected={item.iconUnselected}
                        onPress={onItemPress ? () => onItemPress(index) : undefined}
                      />
                    ) : (
                      <View style={[styles.placeholder, styles.placeholderFill]} />
                    )}
                  </View>
                );
              })}
            </View>
          )}
    </View>
  );
};

const styles = StyleSheet.create({
  groupContainer: {
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  slot: {
    flex: 1,
  },
  slotGap: {
    marginRight: 8,
  },
  placeholder: {
    opacity: 0,
  },
  placeholderFill: {
    height: 76,
    borderRadius: TOKENS.radius.card,
  },
});

export default SquareButtonGroup;
