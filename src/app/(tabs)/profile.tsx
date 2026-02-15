import { useFocusEffect } from 'expo-router';
import { Text, View, SafeAreaView } from '@/src/components/Themed';
import { StyleSheet, Image, ScrollView } from 'react-native';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { useEffect, useState, useCallback } from 'react';
import { getOrganizationById } from '@/src/services/organizations.service';
import { AvatarPlaceholder, OrganizationAvatarPlaceholder } from '@/src/components/ui/AvatarPlaceholder';
import OrganizationSettingsButton from '@/src/components/ui/OrganizationSettingsButton';
import SettingsButton from '@/src/components/ui/SettingsButton';
import MessagesChart from '@/src/components/charts/MessagesChart';
import EventsChart from '@/src/components/charts/EventsChart';

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
          <Text style={styles.title}>
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
              {organizationName &&
                <Text style={styles.organizationTitle}>
                  {organizationName}
                </Text>}
              {organizationDescription &&
                <Text style={styles.description}>
                  {organizationDescription}
                </Text>}
            </View>
          </View>
          <OrganizationSettingsButton />
        </View>
      )}
      
      <Text style={styles.title}>
        Analytiikka
      </Text>
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>Viestit / päivä (nykyinen kuukausi)</Text>
        <MessagesChart />
        <Text style={[styles.description, { marginTop: 24 }]}>Tapahtumat / päivä (nykyinen kuukausi)</Text>
        {/* @ts-ignore */}
        <EventsChart />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  organizationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  description: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
});