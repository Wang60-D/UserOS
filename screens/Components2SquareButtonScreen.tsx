import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { SquareButtonGroup } from '../components2.0/ButtonGroup';
import type { SquareButtonGroupItem } from '../components2.0/ButtonGroup';
import { COMPONENT_TOKENS, CORE_TOKENS, TOKENS } from '../tokens';

const ICONS = [
  require('../assets/icons/cool_black.png'),
  require('../assets/icons/heat_black.png'),
  require('../assets/icons/dehumidify_black.png'),
  require('../assets/icons/fan_black.png'),
  require('../assets/icons/cool_black.png'),
  require('../assets/icons/heat_black.png'),
  require('../assets/icons/dehumidify_black.png'),
  require('../assets/icons/fan_black.png'),
];

const LABELS = ['制冷', '制热', '除湿', '送风', '加热', '净化', '省电', '睡眠'];
const GROUP_COUNTS = [2, 3, 4];

const createItems = (count: number): SquareButtonGroupItem[] =>
  Array.from({ length: count }, (_, index) => ({
    label: LABELS[index],
    icon: ICONS[index],
    selected: index === 0,
  }));

const Components2SquareButtonScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [isCompact, setIsCompact] = useState(false);
  const initialGroups = useMemo(
    () =>
      GROUP_COUNTS.reduce<Record<number, SquareButtonGroupItem[]>>((acc, count) => {
        acc[count] = createItems(count);
        return acc;
      }, {}),
    []
  );
  const [groups, setGroups] = useState<Record<number, SquareButtonGroupItem[]>>(initialGroups);

  const handleItemPress = (groupCount: number, index: number) => {
    setGroups((prev) => {
      const currentItems = prev[groupCount] || [];
      const isSelected = !!currentItems[index]?.selected;
      if (isSelected) {
        Haptics.selectionAsync();
        return prev;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return {
        ...prev,
        [groupCount]: currentItems.map((item, itemIndex) => ({
          ...item,
          selected: itemIndex === index,
        })),
      };
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + TOKENS.spacing.pagePaddingV },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>SquareButton 2.0</Text>
        <Text style={styles.pageSubtitle}>
          {isCompact ? '按 Figma 还原小切换器 2/3/4 个按钮样式' : '按 Figma 还原大切换器 2/3/4 个按钮样式'}
        </Text>

        <View style={styles.modeRow}>
          <Text style={styles.modeLabel}>小切换器 (true) / 大切换器 (false)</Text>
          <Switch
            value={isCompact}
            onValueChange={setIsCompact}
            trackColor={{ true: CORE_TOKENS.color.brandPrimarySoft, false: TOKENS.colors.rightPillBg }}
            thumbColor={isCompact ? CORE_TOKENS.color.brandPrimary : CORE_TOKENS.color.surfaceCard}
          />
        </View>

        {GROUP_COUNTS.map((count) => (
          <View key={`square-group-${count}`} style={styles.cardSpacing}>
            <Text style={styles.groupTitle}>{count} 个按钮</Text>
            <View style={[styles.groupCard, isCompact ? styles.groupCardCompact : styles.groupCardLarge]}>
              <SquareButtonGroup
                items={groups[count] || []}
                isCompact={isCompact}
                selectedColor={CORE_TOKENS.color.brandPrimary}
                onItemPress={(index) => handleItemPress(count, index)}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.colors.pageBg,
    paddingHorizontal: TOKENS.spacing.pagePaddingH,
  },
  scrollContent: {
    paddingBottom: TOKENS.spacing.pagePaddingV,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: TOKENS.colors.textPrimary,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: TOKENS.colors.subtitleText,
    marginBottom: 20,
  },
  modeRow: {
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingVertical: TOKENS.spacing.cardInnerPaddingV,
    marginBottom: TOKENS.spacing.itemGap,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: CORE_TOKENS.spacing.sm,
  },
  modeLabel: {
    flex: 1,
    fontSize: TOKENS.fontSize.medium,
    color: TOKENS.colors.textPrimary,
    fontWeight: '500',
  },
  cardSpacing: {
    marginBottom: TOKENS.spacing.itemGap,
  },
  groupCard: {
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
  },
  groupCardCompact: {
    padding: COMPONENT_TOKENS.squareButton.cardPadding,
  },
  groupCardLarge: {
    padding: 0,
  },
  groupTitle: {
    fontSize: TOKENS.fontSize.medium,
    fontWeight: '500',
    color: TOKENS.colors.textPrimary,
    marginBottom: TOKENS.spacing.titleGap,
  },
});

export default Components2SquareButtonScreen;
