import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TOKENS } from '../tokens';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeNavigationProp = StackNavigationProp<RootStackParamList>;
type QuickActionRouteName = keyof Pick<RootStackParamList, 'Part1' | 'ComponentLibrary'>;

// 五个功能按钮的占位数据，支持 emoji 和可编辑文本
const QUICK_ACTIONS = [
  { emoji: '1️⃣', label: 'Part01', routeName: 'Part1' as QuickActionRouteName },
  { emoji: '2️⃣', label: 'Part02' },
  { emoji: '📚', label: '控件库', routeName: 'ComponentLibrary' as QuickActionRouteName },
  //{ emoji: '✨', label: '随机生成一个页面' },
];

interface QuickActionButtonProps {
  emoji: string;
  label: string;
  onPress: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  emoji,
  label,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.quickActionButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.quickActionEmoji}>{emoji}</Text>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

const HomeScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const navigation = useNavigation<HomeNavigationProp>();

  const handleQuickActionPress = (index: number) => {
    const action = QUICK_ACTIONS[index];
    if (action?.routeName) {
      navigation.navigate(action.routeName);
      return;
    }
    // 预留：后续可接入其他功能或路由
    console.log('Quick action pressed:', index, action);
  };

  const handleSend = () => {
    // 预留：后续接入 Gemini API
    const text = inputText.trim();
    if (text) {
      console.log('Send to Gemini:', text);
      setInputText('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 欢迎标题 */}
        <Text style={styles.welcomeTitle}>
          欢迎来到UserOS，
          这是一个基于米家组件库的用户体验测试系统。
        </Text>

        {/* 五个功能按钮 */}
        <View style={styles.quickActionsContainer}>
          {QUICK_ACTIONS.map((action, index) => (
            <QuickActionButton
              key={index}
              emoji={action.emoji}
              label={action.label}
              onPress={() => handleQuickActionPress(index)}
            />
          ))}
        </View>
      </ScrollView>

      {/* 底部固定输入栏 */}
      <View style={styles.inputBarContainer}>
        <View style={styles.inputBar}>
          <TouchableOpacity
            style={styles.inputBarLeftButton}
            onPress={() => {}}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.inputBarIcon}>+</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="问问 UserOS"
            placeholderTextColor="#8E8E93"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={2000}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />

          <View style={styles.inputBarRightButtons}>
            <TouchableOpacity
              style={styles.quickModeButton}
              onPress={() => {}}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.quickModeText}>快速</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {}}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.inputBarIcon}>🎤</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, styles.sendButton]}
              onPress={handleSend}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.sendIcon}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.colors.pageBg,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: TOKENS.spacing.pagePaddingH,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: TOKENS.colors.textPrimary,
    lineHeight: 36,
    marginTop: 64,
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  quickActionsContainer: {
    gap: 12,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TOKENS.colors.cardBg,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  quickActionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: TOKENS.colors.textPrimary,
    letterSpacing: -0.3,
  },
  inputBarContainer: {
    paddingHorizontal: TOKENS.spacing.pagePaddingH,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    paddingTop: 12,
    backgroundColor: TOKENS.colors.pageBg,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: TOKENS.radius.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  inputBarLeftButton: {
    padding: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  inputBarIcon: {
    fontSize: 20,
    color: '#8E8E93',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: TOKENS.colors.textPrimary,
    maxHeight: 120,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  inputBarRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  quickModeButton: {
    backgroundColor: TOKENS.colors.rightPillBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  quickModeText: {
    fontSize: 14,
    fontWeight: '500',
    color: TOKENS.colors.rightText,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TOKENS.colors.rightPillBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: TOKENS.colors.mainColor,
  },
  sendIcon: {
    fontSize: 14,
    color: TOKENS.colors.switchThumb,
    fontWeight: '600',
  },
});

export default HomeScreen;
