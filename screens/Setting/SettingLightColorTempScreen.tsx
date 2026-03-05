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
        sliderShowFill: false,
        sliderFillMode: 'none',
        trackBaseGradientStops: [
          { offset: 0, color: '#FFAB09' },
          { offset: 14, color: '#FFBF37' },
          { offset: 29, color: '#FFD466' },
          { offset: 43, color: '#FFE894' },
          { offset: 57, color: '#ECF6FF' },
          { offset: 71, color: '#CAE6FF' },
          { offset: 86, color: '#9CCFFF' },
          { offset: 100, color: '#80C2FF' },
        ],
      }}
    />
  );
};

export default SettingLightColorTempScreen;
