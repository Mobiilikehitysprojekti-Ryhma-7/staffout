import { StyleSheet } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import React, { useCallback} from 'react';
import { useFocusEffect } from 'expo-router';

export default function TabOneScreen() {
  const { user, reload } = useUserProfile();
  const first = user?.first || "";

   useFocusEffect(
      useCallback(() => {
        reload(true);
      }, [reload])
    );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kotisivu</Text>
      <Text
        style={styles.regularText}>
       Tervetuloa {first}!
      </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  regularText: {
    fontSize: 14,
    fontWeight: '400',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});