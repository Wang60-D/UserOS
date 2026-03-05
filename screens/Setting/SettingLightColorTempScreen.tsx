import React from 'react';
import SettingAdjustScreenBase from './SettingAdjustScreenBase';

const SettingLightColorTempScreen: React.FC = () => {
  return (
    <SettingAdjustScreenBase
      config={{
        pageTitle: '灯光色温',
        adjustTitle: '色温调至',
        unit: 'K',
        min: 2600,
        max: 6000,
        step: 1,
        defaultValue: 2900,
        sliderLeftLabel: '2600',
        sliderRightLabel: '6000',
      }}
    />
  );
};

export default SettingLightColorTempScreen;
