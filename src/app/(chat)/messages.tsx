import { View, Text, StyleSheet, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import React, { useRef, useEffect } from 'react'
import SendButton from '@/src/components/ui/MessageButtons';
import { AvatarPlaceholder } from '@/src/components/ui/AvatarPlaceholder';
import { Image } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import MoreButton from '@/src/components/ui/MoreButton';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import MessageOptions from '@/src/components/chat/MessageUpdate';
import useMessages from '@/src/hooks/useMessages';

export default function MessagesModal() {

  const { channelId, name } = useLocalSearchParams<{ channelId: string; name: string }>();
  const {
    merged,
    role,
    uid,
    newMessage,
    setNewMessage,
    selectedMessage,
    setSelectedMessage,
    editMessage,
    setEditMessage,
    sendMessage,
    handleUpdateMessage,
    handleDeleteMessage,
    startEditMessage,
    clearSelection,
  } = useMessages(channelId);
  const headerHeight = useHeaderHeight();

  // Ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (selectedMessage) {
      bottomSheetModalRef.current?.present();
    }
  }, [selectedMessage]);

  const handleClose = () => {
    clearSelection();
    bottomSheetModalRef.current?.dismiss();
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
              const deleted = await handleDeleteMessage();
              if (deleted) {
                alert("Viesti poistettu onnistuneesti.");
                handleClose();
              }
            }
          },
        },
      ]
    );
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
                <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
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
                <Pressable onPress={() => startEditMessage(item.id, item.text, item.createdBy)}>
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
        handleUpdateMessage={async () => {
          const updated = await handleUpdateMessage();
          if (updated) {
            alert("Viesti päivitetty onnistuneesti.");
            handleClose();
          }
        }}
        handleDeleteMessage={async () => {
          const deleted = await handleDeleteMessage();
          if (deleted) {
            alert("Viesti poistettu onnistuneesti.");
            handleClose();
          } 
        }}
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