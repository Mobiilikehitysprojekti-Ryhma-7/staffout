import { View, Text, StyleSheet, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import React, { useEffect, useState } from 'react'
import SendButton from '@/src/components/ui/MessageButtons';
import { AvatarPlaceholder } from '@/src/components/ui/AvatarPlaceholder';
import { Image } from 'react-native';
import { getMessages, createMessage } from '@/src/services/chat/messages.service';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { getUserById } from '@/src/services/users.service';
import { useHeaderHeight } from '@react-navigation/elements';

export default function MessagesModal() {
  const { user } = useUserProfile();
  const oid = user?.organizationId;
  const params = useLocalSearchParams<{ channelId: string, name: string }>();
  const { channelId, name } = params;
  const [messages, setMessages] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [merged, setMerged] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const headerHeight = useHeaderHeight();
  useEffect(() => {
    fetchMessages();

    mergeUserProfile();
  }, [oid, messages]);

  async function fetchMessages() {
    if (!oid || !channelId) return;
    const messages = await getMessages(oid, channelId);
    setMessages(messages);
  }

  async function mergeUserProfile() {
    if (messages.length > 0) {
      const mergedData = await Promise.all(messages.map(async (message) => {
        const userProfile = await getUserById(message.createdBy);
        return { ...message, ...userProfile };
      }));
      setMerged(mergedData);
    }
  }

  async function sendMessage() {
    if (!oid || !channelId) return;
    try {
      await createMessage(oid, channelId, newMessage, attachments);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setNewMessage('');
    fetchMessages();
  }
  return (
    <KeyboardAvoidingView style={styles.container} 
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : 0}>
      <Stack.Screen
        options={{
          title: name,
        }}
      />
      <FlatList style={{ width: "100%" }}
        data={merged}
        keyboardShouldPersistTaps="handled"
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
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                  <Text style={styles.nameText}>
                    {item.first || "undefined"} {item.last || "undefined"}
                  </Text>
                  <Text style={styles.time}>{item.createdAt.toDate().toLocaleString()}</Text>
                </View>

                <Text style={styles.text}>
                  {item.text}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View style={{ flexDirection: 'row', paddingTop: 10, width: "auto" }}>
        <TextInput style={styles.input} placeholder="Kirjoita viesti..." value={newMessage} onChangeText={setNewMessage} />
        <Pressable onPress={sendMessage} disabled={!newMessage.trim()}>
          <SendButton disabled={!newMessage.trim()} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>

  )
}

const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    width: 'auto',
     flex: 1
  },
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 14,
    color: '#000000',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  nameText: {
    fontSize: 18,
    fontWeight: "600",
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25
  },
});