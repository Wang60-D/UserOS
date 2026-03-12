export const LABEL_ROUTES = [
  { routeName: 'Part2LabelLevel4', label: '1-4档' },
  { routeName: 'Part2LabelLevel6', label: '1-6档' },
  { routeName: 'Part2LabelWindSpeed', label: '风速' },
  { routeName: 'Part2LabelSweepAngle', label: '左右扫风角度' },
  { routeName: 'Part2LabelSweepFixed', label: '定格' },
  { routeName: 'Part2LabelBrightness', label: '亮度' },
  { routeName: 'Part2LabelCurtain', label: '窗帘开合' },
] as const;

export type LabelRouteName = (typeof LABEL_ROUTES)[number]['routeName'];
