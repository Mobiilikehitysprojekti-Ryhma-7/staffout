import { View, Text, StyleSheet, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, Alert} from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import React, { useRef, useEffect, useState } from 'react'
import SendButton from '@/src/components/ui/MessageButtons';
import { AvatarPlaceholder } from '@/src/components/ui/AvatarPlaceholder';
import { Image } from 'react-native';
import { getMessages, createMessage } from '@/src/services/chat/messages.service';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { getUserById } from '@/src/services/users.service';
import { useHeaderHeight } from '@react-navigation/elements';
import MoreButton from '@/src/components/ui/MoreButton';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { deleteMessage, updateMessage } from '@/src/services/chat/messages.service';
import { useOrganizationMembership } from '@/src/hooks/useOrganizationMembership';
import { auth } from '@/src/config/firebaseConfig';
import MessageOptions from '@/src/components/chat/MessageUpdate';

export default function MessagesModal() {

  const uid = auth.currentUser?.uid;
  const { user } = useUserProfile();
  const { role } = useOrganizationMembership();
  const { channelId, name } = useLocalSearchParams<{ channelId: string; name: string }>();
  const oid = user?.organizationId;
  const [messages, setMessages] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [merged, setMerged] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<{ messageId: string; text: string; } | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const headerHeight = useHeaderHeight();

  // Ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    fetchMessages();
  }, [oid, channelId]);

  useEffect(() => {
    if (messages.length === 0) {
      setMerged([]);
      return;
    }
    mergeUserProfile();
  }, [messages]);

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

  useEffect(() => {
    if (selectedMessage) {
      bottomSheetModalRef.current?.present();
      setEditMessage(selectedMessage.text);
    }
  }, [selectedMessage]);

  const openEditForm = (messageId: string, text: string) => {
    setSelectedMessage({ messageId, text });
    bottomSheetModalRef.current?.present();
  };

  const handleClose = () => {
    setSelectedMessage(null);
    setEditMessage('');
    bottomSheetModalRef.current?.dismiss();
  };

  const handleUpdateMessage = async () => {
    if (!selectedMessage || !oid || !channelId) return console.error("Missing required parameters for editing message.");
    try {
      await updateMessage(oid!, channelId!, selectedMessage.messageId, editMessage);
      alert("Viesti päivitetty onnistuneesti.");
      setEditMessage('');
      handleClose();
      fetchMessages();
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const confirmDeleteMessage = () => {
    if (!selectedMessage) return;
    Alert.alert(
      'Poista viesti',
      'Haluatko varmasti poistaa viestin? Tätä toimintoa ei voi perua.',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            if (selectedMessage) {
              await handleDeleteMessage();
              setSelectedMessage(null);
              handleClose();
            }
          },
        },
      ]
    );
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage || !oid || !channelId) return console.error("Missing required parameters for deleting message.");
    try {
      await deleteMessage(oid, channelId, selectedMessage.messageId);
      alert("Viesti poistettu onnistuneesti.");
      handleClose();
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <><KeyboardAvoidingView style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : 0}>
      <Stack.Screen
        options={{
          title: name,
        }} />
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
              {(role === 'admin' || item.createdBy === uid) &&
                <Pressable onPress={() => openEditForm(item.id, item.text)}>
                  <MoreButton></MoreButton>
                </Pressable>
              }
            </View>
          );
        }} />

      <View style={{ flexDirection: 'row', paddingTop: 10, width: "auto" }}>
        <TextInput style={styles.input} placeholder="Kirjoita viesti..." value={newMessage} onChangeText={setNewMessage} />
        <Pressable onPress={sendMessage} disabled={!newMessage.trim()}>
          <SendButton disabled={!newMessage.trim()} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>

  <MessageOptions
    selectedMessage={selectedMessage}
    setSelectedMessage={setSelectedMessage}
    editMessage={editMessage}
    setEditMessage={setEditMessage}
    handleClose={handleClose}
    handleUpdateMessage={handleUpdateMessage}
    handleDeleteMessage={handleDeleteMessage}
    confirmDeleteMessage={confirmDeleteMessage}
    bottomSheetModalRef={bottomSheetModalRef as React.RefObject<BottomSheetModal>}
  />
    </>
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
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 5,
    textAlign: 'left',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 20,
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