import { useFocusEffect } from 'expo-router';
import { Text, View, SafeAreaView } from '@/src/components/Themed';
import { StyleSheet, Image } from 'react-native';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { useCallback } from 'react';
import { AvatarPlaceholder } from '@/src/components/ui/AvatarPlaceholder';
import SettingsButton from '@/src/components/ui/SettingsButton';
import MessagesChart from '@/src/components/charts/MessagesChart';
import { useOrganization } from '@/src/hooks/useOrganization';
import OrganizationCard from '@/src/components/ui/OrganizationCard';

export default function ProfileScreen() {
  const { user, reload } = useUserProfile();

  const { organization } = useOrganization(user, user?.organizationId);

  useFocusEffect(
    useCallback(() => {
      reload(true);
    }, [reload])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }}
            style={styles.avatar} />
        ) : (
          <AvatarPlaceholder />
        )}
        <View style={{ flex: 1, marginHorizontal: 20, backgroundColor: 'transparent' }}>
          <Text style={styles.title}>
            {user ? `${user.first} ${user.last}` : 'Loading...'}
          </Text>
        </View>
        <SettingsButton />
      </View>

      <OrganizationCard
        organizationId={user?.organizationId}
        organizationName={organization?.name}
        organizationDescription={organization?.description}
        organizationAvatar={organization?.photoURL}
        interactive={true}
      />

      <Text style={styles.title}>
        Analytiikka
      </Text>
      <Text style={styles.description}>
        Viestit / päivä (30pv)
      </Text>
      <MessagesChart />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 5
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    width: '100%'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
});