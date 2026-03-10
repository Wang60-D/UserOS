import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { TOKENS } from '../../tokens';

export interface PageSwitchButtonProps {
  /** 按钮文案，宽度随文案自适应 */
  label: string;
  /** 是否为选中态（蓝框） */
  selected: boolean;
  onPress: () => void;
}

/**
 * 单粒页面切换胶囊按钮，按 Figma 设计：
 * - 选中：白底 + 蓝色边框 1.75px #007CFF
 * - 未选中：白底 + 浅灰边框 1px
 * - 高度 37px，圆角 30px，宽度随文字 + 水平内边距自适应
 */
const PageSwitchButton: React.FC<PageSwitchButtonProps> = ({
  label,
  selected,
  onPress,
}) => {
  return (
    <Pressable
      style={[styles.pill, selected && styles.pillSelected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    height: TOKENS.sizes.pageSwitchPillHeight,
    paddingHorizontal: TOKENS.spacing.pageSwitchPillPaddingH,
    borderRadius: TOKENS.radius.pageSwitchPill,
    backgroundColor: TOKENS.colors.cardBg,
    borderWidth: 1,
    borderColor: TOKENS.colors.pageSwitchUnselectedBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillSelected: {
    borderColor: TOKENS.colors.pageSwitchSelectedBorder,
    borderWidth: 1.75,
  },
  label: {
    fontSize: TOKENS.fontSize.pageSwitchPill,
    color: TOKENS.colors.pageSwitchText,
    fontWeight: '400',
    letterSpacing: -0.308,
  },
});

export default PageSwitchButton;
