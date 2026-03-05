import React from 'react';
import SettingAdjustScreenBase from './SettingAdjustScreenBase';

const SettingTime2Screen: React.FC = () => {
  return (
    <SettingAdjustScreenBase
      config={{
        pageTitle: '时间2',
        adjustTitle: '时间调至',
        unit: '分',
        min: 0,
        max: 60,
        step: 1,
        defaultValue: 40,
        sliderLeftLabel: '0',
        sliderRightLabel: '60',
      }}
    />
  );
};

export default SettingTime2Screen;
