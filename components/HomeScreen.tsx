import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// 定义分类数据结构
interface Category {
  title: string;
  tabs: string[];
}

// 分类数据
const categories: Category[] = [
  {
    title: '模式',
    tabs: ['空调', '空气净化器', '灯光', '音效', '耳机', '冰箱'],
  },
  {
    title: '档位',
    tabs: ['风速', '加湿器', '净烟机', '电暖器'],
  },
  {
    title: '方位',
    tabs: ['出风', '浴霸', '风扇', '空调扫风', '空调定格', '梦幻帘'],
  },
  {
    title: '温度',
    tabs: ['空调', '热水器', '冰箱', '电热水壶'],
  },
  {
    title: '按钮',
    tabs: ['方形'],
  },
  {
    title: '无极',
    tabs: ['灯光', '音量', '播放器', '窗帘', '加湿器', '风扇'],
  },
  {
    title: '时间',
    tabs: ['单把手', '双把手', '倒计时', '延时'],
  },
  {
    title: '组件',
    tabs: ['控件标题','按钮','滑条','开关滑条','数字滑条','步进器','圆规','播放器','时间滚轮'],
  },
];

interface TabButtonProps {
  label: string;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.tabButtonText}>{label}</Text>
    </TouchableOpacity>
  );
};

interface CategorySectionProps {
  category: Category;
}

interface CategorySectionProps {
  category: Category;
  onButtonClick: (categoryTitle: string, tab: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, onButtonClick }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleTabPress = (tab: string) => {
    // 导航到对应的子页面
    if (category.title === '模式' && tab === '空调') {
      navigation.navigate('AirConditioner');
      return;
    }
    if (category.title === '组件' && tab === '控件标题') {
      navigation.navigate('ControlTitle');
      return;
    }
    if (category.title === '组件' && tab === '按钮') {
      navigation.navigate('ButtonGroup');
      return;
    }
    // 调用父组件的点击处理函数
    onButtonClick(category.title, tab);
  };

  return (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{category.title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
        style={styles.tabsScrollView}
      >
        {category.tabs.map((tab, index) => (
          <TabButton
            key={index}
            label={tab}
            onPress={() => handleTabPress(tab)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

// Toast 组件
interface ToastProps {
  message: string;
  visible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, visible }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(false);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (visible && message) {
      // 停止之前的动画
      if (animationRef.current) {
        animationRef.current.stop();
      }
      
      setShouldRender(true);
      opacity.setValue(0); // 重置透明度
      
      // 显示动画
      animationRef.current = Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000), // 显示2秒
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);
      
      animationRef.current.start(() => {
        // 动画完成后隐藏组件
        setShouldRender(false);
        animationRef.current = null;
      });
    } else if (!visible) {
      // 如果 visible 变为 false，立即隐藏
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      setShouldRender(false);
    }
  }, [visible, message, opacity]);

  if (!shouldRender || !message) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity,
          transform: [
            {
              translateY: opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const HomeScreen: React.FC = () => {
  // 记录每个按钮的点击次数，格式：{ "模式-空调": 5 }
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Rick Roll 视频链接
  const RICK_ROLL_URL = 'https://www.bilibili.com/video/BV1GJ411x7h7/?share_source=copy_web&vd_source=2824ac185a2d8f2f7972561dd0b51013';

  const handleButtonClick = (categoryTitle: string, tab: string) => {
    const buttonKey = `${categoryTitle}-${tab}`;
    const currentCount = (clickCounts[buttonKey] || 0) + 1;
    
    // 更新点击次数
    setClickCounts((prev) => ({
      ...prev,
      [buttonKey]: currentCount,
    }));

    // 显示 Toast
    setToastMessage(`点击了${buttonKey}按钮${currentCount}次`);
    setToastVisible(false); // 先隐藏，确保动画重置
    setTimeout(() => {
      setToastVisible(true); // 再显示，触发新的动画
    }, 50);

    // 如果点击了10次以上，跳转到 Rick Roll 视频
    if (currentCount >= 10) {
      // 延迟一下，让用户看到 Toast
      setTimeout(() => {
        Linking.openURL(RICK_ROLL_URL).catch((err) => {
          console.error('打开链接失败:', err);
        });
      }, 500);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category, index) => (
          <CategorySection
            key={index}
            category={category}
            onButtonClick={handleButtonClick}
          />
        ))}
      </ScrollView>
      
      {/* Toast 提示 */}
      <Toast message={toastMessage} visible={toastVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS 系统背景色
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: '700', // iOS SF Pro Bold
    color: '#000000',
    marginBottom: 16,
    letterSpacing: -0.5, // iOS 字体间距
  },
  tabsContainer: {
    paddingRight: 16,
  },
  tabsScrollView: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  tabButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // iOS 阴影效果
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android 阴影
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '500', // iOS SF Pro Medium
    color: '#0CCE94', // iOS 系统蓝色
    letterSpacing: -0.3,
  },
  // Toast 样式
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    // iOS 阴影
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Android 阴影
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HomeScreen;
