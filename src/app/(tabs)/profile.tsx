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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#E3F1FF', padding: 10, borderRadius: 10, width: '100%' }}>
        <Image source={photoUrl ? { uri: photoUrl } : defaultProfile}
          style={{ width: 50, height: 50, borderRadius: 25 }} />
        <View style={{ flex: 1, marginHorizontal: 20, backgroundColor: 'transparent' }}>
          <Text style={styles.nameText}>
            {user ? `${firstName} ${lastName}` : 'Loading...'}
          </Text>
          <Text style={styles.organizationText}>{organizationName}</Text>
        </View>
        <Pressable style={styles.actionBtn} onPress={() => router.push('../(settings)/settings')}>
          <MaterialIcons name="settings" size={20} color="#fff" />
        </Pressable>
      </View>



      <Text style={styles.subheader}>Analytiikka</Text>
       <Text style={styles.subheader}>Viime kuukauden tapahtumat</Text>


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
    fontSize: 18,
    fontWeight: "800",
  },
  organizationText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
  },
  subheader: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 20,
  }
});