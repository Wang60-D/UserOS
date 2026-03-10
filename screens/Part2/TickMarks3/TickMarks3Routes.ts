export const TICKMARKS3_ROUTES = [
  { routeName: 'Part2TickMarks3DelayShort', label: '延时（短）' },
  { routeName: 'Part2TickMarks3DelayLong', label: '延时（长）' },
  { routeName: 'Part2TickMarks3WaterHeaterTemp', label: '温度-热水器' },
  { routeName: 'Part2TickMarks3KettleTemp', label: '温度-电热水器' },
  { routeName: 'Part2TickMarks3Humidity', label: '湿度' },
  { routeName: 'Part2TickMarks3FridgeTemp', label: '温度-冰箱' },
] as const;

export type TickMarks3RouteName = (typeof TICKMARKS3_ROUTES)[number]['routeName'];
