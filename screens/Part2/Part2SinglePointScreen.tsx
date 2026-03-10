import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TOKENS } from '../../tokens';
import { PART2_SINGLE_POINT_ITEMS } from './part2CatalogData';

const Part2SinglePointScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + TOKENS.spacing.pagePaddingV },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>
          Single-point Indicator / Cumulative Fill / Track Colorization
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sectionRowScroll}
          contentContainerStyle={styles.sectionRow}
        >
          {PART2_SINGLE_POINT_ITEMS.map((label) => (
            <TouchableOpacity
              key={label}
              style={styles.chipButton}
              onPress={() => {}}
              activeOpacity={0.75}
            >
              <Text style={styles.chipText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.colors.pageBg,
  },
  contentContainer: {
    paddingHorizontal: TOKENS.spacing.pagePaddingH,
    paddingBottom: TOKENS.spacing.pagePaddingV,
  },
  sectionTitle: {
    fontSize: 44 / 2,
    fontWeight: '700',
    color: TOKENS.colors.textPrimary,
    marginBottom: 12,
  },
  sectionRow: {
    paddingRight: TOKENS.spacing.pagePaddingH + 8,
  },
  sectionRowScroll: {
    marginHorizontal: -TOKENS.spacing.pagePaddingH,
  },
  chipButton: {
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chipText: {
    fontSize: 16,
    color: '#22C7B0',
    fontWeight: '600',
  },
});

export default Part2SinglePointScreen;
