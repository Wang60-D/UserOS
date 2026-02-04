import React from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import ToggleButton from './ToggleButton';

export interface ToggleButtonItem {
  id: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  icon: ImageSourcePropType;
}

interface ToggleButtonGroupProps {
  items: ToggleButtonItem[];
  onItemPress?: (id: string) => void;
  onItemTitlePress?: (id: string) => void;
}

const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  items,
  onItemPress,
  onItemTitlePress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        {items.map((item) => (
          <ToggleButton
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            enabled={item.enabled}
            icon={item.icon}
            onPress={() => onItemPress?.(item.id)}
            onTitlePress={() => onItemTitlePress?.(item.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default ToggleButtonGroup;
