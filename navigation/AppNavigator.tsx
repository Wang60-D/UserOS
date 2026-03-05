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
import HumidifierGearScreen from '../screens/Gear/HumidifierGearScreen';
import WindSpeedGearScreen from '../screens/Gear/WindSpeedGearScreen';
import RangehoodGearScreen from '../screens/Gear/RangehoodGearScreen';
import ElectricHeaterGearScreen from '../screens/Gear/ElectricHeaterGearScreen';
import ClothrackDirectionScreen from '../screens/Direction/ClothrackDirectionScreen';
import BathheaterDirectionScreen from '../screens/Direction/BathheaterDirectionScreen';
import FanDirectionScreen from '../screens/Direction/FanDirectionScreen';
import AirConditionerDirectionScreen from '../screens/Direction/AirConditionerDirectionScreen';
import DreamCurtainDirectionScreen from '../screens/Direction/DreamCurtainDirectionScreen';
import CurtainDirectionScreen from '../screens/Direction/CurtainDirectionScreen';
import AirConditionerTemperatureScreen from '../screens/Temperature/AirConditionerTemperatureScreen';
import WaterHeaterTemperatureScreen from '../screens/Temperature/WaterHeaterTemperatureScreen';
import FridgeTemperatureScreen from '../screens/Temperature/FridgeTemperatureScreen';
import ElectricKettleTemperatureScreen from '../screens/Temperature/ElectricKettleTemperatureScreen';
import ControlTitleScreen from '../screens/ControlTitleScreen';
import ButtonGroupScreen from '../screens/ButtonGroupScreen';
import SliderScreen from '../screens/SliderScreen';
import TimePickerScreen from '../screens/TimePickerScreen';
import CircularArcSliderScreen from '../screens/CircularArcSliderScreen';
import ComponentLibraryScreen from '../screens/ComponentLibraryScreen';
import SwitchScreen from '../screens/Switch/SwitchScreen';
import Part1Screen from '../screens/Part1Screen';
import FanSwitchScreen from '../screens/Switch/FanSwitchScreen';
import WallSwitchScreen from '../screens/Switch/WallSwitchScreen';
import BathLightScreen from '../screens/Switch/BathLightScreen';
import FishtankLightScreen from '../screens/Switch/FishtankLightScreen';
import MassageScreen from '../screens/Switch/MassageScreen';
import DehumidifierScreen from '../screens/Switch/DehumidifierScreen';
import ClothrackSwitchScreen from '../screens/Switch/ClothrackSwitchScreen';

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
  ClothrackSwitch: undefined;
  FishtankLight: undefined;
  Massage: undefined;
  Dehumidifier: undefined;
  ComponentLibrary: undefined;
  AirConditioner: undefined;
  AirPurifier: undefined;
  LightMode: undefined;
  SoundMode: undefined;
  EarphoneMode: undefined;
  FridgeMode: undefined;
  HumidifierGear: undefined;
  WindSpeedGear: undefined;
  RangehoodGear: undefined;
  ElectricHeaterGear: undefined;
  ClothrackDirection: undefined;
  BathheaterDirection: undefined;
  FanDirection: undefined;
  AirConditionerDirection: undefined;
  DreamCurtainDirection: undefined;
  CurtainDirection: undefined;
  AirConditionerTemperature: undefined;
  WaterHeaterTemperature: undefined;
  FridgeTemperature: undefined;
  ElectricKettleTemperature: undefined;
  ControlTitle: undefined;
  ButtonGroup: undefined;
  Slider: undefined;
  CircularArcSlider: undefined;
  TimePicker: undefined;
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
          name="ClothrackSwitch"
          component={ClothrackSwitchScreen}
        />
        <Stack.Screen
          name="FishtankLight"
          component={FishtankLightScreen}
        />
        <Stack.Screen
          name="Massage"
          component={MassageScreen}
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
          name="HumidifierGear" 
          component={HumidifierGearScreen}
        />
        <Stack.Screen
          name="WindSpeedGear"
          component={WindSpeedGearScreen}
        />
        <Stack.Screen
          name="RangehoodGear"
          component={RangehoodGearScreen}
        />
        <Stack.Screen
          name="ElectricHeaterGear"
          component={ElectricHeaterGearScreen}
        />
        <Stack.Screen
          name="ClothrackDirection"
          component={ClothrackDirectionScreen}
        />
        <Stack.Screen
          name="BathheaterDirection"
          component={BathheaterDirectionScreen}
        />
        <Stack.Screen
          name="FanDirection"
          component={FanDirectionScreen}
        />
        <Stack.Screen
          name="AirConditionerDirection"
          component={AirConditionerDirectionScreen}
        />
        <Stack.Screen
          name="DreamCurtainDirection"
          component={DreamCurtainDirectionScreen}
        />
        <Stack.Screen
          name="CurtainDirection"
          component={CurtainDirectionScreen}
        />
        <Stack.Screen
          name="AirConditionerTemperature"
          component={AirConditionerTemperatureScreen}
        />
        <Stack.Screen
          name="WaterHeaterTemperature"
          component={WaterHeaterTemperatureScreen}
        />
        <Stack.Screen
          name="FridgeTemperature"
          component={FridgeTemperatureScreen}
        />
        <Stack.Screen
          name="ElectricKettleTemperature"
          component={ElectricKettleTemperatureScreen}
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
          name="CircularArcSlider"
          component={CircularArcSliderScreen}
        />
        <Stack.Screen
          name="TimePicker"
          component={TimePickerScreen}
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
