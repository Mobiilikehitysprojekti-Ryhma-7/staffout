import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { auth } from '@/src/config/firebaseConfig';
import { signOut } from 'firebase/auth';

export default function Home() {

  const handleSignOut = async () => { signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
    console.log(error);
  });
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text 
        style={{margin: 10}}>
        Welcome {auth.currentUser?.email}!
      </Text>
      <Button title="Sign out" onPress={handleSignOut} />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});