import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  PanResponder,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 模式类型
type Mode = 'cool' | 'heat' | 'dehumidify' | 'fan';

// 模式配置
const modes: { key: Mode; label: string; iconSource: any; emoji: string }[] = [
  { 
    key: 'cool', 
    label: '制冷', 
    iconSource: (() => {
      try {
        return require('../assets/icons/cool.png');
      } catch {
        return null;
      }
    })(),
    emoji: '❄️'
  },
  { 
    key: 'heat', 
    label: '制热', 
    iconSource: (() => {
      try {
        return require('../assets/icons/heat.png');
      } catch {
        return null;
      }
    })(),
    emoji: '☀️'
  },
  { 
    key: 'dehumidify', 
    label: '除湿', 
    iconSource: (() => {
      try {
        return require('../assets/icons/dehumidify.png');
      } catch {
        return null;
      }
    })(),
    emoji: '💧'
  },
  { 
    key: 'fan', 
    label: '送风', 
    iconSource: (() => {
      try {
        return require('../assets/icons/fan.png');
      } catch {
        return null;
      }
    })(),
    emoji: '💨'
  },
];

// 设备图标
let equipmentImageSource: any = null;
try {
  equipmentImageSource = require('../assets/equipment/air-conditioner.png');
} catch {
  equipmentImageSource = null;
}

// 按钮模式组件
interface ButtonModeComponentProps {
  selectedMode: Mode;
  onModeChange: (mode: Mode) => void;
}

