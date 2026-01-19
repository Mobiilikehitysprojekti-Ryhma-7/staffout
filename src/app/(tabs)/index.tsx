import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { handleSignOut } from '@/src/services/handleSignout';
import { getUser } from '@/src/services/useUser';
import React, { useEffect, useState } from 'react';
export default function TabOneScreen() {
const [user, setUser] = useState<any>(null);

useEffect(() => {
  async function loadUser() {
    const data = await getUser();
    setUser(data);
  }
  loadUser();
}, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text 
      style={{margin: 10}}>
        Tervetuloa {user?.first}!
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