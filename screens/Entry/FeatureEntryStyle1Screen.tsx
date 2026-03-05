import React, { useEffect, useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwitchRow } from '../../components/Switch';
import { PageTabSwitch } from '../../components/PageSwitch';
import { TOKENS } from '../../tokens';

type EntryTabType = 0 | 1;
type DrawerType = 'none' | 'wind' | 'sweep';

const PAGE_TABS = ['1', '2'] as const;

const ENTRY_ITEMS = [
  {
    id: 'wind-sense',
    title: '风感',
    subtitle: '双柔风',
    enabled: true,
    icon: require('../../assets/icons/fan_black.png'),
    drawerType: 'wind' as DrawerType,
  },
  {
    id: 'up-down',
    title: '上下扫风',
    subtitle: '关闭',
    enabled: false,
    icon: require('../../assets/icons/airconditioner/angletop.png'),
    drawerType: 'sweep' as DrawerType,
  },
  {
    id: 'left-right',
    title: '左右扫风',
    subtitle: '关闭',
    enabled: false,
    icon: require('../../assets/icons/airconditioner/angledown.png'),
    drawerType: 'sweep' as DrawerType,
  },
];

const WIND_SENSE_OPTIONS = [
  '天幕风',
  '地毯风',
  '风避人',
  '风吹人',
] as const;

