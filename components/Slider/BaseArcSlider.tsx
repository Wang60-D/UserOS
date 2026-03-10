import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import CircularArcSlider from './CircularArcSlider';
import { TOKENS } from '../../tokens';

interface BaseArcSliderProps {
  value: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  title?: string;
  arcAngle?: number;
  openingAngle?: number;
  showEndLabels?: boolean;
  middleDotsEvenlyDistributed?: boolean;
  showMiddleDots?: boolean;
  pointCount?: number;
}

const BaseArcSlider: React.FC<BaseArcSliderProps> = ({
  value,
  onChange,
  onChangeEnd,
  title = '窗帘开合位置',
  arcAngle = 180,
  openingAngle = 90,
  showEndLabels = true,
  middleDotsEvenlyDistributed = true,
  showMiddleDots = true,
  pointCount = 3,
}) => {
  const roundedValue = Math.round(value);
  const valueAnchorY = 230;
  const trackWidth = 34;
  const outerCoordinatePadding = 5;
  const outerCoordinateRadiusOffset = trackWidth / 2 + outerCoordinatePadding;
  const normalizedArcAngle = Math.max(90, Math.min(360, arcAngle));
  const normalizedPointCount = Math.max(1, Math.min(10, Math.round(pointCount)));
  const { startAngle, endAngle } = useMemo(() => {
    const normalizedOpeningAngle = ((openingAngle % 360) + 360) % 360;
    const arcMidAngle = normalizedOpeningAngle + 180;
    return {
      startAngle: arcMidAngle - normalizedArcAngle / 2,
      endAngle: arcMidAngle + normalizedArcAngle / 2,
    };
  }, [normalizedArcAngle, openingAngle]);

  const middleDotValues = useMemo(
    () =>
      Array.from({ length: normalizedPointCount }, (_, index) => {
        const t = (index + 1) / (normalizedPointCount + 1);
        const ratio = middleDotsEvenlyDistributed ? t : Math.pow(t, 1.25);
        return Math.round(ratio * 100);
      }),
    [middleDotsEvenlyDistributed, normalizedPointCount]
  );
  const middleTickDots = showMiddleDots
    ? middleDotValues.map((dotValue) => ({
        value: dotValue,
        radius: 2.6,
        color: 'rgba(0,0,0,0.22)',
      }))
    : [];
  const edgeTickDots = showEndLabels
    ? []
    : [0, 100].map((dotValue) => ({
        value: dotValue,
        radius: 2.6,
        color: 'rgba(0,0,0,0.22)',
      }));
  const tickDots = [...middleTickDots, ...edgeTickDots];
  const tickLabels = showEndLabels
    ? [
        { value: 0, text: '0%', fontSize: 12, color: 'rgba(0,0,0,0.35)', offsetY: 2 },
        { value: 100, text: '100%', fontSize: 12, color: 'rgba(0,0,0,0.35)', offsetY: 2 },
      ]
    : [];
  // 外层坐标值与中间点位置保持一致；当内层已有两端文字时隐藏外层两端坐标值
  const outerCoordinateValues = showEndLabels ? middleDotValues : [0, ...middleDotValues, 100];
  const outerCoordinateLabels = outerCoordinateValues.map((coordinateValue) => ({
    value: coordinateValue,
    text: `${Math.round(coordinateValue)}`,
    radiusOffset: outerCoordinateRadiusOffset,
  }));

  return (
    <View style={styles.card}>
      <CircularArcSlider
        mode="single"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={onChange}
        onChangeEnd={onChangeEnd ?? onChange}
        size={300}
        centerValueAnchorY={valueAnchorY}
        followCenterValueAnchor={true}
        startAngle={startAngle}
        endAngle={endAngle}
        clockwise={true}
        trackWidth={trackWidth}
        baseTrackColor={TOKENS.colors.rightPillBg}
        activeTrackColor={TOKENS.colors.mainColor}
        handleStyle="hollow"
        handleColor={TOKENS.colors.mainColor}
        handleBorderColor={TOKENS.colors.mainColor}
        handleBorderWidth={5}
        titleText={title}
        subtitleText={`${roundedValue}%`}
        centerValueText={`${roundedValue}`}
        centerValueUnitText="%"
        tickDots={tickDots}
        tickLabels={tickLabels}
        tickLabelRadiusOffset={0}
        outerCoordinateLabels={outerCoordinateLabels}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});

export default BaseArcSlider;
