import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TOKENS } from '../tokens';
import { RootStackParamList } from '../navigation/AppNavigator';

type ComponentLibraryRouteName =
  | 'AirConditioner'
  | 'ButtonGroup'
  | 'ControlTitle'
  | 'Slider'
  | 'TimePicker'
  | 'Switch';

interface ComponentItem {
  title: string;
  description: string;
  routeName: ComponentLibraryRouteName;
}

const COMPONENT_ITEMS: ComponentItem[] = [
  {
    title: '空调组件',
    description: '模式按钮与模式滑条组合演示',
    routeName: 'AirConditioner',
  },
  {
    title: '按钮组组件',
    description: '圆形按钮组、方形按钮组与开关按钮组',
    routeName: 'ButtonGroup',
  },
  {
    title: '控件标题组件',
    description: '左标题与中标题的多种样式状态',
    routeName: 'ControlTitle',
  },
  {
    title: '滑条组件',
    description: '离散步进滑条与吸附行为演示',
    routeName: 'Slider',
  },
  {
    title: '时间选择组件',
    description: '上滑下滑选择时间，支持开始/结束切换',
    routeName: 'TimePicker',
  },
  {
    title: 'Switch 组件',
    description: '按钮与开关组合的四种设计态',
    routeName: 'Switch',
  },
];

const ComponentLibraryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + TOKENS.spacing.pagePaddingV },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>组件库</Text>
        <Text style={styles.pageSubtitle}>选择一个组件页面进入查看效果</Text>

        <View style={styles.listContainer}>
          {COMPONENT_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.routeName}
              style={styles.listItem}
              activeOpacity={0.75}
              onPress={() => navigation.navigate(item.routeName)}
            >
              <View style={styles.listItemTextContainer}>
                <Text style={styles.listItemTitle}>{item.title}</Text>
                <Text style={styles.listItemDescription}>{item.description}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  listContainer: {
    gap: 12,
  },
  listItem: {
    width: '100%',
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingVertical: TOKENS.spacing.cardInnerPaddingV,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  listItemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: TOKENS.colors.textPrimary,
    marginBottom: 4,
  },
  listItemDescription: {
    fontSize: 13,
    color: TOKENS.colors.subtitleText,
  },
  chevron: {
    fontSize: 24,
    color: TOKENS.colors.subtitleText,
    lineHeight: 24,
  },
});

export default ComponentLibraryScreen;
