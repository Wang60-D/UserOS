import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/HomeScreen';
import AirConditionerScreen from '../screens/Model/AirConditionerScreen';
import AirPurifierScreen from '../screens/Model/AirPurifierScreen';
import LightModeScreen from '../screens/Model/LightModeScreen';
import SoundModeScreen from '../screens/Model/SoundModeScreen';
import EarphoneModeScreen from '../screens/Model/EarphoneModeScreen';
import FridgeModeScreen from '../screens/Model/FridgeModeScreen';
import ControlTitleScreen from '../screens/ControlTitleScreen';
import ButtonGroupScreen from '../screens/ButtonGroupScreen';
import SliderScreen from '../screens/SliderScreen';
import ComponentLibraryScreen from '../screens/ComponentLibraryScreen';
import SwitchScreen from '../screens/Switch/SwitchScreen';
import Part1Screen from '../screens/Part1Screen';
import FanSwitchScreen from '../screens/Switch/FanSwitchScreen';
import WallSwitchScreen from '../screens/Switch/WallSwitchScreen';
import BathLightScreen from '../screens/Switch/BathLightScreen';
import DehumidifierScreen from '../screens/Switch/DehumidifierScreen';

// 尝试禁用 react-native-screens（如果存在）
try {
  const { enableScreens } = require('react-native-screens');
  enableScreens(false);
} catch (e) {
  // react-native-screens 不存在，忽略
}

export type RootStackParamList = {
  Home: undefined;
  Part1: undefined;
  FanSwitch: undefined;
  WallSwitch: undefined;
  BathLight: undefined;
  Dehumidifier: undefined;
  ComponentLibrary: undefined;
  AirConditioner: undefined;
  AirPurifier: undefined;
  LightMode: undefined;
  SoundMode: undefined;
  EarphoneMode: undefined;
  FridgeMode: undefined;
  ControlTitle: undefined;
  ButtonGroup: undefined;
  Slider: undefined;
  Switch: undefined;
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
          name="Part1" 
          component={Part1Screen}
        />
        <Stack.Screen 
          name="FanSwitch" 
          component={FanSwitchScreen}
        />
        <Stack.Screen 
          name="WallSwitch" 
          component={WallSwitchScreen}
        />
        <Stack.Screen 
          name="BathLight" 
          component={BathLightScreen}
        />
        <Stack.Screen 
          name="Dehumidifier" 
          component={DehumidifierScreen}
        />
        <Stack.Screen 
          name="ComponentLibrary" 
          component={ComponentLibraryScreen}
        />
        <Stack.Screen 
          name="AirConditioner" 
          component={AirConditionerScreen}
        />
        <Stack.Screen 
          name="AirPurifier" 
          component={AirPurifierScreen}
        />
        <Stack.Screen 
          name="LightMode" 
          component={LightModeScreen}
        />
        <Stack.Screen 
          name="SoundMode" 
          component={SoundModeScreen}
        />
        <Stack.Screen 
          name="EarphoneMode" 
          component={EarphoneModeScreen}
        />
        <Stack.Screen 
          name="FridgeMode" 
          component={FridgeModeScreen}
        />
        <Stack.Screen 
          name="ControlTitle" 
          component={ControlTitleScreen}
        />
        <Stack.Screen 
          name="ButtonGroup" 
          component={ButtonGroupScreen}
        />
        <Stack.Screen 
          name="Slider" 
          component={SliderScreen}
        />
        <Stack.Screen 
          name="Switch" 
          component={SwitchScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
