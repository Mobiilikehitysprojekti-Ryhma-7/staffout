import { Button, StyleSheet } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { router } from 'expo-router';

export default function JoinOrCreateOrganizationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sovellusasetukset</Text>
      <Button title="Liity organisaatioon" onPress={() => router.push('/(organization)/join-organization')} />
      <View style={{ height: 12 }} />
      <Button title="Luo organisaatio" onPress={() => router.push('/(organization)/create-organization')} />
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
