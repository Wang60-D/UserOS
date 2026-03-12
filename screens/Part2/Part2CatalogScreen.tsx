import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { TOKENS } from '../../tokens';
import { PART2_CATALOG_ITEMS, Part2CatalogKey } from './part2CatalogData';

type Part2CatalogRoute = RouteProp<RootStackParamList, 'Part2Catalog'>;
type Nav = StackNavigationProp<RootStackParamList>;

const TICKMARKS1_ROUTE: keyof RootStackParamList = 'Part2TickMarks1';
const TICKMARKS2_ROUTE_MAP: Record<string, keyof RootStackParamList> = {
  风速: 'Part2TickMarks2WindSpeed',
  方位: 'Part2TickMarks2Direction',
  窗帘开合: 'Part2TickMarks2Curtain',
  亮度: 'Part2TickMarks2Brightness',
  音量: 'Part2TickMarks2Volume',
  色温: 'Part2TickMarks2ColorTemp',
};
const TICKMARKS3_ROUTE_MAP: Record<string, keyof RootStackParamList> = {
  '延时（短）': 'Part2TickMarks3DelayShort',
  '延时（长）': 'Part2TickMarks3DelayLong',
  '温度-热水器': 'Part2TickMarks3WaterHeaterTemp',
  '温度-电热水器': 'Part2TickMarks3KettleTemp',
  湿度: 'Part2TickMarks3Humidity',
  '温度-冰箱': 'Part2TickMarks3FridgeTemp',
};
const LABEL_ROUTE_MAP: Record<string, keyof RootStackParamList> = {
  '1-4档': 'Part2LabelLevel4',
  '1-6档': 'Part2LabelLevel6',
  风速: 'Part2LabelWindSpeed',
  左右扫风角度: 'Part2LabelSweepAngle',
  定格: 'Part2LabelSweepFixed',
  亮度: 'Part2LabelBrightness',
  窗帘开合: 'Part2LabelCurtain',
};

const Part2CatalogScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<Part2CatalogRoute>();
  const navigation = useNavigation<Nav>();
  const { catalogKey, title } = route.params;
  const items = PART2_CATALOG_ITEMS[catalogKey as Part2CatalogKey] ?? [];

  const handleChipPress = (label: string) => {
    if (catalogKey === 'TickMarks1') {
      navigation.navigate(TICKMARKS1_ROUTE);
      return;
    }
    if (catalogKey === 'TickMarks2') {
      const route = TICKMARKS2_ROUTE_MAP[label];
      if (route) navigation.navigate(route);
      return;
    }
    if (catalogKey === 'TickMarks3') {
      const route = TICKMARKS3_ROUTE_MAP[label];
      if (route) navigation.navigate(route);
      return;
    }
    if (catalogKey === 'Label') {
      const route = LABEL_ROUTE_MAP[label];
      if (route) navigation.navigate(route);
      return;
    }
    // 其他 catalog 的 chip 暂不跳转
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + TOKENS.spacing.pagePaddingV },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sectionRowScroll}
          contentContainerStyle={styles.sectionRow}
        >
          {items.map((label) => (
            <TouchableOpacity
              key={label}
              style={styles.chipButton}
              onPress={() => handleChipPress(label)}
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

export default Part2CatalogScreen;
