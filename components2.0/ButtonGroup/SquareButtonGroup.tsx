import React from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { COMPONENT_TOKENS } from '../../tokens';
import SquareButton from './SquareButton';

export interface SquareButtonGroupItem {
  label: string;
  icon?: ImageSourcePropType;
  iconSelected?: ImageSourcePropType;
  iconUnselected?: ImageSourcePropType;
  iconSelectedTintColor?: string;
  iconUnselectedTintColor?: string;
  labelSelectedColor?: string;
  labelUnselectedColor?: string;
  selectedColor?: string;
  selected?: boolean;
  disabled?: boolean;
}

export interface SquareButtonGroupProps {
  items: SquareButtonGroupItem[];
  isCompact?: boolean;
  selectedColor?: string;
  onItemPress?: (index: number) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const SquareButtonGroup: React.FC<SquareButtonGroupProps> = ({
  items,
  isCompact = false,
  selectedColor = COMPONENT_TOKENS.squareButton.selectedColorDefault,
  onItemPress,
}) => {
  const token = COMPONENT_TOKENS.squareButton;
  const visibleCount = clamp(items.length, token.minCount, token.maxCount);
  const visibleItems = items.slice(0, visibleCount);
  const isTwoRows = visibleItems.length > token.maxColumns;
  const firstRowItems = isTwoRows ? visibleItems.slice(0, token.maxColumns) : visibleItems;
  const secondRowItems = isTwoRows ? visibleItems.slice(token.maxColumns) : [];
  const groupContainerStyle = isCompact ? styles.compactContainer : null;

  return (
    <View style={[styles.container, groupContainerStyle]}>
      <View style={styles.grid}>
        <View style={[styles.row, isTwoRows ? styles.rowFirst : null]}>
          {firstRowItems.map((item, index) => (
            <View
              key={`square-button-row1-${index}`}
              style={[styles.cell, isTwoRows ? styles.cellFourColumns : styles.cellFlexible]}
            >
              <SquareButton
                label={item.label}
                icon={item.icon}
                iconSelected={item.iconSelected}
                iconUnselected={item.iconUnselected}
                iconSelectedTintColor={item.iconSelectedTintColor}
                iconUnselectedTintColor={item.iconUnselectedTintColor}
                labelSelectedColor={item.labelSelectedColor}
                labelUnselectedColor={item.labelUnselectedColor}
                selected={item.selected}
                disabled={item.disabled}
                isCompact={isCompact}
                selectedColor={item.selectedColor || selectedColor}
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
                <View key={`square-button-row2-${itemIndex}`} style={[styles.cell, styles.cellFourColumns]}>
                  <SquareButton
                    label={item.label}
                    icon={item.icon}
                    iconSelected={item.iconSelected}
                    iconUnselected={item.iconUnselected}
                    iconSelectedTintColor={item.iconSelectedTintColor}
                    iconUnselectedTintColor={item.iconUnselectedTintColor}
                    labelSelectedColor={item.labelSelectedColor}
                    labelUnselectedColor={item.labelUnselectedColor}
                    selected={item.selected}
                    disabled={item.disabled}
                    isCompact={isCompact}
                    selectedColor={item.selectedColor || selectedColor}
                    onPress={onItemPress ? () => onItemPress(itemIndex) : undefined}
                  />
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  compactContainer: {
    borderRadius: COMPONENT_TOKENS.squareButton.compactTrackRadius,
    backgroundColor: COMPONENT_TOKENS.squareButton.compactTrackBackgroundColor,
    padding: COMPONENT_TOKENS.squareButton.compactTrackPadding,
  },
  grid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rowFirst: {
    paddingBottom: COMPONENT_TOKENS.squareButton.rowSplitPadding,
  },
  rowSecond: {
    paddingTop: COMPONENT_TOKENS.squareButton.rowSplitPadding,
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

export default SquareButtonGroup;
