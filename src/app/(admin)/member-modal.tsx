import { Text, Button, StyleSheet, Pressable } from 'react-native'
import { View } from '@/src/components/Themed'
import { useLocalSearchParams, router } from 'expo-router'
import React from 'react'
import { Image } from 'react-native';
import { AvatarPlaceholder } from '@/src/components/ui/AvatarPlaceholder';
import { Feather } from '@expo/vector-icons';
import { updateMemberRole, removeMemberFromOrganization } from '@/src/services/members.service';
import { updateUserOrganization } from '@/src/services/users.service';
import { useState } from 'react';

export default function MemberModal() {
  const params = useLocalSearchParams<{ first: string, last: string, photoURL?: string, uid: string, role: string, oid: string }>();
  const { first, last, photoURL, uid, oid } = params;
  const [role, setRole] = useState(params.role);

  async function promoteToAdmin() {
    if (oid) {
      try {
        await updateMemberRole(oid, uid, 'admin');
        alert(`${first} ${last} on nyt organisaation admin!`);
        setRole('admin');
      }
      catch (error) {
        console.error("Error promoting member to admin:", error);
      }
    }
  }

  async function removeFromOrganization() {
    if (oid) {
      try {
        await removeMemberFromOrganization(oid, uid);
        await updateUserOrganization('', uid);
        alert(`${first} ${last} on nyt poistettu organisaatiosta!`);
        router.back();
      } catch (error) {
        console.error("Error removing member from organization:", error);
      }
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {photoURL ? (
          <Image source={{ uri: photoURL }}
            style={styles.avatar} />
        ) : (
          <AvatarPlaceholder />
        )}

        <View style={{ marginHorizontal: 20, backgroundColor: 'transparent', justifyContent: 'center', flex: 1 }}>
          <Text style={styles.nameText}>
            {first || "undefined"} {last || "undefined"}
          </Text>
          <Text style={styles.text}>
            uid: {uid || "uid not found"}
          </Text>
          {role && <Text style={styles.text}>role: {role}</Text>}
        </View>

        <Pressable style={styles.actionBtn} onPress={() => { router.back() }}>
          <Feather name="minimize" size={20} color="#fff" />
        </Pressable>
      </View>
      <Button title="Ylennä käyttäjä admin-rooliin" onPress={promoteToAdmin}></Button>
      <View style={{ height: 10 }}></View>
      <Button title="Poista käyttäjä organisaatiosta" onPress={removeFromOrganization}></Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
