// 设计 tokens：统一颜色、间距、圆角等基础变量，便于全局维护
export const TOKENS = {
  colors: {
    pageBg: '#F7F7F7',
    cardBg: '#FFFFFF',
    borderAccent: '#FF0000',
    textPrimary: '#000000',
    mainColor: '#809DE4',
    switchOff: 'rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    pagePaddingH: 16,
    pagePaddingV: 24,
    containerPaddingH: 0,
    containerPaddingV: 0,
    itemGap: 24,
    cardInnerPaddingH: 16,
    cardInnerPaddingV: 12,
  },
  radius: {
    card: 16,
  },
  sizes: {
    controlTitleHeight: 28,
  },
  fontSize: {
    large: 20,
    medium: 14,
    small: 12,
  },
} as const;
