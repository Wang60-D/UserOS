import React from 'react';
import SettingAdjustScreenBase from './SettingAdjustScreenBase';

const SettingTime1Screen: React.FC = () => {
  return (
    <SettingAdjustScreenBase
      config={{
        pageTitle: '时间1',
        adjustTitle: '时间调至',
        unit: '时',
        min: 0,
        max: 24,
        step: 1,
        defaultValue: 16,
        sliderLeftLabel: '0',
        sliderRightLabel: '24',
        pickerTitleToContentPadding: 37,
        sliderTitleToValuePadding: 37,
        sliderValueToSliderPadding: 31,
      }}
    />
  );
};

export default SettingTime1Screen;
