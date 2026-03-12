import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { CircleButtonGroup } from '../../components2.0/ButtonGroup';
import type { CircleButtonGroupItem } from '../../components2.0/ButtonGroup';
import { DotSlider, NumberCapsuleSlider } from '../../components/Slider';
import { RemoteControlStepper } from '../../components/RemoteControlStepper';
import { PageTabSwitch } from '../../components/PageSwitch';
import { TOKENS } from '../../tokens';

type WindSpeedControlType = 0 | 1 | 2 | 3;

const VIEW_TABS = ['1', '2', '3', '4'] as const;
const WIND_SPEED_COMPONENT3_ICON_SIZE = 18;

const WIND_SPEED_ITEMS = [
  { value: 1, label: '1挡' },
  { value: 2, label: '2挡' },
  { value: 3, label: '3挡' },
  { value: 4, label: '4挡' },
  { value: 5, label: '5挡' },
  { value: 6, label: '6挡' },
] as const;

const WIND_SPEED_LEVEL_ICONS = {
  level1: require('../../assets/icons/humidifier/01.png'),
  level2: require('../../assets/icons/humidifier/02.png'),
  level3: require('../../assets/icons/humidifier/03.png'),
  level4: require('../../assets/icons/humidifier/04.png'),
  level5: require('../../assets/icons/humidifier/05.png'),
  level6: require('../../assets/icons/humidifier/06.png'),
} as const;
const WIND_SPEED_EQUIPMENT_IMAGE = require('../../assets/equipment/fan.png');

const WindSpeedGearScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<WindSpeedControlType>(0);
  const [speedValue, setSpeedValue] = useState(2);

  const subtitleText = `${speedValue}档`;

  const circleItems = useMemo<CircleButtonGroupItem[]>(
    () =>
      WIND_SPEED_ITEMS.map((item) => ({
        label: item.label,
        icon: WIND_SPEED_LEVEL_ICONS[`level${item.value}` as keyof typeof WIND_SPEED_LEVEL_ICONS],
        selected: speedValue === item.value,
      })),
    [speedValue]
  );

  const renderCurrentControl = () => {
    if (activeTab === 0) {
      return (
        <CircleButtonGroup
          items={circleItems}
          showLabel={true}
          onItemPress={(index) => {
            const item = WIND_SPEED_ITEMS[index];
            if (!item) return;
            setSpeedValue(item.value);
          }}
        />
      );
    }

    if (activeTab === 1) {
      return (
        <DotSlider
          value={speedValue}
          onChange={(next: number) => setSpeedValue(Math.max(1, Math.min(6, Math.round(next))))}
          min={1}
          max={6}
          showDots={true}
          snapToDots={true}
          dotDistribution="even"
          dotCount={6}
          showFill={true}
          fillMode="left"
          showTickLabels={false}
          showEdgeValues={false}
        />
      );
    }

    if (activeTab === 2) {
      return (
        <NumberCapsuleSlider
          steps={6}
          value={Math.max(0, Math.min(5, speedValue - 1))}
          onChange={(nextIndex) => setSpeedValue(Math.max(1, Math.min(6, nextIndex + 1)))}
          iconLabels={[
            WIND_SPEED_LEVEL_ICONS.level1,
            WIND_SPEED_LEVEL_ICONS.level2,
            WIND_SPEED_LEVEL_ICONS.level3,
            WIND_SPEED_LEVEL_ICONS.level4,
            WIND_SPEED_LEVEL_ICONS.level5,
            WIND_SPEED_LEVEL_ICONS.level6,
          ]}
          labelIconSize={WIND_SPEED_COMPONENT3_ICON_SIZE}
        />
      );
    }

    return (
      <RemoteControlStepper
        range={[1, 6]}
        step={1}
        value={speedValue}
        onChange={setSpeedValue}
        unitLabel="档"
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>风速</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={WIND_SPEED_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft
              titleText="挡位选择"
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
          onChange={(index) => setActiveTab(index as WindSpeedControlType)}
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
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
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

export default WindSpeedGearScreen;
