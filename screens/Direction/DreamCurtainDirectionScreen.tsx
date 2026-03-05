import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../components/Slider';
import { PageTabSwitch } from '../../components/PageSwitch';
import { TOKENS } from '../../tokens';

type DreamCurtainControlType = 0 | 1;
type CurtainAction = 'left' | 'stop' | 'right';

const VIEW_TABS = ['1', '2'] as const;
const DREAM_CURTAIN_EQUIPMENT_IMAGE = require('../../assets/equipment/curtain.png');
const MIN_ANGLE = 0;
const MAX_ANGLE = 180;
const CONTINUOUS_STEP = 1;
const CONTINUOUS_INTERVAL_MS = 120;

const ACTION_ITEMS: Array<{
  key: CurtainAction;
  label: string;
  icon: any;
}> = [
  {
    key: 'left',
    label: '左调光',
    icon: require('../../assets/icons/curtain/left.png'),
  },
  {
    key: 'stop',
    label: '暂停',
    icon: require('../../assets/icons/curtain/stop.png'),
  },
  {
    key: 'right',
    label: '右调光',
    icon: require('../../assets/icons/curtain/right.png'),
  },
];

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const DreamCurtainDirectionScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<DreamCurtainControlType>(0);
  const [angleValue, setAngleValue] = useState(120);
  const [activeAction, setActiveAction] = useState<CurtainAction>('stop');
  const continuousTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const subtitleText = `${angleValue}°`;

  const stopContinuousAdjust = (resetAction = true) => {
    if (continuousTimerRef.current) {
      clearInterval(continuousTimerRef.current);
      continuousTimerRef.current = null;
    }
    if (resetAction) {
      setActiveAction('stop');
    }
  };

  const startContinuousAdjust = (action: Exclude<CurtainAction, 'stop'>) => {
    stopContinuousAdjust(false);
    setActiveAction(action);
    const delta = action === 'left' ? -CONTINUOUS_STEP : CONTINUOUS_STEP;
    continuousTimerRef.current = setInterval(() => {
      setAngleValue((prev) => clamp(prev + delta, MIN_ANGLE, MAX_ANGLE));
    }, CONTINUOUS_INTERVAL_MS);
  };

  useEffect(() => {
    if (activeTab !== 0) {
      stopContinuousAdjust(true);
    }
  }, [activeTab]);

  useEffect(() => () => stopContinuousAdjust(true), []);

  const renderButtonMode = () => (
    <View style={styles.actionRow}>
      {ACTION_ITEMS.map((item) => {
        const selected = item.key !== 'stop' && item.key === activeAction;
        return (
          <Pressable
            key={item.key}
            style={styles.actionItem}
            onPress={
              item.key === 'stop'
                ? () => {
                    stopContinuousAdjust(true);
                  }
                : () => {
                    if (item.key === 'left' || item.key === 'right') {
                      startContinuousAdjust(item.key);
                    }
                  }
            }
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <View style={[styles.actionCircle, selected && styles.actionCircleSelected]}>
              <Image
                source={item.icon}
                style={[styles.actionIcon, selected ? styles.actionIconSelected : styles.actionIconUnselected]}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.actionLabel}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderSliderMode = () => (
    <DotSlider
      value={angleValue}
      onChange={(next) => {
        setAngleValue(clamp(Math.round(next), MIN_ANGLE, MAX_ANGLE));
      }}
      min={MIN_ANGLE}
      max={MAX_ANGLE}
      showDots={false}
      snapToDots={false}
      dotDistribution="even"
      dotCount={7}
      showFill={true}
      fillMode="left"
      showEdgeValues={true}
      edgeValues={[0, 180]}
      showTickLabels={false}
      thumbOutlineColor={TOKENS.colors.mainColor}
      thumbOutlineWidth={2}
      emitChangeWhileDragging={true}
    />
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>梦幻帘</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={DREAM_CURTAIN_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft
              titleText="调光"
              subtitleEnabled={true}
              subtitleText={subtitleText}
              rightEnabled={false}
            />
          </View>

          <View style={activeTab === 0 ? styles.buttonPanel : styles.sliderPanel}>
            {activeTab === 0 ? renderButtonMode() : renderSliderMode()}
          </View>
        </View>

        <PageTabSwitch
          activeIndex={activeTab}
          onChange={(index) => setActiveTab(index as DreamCurtainControlType)}
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
  buttonPanel: {
    paddingTop: 8,
    paddingHorizontal: 14,
    paddingBottom: 18,
  },
  sliderPanel: {
    paddingTop: 8,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingBottom: TOKENS.spacing.cardInnerPaddingV,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: 84,
    alignItems: 'center',
  },
  actionCircle: {
    width: 50,
    height: 50,
    borderRadius: TOKENS.radius.circle,
    backgroundColor: TOKENS.colors.circleUnselectedBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCircleSelected: {
    backgroundColor: TOKENS.colors.mainColor,
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
  actionIconSelected: {
    tintColor: '#FFFFFF',
  },
  actionIconUnselected: {
    tintColor: TOKENS.colors.rightText,
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 13,
    color: TOKENS.colors.textPrimary,
    fontWeight: '500',
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

export default DreamCurtainDirectionScreen;
