import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';

// 尝试禁用 react-native-screens（如果存在）
let screensEnabled = false;
try {
  const { enableScreens } = require('react-native-screens');
  enableScreens(false);
  screensEnabled = false;
} catch (e) {
  // react-native-screens 不存在或已禁用
}

export default function App() {
  useEffect(() => {
    // 确保在应用启动时禁用 screens
    try {
      const { enableScreens } = require('react-native-screens');
      enableScreens(false);
    } catch (e) {
      // 忽略错误
    }
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
}