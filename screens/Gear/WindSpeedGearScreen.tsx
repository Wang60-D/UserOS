import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { CircleButtonGroup } from '../../components/ButtonGroup';
import type { CircleButtonGroupItem } from '../../components/ButtonGroup/CircleButtonGroup';
import { DotSlider, NumberCapsuleSlider } from '../../components/Slider';
import { RemoteControlStepper } from '../../components/RemoteControlStepper';
import { TOKENS } from '../../tokens';

type WindSpeedControlType = 0 | 1 | 2 | 3;

const VIEW_TABS = ['1', '2', '3', '4'] as const;

const WIND_SPEED_ITEMS = [
  { value: 1, label: '1档' },
  { value: 2, label: '2档' },
  { value: 3, label: '3档' },
  { value: 4, label: '4档' },
  { value: 5, label: '5档' },
  { value: 6, label: '6档' },
] as const;

const FAN_ICONS = {
  selected: require('../../assets/icons/fan_white.png'),
  unselected: require('../../assets/icons/fan_black.png'),
} as const;

const WindSpeedGearScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<WindSpeedControlType>(0);
  const [speedValue, setSpeedValue] = useState(2);

  const subtitleText = `${speedValue}档`;

  const circleItems = useMemo<CircleButtonGroupItem[]>(
    () =>
      WIND_SPEED_ITEMS.map((item) => ({
        label: item.label,
        iconSelected: FAN_ICONS.selected,
        iconUnselected: FAN_ICONS.unselected,
        selected: speedValue === item.value,
      })),
    [speedValue]
  );

  const renderCurrentControl = () => {
    if (activeTab === 0) {
      return (
        <CircleButtonGroup
          items={circleItems}
          itemCount={6}
          columns={6}
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
          labels={['1', '2', '3', '4', '5', '6']}
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

      <View style={styles.contentPlaceholder} />

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

        <View style={styles.pageSwitchContainer}>
          {VIEW_TABS.map((label, index) => {
            const selected = index === activeTab;
            return (
              <Pressable
                key={label}
                style={[styles.pageButton, selected && styles.pageButtonSelected]}
                onPress={() => setActiveTab(index as WindSpeedControlType)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Text style={[styles.pageButtonText, selected && styles.pageButtonTextSelected]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
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
