export const LABEL2_ROUTES = [
  { routeName: 'Part2Label2AirConditioner', label: '空调' },
  { routeName: 'Part2Label2WaterHeater', label: '热水器' },
  { routeName: 'Part2Label2Fridge', label: '冰箱' },
  { routeName: 'Part2Label2Kettle', label: '电热水器' },
  { routeName: 'Part2Label2Humidity', label: '湿度' },
  { routeName: 'Part2Label2Area', label: '面积' },
] as const;

export type Label2RouteName = (typeof LABEL2_ROUTES)[number]['routeName'];