const FeatureEntryStyle1Screen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState<EntryTabType>(0);
  const [drawerType, setDrawerType] = useState<DrawerType>('none');
  const [windSenseValue, setWindSenseValue] = useState<(typeof WIND_SENSE_OPTIONS)[number]>('天幕风');
  const [upDownEnabled, setUpDownEnabled] = useState(true);
  const [leftRightEnabled, setLeftRightEnabled] = useState(true);
  const [upDownActive, setUpDownActive] = useState<string[]>(['右上风区', '右下风区']);
  const [leftRightActive, setLeftRightActive] = useState<string[]>(['右风区']);

  useEffect(() => {
    if (route.name === 'FeatureEntryStyle2') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [route.name]);

  const style2Items = useMemo(
    () =>
      ENTRY_ITEMS.map((item) => ({
        ...item,
        enabled: item.id === 'wind-sense',
      })),
    []
  );

  const toggleTag = (label: string, selected: string[], onChange: (next: string[]) => void) => {
    const exists = selected.includes(label);
    if (exists) {
      onChange(selected.filter((item) => item !== label));
      return;
    }
    onChange([...selected, label]);
  };

  const renderStyle1 = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>风调节</Text>
      <View style={styles.itemRow}>
        {ENTRY_ITEMS.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.itemCard, item.enabled ? styles.itemCardEnabled : styles.itemCardDisabled]}
            onPress={() => setDrawerType(item.drawerType)}
          >
            <View style={styles.iconWrap}>
              <Image
                source={item.icon}
                style={[styles.icon, item.enabled ? styles.iconEnabled : styles.iconDisabled]}
                resizeMode="contain"
              />
            </View>
            <View style={styles.titleRow}>
              <Text style={[styles.itemTitle, item.enabled ? styles.textEnabled : styles.textDisabled]}>
                {item.title}
              </Text>
              <Text style={[styles.caret, item.enabled ? styles.textEnabled : styles.textDisabled]}>▾</Text>
            </View>
            <Text style={[styles.itemSubtitle, item.enabled ? styles.textEnabled : styles.subtitleDisabled]}>
              {item.subtitle}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderStyle2 = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>风调节</Text>
      <View style={styles.style2Row}>
        {style2Items.map((item) => (
          <Pressable key={item.id} style={styles.style2Item} onPress={() => setDrawerType(item.drawerType)}>
            <View style={[styles.style2IconCircle, item.enabled && styles.style2IconCircleSelected]}>
              <Image
                source={item.icon}
                style={[styles.style2Icon, item.enabled ? styles.iconEnabled : styles.iconDisabled]}
                resizeMode="contain"
              />
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.textDisabled}>{item.title}</Text>
              <Text style={styles.textDisabled}>▾</Text>
            </View>
            <Text style={styles.subtitleDisabled}>{item.subtitle}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderWindSenseDrawer = () => (
    <View style={styles.drawerSheet}>
      <View style={styles.drawerHandle} />
      <View style={styles.drawerHeader}>
        <Pressable style={styles.drawerCloseBtn} onPress={() => setDrawerType('none')}>
          <Text style={styles.drawerCloseText}>×</Text>
        </Pressable>
        <Text style={styles.drawerTitle}>风感</Text>
        <View style={styles.drawerCloseBtn} />
      </View>
      <View style={styles.windOptionRow}>
        {WIND_SENSE_OPTIONS.map((item) => {
          const selected = item === windSenseValue;
          return (
            <Pressable key={item} style={styles.windOptionItem} onPress={() => setWindSenseValue(item)}>
              <View style={[styles.windOptionCircle, selected && styles.windOptionCircleSelected]}>
                <Image
                  source={require('../../assets/icons/fan_black.png')}
                  style={[styles.optionIcon, selected ? styles.iconEnabled : styles.iconDisabled]}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.windOptionText, selected && styles.windOptionTextSelected]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderSweepDrawer = () => (
    <View style={styles.drawerSheet}>
      <View style={styles.drawerHandle} />
      <View style={styles.drawerHeader}>
        <Pressable style={styles.drawerCloseBtn} onPress={() => setDrawerType('none')}>
          <Text style={styles.drawerCloseText}>×</Text>
        </Pressable>
        <Text style={styles.drawerTitle}>扫风</Text>
        <View style={styles.drawerCloseBtn} />
      </View>

      <View style={styles.sweepGroupCard}>
        <SwitchRow
          titleText="上下扫风"
          rightMode="switch"
          switchValue={upDownEnabled}
          onSwitchChange={setUpDownEnabled}
          rowHeight={54}
          containerBgColor="transparent"
        />
        <View style={styles.sweepTagGrid}>
          {['左上风区', '右上风区', '左下风区', '右下风区'].map((label) => {
            const selected = upDownActive.includes(label);
            return (
              <Pressable
                key={label}
                style={[styles.sweepTag, selected && styles.sweepTagSelected]}
                onPress={() => toggleTag(label, upDownActive, setUpDownActive)}
              >
                <Text style={[styles.sweepTagText, selected && styles.sweepTagTextSelected]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.sweepGroupCard}>
        <SwitchRow
          titleText="左右扫风"
          rightMode="switch"
          switchValue={leftRightEnabled}
          onSwitchChange={setLeftRightEnabled}
          rowHeight={54}
          containerBgColor="transparent"
        />
        <View style={styles.sweepTagGrid}>
          {['左风区', '右风区'].map((label) => {
            const selected = leftRightActive.includes(label);
            return (
              <Pressable
                key={label}
                style={[styles.sweepTag, selected && styles.sweepTagSelected]}
                onPress={() => toggleTag(label, leftRightActive, setLeftRightActive)}
              >
                <Text style={[styles.sweepTagText, selected && styles.sweepTagTextSelected]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>功能入口</Text>
      </View>

      <View style={styles.contentPlaceholder} />

      <View style={styles.bottomSection}>
        {activeTab === 0 ? renderStyle1() : renderStyle2()}

        <PageTabSwitch
          activeIndex={activeTab}
          onChange={(index) => setActiveTab(index as EntryTabType)}
          labels={[...PAGE_TABS]}
        />
      </View>

      {drawerType !== 'none' && (
        <View style={styles.drawerOverlay}>
          <Pressable style={styles.drawerMask} onPress={() => setDrawerType('none')} />
          {drawerType === 'wind' ? renderWindSenseDrawer() : renderSweepDrawer()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.colors.pageBg,
    paddingHorizontal: TOKENS.spacing.pagePaddingH,
    paddingBottom: 80,
  },
  header: {
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: TOKENS.fontSize.large,
    fontWeight: '500',
    color: TOKENS.colors.textPrimary,
  },
  contentPlaceholder: {
    flex: 1,
  },
  bottomSection: {
    marginBottom: 0,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 14,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 10,
  },
  style2Row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  style2Item: {
    width: '31%',
    alignItems: 'center',
  },
  style2IconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  style2IconCircleSelected: {
    backgroundColor: TOKENS.colors.mainColor,
  },
  style2Icon: {
    width: 24,
    height: 24,
  },
  itemCard: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  itemCardEnabled: {
    backgroundColor: 'rgba(128,157,228,0.1)',
  },
  itemCardDisabled: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconEnabled: {
    tintColor: TOKENS.colors.mainColor,
  },
  iconDisabled: {
    tintColor: '#000000CC',
  },
  titleRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  caret: {
    marginLeft: 2,
    fontSize: 12,
  },
  itemSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
  },
  textEnabled: {
    color: TOKENS.colors.mainColor,
  },
  textDisabled: {
    color: '#000000',
  },
  subtitleDisabled: {
    color: 'rgba(0,0,0,0.4)',
  },
  pageSwitchContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    columnGap: 18,
    marginTop: 20,
  },
  pageButton: {
    width: 54,
    height: 54,
    borderRadius: TOKENS.radius.circle,
    backgroundColor: TOKENS.colors.circleUnselectedBg,
    borderWidth: 1,
    borderColor: TOKENS.colors.pageBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageButtonSelected: {
    backgroundColor: TOKENS.colors.pageBg,
    borderColor: TOKENS.colors.mainColor,
    borderWidth: 2,
  },
  pageButtonText: {
    fontSize: 17,
    color: '#666666',
    fontWeight: '400',
  },
  pageButtonTextSelected: {
    color: '#0A6EFF',
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  drawerMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  drawerSheet: {
    backgroundColor: '#F7F7F7',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 28,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  drawerHeader: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  drawerCloseBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerCloseText: {
    fontSize: 30,
    color: '#444',
    lineHeight: 32,
  },
  drawerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  windOptionRow: {
    marginTop: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  windOptionItem: {
    width: 62,
    alignItems: 'center',
  },
  windOptionCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  windOptionCircleSelected: {
    backgroundColor: 'rgba(52,130,255,0.15)',
  },
  optionIcon: {
    width: 24,
    height: 24,
  },
  windOptionText: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(0,0,0,0.4)',
  },
  windOptionTextSelected: {
    color: '#3482FF',
    fontWeight: '500',
  },
  sweepGroupCard: {
    marginHorizontal: 12,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 10,
  },
  sweepTagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  sweepTag: {
    width: '48.5%',
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sweepTagSelected: {
    backgroundColor: 'rgba(52,130,255,0.12)',
  },
  sweepTagText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.45)',
  },
  sweepTagTextSelected: {
    color: '#3482FF',
    fontWeight: '500',
  },
});

export default FeatureEntryStyle1Screen;
