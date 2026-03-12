export type Part2CatalogKey =
  | 'TickMarks1'
  | 'TickMarks2'
  | 'TickMarks3'
  | 'Label'
  | 'Shape'
  | 'ShapeTickMarks'
  | 'ShapeTickMarksLabel';

export interface Part2CatalogEntry {
  title: string;
  catalogKey: Part2CatalogKey;
}

export const PART2_TICKMARKS_SHAPE_ENTRIES: Part2CatalogEntry[] = [
  { title: 'Tick marks1 推荐值', catalogKey: 'TickMarks1' },
  { title: 'Tick marks2 等分', catalogKey: 'TickMarks2' },
  { title: 'Tick marks3 整数偏好', catalogKey: 'TickMarks3' },
  { title: 'Label-1', catalogKey: 'Label' },
  { title: 'Label-2', catalogKey: 'Label' },
  { title: 'Label-3', catalogKey: 'Label' },
  { title: 'Shape', catalogKey: 'Shape' },
  { title: 'Shape+Tick marks', catalogKey: 'ShapeTickMarks' },
  { title: 'Shape+Tick marks+Label', catalogKey: 'ShapeTickMarksLabel' },
];

export const PART2_CATALOG_ITEMS: Record<Part2CatalogKey, string[]> = {
  TickMarks1: ['温度', '色温'],
  TickMarks2: ['风速', '方位', '窗帘开合', '亮度', '音量', '色温'],
  TickMarks3: [
    '延时（短）',
    '延时（长）',
    '温度-热水器',
    '温度-电热水器',
    '湿度',
    '温度-冰箱',
  ],
  Label: [
    '1-4档',
    '1-6档',
    '无极档位',
    '风速',
    '左右扫风角度',
    '定格',
    '梦幻帘叶片角度',
    '窗帘开合',
    '空调',
    '热水器',
    '冰箱',
    '电热水器',
    '湿度',
    '面积',
    '延时（短）',
    '延时（长）',
    '亮度',
    '音量',
    '色温',
  ],
  Shape: [
    '浴霸出风角度',
    '左右扫风角度',
    '空调扫风定格',
    '梦幻帘叶片角度',
    '窗帘开合位置',
    '风速',
    '空调',
    '热水器',
    '冰箱',
    '湿度',
    '亮度',
    '色温',
    '延时（短）',
    '延时（长）',
    '音量',
  ],
  ShapeTickMarks: [
    '梦幻帘叶片角度',
    '窗帘开合位置',
    '风速',
    '空调',
    '热水器',
    '冰箱',
    '湿度',
    '亮度',
    '色温',
    '延时（短）',
    '延时（长）',
    '音量',
  ],
  ShapeTickMarksLabel: [
    '梦幻帘叶片角度',
    '窗帘开合位置',
    '风速',
    '空调',
    '热水器',
    '冰箱',
    '湿度',
    '亮度',
    '色温',
    '延时（短）',
    '延时（长）',
    '音量',
  ],
};

export const PART2_SINGLE_POINT_ITEMS = ['风速', '方位', '设置'];
