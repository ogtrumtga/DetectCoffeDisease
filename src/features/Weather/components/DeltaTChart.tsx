import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const deltaTLevels = [
  { value: 2, color: '#b58047ff', icon: 'ellipse' as const },
  { value: 4, color: '#1c9720ff', icon: 'square' as const },
  { value: 6, color: '#1c9721ff', icon: 'square' as const },
  { value: 8, color: '#98642dff', icon: 'ellipse' as const },
  { value: 10, color: '#700e6dff', icon: 'close' as const },
];

export function DeltaTChart() {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Delta T</Text>
          <Text style={styles.unit}>(°C)</Text>
        </View>
        
        <View style={styles.levelsContainer}>
          {deltaTLevels.map((level, index) => (
            <View key={index} style={styles.levelRow}>
              <View style={styles.lineContainer}>
                <View style={[styles.line, { backgroundColor: level.color }]} />
                <View style={[styles.iconContainer, { backgroundColor: level.color }]}>
                  {level.icon === 'ellipse' && (
                    <View style={styles.circle} />
                  )}
                  {level.icon === 'square' && (
                    <View style={styles.square} />
                  )}
                  {level.icon === 'close' && (
                    <Ionicons name="close" size={20} color="#fff" />
                  )}
                </View>
                <View style={[styles.line, { backgroundColor: level.color }]} />
              </View>
              <Text style={styles.levelValue}>{level.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  box: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  unit: {
    fontSize: 24,
    fontWeight: '400',
    color: '#333',
    textAlign: 'center',
    marginTop: 4,
  },
  levelsContainer: {
    width: '100%',
    gap: 15,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
  },
  line: {
    height: 3,
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  square: {
    width: 16,
    height: 16,
    backgroundColor: '#fff',
  },
  levelValue: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333',
    minWidth: 40,
    textAlign: 'right',
  },
});
