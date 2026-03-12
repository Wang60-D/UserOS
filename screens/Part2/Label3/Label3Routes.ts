export const LABEL3_ROUTES = [
  { routeName: 'Part2Label3DelayShort', label: '延时（短）' },
  { routeName: 'Part2Label3DelayLong', label: '延时（长）' },
  { routeName: 'Part2Label3Brightness', label: '亮度' },
  { routeName: 'Part2Label3Volume', label: '音量' },
  { routeName: 'Part2Label3ColorTemp', label: '色温' },
] as const;

export type Label3RouteName = (typeof LABEL3_ROUTES)[number]['routeName'];
