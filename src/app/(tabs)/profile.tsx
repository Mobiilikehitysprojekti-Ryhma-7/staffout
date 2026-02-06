import { useFocusEffect } from 'expo-router';
import { Text, View, SafeAreaView } from '@/src/components/Themed';
import { StyleSheet, Image } from 'react-native';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { useEffect, useState, useCallback } from 'react';
import { getOrganizationById } from '@/src/services/organizations.service';
import { AvatarPlaceholder, OrganizationAvatarPlaceholder } from '@/src/components/ui/AvatarPlaceholder';
import OrganizationSettingsButton from '@/src/components/ui/OrganizationSettingsButton';
import SettingsButton from '@/src/components/ui/SettingsButton';

export default function ProfileScreen() {
  const { user, reload } = useUserProfile();
  const [firstName, setFirstName] = useState(user?.first || "");
  const [lastName, setLastName] = useState(user?.last || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationAvatar, setOrganizationAvatar] = useState("");
  const [organizationDescription, setOrganizationDescription] = useState("");


  useFocusEffect(
    useCallback(() => {
      reload(true);
    }, [reload])
  );

  useEffect(() => {
    if (user) {
      setFirstName(user.first || "");
      setLastName(user.last || "");
      setPhotoURL(user.photoURL || "");

      if (user.organizationId) {
        getOrganizationById(user.organizationId).then(o => {
          if (o) {
            setOrganizationName(o.name);
            setOrganizationAvatar(o.photoURL || "");
            setOrganizationDescription(o.description || "");
          } else {
            setOrganizationName("Tuntematon organisaatio");
          }
        })
      }
    }
  }, [user]);
  return (
    <SafeAreaView style={styles.container}>


      <View style={styles.card}>
        {photoURL ? (
          <Image source={{ uri: photoURL }}
            style={styles.avatar} />
        ) : (
          <AvatarPlaceholder />
        )}
        <View style={{ flex: 1, marginHorizontal: 20, backgroundColor: 'transparent' }}>
          <Text style={styles.nameText}>
            {user ? `${firstName} ${lastName}` : 'Loading...'}
          </Text>
        </View>
        <SettingsButton />
      </View>


      {user?.organizationId && (
        <View style={[styles.card, { flexDirection: 'column', marginBottom: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: 'transparent' }}>
            {organizationAvatar ? (
              <Image source={{ uri: organizationAvatar }} style={styles.avatar} />
            ) : (
              <OrganizationAvatarPlaceholder />
            )}
            <View style={{ flex: 1, marginHorizontal: 20, backgroundColor: 'transparent' }}>
              {organizationName && <Text style={styles.subheader2}>{organizationName}</Text>}
              {organizationDescription && <Text style={styles.description}>{organizationDescription}</Text>}
            </View>
          </View>
          <OrganizationSettingsButton />
        </View>
      )}


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
  avatar: {
    width: 50, height: 50, borderRadius: 25
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    width: '100%'
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
    fontWeight: "600",
  },
  subheader2: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  description: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
  },
  subheader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  }
});