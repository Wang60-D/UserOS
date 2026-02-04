import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircleButtonGroup, SquareButtonGroup, ToggleButtonGroup } from '../components/ButtonGroup';
import type { CircleButtonGroupItem } from '../components/ButtonGroup/CircleButtonGroup';
import type { SquareButtonGroupItem } from '../components/ButtonGroup/SquareButtonGroup';
import type { ToggleButtonItem } from '../components/ButtonGroup/ToggleButtonGroup';
import { TOKENS } from '../tokens';

const GROUP_CONFIGS: Array<{
  id: string;
  items: CircleButtonGroupItem[];
}> = [
  {
    id: 'group-2',
    items: [
      {
        label: '制冷',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '制热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
    ],
  },
  {
    id: 'group-3',
    items: [
      {
        label: '制冷',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '制热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '除湿',
        iconSelected: require('../assets/icons/dehumidify_white.png'),
        iconUnselected: require('../assets/icons/dehumidify_black.png'),
      },
    ],
  },
  {
    id: 'group-4',
    items: [
      {
        label: '制冷',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '制热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '除湿',
        iconSelected: require('../assets/icons/dehumidify_white.png'),
        iconUnselected: require('../assets/icons/dehumidify_black.png'),
      },
      {
        label: '送风',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
    ],
  },
  {
    id: 'group-5',
    items: [
      {
        label: '制冷',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '制热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '除湿',
        iconSelected: require('../assets/icons/dehumidify_white.png'),
        iconUnselected: require('../assets/icons/dehumidify_black.png'),
      },
      {
        label: '送风',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
      {
        label: '加热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
    ],
  },
  {
    id: 'group-6',
    items: [
      {
        label: '制冷',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '制热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '除湿',
        iconSelected: require('../assets/icons/dehumidify_white.png'),
        iconUnselected: require('../assets/icons/dehumidify_black.png'),
      },
      {
        label: '送风',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
      {
        label: '加热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '净化',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
    ],
  },
  {
    id: 'group-7',
    items: [
      {
        label: '制冷',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '制热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '除湿',
        iconSelected: require('../assets/icons/dehumidify_white.png'),
        iconUnselected: require('../assets/icons/dehumidify_black.png'),
      },
      {
        label: '送风',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
      {
        label: '加热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '净化',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
      {
        label: '省电',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
    ],
  },
  {
    id: 'group-8',
    items: [
      {
        label: '制冷',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '制热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '除湿',
        iconSelected: require('../assets/icons/dehumidify_white.png'),
        iconUnselected: require('../assets/icons/dehumidify_black.png'),
      },
      {
        label: '送风',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
      {
        label: '加热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '净化',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
      {
        label: '省电',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '睡眠',
        iconSelected: require('../assets/icons/dehumidify_white.png'),
        iconUnselected: require('../assets/icons/dehumidify_black.png'),
      },
    ],
  },
];

const SQUARE_GROUP_CONFIGS: Array<{
  id: string;
  items: SquareButtonGroupItem[];
}> = [
  {
    id: 'square-group-2',
    items: [
      {
        label: '制冷',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '制热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
    ],
  },
  {
    id: 'square-group-3',
    items: [
      {
        label: '制冷',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '制热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '除湿',
        iconSelected: require('../assets/icons/dehumidify_white.png'),
        iconUnselected: require('../assets/icons/dehumidify_black.png'),
      },
    ],
  },
  {
    id: 'square-group-4',
    items: [
      {
        label: '制冷',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '制热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '除湿',
        iconSelected: require('../assets/icons/dehumidify_white.png'),
        iconUnselected: require('../assets/icons/dehumidify_black.png'),
      },
      {
        label: '送风',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
    ],
  },
  {
    id: 'square-group-5',
    items: [
      {
        label: '制冷',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '制热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '除湿',
        iconSelected: require('../assets/icons/dehumidify_white.png'),
        iconUnselected: require('../assets/icons/dehumidify_black.png'),
      },
      {
        label: '送风',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
      {
        label: '加热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
    ],
  },
  {
    id: 'square-group-6',
    items: [
      {
        label: '制冷',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '制热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '除湿',
        iconSelected: require('../assets/icons/dehumidify_white.png'),
        iconUnselected: require('../assets/icons/dehumidify_black.png'),
      },
      {
        label: '送风',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
      {
        label: '加热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '净化',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
    ],
  },
  {
    id: 'square-group-7',
    items: [
      {
        label: '制冷',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '制热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '除湿',
        iconSelected: require('../assets/icons/dehumidify_white.png'),
        iconUnselected: require('../assets/icons/dehumidify_black.png'),
      },
      {
        label: '送风',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
      {
        label: '加热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '净化',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
      {
        label: '省电',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
    ],
  },
  {
    id: 'square-group-8',
    items: [
      {
        label: '制冷',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '制热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '除湿',
        iconSelected: require('../assets/icons/dehumidify_white.png'),
        iconUnselected: require('../assets/icons/dehumidify_black.png'),
      },
      {
        label: '送风',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
      {
        label: '加热',
        iconSelected: require('../assets/icons/heat_white.png'),
        iconUnselected: require('../assets/icons/heat_black.png'),
      },
      {
        label: '净化',
        iconSelected: require('../assets/icons/fan_white.png'),
        iconUnselected: require('../assets/icons/fan_black.png'),
      },
      {
        label: '省电',
        iconSelected: require('../assets/icons/cool_white.png'),
        iconUnselected: require('../assets/icons/cool_black.png'),
      },
      {
        label: '睡眠',
        iconSelected: require('../assets/icons/dehumidify_white.png'),
        iconUnselected: require('../assets/icons/dehumidify_black.png'),
      },
    ],
  },
];

const TOGGLE_BUTTONS: ToggleButtonItem[] = [
  {
    id: 'toggle-1',
    title: '风感',
    subtitle: '双柔风',
    enabled: true,
    icon: require('../assets/icons/fan_black.png'),
  },
  {
    id: 'toggle-2',
    title: '上下扫风',
    subtitle: '双柔风',
    enabled: false,
    icon: require('../assets/icons/fan_black.png'),
  },
  {
    id: 'toggle-3',
    title: '左右扫风',
    subtitle: '双柔风',
    enabled: false,
    icon: require('../assets/icons/fan_black.png'),
  },
];

const ButtonGroupScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const createGroupItems = <T extends { selected?: boolean }>(items: T[]) =>
    items.map((item, index) => ({
      ...item,
      selected: index === 0,
    }));

  const [groupItems, setGroupItems] = useState(() =>
    GROUP_CONFIGS.reduce<Record<string, CircleButtonGroupItem[]>>((acc, group) => {
      acc[group.id] = createGroupItems(group.items);
      return acc;
    }, {})
  );
  const [squareGroupItems, setSquareGroupItems] = useState(() =>
    SQUARE_GROUP_CONFIGS.reduce<Record<string, SquareButtonGroupItem[]>>((acc, group) => {
      acc[group.id] = createGroupItems(group.items);
      return acc;
    }, {})
  );
  const [toggleButtons, setToggleButtons] = useState<ToggleButtonItem[]>(() => TOGGLE_BUTTONS);

  const handleItemPress = (groupId: string, index: number) => {
    setGroupItems((prev) => {
      const currentItems = prev[groupId] || [];
      const isSelected = !!currentItems[index]?.selected;
      if (isSelected) {
        Haptics.selectionAsync();
        return prev;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return {
        ...prev,
        [groupId]: currentItems.map((item, itemIndex) => ({
          ...item,
          selected: itemIndex === index,
        })),
      };
    });
  };
  const handleSquareItemPress = (groupId: string, index: number) => {
    setSquareGroupItems((prev) => {
      const currentItems = prev[groupId] || [];
      const isSelected = !!currentItems[index]?.selected;
      if (isSelected) {
        Haptics.selectionAsync();
        return prev;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return {
        ...prev,
        [groupId]: currentItems.map((item, itemIndex) => ({
          ...item,
          selected: itemIndex === index,
        })),
      };
    });
  };
  const handleTogglePress = (id: string) => {
    setToggleButtons((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              enabled: !item.enabled,
            }
          : item
      )
    );
  };
  const handleToggleTitlePress = (_id: string) => {
    Alert.alert('提示', '这里是 iOS 原生 toast 占位，后续替换为抽屉');
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
        {GROUP_CONFIGS.map((group) => (
          <View key={group.id} style={[styles.card, styles.cardSpacing]}>
            <CircleButtonGroup
              showLabel={true}
              items={groupItems[group.id] || []}
              onItemPress={(index) => handleItemPress(group.id, index)}
              itemCount={group.items.length}
            />
          </View>
        ))}
        <View style={[styles.card, styles.cardSpacing]}>
          <ToggleButtonGroup
            items={toggleButtons}
            onItemTitlePress={handleToggleTitlePress}
            onItemPress={handleTogglePress}
          />
        </View>
        {SQUARE_GROUP_CONFIGS.map((group) => (
          <View key={group.id} style={[styles.card, styles.cardSpacing]}>
            <SquareButtonGroup
              items={squareGroupItems[group.id] || []}
              onItemPress={(index) => handleSquareItemPress(group.id, index)}
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
  card: {
    width: '100%',
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingVertical: TOKENS.spacing.cardInnerPaddingV,
  },
  cardSpacing: {
    marginBottom: TOKENS.spacing.itemGap,
  },
});

export default ButtonGroupScreen;
