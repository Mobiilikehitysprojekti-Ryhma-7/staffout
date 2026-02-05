import { Button, StyleSheet, FlatList, Image, Text, ActivityIndicator, Pressable, Modal } from 'react-native';
import { View } from '@/src/components/Themed';
import { getAllMembersFromOrganization } from '@/src/services/members.service';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { useEffect, useState } from 'react';
import { getUserById } from '@/src/services/users.service';
import { AvatarPlaceholder } from '@/src/components/ui/AvatarPlaceholder';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ManageMembersScreen() {
  const { user } = useUserProfile();
  const oid = user?.organizationId;
  const [members, setMembers] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);

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
    } else {
      setLoading(false);
    }
  }, [oid, members])


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
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
                      uid: {item.uid || "Deleted User"}
                    </Text>
                    {item.role && <Text style={styles.text}>role: {item.role}</Text>}
                  </View>
            
                <Pressable style={styles.actionBtn} onPress={() => {router.push('/(admin)/member-modal')}}>
                    <Feather name="more-vertical" size={20} color="#fff" />
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
