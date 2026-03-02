import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TOKENS } from '../tokens';

type Part1Navigation = StackNavigationProp<RootStackParamList>;

interface SectionItem {
  label: string;
  routeName?: keyof RootStackParamList;
}

interface CatalogSection {
  title: string;
  items: SectionItem[];
}

const CATALOG_SECTIONS: CatalogSection[] = [
  {
    title: '开关',
    items: [
      { label: '风扇', routeName: 'FanSwitch' },
      { label: '墙壁开关', routeName: 'WallSwitch' },
      { label: '浴霸灯光', routeName: 'BathLight' },
      { label: '除湿机', routeName: 'Dehumidifier' },
    ],
  },
  {
    title: '模式',
    items: [
      { label: '空调', routeName: 'AirConditioner' },
      { label: '空气净化器', routeName: 'AirPurifier' },
      { label: '灯光', routeName: 'LightMode' },
      { label: '音效', routeName: 'SoundMode' },
      { label: '耳机', routeName: 'EarphoneMode' },
    ],
  },
  {
    title: '档位',
    items: [
      { label: '加湿器' },
      { label: '风速' },
      { label: '净烟机' },
      { label: '电暖器' },
    ],
  },
  {
    title: '方位',
    items: [
      { label: '晾衣架' },
      { label: '浴霸' },
      { label: '风扇' },
      { label: '空调' },
    ],
  },
  {
    title: '温度',
    items: [
      { label: '空调', routeName: 'AirConditioner' },
      { label: '热水器' },
      { label: '冰箱' },
      { label: '电热水壶' },
    ],
  },
  {
    title: '时间',
    items: [
      { label: '定时1' },
      { label: '定时2' },
      { label: '倒计时' },
      { label: '延时' },
    ],
  },

];

const Part1Screen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Part1Navigation>();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + TOKENS.spacing.pagePaddingV },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {CATALOG_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sectionRow}
            >
              {section.items.map((item) => (
                <TouchableOpacity
                  key={`${section.title}-${item.label}`}
                  style={styles.chipButton}
                  onPress={() => item.routeName && navigation.navigate(item.routeName)}
                  activeOpacity={item.routeName ? 0.75 : 1}
                  disabled={!item.routeName}
                >
                  <Text style={styles.chipText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  },
  contentContainer: {
    paddingHorizontal: TOKENS.spacing.pagePaddingH,
    paddingBottom: TOKENS.spacing.pagePaddingV,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 44 / 2,
    fontWeight: '700',
    color: TOKENS.colors.textPrimary,
    marginBottom: 12,
  },
  sectionRow: {
    paddingRight: 8,
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

export default Part1Screen;
