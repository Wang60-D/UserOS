import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlTitleLeft from '../../components/ControlTitle/ControlTitleLeft';
import { DotSlider } from '../../components/Slider';
import { TOKENS } from '../../tokens';

type CurtainControlType = 0 | 1;
type CurtainAction = 'open' | 'stop' | 'close';

const VIEW_TABS = ['1', '2'] as const;
const CURTAIN_EQUIPMENT_IMAGE = require('../../assets/equipment/curtain.png');
const MIN_POSITION = 0;
const MAX_POSITION = 100;
const TAP_STEP = 10;
const LONG_PRESS_STEP = 1;
const LONG_PRESS_INTERVAL_MS = 120;

const ACTION_ITEMS: Array<{
  key: CurtainAction;
  label: string;
  icon: any;
}> = [
  {
    key: 'open',
    label: '打开',
    icon: require('../../assets/icons/curtain/open.png'),
  },
  {
    key: 'stop',
    label: '暂停',
    icon: require('../../assets/icons/curtain/stop.png'),
  },
  {
    key: 'close',
    label: '关闭',
    icon: require('../../assets/icons/curtain/off.png'),
  },
];

const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(maxValue, value));

const CurtainDirectionScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<CurtainControlType>(0);
  const [positionValue, setPositionValue] = useState(35);
  const [activeAction, setActiveAction] = useState<CurtainAction>('stop');
  const continuousTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isContinuousAdjustingRef = useRef(false);
  const longPressTriggeredRef = useRef(false);

  const subtitleText = `${positionValue}%`;

  const stopContinuousAdjust = (resetAction = true) => {
    if (continuousTimerRef.current) {
      clearInterval(continuousTimerRef.current);
      continuousTimerRef.current = null;
    }
    isContinuousAdjustingRef.current = false;
    if (resetAction) {
      setActiveAction('stop');
    }
  };

  const startContinuousAdjust = (action: Exclude<CurtainAction, 'stop'>) => {
    stopContinuousAdjust(false);
    longPressTriggeredRef.current = true;
    isContinuousAdjustingRef.current = true;
    setActiveAction(action);
    const delta = action === 'open' ? -LONG_PRESS_STEP : LONG_PRESS_STEP;
    continuousTimerRef.current = setInterval(() => {
      setPositionValue((prev) => clamp(prev + delta, MIN_POSITION, MAX_POSITION));
    }, LONG_PRESS_INTERVAL_MS);
  };

  const handleTapAdjust = (action: Exclude<CurtainAction, 'stop'>) => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    stopContinuousAdjust(false);
    setActiveAction(action);
    const delta = action === 'open' ? -TAP_STEP : TAP_STEP;
    setPositionValue((prev) => clamp(prev + delta, MIN_POSITION, MAX_POSITION));
  };

  const handlePressOut = () => {
    if (!isContinuousAdjustingRef.current) {
      setActiveAction('stop');
    }
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
                : () => handleTapAdjust(item.key)
            }
            onLongPress={
              item.key === 'stop'
                ? undefined
                : () => {
                    startContinuousAdjust(item.key);
                  }
            }
            onPressOut={item.key === 'stop' ? undefined : handlePressOut}
            delayLongPress={260}
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
      value={positionValue}
      onChange={(next) => {
        setPositionValue(clamp(Math.round(next), MIN_POSITION, MAX_POSITION));
      }}
      min={MIN_POSITION}
      max={MAX_POSITION}
      showDots={false}
      snapToDots={false}
      dotDistribution="even"
      dotCount={6}
      showFill={true}
      fillMode="left"
      showEdgeValues={false}
      showTickLabels={false}
      emitChangeWhileDragging={true}
      thumbOutlineColor={TOKENS.colors.mainColor}
      thumbOutlineWidth={2}
    />
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.pageTitle}>窗帘</Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <Image source={CURTAIN_EQUIPMENT_IMAGE} style={styles.equipmentImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.modeCard}>
          <View style={styles.titleRow}>
            <ControlTitleLeft
              titleText="窗帘位置"
              subtitleEnabled={true}
              subtitleText={subtitleText}
              rightEnabled={false}
            />
          </View>

          <View style={activeTab === 0 ? styles.buttonPanel : styles.sliderPanel}>
            {activeTab === 0 ? renderButtonMode() : renderSliderMode()}
          </View>
        </View>

        <View style={styles.pageSwitchContainer}>
          {VIEW_TABS.map((label, index) => {
            const selected = index === activeTab;
            return (
              <Pressable
                key={label}
                style={[styles.pageButton, selected && styles.pageButtonSelected]}
                onPress={() => setActiveTab(index as CurtainControlType)}
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

export default CurtainDirectionScreen;
