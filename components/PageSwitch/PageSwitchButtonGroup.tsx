import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TOKENS } from '../../tokens';
import PageSwitchButton from './PageSwitchButton';

export interface PageSwitchButtonGroupProps {
  /** 选项文案列表，按钮宽度随各自文案自适应 */
  labels: string[];
  /** 当前选中索引 */
  activeIndex: number;
  /** 切换回调 */
  onChange: (index: number) => void;
  /** 按钮之间的间距，默认 8 */
  gap?: number;
}

/**
 * 页面切换胶囊按钮组，横向排列，每粒宽度随文案自适应。
 */
const PageSwitchButtonGroup: React.FC<PageSwitchButtonGroupProps> = ({
  labels,
  activeIndex,
  onChange,
  gap = TOKENS.spacing.titleGap,
}) => {
  if (!labels.length) return null;

  return (
    <View style={[styles.container, { gap }]}>
      {labels.map((label, index) => (
        <PageSwitchButton
          key={`${label}-${index}`}
          label={label}
          selected={index === activeIndex}
          onPress={() => onChange(index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default PageSwitchButtonGroup;
