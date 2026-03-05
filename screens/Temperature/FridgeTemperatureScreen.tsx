import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { DotSlider, NumberValueSlider } from '../../components/Slider';
import { RemoteControlStepper } from '../../components/RemoteControlStepper';
import { TOKENS } from '../../tokens';

type FridgeTemperatureControlType = 0 | 1 | 2;

const VIEW_TABS = ['1', '2', '3'] as const;
const FRIDGE_MIN_TEMP = 2;
const FRIDGE_MAX_TEMP = 8;
const FRIDGE_STEP = 1;
const FREEZER_MIN_TEMP = -24;
const FREEZER_MAX_TEMP = 16;
const FREEZER_STEP = 1;
const FRIDGE_EQUIPMENT_IMAGE = require('../../assets/equipment/fridge.png');

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const FridgeTemperatureScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<FridgeTemperatureControlType>(0);
  const [fridgeValue, setFridgeValue] = useState(3);
  const [freezerValue, setFreezerValue] = useState(-16);

  const fridgeSubtitle = useMemo(() => {
    if (activeTab === 0) return `${fridgeValue}℃`;
    return '2~8℃';
  }, [activeTab, fridgeValue]);

  const freezerSubtitle = useMemo(() => {
    if (activeTab === 0) return `${freezerValue}℃`;
    return '-24~16℃';
  }, [activeTab, freezerValue]);

  const commitFridgeTemperature = (nextValue: number) => {
    setFridgeValue(clamp(Math.round(nextValue), FRIDGE_MIN_TEMP, FRIDGE_MAX_TEMP));
  };

  const commitFreezerTemperature = (nextValue: number) => {
    setFreezerValue(clamp(Math.round(nextValue), FREEZER_MIN_TEMP, FREEZER_MAX_TEMP));
  };

  const renderCardControl = (
    min: number,
    max: number,
    step: number,
    value: number,
    onChange: (nextValue: number) => void,
    edgeValues: [string, string]
  ) => {
    if (activeTab === 0) {
      return (
        <DotSlider
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          showDots={false}
          snapToDots={false}
          showFill={true}
          fillMode="left"
          showEdgeValues={true}
          edgeValues={edgeValues}
          showTickLabels={false}
          emitChangeWhileDragging={true}
          thumbOutlineColor={TOKENS.colors.mainColor}
          thumbOutlineWidth={2}
        />
      );
    }

    if (activeTab === 1) {
      return (
        <RemoteControlStepper
          range={[min, max]}
          step={step}
          value={value}
          onChange={onChange}
          unitLabel="℃"
          enableContinuousPress={true}
        />
      );
    }

    return (
      <NumberValueSlider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        onChangeEnd={onChange}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>冰箱</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={FRIDGE_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft
              titleText="冷藏室"
              subtitleEnabled={true}
              subtitleText={fridgeSubtitle}
              rightEnabled={false}
            />
          </View>
          <View style={activeTab === 1 ? styles.stepperPanel : styles.controlPanel}>
            {renderCardControl(
              FRIDGE_MIN_TEMP,
              FRIDGE_MAX_TEMP,
              FRIDGE_STEP,
              fridgeValue,
              commitFridgeTemperature,
              ['2', '8']
            )}
          </View>
        </View>

        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft
              titleText="冷冻室"
              subtitleEnabled={true}
              subtitleText={freezerSubtitle}
              rightEnabled={false}
            />
          </View>
          <View style={activeTab === 1 ? styles.stepperPanel : styles.controlPanel}>
            {renderCardControl(
              FREEZER_MIN_TEMP,
              FREEZER_MAX_TEMP,
              FREEZER_STEP,
              freezerValue,
              commitFreezerTemperature,
              ['-24', '16']
            )}
          </View>
        </View>

        <View style={styles.pageSwitchContainer}>
          {VIEW_TABS.map((label, index) => {
            const selected = index === activeTab;
            return (
              <Pressable
                key={label}
                style={[styles.pageButton, selected && styles.pageButtonSelected]}
                onPress={() => setActiveTab(index as FridgeTemperatureControlType)}
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
    marginBottom: 12,
  },
  titleRow: {
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingTop: TOKENS.spacing.cardInnerPaddingV,
    paddingBottom: 6,
  },
  controlPanel: {
    paddingTop: 8,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingBottom: TOKENS.spacing.cardInnerPaddingV,
  },
  stepperPanel: {
    paddingTop: 8,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingBottom: TOKENS.spacing.cardInnerPaddingV,
  },
  pageSwitchContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    columnGap: 18,
    marginTop: 36,
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

export default FridgeTemperatureScreen;
