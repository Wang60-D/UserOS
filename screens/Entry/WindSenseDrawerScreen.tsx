import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { TOKENS } from '../../tokens';

const OPTIONS = [
  { id: 'canopy', label: '天幕风', icon: require('../../assets/icons/fan_black.png') },
  { id: 'carpet', label: '地毯风', icon: require('../../assets/icons/airconditioner/anglebuttom.png') },
  { id: 'avoid', label: '风避人', icon: require('../../assets/icons/airconditioner/angleup.png') },
  { id: 'blow', label: '风吹人', icon: require('../../assets/icons/airconditioner/angledown.png') },
];

interface WindSenseDrawerScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const WindSenseDrawerScreen: React.FC<WindSenseDrawerScreenProps> = ({ navigation }) => {
  const [activeId, setActiveId] = useState('canopy');

  return (
    <View style={styles.container}>
      <View style={styles.mask} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.headerRow}>
          <Pressable style={styles.closeBtn} onPress={navigation.goBack}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
          <Text style={styles.title}>风感</Text>
          <View style={styles.closeBtn} />
        </View>

        <View style={styles.optionRow}>
          {OPTIONS.map((item) => {
            const selected = item.id === activeId;
            return (
              <Pressable key={item.id} style={styles.optionItem} onPress={() => setActiveId(item.id)}>
                <View style={[styles.optionCircle, selected && styles.optionCircleSelected]}>
                  <Image
                    source={item.icon}
                    style={[styles.optionIcon, selected ? styles.optionIconSelected : styles.optionIconNormal]}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A9A9A9',
    justifyContent: 'flex-end',
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: '#F7F7F7',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 28,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  headerRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  closeBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 30,
    color: '#444',
    lineHeight: 32,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  optionRow: {
    marginTop: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionItem: {
    width: 62,
    alignItems: 'center',
  },
  optionCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCircleSelected: {
    backgroundColor: 'rgba(52,130,255,0.15)',
  },
  optionIcon: {
    width: 24,
    height: 24,
  },
  optionIconSelected: {
    tintColor: '#3482FF',
  },
  optionIconNormal: {
    tintColor: 'rgba(0,0,0,0.5)',
  },
  optionText: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(0,0,0,0.4)',
  },
  optionTextSelected: {
    color: '#3482FF',
    fontWeight: '500',
  },
});

export default WindSenseDrawerScreen;
