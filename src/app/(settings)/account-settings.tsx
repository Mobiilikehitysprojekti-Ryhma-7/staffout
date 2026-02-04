import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AccountSettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'flex-start' }}>
        <Pressable onPress={() => router.push('/(settings)/change-password')} style={styles.pressable}>
          <View style={styles.content}>
            <MaterialIcons style={styles.icon} name="lock" size={20} color="black" />
            <View>
              <Text style={styles.label}>Vaihda Salasana</Text>
            </View></View>
        </Pressable>

        <Pressable onPress={() => router.push('/(settings)/change-email')} style={styles.pressable}>
          <View style={styles.content}>
            <MaterialIcons style={styles.icon} name="mail" size={20} color="black" />
            <View>
              <Text style={styles.label}>Vaihda Sähköposti</Text>
            </View></View>
        </Pressable>

        <Pressable onPress={() => router.push('/(settings)/delete-user')} style={styles.pressable}>
          <View style={styles.content}>
            <MaterialIcons style={styles.icon} name="account-circle" size={20} color="black" />
            <View>
              <Text style={styles.label}>Poista käyttäjä</Text>
            </View></View>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '800',
  },
  pressable: {
    marginTop: 10,
    padding: 12,
    flexDirection: 'row'
  },
  icon: {
    marginRight: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
