import { Alert, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import { handleSignOut } from '@/src/services/handleSignout'
import { router } from 'expo-router';
import { Platform } from 'react-native';
export default function SettingsScreen() {
  const confirmSignout = () =>
    Alert.alert('Kirjaudu ulos', 'Haluatko varmasti kirjautua ulos?', [
      {
        text: 'Peruuta',
        style: 'cancel',
      },
      {text: 'OK', onPress: () => handleSignOut()},
    ]);

  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      
      <Pressable onPress={() => router.push('/(settings)/profile-settings')} style={styles.pressable}>
        <View style={styles.content}>
        <MaterialIcons style={styles.icon} name="person" size={20} color="#000" />
        <View>
        <Text style={styles.label}>Profiiliasetukset</Text>
        <Text style={styles.description}>Muuta profiilitietoja ja profiilikuvaa</Text>
        </View>
        </View>
      </Pressable>

       <Pressable onPress={() => router.push('/(settings)/account-settings')} style={styles.pressable}>
        <View style={styles.content}>
        <MaterialIcons style={styles.icon} name="manage-accounts" size={20} color="#000" />
        <View>
        <Text style={styles.label}>Tiliasetukset</Text>
        <Text style={styles.description}>Vaihda sähköpostiosoitetta, salasanaa tai poista käyttäjä</Text>
        </View></View>
      </Pressable>

       <Pressable onPress={() => router.push('/(settings)/app-settings')} style={styles.pressable}>
        <View style={styles.content}>
        <MaterialIcons style={styles.icon} name="settings" size={20} color="#000" />
        <View>
        <Text style={styles.label}>Sovellusasetukset</Text>
        <Text style={styles.description}>Vaihda sovellusasetuksia</Text>
        </View></View>
      </Pressable>

       <Pressable onPress={Platform.OS === 'web' ? handleSignOut : confirmSignout} style={styles.pressable}>
        <View style={styles.content}>
        <MaterialIcons style={styles.icon} name="logout" size={20} color="red" />
        <View>
        <Text style={styles.logoutButton}>Kirjaudu ulos</Text>
        </View></View>
      </Pressable>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
   
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
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
  logoutButton: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',

  }
});