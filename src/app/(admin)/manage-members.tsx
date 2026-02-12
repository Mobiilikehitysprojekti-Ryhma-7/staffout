import { StyleSheet, FlatList, Image, Text, ActivityIndicator, Pressable} from 'react-native';
import { View } from '@/src/components/Themed';
import { getAllMembersFromOrganization } from '@/src/services/members.service';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { useEffect, useState } from 'react';
import { getUserById } from '@/src/services/users.service';
import { AvatarPlaceholder } from '@/src/components/ui/AvatarPlaceholder';
import { router } from 'expo-router';
import MoreButton from '@/src/components/ui/MoreButton';
import LoadingScreen from '@/src/components/LoadingScreen';

export default function ManageMembersScreen() {
  const { user } = useUserProfile();
  const oid = user?.organizationId;
  const [members, setMembers] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function getMembers() {
    if (oid) {
      const members = await getAllMembersFromOrganization(oid);
      setMembers(members);
    }
  }

  async function getUserProfile() {
    const profiles = await Promise.all(members.map(async (item) => {
      const profile = await getUserById(item.id);
      if (!profile) return null;
      return { ...profile, role: item.role };
    }));
    setUserProfile(profiles.filter(profile => profile != null));
    setLoading(false);
  }

  useEffect(() => {
    if (oid) {
      getMembers();
    }
    if (members.length > 0) {
      getUserProfile();
      setLoading(false);
    } 
  }, [oid, members])


  if (loading) {
    return (
     <LoadingScreen />
    );
  }

  if (!loading)
    return (
      <View style={styles.container}>

        <FlatList style={{ width: "100%" }}
          data={userProfile}
          renderItem={({ item }) => {
            return (
              <View style={styles.card}>
                {item.photoURL ? (
                  <Image source={{ uri: item.photoURL }}
                    style={styles.avatar} />
                ) : (
                  <AvatarPlaceholder />
                )}

                <View style={{ marginHorizontal: 20, backgroundColor: 'transparent', justifyContent: 'center', flex: 1 }}>
                  <Text style={styles.nameText}>
                    {item.first || "undefined"} {item.last || "undefined"}
                  </Text>
                  <Text style={styles.text}>
                    uid: {item.uid || "uid not found"}
                  </Text>
                  {item.role && <Text style={styles.text}>role: {item.role}</Text>}
                </View>

                <Pressable onPress={() => { router.push({ pathname: '/(admin)/member-modal', params: { first: item.first, last: item.last, photoURL: item.photoURL, uid: item.uid, role: item.role, oid } }) }}>
                  <MoreButton></MoreButton>
                </Pressable>
              </View>
            );
          }}
        />
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,

  },
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 14,
    color: '#666666',
  },
  nameText: {
    fontSize: 18,
    fontWeight: "600",
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
});
