import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PageSwitchButton } from '../../../components/PageSwitch';
import { TOKENS } from '../../../tokens';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import { TICKMARKS3_ROUTES, type TickMarks3RouteName } from './TickMarks3Routes';

type Nav = StackNavigationProp<RootStackParamList>;

const TickMarks3SwitchRow: React.FC<{ activeRoute: TickMarks3RouteName }> = ({ activeRoute }) => {
  const navigation = useNavigation<Nav>();
  const [viewportWidth, setViewportWidth] = useState(0);
  const [firstButtonWidth, setFirstButtonWidth] = useState(0);

  const initialLeftPadding = useMemo(() => {
    if (viewportWidth <= 0 || firstButtonWidth <= 0) return 0;
    return Math.max(0, viewportWidth / 2 - firstButtonWidth / 2);
  }, [firstButtonWidth, viewportWidth]);

  return (
    <View
      style={styles.switchRowWrap}
      onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}
    >
      <ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.switchRowContent,
          {
            paddingLeft: initialLeftPadding,
          },
        ]}
      >
        {TICKMARKS3_ROUTES.map((item, index) => (
          <View
            key={item.routeName}
            style={styles.switchItem}
            onLayout={
              index === 0
                ? (event) => setFirstButtonWidth(event.nativeEvent.layout.width)
                : undefined
            }
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

export default TickMarks3SwitchRow;
