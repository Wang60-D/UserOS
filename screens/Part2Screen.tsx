import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TOKENS } from '../tokens';
import {
  PART2_TICKMARKS_SHAPE_ENTRIES,
  Part2CatalogKey,
} from './Part2/part2CatalogData';

type Part2Navigation = StackNavigationProp<RootStackParamList>;

const Part2Screen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Part2Navigation>();

  const handlePressCatalog = (title: string, catalogKey: Part2CatalogKey) => {
    if (catalogKey === 'TickMarks1') {
      navigation.navigate('Part2TickMarks1');
      return;
    }
    if (catalogKey === 'TickMarks2') {
      navigation.navigate('Part2TickMarks2WindSpeed');
      return;
    }
    if (catalogKey === 'TickMarks3') {
      navigation.navigate('Part2TickMarks3DelayShort');
      return;
    }
    navigation.navigate('Part2Catalog', { catalogKey, title });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + TOKENS.spacing.pagePaddingV },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {PART2_TICKMARKS_SHAPE_ENTRIES.map((entry) => (
          <TouchableOpacity
            key={entry.catalogKey}
            style={styles.card}
            onPress={() => handlePressCatalog(entry.title, entry.catalogKey)}
            activeOpacity={0.75}
          >
            <Text style={styles.cardTitle} numberOfLines={2}>
              {entry.title}
            </Text>
            <View style={styles.arrowWrap}>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Part2SinglePoint')}
          activeOpacity={0.75}
        >
          <Text style={styles.cardTitle} numberOfLines={2}>
            Single-point Indicator/Cumulative Fill/Track Colorization
          </Text>
          <View style={styles.arrowWrap}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.colors.pageBg,
  },
  contentContainer: {
    paddingHorizontal: TOKENS.spacing.pagePaddingH,
    paddingBottom: TOKENS.spacing.pagePaddingV,
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: TOKENS.colors.cardBg,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: TOKENS.colors.textPrimary,
    marginRight: 8,
  },
  arrowWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 20,
    color: TOKENS.colors.subtitleText,
    fontWeight: '300',
  },
});

export default Part2Screen;
