import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircularArcSlider } from '../components/Slider';
import { TOKENS } from '../tokens';

const CircularArcSliderScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [bathDirection, setBathDirection] = useState(70);
  const [fanSwingRange, setFanSwingRange] = useState<[number, number]>([30, 90]);
  const [airFixedPos, setAirFixedPos] = useState(1);
  const [dimmerAngle, setDimmerAngle] = useState(120);
  const [curtainOpen, setCurtainOpen] = useState(20);
  const [colorTemp, setColorTemp] = useState(2900);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + TOKENS.spacing.pagePaddingV },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <CircularArcSlider
            mode="single"
            min={60}
            max={120}
            step={10}
            value={bathDirection}
            onChange={setBathDirection}
            onChangeEnd={setBathDirection}
            size={320}
            startAngle={155}
            endAngle={260}
            clockwise={true}
            trackWidth={34}
            baseTrackColor="rgba(0,0,0,0.06)"
            activeTrackColor={TOKENS.colors.mainColor}
            handleStyle="solid"
            titleText="风向"
            subtitleText={`出风角度${bathDirection}度`}
            valueFormatter={(v) => `${Math.round(v)}°`}
            tickLabels={[
              { value: 60, text: '60', offsetY: 6, fontSize: 12 },
              { value: 80, text: '80', offsetY: 10, fontSize: 12 },
              { value: 90, text: '90', offsetY: 12, fontSize: 12 },
              { value: 120, text: '120', offsetY: 14, fontSize: 12 },
            ]}
            showCenterGuide={true}
          />
        </View>
        <View style={[styles.card, styles.cardSpacing]}>
          <CircularArcSlider
            mode="range"
            min={0}
            max={120}
            step={30}
            rangeValue={fanSwingRange}
            onRangeChange={setFanSwingRange}
            onRangeChangeEnd={setFanSwingRange}
            symmetricRange={true}
            size={320}
            startAngle={215}
            endAngle={325}
            clockwise={true}
            trackWidth={34}
            activeFillStyle="sector"
            baseTrackColor="rgba(0,0,0,0.08)"
            activeTrackColor={TOKENS.colors.mainColor}
            titleText="左右扫风角度"
            subtitleText={`${Math.round((fanSwingRange[1] - fanSwingRange[0]) / 2)}度`}
            rangeValueFormatter={(range) => `${Math.round((range[1] - range[0]) / 2)}°`}
            tickLabels={[
              { value: 60, text: '60', fontSize: 10 },
              { value: 90, text: '90', fontSize: 10 },
              { value: 120, text: '120', fontSize: 10 },
            ]}
            showCenterGuide={true}
          />
        </View>
        <View style={[styles.card, styles.cardSpacing]}>
          <CircularArcSlider
            mode="single"
            min={0}
            max={4}
            step={1}
            value={airFixedPos}
            onChange={setAirFixedPos}
            onChangeEnd={setAirFixedPos}
            size={320}
            startAngle={245}
            endAngle={470}
            clockwise={true}
            trackWidth={32}
            baseTrackColor="rgba(0,0,0,0.08)"
            activeTrackColor={TOKENS.colors.mainColor}
            titleText="上下扫风定格位置"
            subtitleText={['上定格', '偏上定格', '中定格', '偏下定格', '下定格'][airFixedPos] ?? '中定格'}
            centerValueText={['上', '偏上', '中', '偏下', '下'][airFixedPos] ?? '中'}
            tickDots={[
              { value: 0, radius: 3 },
              { value: 1, radius: 3 },
              { value: 2, radius: 3 },
              { value: 3, radius: 3 },
              { value: 4, radius: 3 },
            ]}
            tickLabels={[
              { value: 0, text: '上', fontSize: 10 },
              { value: 2, text: '中', fontSize: 10 },
              { value: 4, text: '下', fontSize: 10 },
            ]}
            showCenterGuide={true}
          />
        </View>
        <View style={[styles.card, styles.cardSpacing]}>
          <CircularArcSlider
            mode="single"
            min={0}
            max={180}
            step={1}
            value={dimmerAngle}
            onChange={setDimmerAngle}
            onChangeEnd={setDimmerAngle}
            size={320}
            startAngle={180}
            endAngle={360}
            clockwise={true}
            trackWidth={34}
            baseTrackColor="rgba(0,0,0,0.08)"
            activeTrackColor={TOKENS.colors.mainColor}
            titleText="调光"
            subtitleText={`${Math.round(dimmerAngle)}°`}
            valueFormatter={(v) => `${Math.round(v)}`}
            centerValueUnitText="°"
            tickLabels={[
              { value: 0, text: '0', fontSize: 10, offsetY: -2 },
              { value: 180, text: '180', fontSize: 10, offsetY: -2 },
            ]}
            showCenterGuide={true}
          />
        </View>
        <View style={[styles.card, styles.cardSpacing]}>
          <CircularArcSlider
            mode="single"
            min={0}
            max={100}
            step={1}
            value={curtainOpen}
            onChange={setCurtainOpen}
            onChangeEnd={setCurtainOpen}
            size={320}
            startAngle={180}
            endAngle={360}
            clockwise={true}
            trackWidth={34}
            baseTrackColor="rgba(0,0,0,0.08)"
            activeTrackColor={TOKENS.colors.mainColor}
            titleText="窗帘开合位置"
            subtitleText={`${Math.round(curtainOpen)}%`}
            valueFormatter={(v) => `${Math.round(v)}`}
            centerValueUnitText="%"
            showCenterGuide={true}
          />
        </View>
        <View style={[styles.card, styles.cardSpacing]}>
          <CircularArcSlider
            mode="single"
            min={2700}
            max={6500}
            step={100}
            value={colorTemp}
            onChange={setColorTemp}
            onChangeEnd={setColorTemp}
            size={320}
            startAngle={180}
            endAngle={360}
            clockwise={true}
            trackWidth={34}
            baseTrackColor="rgba(0,0,0,0.08)"
            activeFillStyle="arc"
            activeTrackGradient={[
              { offset: '0%', color: '#F8A700' },
              { offset: '45%', color: '#F6D97F' },
              { offset: '100%', color: '#6BAEEA' },
            ]}
            handleStyle="hollow"
            handleColor="#F8A700"
            handleBorderColor="#F8A700"
            titleText="色温"
            subtitleText={`${Math.round(colorTemp)}K`}
            valueFormatter={(v) => `${Math.round(v)}`}
            centerValueUnitText="K"
            showCenterGuide={true}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.colors.pageBg,
    paddingHorizontal: TOKENS.spacing.pagePaddingH,
  },
  scrollContent: {
    paddingBottom: TOKENS.spacing.pagePaddingV,
  },
  card: {
    width: '100%',
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
    paddingHorizontal: TOKENS.spacing.cardInnerPaddingH,
    paddingVertical: TOKENS.spacing.cardInnerPaddingV,
  },
  cardSpacing: {
    marginTop: TOKENS.spacing.itemGap,
  },
});

export default CircularArcSliderScreen;