const ButtonModeComponent: React.FC<ButtonModeComponentProps> = ({
  selectedMode,
  onModeChange,
}) => {
  return (
    <View style={styles.buttonModeContainer}>
      <View style={styles.buttonModeRow}>
        {modes.map((mode, index) => (
          <TouchableOpacity
            key={mode.key}
            style={[
              styles.modeButton,
              index < modes.length - 1 && { marginRight: 8.5 },
            ]}
            onPress={() => onModeChange(mode.key)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.modeButtonIcon,
                selectedMode === mode.key && styles.modeButtonIconActive,
                { marginBottom: 9 },
              ]}
            >
              {mode.iconSource ? (
                <Image
                  source={mode.iconSource}
                  style={styles.modeButtonIconImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.modeButtonIconEmoji}>{mode.emoji}</Text>
              )}
            </View>
            <Text
              style={[
                styles.modeButtonLabel,
                selectedMode === mode.key && styles.modeButtonLabelActive,
              ]}
            >
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// 滑条模式组件
interface SliderModeComponentProps {
  selectedMode: Mode;
  onModeChange: (mode: Mode) => void;
}

const SliderModeComponent: React.FC<SliderModeComponentProps> = ({
  selectedMode,
  onModeChange,
}) => {
  // === 基础状态 ===
  const selectedIndex = modes.findIndex((m) => m.key === selectedMode);
  const [trackWidth, setTrackWidth] = useState(0);
  
  // === 动画值 ===
  const translateX = useRef(new Animated.Value(0)).current;
  
  // === 常量定义 ===
  const THUMB_WIDTH = 80;      // 蓝色胶囊宽度
  const TRACK_HEIGHT = 52;     // 轨道高度
  const TRACK_PADDING = 4;     // 轨道内边距
  const STEP_COUNT = modes.length - 1;

  // === 状态引用，用于手势闭包 ===
  const stateRef = useRef({
    trackWidth: 0,
    selectedIndex,
    selectedMode,
  });

  useEffect(() => {
    stateRef.current.selectedIndex = selectedIndex;
    stateRef.current.selectedMode = selectedMode;
  }, [selectedIndex, selectedMode]);

  /**
   * 计算位置：索引 -> 像素
   */
  const getPositionForIndex = useCallback((index: number, width: number): number => {
    if (width <= 0) return 0;
    const usableWidth = width - TRACK_PADDING * 2 - THUMB_WIDTH;
    return (index / STEP_COUNT) * usableWidth;
  }, []);

  /**
   * 移动并吸附
   */
  const moveToIndex = useCallback((index: number) => {
    const width = stateRef.current.trackWidth;
    if (width <= 0) return;

    const targetX = getPositionForIndex(index, width);
    
    Animated.spring(translateX, {
      toValue: targetX,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();

    if (modes[index].key !== stateRef.current.selectedMode) {
      onModeChange(modes[index].key);
    }
  }, [onModeChange, getPositionForIndex, translateX]);

  /**
   * 外部同步：当模式改变时（如点击下方文字），滑块跟随移动
   */
  useEffect(() => {
    if (trackWidth > 0) {
      const targetX = getPositionForIndex(selectedIndex, trackWidth);
      Animated.spring(translateX, {
        toValue: targetX,
        useNativeDriver: false,
        tension: 60,
        friction: 10,
      }).start();
    }
  }, [selectedIndex, trackWidth, getPositionForIndex, translateX]);
  /**
   * === 手势处理器 (PanResponder) ===
   */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const { locationX } = evt.nativeEvent;
        const width = stateRef.current.trackWidth;
        
        if (width > 0) {
          // --- 点击跳转功能 ---
          // 1. 计算点击区域对应的索引
          const segmentWidth = width / modes.length;
          const clickedIndex = Math.max(0, Math.min(modes.length - 1, Math.floor(locationX / segmentWidth)));
          
          // 2. 执行跳转动画和状态更新
          moveToIndex(clickedIndex);

          // 3. 为后续可能的拖动做准备
          // 我们需要停止之前的动画干扰，并将 Offset 设为目标位置
          const targetX = getPositionForIndex(clickedIndex, width);
          translateX.stopAnimation();
          translateX.setOffset(targetX);
          translateX.setValue(0);
        }
      },

      onPanResponderMove: (_, gestureState) => {
        const width = stateRef.current.trackWidth;
        if (width <= 0) return;

        const usableWidth = width - TRACK_PADDING * 2 - THUMB_WIDTH;
        const currentOffset = (translateX as any)._offset || 0;
        
        let targetValue = gestureState.dx;
        
        // 边界限制
        if (currentOffset + targetValue < 0) {
          targetValue = -currentOffset;
        } else if (currentOffset + targetValue > usableWidth) {
          targetValue = usableWidth - currentOffset;
        }
        
        translateX.setValue(targetValue);
      },

      onPanResponderRelease: () => {
        const width = stateRef.current.trackWidth;
        if (width <= 0) return;

        translateX.flattenOffset();
        
        translateX.stopAnimation((finalX) => {
          const usableWidth = width - TRACK_PADDING * 2 - THUMB_WIDTH;
          const ratio = Math.max(0, Math.min(1, finalX / usableWidth));
          const nearestIndex = Math.round(ratio * STEP_COUNT);
          moveToIndex(nearestIndex);
        });
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  return (
    <View style={styles.sliderFullWrapper}>
      {/* 轨道层 */}
      <View 
        style={[styles.newTrack, { 
          height: TRACK_HEIGHT, 
          borderRadius: TRACK_HEIGHT / 2, 
          padding: TRACK_PADDING 
        }]}
        onLayout={(e) => {
          const width = e.nativeEvent.layout.width;
          setTrackWidth(width);
          stateRef.current.trackWidth = width;
        }}
        {...panResponder.panHandlers}
      >
        {/* 背景图标 */}
        <View style={styles.newBgIconsLayer}>
          {modes.map((mode, index) => (
            <View key={`icon-${index}`} style={styles.newIconSlot}>
              <Text style={styles.newBgEmoji}>{mode.emoji}</Text>
            </View>
          ))}
        </View>

        {/* 蓝色胶囊 */}
        <Animated.View
          style={[
            styles.newThumb,
            {
              width: THUMB_WIDTH,
              height: TRACK_HEIGHT - TRACK_PADDING * 2,
              borderRadius: (TRACK_HEIGHT - TRACK_PADDING * 2) / 2,
              transform: [{ translateX }],
            }
          ]}
          pointerEvents="none" // 触摸穿透到轨道容器
        >
          <View style={styles.newThumbContent}>
            <Text style={styles.newThumbEmoji}>{modes[selectedIndex]?.emoji || '❄️'}</Text>
          </View>
        </Animated.View>
      </View>

      {/* 底部文字 */}
      <View style={styles.newLabelRow}>
        {modes.map((mode, index) => (
          <TouchableOpacity 
            key={`label-${index}`} 
            style={styles.newLabelItem}
            onPress={() => moveToIndex(index)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.newLabelText, 
              selectedMode === mode.key && styles.newLabelActive
            ]}>
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const AirConditionerScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedMode, setSelectedMode] = useState<Mode>('cool');
  const [componentType, setComponentType] = useState<'button' | 'slider'>('button');

  return (
    <View style={styles.container}>
      {/* 移除 ScrollView，改用 View 以防止手势干扰 */}
      <View style={styles.contentContainer}>
        {/* 返回按钮 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>

        {/* 标题 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>空调</Text>
        </View>

        {/* 设备图标 */}
        <View style={styles.equipmentContainer}>
          {equipmentImageSource ? (
            <Image
              source={equipmentImageSource}
              style={styles.equipmentImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.equipmentPlaceholder}>
              <Text style={styles.equipmentPlaceholderText}>
                请从 Figma 下载{'\n'}空调设备图片
              </Text>
            </View>
          )}
        </View>

        {/* 模式切换组件 */}
        <View style={styles.componentsContainer}>
          <View style={styles.componentsCard}>
            {componentType === 'button' ? (
              <ButtonModeComponent
                selectedMode={selectedMode}
                onModeChange={setSelectedMode}
              />
            ) : (
              <SliderModeComponent
                selectedMode={selectedMode}
                onModeChange={setSelectedMode}
              />
            )}
          </View>
        </View>

        {/* 组件切换按钮 */}
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              componentType === 'button' && styles.switchButtonActive,
              { marginRight: 20 },
            ]}
            onPress={() => setComponentType('button')}
          >
            <Text
              style={[
                styles.switchButtonText,
                componentType === 'button' && styles.switchButtonTextActive,
              ]}
            >
              按钮模式
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchButton,
              componentType === 'slider' && styles.switchButtonActive,
            ]}
            onPress={() => setComponentType('slider')}
          >
            <Text
              style={[
                styles.switchButtonText,
                componentType === 'slider' && styles.switchButtonTextActive,
              ]}
            >
              滑条模式
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  contentContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#1E1E1E',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  equipmentContainer: {
    width: '100%',
    height: 392,
    paddingHorizontal: 56,
    paddingVertical: 135,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  equipmentImage: {
    width: 280,
    height: 100,
  },
  equipmentPlaceholder: {
    width: 280,
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equipmentPlaceholderText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  switchButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  switchButtonActive: {
    backgroundColor: '#809DE4',
    borderColor: '#809DE4',
  },
  switchButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  switchButtonTextActive: {
    color: '#FFFFFF',
  },
  componentsContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  componentsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonModeContainer: {
    width: '100%',
  },
  buttonModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  modeButtonIcon: {
    width: 51.13,
    height: 51.13,
    borderRadius: 63.913,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonIconActive: {
    backgroundColor: '#809DE4',
  },
  modeButtonIconImage: {
    width: 21.3,
    height: 21.3,
  },
  modeButtonIconEmoji: {
    fontSize: 21.3,
  },
  modeButtonLabel: {
    fontSize: 13.35,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.8)',
    textAlign: 'center',
  },
  modeButtonLabelActive: {
    color: 'rgba(0, 0, 0, 0.8)',
  },
  sliderFullWrapper: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  newTrack: {
    width: '100%',
    backgroundColor: '#F5F5F7',
    position: 'relative',
    justifyContent: 'center',
  },
  newBgIconsLayer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 32,
    zIndex: 1,
  },
  newIconSlot: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBgEmoji: {
    fontSize: 20,
    opacity: 0.8,
  },
  newThumb: {
    position: 'absolute',
    left: 4,
    backgroundColor: '#809DE4',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  newThumbContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newThumbEmoji: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  newLabelRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 12,
  },
  newLabelItem: {
    flex: 1,
    alignItems: 'center',
  },
  newLabelText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  newLabelActive: {
    color: '#333',
    fontWeight: '600',
  },
});

export default AirConditionerScreen;