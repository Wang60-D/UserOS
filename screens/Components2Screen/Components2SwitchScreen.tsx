import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwitchRow } from '../../components2.0/Switch';
import { TOKENS } from '../../tokens';

type RightMode = 'button' | 'switch';
type TitleRightIconType = 'switch' | 'arrow';

interface SwitchExample {
  id: string;
  title: string;
  subtitleText?: string;
  subtitleEnabled?: boolean;
  leftIconEnabled?: boolean;
  leftIconSource?: any;
  titleRightArrowEnabled?: boolean;
  titleRightIconType?: TitleRightIconType;
  rightMode: RightMode;
  rightButtonIconSource?: any;
  disabled?: boolean;
}

const ICONS = {
  power: require('../../assets/icons/power.png'),
  feature: require('../../assets/icons/humidity.png'),
  refresh: require('../../assets/icons/mode.png'),
} as const;

const SWITCH_EXAMPLES: SwitchExample[] = [
  {
    id: 'button-basic',
    title: '基础按钮态',
    rightMode: 'button',
    rightButtonIconSource: ICONS.power,
  },
  {
    id: 'button-with-left-icon',
    title: '带左图标',
    leftIconEnabled: true,
    leftIconSource: ICONS.feature,
    rightMode: 'button',
    rightButtonIconSource: ICONS.feature,
  },
  {
    id: 'button-with-switch-icon',
    title: '标题右图标-切换',
    titleRightArrowEnabled: true,
    titleRightIconType: 'switch',
    rightMode: 'button',
    rightButtonIconSource: ICONS.refresh,
  },
  {
    id: 'button-with-arrow',
    title: '标题右图标-箭头',
    titleRightArrowEnabled: true,
    titleRightIconType: 'arrow',
    rightMode: 'button',
    rightButtonIconSource: ICONS.refresh,
  },
  {
    id: 'switch-basic',
    title: '基础开关态',
    rightMode: 'switch',
  },
  {
    id: 'switch-with-subtitle',
    title: '带副标题',
    subtitleEnabled: true,
    subtitleText: '当前状态说明',
    rightMode: 'switch',
  },
  {
    id: 'full-config',
    title: '全量配置',
    subtitleEnabled: true,
    subtitleText: '支持左 icon + 副标题 + 右箭头',
    leftIconEnabled: true,
    leftIconSource: ICONS.power,
    titleRightArrowEnabled: true,
    titleRightIconType: 'arrow',
    rightMode: 'switch',
  },
  {
    id: 'button-disabled',
    title: '按钮禁用态',
    rightMode: 'button',
    rightButtonIconSource: ICONS.power,
    disabled: true,
  },
  {
    id: 'switch-disabled',
    title: '开关禁用态',
    rightMode: 'switch',
    disabled: true,
  },
];

const Components2SwitchScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const initialState = useMemo(
    () =>
      SWITCH_EXAMPLES.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = item.rightMode === 'switch';
        return acc;
      }, {}),
    []
  );
  const [stateMap, setStateMap] = useState<Record<string, boolean>>(initialState);

  const updateValue = (id: string, value: boolean) => {
    setStateMap((prev) => ({
      ...prev,
      [id]: value,
    }));
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
        <Text style={styles.pageTitle}>Switch 2.0</Text>
        <Text style={styles.pageSubtitle}>展示按钮态/开关态及左 icon、副标题、标题右箭头等组合样式</Text>

        <View style={styles.listContainer}>
          {SWITCH_EXAMPLES.map((item) => (
            <View key={item.id} style={styles.card}>
              <SwitchRow
                titleText={item.title}
                subtitleEnabled={item.subtitleEnabled}
                subtitleText={item.subtitleText}
                leftIconEnabled={item.leftIconEnabled}
                leftIconSource={item.leftIconSource}
                titleRightArrowEnabled={item.titleRightArrowEnabled}
                titleRightIconType={item.titleRightIconType}
                rightMode={item.rightMode}
                rightButtonIconSource={item.rightButtonIconSource}
                rightButtonOn={stateMap[item.id]}
                switchValue={stateMap[item.id]}
                onRightButtonChange={(value) => updateValue(item.id, value)}
                onSwitchChange={(value) => updateValue(item.id, value)}
                disabled={item.disabled}
              />
            </View>
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
    gap: 8,
  },
  card: {
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
    overflow: 'hidden',
  },
});

export default Components2SwitchScreen;
