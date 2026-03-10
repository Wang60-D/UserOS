import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseArcSlider, DotSlider } from '../components/Slider';
import { TOKENS } from '../tokens';

interface ShapeNodePreset {
  nodeId: string;
  name: string;
  arcAngle: number;
  openingAngle: number;
  pointCount: number;
  showEndLabels: boolean;
  middleDotsEvenlyDistributed: boolean;
}

const SHAPE_NODE_PRESETS: ShapeNodePreset[] = [
  {
    nodeId: '889:6999',
    name: '风向',
    arcAngle: 90,
    openingAngle: 300,
    pointCount: 4,
    showEndLabels: false,
    middleDotsEvenlyDistributed: true,
  },
  {
    nodeId: '889:6957',
    name: '左右扫风角度',
    arcAngle: 240,
    openingAngle: 90,
    pointCount: 9,
    showEndLabels: false,
    middleDotsEvenlyDistributed: true,
  },
  {
    nodeId: '889:6983',
    name: '上下扫风定格位置',
    arcAngle: 180,
    openingAngle: 0,
    pointCount: 7,
    showEndLabels: true,
    middleDotsEvenlyDistributed: true,
  },
  {
    nodeId: '889:7017',
    name: '调光',
    arcAngle: 180,
    openingAngle: 270,
    pointCount: 2,
    showEndLabels: true,
    middleDotsEvenlyDistributed: false,
  },
  {
    nodeId: '1100:3638',
    name: '窗帘开合位置',
    arcAngle: 180,
    openingAngle: 90,
    pointCount: 1,
    showEndLabels: false,
    middleDotsEvenlyDistributed: false,
  },
  {
    nodeId: '1100:3639',
    name: '风速',
    arcAngle: 180,
    openingAngle: 90,
    pointCount: 1,
    showEndLabels: false,
    middleDotsEvenlyDistributed: false,
  },
  {
    nodeId: '1100:3640',
    name: '温度调节 23.5℃',
    arcAngle: 180,
    openingAngle: 90,
    pointCount: 2,
    showEndLabels: true,
    middleDotsEvenlyDistributed: true,
  },
  {
    nodeId: '1100:3641',
    name: '温度调节 47℃',
    arcAngle: 180,
    openingAngle: 90,
    pointCount: 2,
    showEndLabels: true,
    middleDotsEvenlyDistributed: true,
  },
  {
    nodeId: '1100:3642',
    name: '温度调节 3℃',
    arcAngle: 180,
    openingAngle: 90,
    pointCount: 2,
    showEndLabels: true,
    middleDotsEvenlyDistributed: true,
  },
  {
    nodeId: '1100:3643',
    name: '目标湿度',
    arcAngle: 180,
    openingAngle: 90,
    pointCount: 2,
    showEndLabels: false,
    middleDotsEvenlyDistributed: true,
  },
  {
    nodeId: '1100:3644',
    name: '亮度',
    arcAngle: 180,
    openingAngle: 90,
    pointCount: 2,
    showEndLabels: false,
    middleDotsEvenlyDistributed: true,
  },
  {
    nodeId: '1100:3645',
    name: '色温',
    arcAngle: 180,
    openingAngle: 90,
    pointCount: 2,
    showEndLabels: false,
    middleDotsEvenlyDistributed: true,
  },
  {
    nodeId: '1100:3646',
    name: '延时开启 1小时20分钟',
    arcAngle: 180,
    openingAngle: 90,
    pointCount: 2,
    showEndLabels: true,
    middleDotsEvenlyDistributed: true,
  },
  {
    nodeId: '1100:3647',
    name: '延时开启 1小时20分钟',
    arcAngle: 180,
    openingAngle: 90,
    pointCount: 2,
    showEndLabels: true,
    middleDotsEvenlyDistributed: true,
  },
  {
    nodeId: '1100:3648',
    name: '音量',
    arcAngle: 180,
    openingAngle: 90,
    pointCount: 2,
    showEndLabels: false,
    middleDotsEvenlyDistributed: false,
  },
];

const BaseArcScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [presetIndex, setPresetIndex] = useState(0);
  const currentPreset = SHAPE_NODE_PRESETS[presetIndex];
  const [value, setValue] = useState(20);
  const [arcAngle, setArcAngle] = useState(currentPreset.arcAngle);
  const [openingAngle, setOpeningAngle] = useState(currentPreset.openingAngle);
  const [showEndLabels, setShowEndLabels] = useState(currentPreset.showEndLabels);
  const [middleDotsEvenlyDistributed, setMiddleDotsEvenlyDistributed] = useState(
    currentPreset.middleDotsEvenlyDistributed
  );
  const [showMiddleDots, setShowMiddleDots] = useState(true);
  const [pointCount, setPointCount] = useState(currentPreset.pointCount);

  const applyPreset = (nextPreset: ShapeNodePreset) => {
    setArcAngle(nextPreset.arcAngle);
    setOpeningAngle(nextPreset.openingAngle);
    setPointCount(nextPreset.pointCount);
    setShowEndLabels(nextPreset.showEndLabels);
    setMiddleDotsEvenlyDistributed(nextPreset.middleDotsEvenlyDistributed);
    setShowMiddleDots(nextPreset.pointCount > 0);
  };

  const handleChangePreset = (delta: number) => {
    const nextIndex =
      (presetIndex + delta + SHAPE_NODE_PRESETS.length) % SHAPE_NODE_PRESETS.length;
    setPresetIndex(nextIndex);
    applyPreset(SHAPE_NODE_PRESETS[nextIndex]);
  };

  const handleChangeArcAngle = (delta: number) => {
    setArcAngle((prev) => Math.max(90, Math.min(360, prev + delta)));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        scrollEnabled={true}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + TOKENS.spacing.pagePaddingV },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.controlCard}>
          <Text style={styles.controlTitle}>Shape 节点预设</Text>
          <Text style={styles.hintText}>
            {currentPreset.nodeId} · {currentPreset.name}（{presetIndex + 1}/{SHAPE_NODE_PRESETS.length}）
          </Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => handleChangePreset(-1)}
              activeOpacity={0.75}
            >
              <Text style={styles.stepButtonText}>{'<'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => applyPreset(currentPreset)}
              activeOpacity={0.75}
            >
              <Text style={styles.stepButtonText}>R</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => handleChangePreset(1)}
              activeOpacity={0.75}
            >
              <Text style={styles.stepButtonText}>{'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <BaseArcSlider
          value={value}
          onChange={setValue}
          onChangeEnd={setValue}
          arcAngle={arcAngle}
          openingAngle={openingAngle}
          showEndLabels={showEndLabels}
          middleDotsEvenlyDistributed={middleDotsEvenlyDistributed}
          showMiddleDots={showMiddleDots}
          pointCount={pointCount}
        />

        <View style={styles.controlCard}>
          <Text style={styles.controlTitle}>圆弧角度</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => handleChangeArcAngle(-10)}
              activeOpacity={0.75}
            >
              <Text style={styles.stepButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.valueText}>{arcAngle}°</Text>
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => handleChangeArcAngle(10)}
              activeOpacity={0.75}
            >
              <Text style={styles.stepButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hintText}>范围 90° - 360°，步进 10°</Text>
        </View>

        <View style={[styles.controlCard, styles.directionCard]}>
          <Text style={styles.controlTitle}>开口方向角度</Text>
          <Text style={styles.valueText}>{openingAngle}°</Text>
          <View style={styles.sliderWrap}>
            <DotSlider
              min={0}
              max={359}
              step={1}
              value={openingAngle}
              onChange={setOpeningAngle}
              onChangeEnd={setOpeningAngle}
              showDots={false}
              snapToDots={false}
              showFill={true}
              fillMode="left"
              showEdgeValues={true}
              edgeValues={['0°', '359°']}
              showTickLabels={false}
              emitChangeWhileDragging={true}
            />
          </View>
          <Text style={styles.hintText}>0° 在右侧，90° 在下方，180° 在左侧，270° 在上方</Text>
        </View>

        <View style={[styles.controlCard, styles.directionCard]}>
          <Text style={styles.controlTitle}>标注开关</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>点数量</Text>
            <View style={styles.counterWrap}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setPointCount((prev) => Math.max(1, prev - 1))}
                activeOpacity={0.75}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterValueText}>{pointCount}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setPointCount((prev) => Math.min(10, prev + 1))}
                activeOpacity={0.75}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>两端文字</Text>
            <TouchableOpacity
              style={[styles.toggleButton, showEndLabels && styles.toggleButtonActive]}
              onPress={() => setShowEndLabels((prev) => !prev)}
              activeOpacity={0.75}
            >
              <Text style={[styles.toggleButtonText, showEndLabels && styles.toggleButtonTextActive]}>
                {showEndLabels ? '开启' : '关闭'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>中间点平均分布</Text>
            <TouchableOpacity
              style={[styles.toggleButton, middleDotsEvenlyDistributed && styles.toggleButtonActive]}
              onPress={() => setMiddleDotsEvenlyDistributed((prev) => !prev)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  middleDotsEvenlyDistributed && styles.toggleButtonTextActive,
                ]}
              >
                {middleDotsEvenlyDistributed ? '开启' : '关闭'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>中间点显示</Text>
            <TouchableOpacity
              style={[styles.toggleButton, showMiddleDots && styles.toggleButtonActive]}
              onPress={() => setShowMiddleDots((prev) => !prev)}
              activeOpacity={0.75}
            >
              <Text style={[styles.toggleButtonText, showMiddleDots && styles.toggleButtonTextActive]}>
                {showMiddleDots ? '开启' : '关闭'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hintText}>
            规则：当两端文字开启时，两端圆点与外层两端坐标值自动隐藏；外层坐标值与中间点位置匹配。
          </Text>
          <Text style={styles.hintText}>
            当前预设值：arcAngle={arcAngle}，openingAngle={openingAngle}，pointCount={pointCount}，两端文字
            {showEndLabels ? '开启' : '关闭'}，平均分布
            {middleDotsEvenlyDistributed ? '开启' : '关闭'}。
          </Text>
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
  controlCard: {
    marginTop: 12,
    borderRadius: TOKENS.radius.card,
    backgroundColor: TOKENS.colors.cardBg,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  directionCard: {
    marginTop: 10,
  },
  controlTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TOKENS.colors.textPrimary,
  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepButton: {
    width: 40,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TOKENS.colors.rightPillBg,
  },
  stepButtonText: {
    fontSize: 20,
    lineHeight: 22,
    color: TOKENS.colors.textPrimary,
    fontWeight: '500',
  },
  valueText: {
    fontSize: 20,
    color: TOKENS.colors.textPrimary,
    fontWeight: '600',
  },
  hintText: {
    marginTop: 6,
    fontSize: 12,
    color: TOKENS.colors.subtitleText,
  },
  sliderWrap: {
    marginTop: 10,
  },
  toggleRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 14,
    color: TOKENS.colors.textPrimary,
    fontWeight: '500',
  },
  toggleButton: {
    minWidth: 64,
    height: 30,
    borderRadius: 15,
    backgroundColor: TOKENS.colors.rightPillBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  toggleButtonActive: {
    backgroundColor: TOKENS.colors.mainColor,
  },
  toggleButtonText: {
    fontSize: 13,
    color: TOKENS.colors.rightText,
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
  },
  counterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counterButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: TOKENS.colors.rightPillBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    fontSize: 18,
    lineHeight: 20,
    color: TOKENS.colors.textPrimary,
    fontWeight: '600',
  },
  counterValueText: {
    minWidth: 20,
    textAlign: 'center',
    fontSize: 15,
    color: TOKENS.colors.textPrimary,
    fontWeight: '600',
  },
});

export default BaseArcScreen;
