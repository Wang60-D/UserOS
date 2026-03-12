import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { CircleButtonGroup } from '../../components2.0/ButtonGroup';
import { DotSlider, NumberCapsuleSlider } from '../../components/Slider';
import { RemoteControlStepper } from '../../components/RemoteControlStepper';
import { PageTabSwitch } from '../../components/PageSwitch';
import type { CircleButtonGroupItem } from '../../components2.0/ButtonGroup';
import { TOKENS } from '../../tokens';

type HumidifierGearControlType = 0 | 1 | 2 | 3;

const VIEW_TABS = ['1', '2', '3', '4'] as const;
const HUMIDIFIER_GEAR_ICON_SIZE = 12;
const HUMIDIFIER_GEAR_COMPONENT3_ICON_SIZE = HUMIDIFIER_GEAR_ICON_SIZE * 1.5;
const ICON_TINT_COLORS = {
  selected: '#FFFFFF',
  unselected: '#000000CC',
} as const;

const HUMIDIFIER_GEAR_ICONS = {
  level1: require('../../assets/icons/humidifier/01.png'),
  level2: require('../../assets/icons/humidifier/02.png'),
  level3: require('../../assets/icons/humidifier/03.png'),
  level4: require('../../assets/icons/humidifier/04.png'),
} as const;
const HUMIDIFIER_EQUIPMENT_IMAGE = require('../../assets/equipment/humidifier.png');

const GEAR_CIRCLE_ITEMS = [
  { value: 1, label: '1挡', icon: HUMIDIFIER_GEAR_ICONS.level1 },
  { value: 2, label: '2挡', icon: HUMIDIFIER_GEAR_ICONS.level2 },
  { value: 3, label: '3挡', icon: HUMIDIFIER_GEAR_ICONS.level3 },
  { value: 4, label: '4挡', icon: HUMIDIFIER_GEAR_ICONS.level4 },
];

const HumidifierGearScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<HumidifierGearControlType>(0);
  const [gearValue, setGearValue] = useState(3);

  const subtitleText = ` ${gearValue} 档`;

  const circleItems = useMemo<CircleButtonGroupItem[]>(
    () =>
      GEAR_CIRCLE_ITEMS.map((item) => ({
        label: item.label,
        icon: item.icon,
        selected: gearValue === item.value,
      })),
    [gearValue]
  );

  const renderCurrentControl = () => {
    if (activeTab === 0) {
      return (
        <CircleButtonGroup
          items={circleItems}
          showLabel={true}
          onItemPress={(index) => {
            const item = GEAR_CIRCLE_ITEMS[index];
            if (!item) return;
            setGearValue(item.value);
          }}
        />
      );
    }

    if (activeTab === 1) {
      return (
        <DotSlider
          value={gearValue}
          onChange={(next: number) => setGearValue(Math.max(1, Math.min(4, Math.round(next))))}
          min={1}
          max={4}
          showDots={true}
          snapToDots={true}
          dotDistribution="even"
          dotCount={4}
          showFill={true}
          fillMode="left"
          showTickLabels={false}
          tickLabels={['1', '2', '3', '4']}
          showEdgeValues={false}
        />
      );
    }

    if (activeTab === 2) {
      return (
        <NumberCapsuleSlider
          steps={4}
          value={Math.max(0, Math.min(3, gearValue - 1))}
          onChange={(nextIndex) => setGearValue(Math.max(1, Math.min(4, nextIndex + 1)))}
          iconLabels={[
            HUMIDIFIER_GEAR_ICONS.level1,
            HUMIDIFIER_GEAR_ICONS.level2,
            HUMIDIFIER_GEAR_ICONS.level3,
            HUMIDIFIER_GEAR_ICONS.level4,
          ]}
          labelIconSize={HUMIDIFIER_GEAR_COMPONENT3_ICON_SIZE}
        />
      );
    }

    return (
      <RemoteControlStepper
        range={[1, 4]}
        step={1}
        value={gearValue}
        onChange={(next: number) => {
          setGearValue(next);
        }}
        unitLabel="档"
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>加湿器</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={HUMIDIFIER_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft
              titleText="加湿档位"
              subtitleEnabled={true}
              subtitleText={subtitleText}
              rightEnabled={false}
            />
          </View>

          <View style={activeTab === 0 ? styles.circlePanel : styles.controlPanel}>
            {renderCurrentControl()}
          </View>
        </View>

        <PageTabSwitch
          activeIndex={activeTab}
          onChange={(index) => setActiveTab(index as HumidifierGearControlType)}
          labels={[...VIEW_TABS]}
        />
      </View>
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
    paddingVertical: TOKENS.spacing.equipmentPaddingVertical,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equipmentImage: {
    width: '100%',
    height: '100%',
  },
  bottomSection: {
    marginBottom: 0,
  },
  modeCard: {
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 48,
  },
  titleRow: {
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingTop: TOKENS.spacing.cardInnerPaddingV,
    paddingBottom: 6,
  },
  circlePanel: {
    paddingTop: 8,
    paddingHorizontal: 14,
    paddingBottom: 18,
  },
  controlPanel: {
    paddingTop: 8,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingBottom: TOKENS.spacing.cardInnerPaddingV,
  },
  pageSwitchContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    columnGap: 18,
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
});

export default HumidifierGearScreen;
