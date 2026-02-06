import { Text, FlatList, StyleSheet, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react'
import { getChannels } from '@/src/services/chat/channels.service';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function channels() {
  const { user } = useUserProfile();
  const oid = user?.organizationId;
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchChannels() {
    if (!oid) return;
    const channels = await getChannels(oid);
    if (!channels) return;
    setChannels(channels)
    setLoading(false);
  }

  useEffect(() => {
    fetchChannels();
  }, [oid]);

  if (!loading)
    return (
      <SafeAreaView style={styles.container}>
        {channels.length > 0 ?
          <FlatList style={{ width: '100%' }}
            data={channels}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable onPress={() => router.push({ pathname: "/(chat)/messages", params: { channelId: item.id, name: item.name } })} style={styles.channelItem}>
                <Feather name="hash" size={20} color="#ffffff" />
                <Text style={styles.title}>{item.name}</Text>

              </Pressable>
            )}
          />
          : <Text style={styles.title}>Ei kanavia</Text>}
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  channelItem: {
    height: 40,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    backgroundColor: "#000000",
    justifyContent: "center",
    width: '100%'
  },
  text: {
    fontSize: 14,
    color: '#666666',
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: '#fff',
  },
  photo: {
    width: 50, height: 50, borderRadius: 25
  },
});


