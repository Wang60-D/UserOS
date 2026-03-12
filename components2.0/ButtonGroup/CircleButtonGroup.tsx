import React from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { COMPONENT_TOKENS } from '../../tokens';
import CircleButton from './CircleButton';

export interface CircleButtonGroupItem {
  label: string;
  icon: ImageSourcePropType;
  selected?: boolean;
  disabled?: boolean;
}

export interface CircleButtonGroupProps {
  items: CircleButtonGroupItem[];
  showLabel?: boolean;
  iconSize?: number;
  onItemPress?: (index: number) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const CircleButtonGroup: React.FC<CircleButtonGroupProps> = ({
  items,
  showLabel = true,
  iconSize,
  onItemPress,
}) => {
  const token = COMPONENT_TOKENS.circleButton;
  const visibleCount = clamp(
    items.length,
    token.minCount,
    token.maxCount
  );
  const visibleItems = items.slice(0, visibleCount);
  const isTwoRows = visibleItems.length > token.maxColumns;
  const firstRowItems = isTwoRows ? visibleItems.slice(0, token.maxColumns) : visibleItems;
  const secondRowItems = isTwoRows ? visibleItems.slice(token.maxColumns) : [];

  return (
    <View style={styles.grid}>
      <View style={[styles.row, isTwoRows ? styles.rowFirst : null]}>
        {firstRowItems.map((item, index) => (
          <View
            key={`circle-button-row1-${index}`}
            style={[styles.cell, isTwoRows ? styles.cellFourColumns : styles.cellFlexible]}
          >
            <CircleButton
              label={item.label}
              icon={item.icon}
              iconSize={iconSize}
              selected={item.selected}
              disabled={item.disabled}
              showLabel={showLabel}
              onPress={onItemPress ? () => onItemPress(index) : undefined}
            />
          </View>
        ))}
      </View>
      {isTwoRows ? (
        <View style={[styles.row, styles.rowSecond]}>
          {secondRowItems.map((item, index) => {
            const itemIndex = token.maxColumns + index;
            return (
              <View key={`circle-button-row2-${itemIndex}`} style={[styles.cell, styles.cellFourColumns]}>
                <CircleButton
                  label={item.label}
                  icon={item.icon}
                  iconSize={iconSize}
                  selected={item.selected}
                  disabled={item.disabled}
                  showLabel={showLabel}
                  onPress={onItemPress ? () => onItemPress(itemIndex) : undefined}
                />
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rowFirst: {
    paddingBottom: COMPONENT_TOKENS.circleButton.rowSplitPadding,
  },
  rowSecond: {
    paddingTop: COMPONENT_TOKENS.circleButton.rowSplitPadding,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cellFlexible: {
    flex: 1,
  },
  cellFourColumns: {
    width: '25%',
  },
});

export default CircleButtonGroup;
