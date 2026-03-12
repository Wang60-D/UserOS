import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
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
import TimerOneScreen from '../screens/Time/TimerOneScreen';
import TimerTwoScreen from '../screens/Time/TimerTwoScreen';
import CountdownScreen from '../screens/Time/CountdownScreen';
import DelayScreen from '../screens/Time/DelayScreen';
import SettingTime1Screen from '../screens/Setting/SettingTime1Screen';
import SettingTime2Screen from '../screens/Setting/SettingTime2Screen';
import SettingLightBrightnessScreen from '../screens/Setting/SettingLightBrightnessScreen';
import SettingAirQualityScreen from '../screens/Setting/SettingAirQualityScreen';
import SettingLightColorTempScreen from '../screens/Setting/SettingLightColorTempScreen';
import FeatureEntryStyle1Screen from '../screens/Entry/FeatureEntryStyle1Screen';
import WindSenseDrawerScreen from '../screens/Entry/WindSenseDrawerScreen';
import SweepDrawerScreen from '../screens/Entry/SweepDrawerScreen';
import CircularArcSliderScreen from '../screens/CircularArcSliderScreen';
import BaseArcScreen from '../screens/BaseArcScreen';
import CircularTimePickerScreen from '../screens/CircularTimePickerScreen';
import ComponentLibraryScreen from '../screens/ComponentLibraryScreen';
import SwitchScreen from '../screens/Switch/SwitchScreen';
import Part1Screen from '../screens/Part1Screen';
import Part2Screen from '../screens/Part2Screen';
import Part2CatalogScreen from '../screens/Part2/Part2CatalogScreen';
import Part2SinglePointScreen from '../screens/Part2/Part2SinglePointScreen';
import Part2TickMarks1Screen from '../screens/Part2/TickMarks1/Part2TickMarks1Screen';
import Part2TickMarks3DelayShortScreen from '../screens/Part2/TickMarks3/Part2TickMarks3DelayShortScreen';
import Part2TickMarks3DelayLongScreen from '../screens/Part2/TickMarks3/Part2TickMarks3DelayLongScreen';
import Part2TickMarks3WaterHeaterTempScreen from '../screens/Part2/TickMarks3/Part2TickMarks3WaterHeaterTempScreen';
import Part2TickMarks3KettleTempScreen from '../screens/Part2/TickMarks3/Part2TickMarks3KettleTempScreen';
import Part2TickMarks3HumidityScreen from '../screens/Part2/TickMarks3/Part2TickMarks3HumidityScreen';
import Part2TickMarks3FridgeTempScreen from '../screens/Part2/TickMarks3/Part2TickMarks3FridgeTempScreen';
import Part2TickMarks2WindSpeedScreen from '../screens/Part2/TickMarks2/Part2TickMarks2WindSpeedScreen';
import Part2TickMarks2DirectionScreen from '../screens/Part2/TickMarks2/Part2TickMarks2DirectionScreen';
import Part2TickMarks2CurtainScreen from '../screens/Part2/TickMarks2/Part2TickMarks2CurtainScreen';
import Part2TickMarks2BrightnessScreen from '../screens/Part2/TickMarks2/Part2TickMarks2BrightnessScreen';
import Part2TickMarks2VolumeScreen from '../screens/Part2/TickMarks2/Part2TickMarks2VolumeScreen';
import Part2TickMarks2ColorTempScreen from '../screens/Part2/TickMarks2/Part2TickMarks2ColorTempScreen';
import Part2LabelLevel4Screen from '../screens/Part2/Label/Part2LabelLevel4Screen';
import Part2LabelLevel6Screen from '../screens/Part2/Label/Part2LabelLevel6Screen';
import Part2LabelWindSpeedScreen from '../screens/Part2/Label/Part2LabelWindSpeedScreen';
import Part2LabelSweepAngleScreen from '../screens/Part2/Label/Part2LabelSweepAngleScreen';
import Part2LabelSweepFixedScreen from '../screens/Part2/Label/Part2LabelSweepFixedScreen';
import Part2LabelBrightnessScreen from '../screens/Part2/Label/Part2LabelBrightnessScreen';
import Part2LabelCurtainScreen from '../screens/Part2/Label/Part2LabelCurtainScreen';
import Part2Label2AirConditionerScreen from '../screens/Part2/Label2/Part2Label2AirConditionerScreen';
import Part2Label2WaterHeaterScreen from '../screens/Part2/Label2/Part2Label2WaterHeaterScreen';
import Part2Label2FridgeScreen from '../screens/Part2/Label2/Part2Label2FridgeScreen';
import Part2Label2KettleScreen from '../screens/Part2/Label2/Part2Label2KettleScreen';
import Part2Label2HumidityScreen from '../screens/Part2/Label2/Part2Label2HumidityScreen';
import Part2Label2AreaScreen from '../screens/Part2/Label2/Part2Label2AreaScreen';
import Part2Label3DelayShortScreen from '../screens/Part2/Label3/Part2Label3DelayShortScreen';
import Part2Label3DelayLongScreen from '../screens/Part2/Label3/Part2Label3DelayLongScreen';
import Part2Label3BrightnessScreen from '../screens/Part2/Label3/Part2Label3BrightnessScreen';
import Part2Label3VolumeScreen from '../screens/Part2/Label3/Part2Label3VolumeScreen';
import Part2Label3ColorTempScreen from '../screens/Part2/Label3/Part2Label3ColorTempScreen';
import FanSwitchScreen from '../screens/Switch/FanSwitchScreen';
import WallSwitchScreen from '../screens/Switch/WallSwitchScreen';
import BathLightScreen from '../screens/Switch/BathLightScreen';
import FishtankLightScreen from '../screens/Switch/FishtankLightScreen';
import MassageScreen from '../screens/Switch/MassageScreen';
import DehumidifierScreen from '../screens/Switch/DehumidifierScreen';
import ClothrackSwitchScreen from '../screens/Switch/ClothrackSwitchScreen';
import Components2Screen from '../screens/Components2Screen/Components2Screen';
import Components2CircleButtonScreen from '../screens/Components2Screen/Components2CircleButtonScreen';
import Components2SquareButtonScreen from '../screens/Components2Screen/Components2SquareButtonScreen';
import Components2SwitchScreen from '../screens/Components2Screen/Components2SwitchScreen';
import Components2SliderScreen from '../screens/Components2Screen/Components2SliderScreen';
import DotSliderTestScreen from '../screens/DotSliderTestScreen';

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
  Part2: undefined;
  Part2Catalog: { catalogKey: string; title: string };
  Part2SinglePoint: undefined;
  Part2TickMarks1: undefined;
  Part2TickMarks2WindSpeed: undefined;
  Part2TickMarks2Direction: undefined;
  Part2TickMarks2Curtain: undefined;
  Part2TickMarks2Brightness: undefined;
  Part2TickMarks2Volume: undefined;
  Part2TickMarks2ColorTemp: undefined;
  Part2TickMarks3DelayShort: undefined;
  Part2TickMarks3DelayLong: undefined;
  Part2TickMarks3WaterHeaterTemp: undefined;
  Part2TickMarks3KettleTemp: undefined;
  Part2TickMarks3Humidity: undefined;
  Part2TickMarks3FridgeTemp: undefined;
  Part2LabelLevel4: undefined;
  Part2LabelLevel6: undefined;
  Part2LabelWindSpeed: undefined;
  Part2LabelSweepAngle: undefined;
  Part2LabelSweepFixed: undefined;
  Part2LabelBrightness: undefined;
  Part2LabelCurtain: undefined;
  Part2Label2AirConditioner: undefined;
  Part2Label2WaterHeater: undefined;
  Part2Label2Fridge: undefined;
  Part2Label2Kettle: undefined;
  Part2Label2Humidity: undefined;
  Part2Label2Area: undefined;
  Part2Label3DelayShort: undefined;
  Part2Label3DelayLong: undefined;
  Part2Label3Brightness: undefined;
  Part2Label3Volume: undefined;
  Part2Label3ColorTemp: undefined;
  FanSwitch: undefined;
  WallSwitch: undefined;
  BathLight: undefined;
  ClothrackSwitch: undefined;
  FishtankLight: undefined;
  Massage: undefined;
  Dehumidifier: undefined;
  ComponentLibrary: undefined;
  Components2: undefined;
  Components2CircleButton: undefined;
  Components2SquareButton: undefined;
  Components2Switch: undefined;
  Components2Slider: undefined;
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
  BaseArc: undefined;
  CircularTimePicker: undefined;
  TimePicker: undefined;
  TimerOne: undefined;
  TimerTwo: undefined;
  Countdown: undefined;
  Delay: undefined;
  SettingTime1: undefined;
  SettingTime2: undefined;
  SettingLightBrightness: undefined;
  SettingAirQuality: undefined;
  SettingLightColorTemp: undefined;
  FeatureEntryStyle1: undefined;
  FeatureEntryStyle2: undefined;
  WindSenseDrawer: undefined;
  SweepDrawer: undefined;
  Switch: undefined;
  DotSliderTest: undefined;
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
          name="Part2" 
          component={Part2Screen}
        />
        <Stack.Screen 
          name="Part2Catalog" 
          component={Part2CatalogScreen}
        />
        <Stack.Screen 
          name="Part2SinglePoint" 
          component={Part2SinglePointScreen}
        />
        <Stack.Screen 
          name="Part2TickMarks1" 
          component={Part2TickMarks1Screen}
        />
        <Stack.Screen
          name="Part2TickMarks2WindSpeed"
          component={Part2TickMarks2WindSpeedScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2TickMarks2Direction"
          component={Part2TickMarks2DirectionScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2TickMarks2Curtain"
          component={Part2TickMarks2CurtainScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2TickMarks2Brightness"
          component={Part2TickMarks2BrightnessScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2TickMarks2Volume"
          component={Part2TickMarks2VolumeScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2TickMarks2ColorTemp"
          component={Part2TickMarks2ColorTempScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2TickMarks3DelayShort"
          component={Part2TickMarks3DelayShortScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2TickMarks3DelayLong"
          component={Part2TickMarks3DelayLongScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2TickMarks3WaterHeaterTemp"
          component={Part2TickMarks3WaterHeaterTempScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2TickMarks3KettleTemp"
          component={Part2TickMarks3KettleTempScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2TickMarks3Humidity"
          component={Part2TickMarks3HumidityScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2TickMarks3FridgeTemp"
          component={Part2TickMarks3FridgeTempScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2LabelLevel4"
          component={Part2LabelLevel4Screen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2LabelLevel6"
          component={Part2LabelLevel6Screen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2LabelWindSpeed"
          component={Part2LabelWindSpeedScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2LabelSweepAngle"
          component={Part2LabelSweepAngleScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2LabelSweepFixed"
          component={Part2LabelSweepFixedScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2LabelBrightness"
          component={Part2LabelBrightnessScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2LabelCurtain"
          component={Part2LabelCurtainScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2Label2AirConditioner"
          component={Part2Label2AirConditionerScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2Label2WaterHeater"
          component={Part2Label2WaterHeaterScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2Label2Fridge"
          component={Part2Label2FridgeScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2Label2Kettle"
          component={Part2Label2KettleScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2Label2Humidity"
          component={Part2Label2HumidityScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2Label2Area"
          component={Part2Label2AreaScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2Label3DelayShort"
          component={Part2Label3DelayShortScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2Label3DelayLong"
          component={Part2Label3DelayLongScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2Label3Brightness"
          component={Part2Label3BrightnessScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2Label3Volume"
          component={Part2Label3VolumeScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
        />
        <Stack.Screen
          name="Part2Label3ColorTemp"
          component={Part2Label3ColorTempScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
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
          name="Components2"
          component={Components2Screen}
        />
        <Stack.Screen
          name="Components2CircleButton"
          component={Components2CircleButtonScreen}
        />
        <Stack.Screen
          name="Components2SquareButton"
          component={Components2SquareButtonScreen}
        />
        <Stack.Screen
          name="Components2Switch"
          component={Components2SwitchScreen}
        />
        <Stack.Screen
          name="Components2Slider"
          component={Components2SliderScreen}
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
          name="BaseArc"
          component={BaseArcScreen}
        />
        <Stack.Screen
          name="CircularTimePicker"
          component={CircularTimePickerScreen}
        />
        <Stack.Screen
          name="TimePicker"
          component={TimePickerScreen}
        />
        <Stack.Screen
          name="TimerOne"
          component={TimerOneScreen}
        />
        <Stack.Screen
          name="TimerTwo"
          component={TimerTwoScreen}
        />
        <Stack.Screen
          name="Countdown"
          component={CountdownScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="Delay"
          component={DelayScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="SettingTime1"
          component={SettingTime1Screen}
        />
        <Stack.Screen
          name="SettingTime2"
          component={SettingTime2Screen}
        />
        <Stack.Screen
          name="SettingLightBrightness"
          component={SettingLightBrightnessScreen}
        />
        <Stack.Screen
          name="SettingAirQuality"
          component={SettingAirQualityScreen}
        />
        <Stack.Screen
          name="SettingLightColorTemp"
          component={SettingLightColorTempScreen}
        />
        <Stack.Screen
          name="FeatureEntryStyle1"
          component={FeatureEntryStyle1Screen}
        />
        <Stack.Screen
          name="FeatureEntryStyle2"
          component={FeatureEntryStyle1Screen}
        />
        <Stack.Screen
          name="WindSenseDrawer"
          component={WindSenseDrawerScreen}
        />
        <Stack.Screen
          name="SweepDrawer"
          component={SweepDrawerScreen}
        />
        <Stack.Screen 
          name="Switch" 
          component={SwitchScreen}
        />
        <Stack.Screen
          name="DotSliderTest"
          component={DotSliderTestScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
