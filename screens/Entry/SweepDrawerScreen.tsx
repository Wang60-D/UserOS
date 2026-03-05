import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SweepDrawerScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const SweepDrawerScreen: React.FC<SweepDrawerScreenProps> = ({ navigation }) => {
  const [upDownEnabled, setUpDownEnabled] = useState(true);
  const [leftRightEnabled, setLeftRightEnabled] = useState(true);
  const [upDownActive, setUpDownActive] = useState<string[]>(['右上风区', '右下风区']);
  const [leftRightActive, setLeftRightActive] = useState<string[]>(['右风区']);

  const toggleTag = (label: string, selected: string[], onChange: (next: string[]) => void) => {
    const exists = selected.includes(label);
    if (exists) {
      onChange(selected.filter((item) => item !== label));
      return;
    }
    onChange([...selected, label]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mask} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.headerRow}>
          <Pressable style={styles.closeBtn} onPress={navigation.goBack}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
          <Text style={styles.title}>扫风</Text>
          <View style={styles.closeBtn} />
        </View>

        <View style={styles.groupCard}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupTitle}>上下扫风</Text>
            <Pressable
              style={[styles.switchTrack, upDownEnabled ? styles.switchTrackOn : styles.switchTrackOff]}
              onPress={() => setUpDownEnabled((prev) => !prev)}
            >
              <View style={[styles.switchThumb, upDownEnabled ? styles.switchThumbOn : styles.switchThumbOff]} />
            </Pressable>
          </View>
          <View style={styles.tagGrid}>
            {['左上风区', '右上风区', '左下风区', '右下风区'].map((label) => {
              const selected = upDownActive.includes(label);
              return (
                <Pressable
                  key={label}
                  style={[styles.tagBtn, selected && styles.tagBtnSelected]}
                  onPress={() => toggleTag(label, upDownActive, setUpDownActive)}
                >
                  <Text style={[styles.tagText, selected && styles.tagTextSelected]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.groupCard}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupTitle}>左右扫风</Text>
            <Pressable
              style={[styles.switchTrack, leftRightEnabled ? styles.switchTrackOn : styles.switchTrackOff]}
              onPress={() => setLeftRightEnabled((prev) => !prev)}
            >
              <View
                style={[styles.switchThumb, leftRightEnabled ? styles.switchThumbOn : styles.switchThumbOff]}
              />
            </Pressable>
          </View>
          <View style={styles.tagGrid}>
            {['左风区', '右风区'].map((label) => {
              const selected = leftRightActive.includes(label);
              return (
                <Pressable
                  key={label}
                  style={[styles.tagBtn, selected && styles.tagBtnSelected]}
                  onPress={() => toggleTag(label, leftRightActive, setLeftRightActive)}
                >
                  <Text style={[styles.tagText, selected && styles.tagTextSelected]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
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
    marginBottom: 8,
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
  groupCard: {
    marginHorizontal: 12,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 10,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 24 / 1.5,
    color: '#000',
    fontWeight: '500',
  },
  switchTrack: {
    width: 48,
    height: 30,
    borderRadius: 999,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  switchTrackOn: {
    backgroundColor: '#3482FF',
    alignItems: 'flex-end',
  },
  switchTrackOff: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'flex-start',
  },
  switchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
  },
  switchThumbOn: {},
  switchThumbOff: {},
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  tagBtn: {
    width: '48.5%',
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagBtnSelected: {
    backgroundColor: 'rgba(52,130,255,0.12)',
  },
  tagText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.45)',
  },
  tagTextSelected: {
    color: '#3482FF',
    fontWeight: '500',
  },
});

export default SweepDrawerScreen;
