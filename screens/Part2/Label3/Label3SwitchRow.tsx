import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PageSwitchButton } from '../../../components/PageSwitch';
import { TOKENS } from '../../../tokens';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import { LABEL3_ROUTES, type Label3RouteName } from './Label3Routes';

type Nav = StackNavigationProp<RootStackParamList>;

const Label3SwitchRow: React.FC<{ activeRoute: Label3RouteName }> = ({ activeRoute }) => {
  const navigation = useNavigation<Nav>();
  const scrollRef = useRef<ScrollView>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [firstButtonWidth, setFirstButtonWidth] = useState(0);
  const [itemLayouts, setItemLayouts] = useState<
    Partial<Record<Label3RouteName, { x: number; width: number }>>
  >({});

  const initialLeftPadding = useMemo(() => {
    if (viewportWidth <= 0 || firstButtonWidth <= 0) return 0;
    return Math.max(0, viewportWidth / 2 - firstButtonWidth / 2);
  }, [firstButtonWidth, viewportWidth]);

  useEffect(() => {
    if (viewportWidth <= 0) return;
    const activeLayout = itemLayouts[activeRoute];
    if (!activeLayout) return;
    const targetCenterX = initialLeftPadding + activeLayout.x + activeLayout.width / 2;
    const nextScrollX = Math.max(0, targetCenterX - viewportWidth / 2);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: nextScrollX, animated: false });
    });
  }, [activeRoute, initialLeftPadding, itemLayouts, viewportWidth]);

  return (
    <View
      style={styles.switchRowWrap}
      onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.switchRowContent, { paddingLeft: initialLeftPadding }]}
      >
        {LABEL3_ROUTES.map((item, index) => (
          <View
            key={item.routeName}
            style={styles.switchItem}
            onLayout={(event) => {
              const { x, width } = event.nativeEvent.layout;
              if (index === 0) setFirstButtonWidth(width);
              setItemLayouts((prev) => {
                const prevItem = prev[item.routeName];
                if (prevItem && prevItem.x === x && prevItem.width === width) return prev;
                return {
                  ...prev,
                  [item.routeName]: { x, width },
                };
              });
            }}
          >
            <PageSwitchButton
              label={item.label}
              selected={item.routeName === activeRoute}
              onPress={() => {
                if (item.routeName === activeRoute) return;
                navigation.replace(item.routeName);
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  switchRowWrap: {
    marginHorizontal: -TOKENS.spacing.pagePaddingH,
  },
  switchRowContent: {
    paddingRight: TOKENS.spacing.pagePaddingH,
  },
  switchItem: {
    marginRight: 8,
  },
});

export default Label3SwitchRow;
