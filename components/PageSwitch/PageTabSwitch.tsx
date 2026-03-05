import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface PageTabSwitchProps {
  activeIndex: number;
  onChange: (nextIndex: number) => void;
  labels?: string[];
  count?: number;
}

const DEFAULT_LABELS = ['1', '2'];

const PageTabSwitch: React.FC<PageTabSwitchProps> = ({
  activeIndex,
  onChange,
  labels,
  count,
}) => {
  const resolvedLabels = useMemo(() => {
    if (labels && labels.length > 0) return labels;
    const safeCount = Math.max(1, count ?? DEFAULT_LABELS.length);
    return Array.from({ length: safeCount }, (_, index) => String(index + 1));
  }, [count, labels]);

  return (
    <View style={styles.container}>
      {resolvedLabels.map((label, index) => {
        const selected = index === activeIndex;
        return (
          <Pressable
            key={`${label}-${index}`}
            style={[styles.button, selected && styles.buttonSelected]}
            onPress={() => onChange(index)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.buttonText, selected && styles.buttonTextSelected]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    columnGap: 18,
  },
  button: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSelected: {
    borderColor: '#0A6EFF',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 21,
    lineHeight: 31.5,
    color: '#666666',
    fontWeight: '400',
    letterSpacing: -0.462,
  },
  buttonTextSelected: {
    color: '#666666',
  },
});

export default PageTabSwitch;
