import React from 'react';
import SettingAdjustScreenBase from './SettingAdjustScreenBase';

const SettingLightBrightnessScreen: React.FC = () => {
  return (
    <SettingAdjustScreenBase
      config={{
        pageTitle: '灯光亮度',
        adjustTitle: '亮度调至',
        unit: '%',
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 67,
        sliderLeftLabel: '1',
        sliderRightLabel: '100',
      }}
    />
  );
};

export default SettingLightBrightnessScreen;
