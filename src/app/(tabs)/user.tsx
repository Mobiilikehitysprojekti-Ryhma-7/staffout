import { router } from 'expo-router';
import { Text , View } from '@/src/components/Themed';
import { Pressable, StyleSheet} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function UserScreen() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.actionBtn} onPress={() => router.push('/(settings)/settings')}>
          <MaterialIcons name="settings" size={20} color="#fff" />
        </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
});