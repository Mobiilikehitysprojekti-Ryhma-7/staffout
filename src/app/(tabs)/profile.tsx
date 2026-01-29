import { router, useFocusEffect } from 'expo-router';
import { Text, View, SafeAreaView } from '@/src/components/Themed';
import { Pressable, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { useEffect, useState, useCallback } from 'react';
import { getOrganizationById } from '@/src/services/organizations.service';

export default function UserScreen() {
  const { user, reload } = useUserProfile();
  const [firstName, setFirstName] = useState(user?.first || "");
  const [lastName, setLastName] = useState(user?.last || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoURL || "");
  const [organizationName, setOrganizationName] = useState(user?.organizationId || "");
  const defaultProfile = require('../../../assets/default-profile.png');

  useFocusEffect(
    useCallback(() => {
      reload(true);
    }, [reload])
  );

   useEffect(() => {
      if (user) {
        setFirstName(user.first || "");
        setLastName(user.last || "");
        setPhotoUrl(user.photoURL || "");
        
        if (user.organizationId) {
          getOrganizationById(user.organizationId).then(org => {
            if (org) {
              setOrganizationName(org.name);
            } else {
              setOrganizationName("Tuntematon organisaatio");
            }
          })
        }
      }
    }, [user]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Image source={photoUrl ? { uri: photoUrl } : defaultProfile}
          style={{ width: 75, height: 75, borderRadius: 50 }} />
        <View style={{ flex: 1, marginHorizontal: 20 }}>
          <Text style={styles.nameText}>
            {user ? `${firstName} ${lastName}` : 'Loading...'}
          </Text>
          <Text style={styles.organizationText}>{organizationName}</Text>
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