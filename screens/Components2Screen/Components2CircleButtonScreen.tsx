import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { CircleButtonGroup } from '../../components2.0/ButtonGroup';
import type { CircleButtonGroupItem } from '../../components2.0/ButtonGroup';
import { TOKENS } from '../../tokens';

const ICONS = [
  require('../../assets/icons/cool_black.png'),
  require('../../assets/icons/heat_black.png'),
  require('../../assets/icons/dehumidify_black.png'),
  require('../../assets/icons/fan_black.png'),
  require('../../assets/icons/cool_black.png'),
  require('../../assets/icons/heat_black.png'),
  require('../../assets/icons/dehumidify_black.png'),
  require('../../assets/icons/fan_black.png'),
];

const LABELS = ['制冷', '制热', '除湿', '送风', '加热', '净化', '省电', '睡眠'];

const createItems = (count: number): CircleButtonGroupItem[] =>
  Array.from({ length: count }, (_, index) => ({
    label: LABELS[index],
    icon: ICONS[index],
    selected: index === 0,
  }));

const GROUP_COUNTS = [2, 3, 4, 5, 6, 7, 8];

const Components2CircleButtonScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const initialGroups = useMemo(
    () =>
      GROUP_COUNTS.reduce<Record<number, CircleButtonGroupItem[]>>((acc, count) => {
        acc[count] = createItems(count);
        return acc;
      }, {}),
    []
  );
  const [groups, setGroups] = useState<Record<number, CircleButtonGroupItem[]>>(initialGroups);

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
        <Text style={styles.pageTitle}>CircleButton 2.0</Text>
        <Text style={styles.pageSubtitle}>按顺序展示 2 到 8 个按钮组（超过 4 个自动换行并左对齐）</Text>

        {GROUP_COUNTS.map((count) => (
          <View key={`group-${count}`} style={styles.cardSpacing}>
            <Text style={styles.groupTitle}>{count} 个按钮</Text>
            <CircleButtonGroup
              items={groups[count] || []}
              showLabel={true}
              onItemPress={(index) => handleItemPress(count, index)}
            />
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
  cardSpacing: {
    marginBottom: TOKENS.spacing.itemGap,
  },
  groupTitle: {
    fontSize: TOKENS.fontSize.medium,
    fontWeight: '500',
    color: TOKENS.colors.textPrimary,
    marginBottom: TOKENS.spacing.titleGap,
  },
});

export default Components2CircleButtonScreen;
