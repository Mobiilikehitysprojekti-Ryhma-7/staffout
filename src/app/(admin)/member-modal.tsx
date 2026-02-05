import { Text, Button, StyleSheet, Pressable } from 'react-native'
import { View } from '@/src/components/Themed'
import { router } from 'expo-router'
import React from 'react'
import { Image } from 'react-native';
import { AvatarPlaceholder } from '@/src/components/ui/AvatarPlaceholder';
import { Feather } from '@expo/vector-icons';
type Props = {
    first: string;
    last: string;
    photoURL?: string;
    uid: string;
    role: string;
    oid: string
}
export default function MemberModal({ first, last, photoURL, uid, role, oid }: Props) {
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
                      uid: {uid || "Deleted User"}
                    </Text>
                    {role && <Text style={styles.text}>role: {role}</Text>}
                  </View>
            
                <Pressable style={styles.actionBtn} onPress={() => {router.push('/(admin)/member-modal')}}>
                    <Feather name="minimize" size={20} color="#fff" />
                  </Pressable>
              </View>
        <Button title="Ylennä käyttäjä admin-rooliin"></Button>
        <Button title="Poista käyttäjä organisaatiosta"></Button>
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
