import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { DotSlider, NumberValueSlider } from '../../components/Slider';
import { RemoteControlStepper } from '../../components/RemoteControlStepper';
import { PageTabSwitch } from '../../components/PageSwitch';
import { TOKENS } from '../../tokens';

type WaterHeaterTemperatureControlType = 0 | 1 | 2;

const VIEW_TABS = ['1', '2', '3'] as const;
const MIN_TEMP = 35;
const MAX_TEMP = 65;
const TEMP_STEP = 1;
const WATER_HEATER_EQUIPMENT_IMAGE = require('../../assets/equipment/waterhearter.png');

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const WaterHeaterTemperatureScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<WaterHeaterTemperatureControlType>(0);
  const [temperatureValue, setTemperatureValue] = useState(42);

  const subtitleText = useMemo(() => {
    if (activeTab === 0) return `${temperatureValue}℃`;
    return '35~65℃';
  }, [activeTab, temperatureValue]);

  const commitTemperature = (nextValue: number) => {
    setTemperatureValue(clamp(Math.round(nextValue), MIN_TEMP, MAX_TEMP));
  };

  const renderCurrentControl = () => {
    if (activeTab === 0) {
      return (
        <DotSlider
          value={temperatureValue}
          onChange={commitTemperature}
          min={MIN_TEMP}
          max={MAX_TEMP}
          showDots={false}
          snapToDots={false}
          showFill={true}
          fillMode="left"
          showEdgeValues={true}
          edgeValues={['35', '65']}
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
          range={[MIN_TEMP, MAX_TEMP]}
          step={TEMP_STEP}
          value={temperatureValue}
          onChange={commitTemperature}
          unitLabel="℃"
          enableContinuousPress={true}
          temperatureIconMode="warm"
        />
      );
    }

    return (
      <NumberValueSlider
        min={MIN_TEMP}
        max={MAX_TEMP}
        step={TEMP_STEP}
        value={temperatureValue}
        onChange={commitTemperature}
        onChangeEnd={commitTemperature}
        temperatureIconMode="warm"
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>热水器</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={WATER_HEATER_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft
              titleText="温度调节"
              subtitleEnabled={true}
              subtitleText={subtitleText}
              rightEnabled={false}
            />
          </View>

          <View style={activeTab === 1 ? styles.stepperPanel : styles.controlPanel}>
            {renderCurrentControl()}
          </View>
        </View>

        <PageTabSwitch
          activeIndex={activeTab}
          onChange={(index) => setActiveTab(index as WaterHeaterTemperatureControlType)}
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

export default WaterHeaterTemperatureScreen;
