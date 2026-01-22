import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/HomeScreen';
import AirConditionerScreen from '../screens/AirConditionerScreen';
import ControlTitleScreen from '../screens/ControlTitleScreen';

// 尝试禁用 react-native-screens（如果存在）
try {
  const { enableScreens } = require('react-native-screens');
  enableScreens(false);
} catch (e) {
  // react-native-screens 不存在，忽略
}

export type RootStackParamList = {
  Home: undefined;
  AirConditioner: undefined;
  ControlTitle: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F7F7F7' },
          // 禁用使用原生 screens
          detachPreviousScreen: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
        />
        <Stack.Screen 
          name="AirConditioner" 
          component={AirConditionerScreen}
        />
        <Stack.Screen 
          name="ControlTitle" 
          component={ControlTitleScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
