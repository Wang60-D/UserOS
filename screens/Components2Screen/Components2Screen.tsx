import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TOKENS } from '../../tokens';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Components2RouteName =
  | 'Components2CircleButton'
  | 'Components2SquareButton'
  | 'Components2Switch'
  | 'Components2Slider';

interface ComponentItem {
  title: string;
  description: string;
  routeName: Components2RouteName;
}

const COMPONENT_ITEMS: ComponentItem[] = [
  {
    title: 'CircleButton',
    description: '展示 2 到 8 个按钮组样式与换行规则',
    routeName: 'Components2CircleButton',
  },
  {
    title: 'SquareButton',
    description: '支持大/小切换器，2 到 8 个按钮排布与换行',
    routeName: 'Components2SquareButton',
  },
  {
    title: 'Switch',
    description: '展示按钮态、开关态、左 icon、副标题与标题右箭头',
    routeName: 'Components2Switch',
  },
  {
    title: 'Slider',
    description: '基础滑条（受控/非受控、onChange/onChangeEnd）',
    routeName: 'Components2Slider',
  },
];

const Components2Screen: React.FC = () => {
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
        <Text style={styles.pageTitle}>Components2.0</Text>
        <Text style={styles.pageSubtitle}>选择组件进入 2.0 示例页面</Text>

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

export default Components2Screen;
