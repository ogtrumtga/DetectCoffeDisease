// MyNewProject/app/(tabs)/index.tsx
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const navigateToCamera = () => {
    router.push('/camera/camera-screen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>App name</Text>

      <View style={styles.card}>
        <View style={styles.workflow}>
          <View style={styles.step}>
            <TouchableOpacity 
              style={styles.dashedBox} 
              onPress={navigateToCamera}
            >
              <Ionicons name="scan-outline" size={30} color="#E9C46A" />
            </TouchableOpacity>
            <Text style={styles.stepText}>Chụp ảnh</Text>
          </View>

          <Ionicons name="arrow-forward" size={20} color="#333" />

          <View style={styles.step}>
            <View style={[styles.iconCircle, { backgroundColor: '#E9C46A' }]}>
              <Ionicons name="document-text" size={24} color="white" />
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#2A9D8F" />
              </View>
            </View>
            <Text style={styles.stepText}>Chuẩn đoán</Text>
          </View>

          <Ionicons name="arrow-forward" size={20} color="#333" />

          <View style={styles.step}>
            <Ionicons name="medical" size={40} color="#2A9D8F" />
            <Text style={styles.stepText}>Thuốc</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.mainButton} onPress={navigateToCamera}>
          <Text style={styles.buttonText}>CHỤP ẢNH</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA', 
    paddingTop: 60, 
    alignItems: 'center' 
  },
  appName: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#B7E4C7', 
    marginBottom: 40 
  },
  card: { 
    width: '90%', 
    backgroundColor: '#F1F8F5', 
    borderRadius: 20, 
    padding: 30, 
    alignItems: 'center' 
  },
  workflow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: 40 
  },
  step: { 
    alignItems: 'center' 
  },
  dashedBox: { 
    width: 50, 
    height: 50, 
    borderStyle: 'dashed', 
    borderWidth: 2, 
    borderColor: '#E9C46A', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  iconCircle: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'relative'
  },
  checkBadge: { 
    position: 'absolute', 
    bottom: -2, 
    right: -2, 
    backgroundColor: 'white', 
    borderRadius: 10 
  },
  stepText: { 
    fontSize: 12, 
    marginTop: 8, 
    fontWeight: '600' 
  },
  mainButton: { 
    backgroundColor: '#B7E4C7', 
    paddingVertical: 15, 
    paddingHorizontal: 40, 
    borderRadius: 30 
  },
  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  }
});