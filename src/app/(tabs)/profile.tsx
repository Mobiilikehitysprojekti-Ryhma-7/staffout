import { router } from 'expo-router';
import { Text, View, SafeAreaView } from '@/src/components/Themed';
import { Pressable, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUserProfile } from '@/src/hooks/useUserProfile';

export default function UserScreen() {
  const { user } = useUserProfile();
  const placeholderImage = 'https://images.pexels.com/photos/32623341/pexels-photo-32623341.jpeg';
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Image source={{ uri: placeholderImage }}
          style={{ width: 75, height: 75, borderRadius: 50 }} />
        <View style={{ flex: 1, marginHorizontal: 20 }}>
          <Text style={styles.nameText}>
            {user ? `${user.first} ${user.last}` : 'Loading...'}
          </Text>
          <Text style={styles.organizationText}>nykyinen organisaatio</Text>
        </View>
        <Pressable style={styles.actionBtn} onPress={() => router.push('/(settings)/settings')}>
          <MaterialIcons name="settings" size={20} color="#fff" />
        </Pressable>
      </View>



      <Text style={{ fontSize: 20, marginBottom: 5 }}>Analytiikka</Text>
       <Text style={{ fontSize: 20, marginBottom: 5 }}>Viime kuukauden tapahtumat</Text>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  organizationText: {
    fontSize: 24,
    color: "#666",
  },
});