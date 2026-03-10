export const TICKMARKS2_ROUTES = [
  { routeName: 'Part2TickMarks2WindSpeed', label: '风速' },
  { routeName: 'Part2TickMarks2Direction', label: '方位' },
  { routeName: 'Part2TickMarks2Curtain', label: '窗帘开合' },
  { routeName: 'Part2TickMarks2Brightness', label: '亮度' },
  { routeName: 'Part2TickMarks2Volume', label: '音量' },
  { routeName: 'Part2TickMarks2ColorTemp', label: '色温' },
] as const;

export type TickMarks2RouteName = (typeof TICKMARKS2_ROUTES)[number]['routeName'];
