import React from 'react';
import SettingAdjustScreenBase from './SettingAdjustScreenBase';

const SettingAirQualityScreen: React.FC = () => {
  return (
    <SettingAdjustScreenBase
      config={{
        pageTitle: '空气质量',
        adjustTitle: 'PM2.5浓度低于',
        unit: 'μg/m³',
        min: 0,
        max: 600,
        step: 1,
        defaultValue: 75,
        sliderLeftLabel: '0',
        sliderRightLabel: '600',
      }}
    />
  );
};

export default SettingAirQualityScreen;
