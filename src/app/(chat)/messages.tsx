import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Alert, Image } from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import React, { useRef, useEffect } from 'react'
import { SendButton, AddButton } from '@/src/components/ui/MessageButtons';
import { AvatarPlaceholderSmall } from '@/src/components/ui/AvatarPlaceholder';
import MoreButton from '@/src/components/ui/MoreButton';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import MessageUpdate from '@/src/components/messages/MessageUpdate';
import useMessages from '@/src/hooks/useMessages';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import MessageImagePicker from '@/src/components/messages/MessageImagePicker';
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
    base64Image,
    setBase64Image,
  } = useMessages(channelId);
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
    <><View style={styles.container}>
      <Stack.Screen
        options={{
          title: name,
        }} />
      <FlatList style={{ width: "100%" }}
        data={merged}
        keyboardShouldPersistTaps="handled"
        inverted
        contentContainerStyle={{ flexDirection: 'column-reverse' }}
        renderItem={({ item }) => {
          return (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <View style={styles.headerRow}>
                  {item.photoURL ? (
                    <Image source={{ uri: item.photoURL }}
                      style={styles.avatar} />
                  ) : (
                    <AvatarPlaceholderSmall />
                  )}
                  <View style={styles.contentContainer}>
                    <View style={styles.textRow}>
                      <Text style={styles.nameText}>
                        {item.first || "undefined"} {item.last || "undefined"}
                      </Text>
                      <Text style={styles.time}>
                        {item.createdAt.toDate().toLocaleString()}
                      </Text>
                    </View>
                    {item.attachments.length > 0 && (
                      <Image source={{ uri: item.attachments[0] }} style={styles.attachmentImage} />
                    )}
                    <Text style={styles.text}>{item.text}</Text>
                  </View>
                </View>
              </View>
              {(role === 'admin' || item.createdBy === uid) &&
                <Pressable onPress={() => startEditMessage(item.id, item.text, item.createdBy)}>
                  <MoreButton></MoreButton>
                </Pressable>
              }
            </View>
          );
        }} />

      <KeyboardStickyView style={styles.inputContainer}>

        <MessageImagePicker onImageSelected={setBase64Image} resetTrigger={base64Image === null}></MessageImagePicker>

        <TextInput style={styles.input} placeholder="Kirjoita viesti..." value={newMessage} onChangeText={setNewMessage} />
        <Pressable onPress={sendMessage} disabled={!newMessage.trim()}>
          <SendButton disabled={!newMessage.trim()} />
        </Pressable>
      </KeyboardStickyView>
    </View>
      <MessageUpdate
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
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    gap: 10,
    flexDirection: 'row',
    paddingBottom: 20,
    paddingTop: 10,
    width: "auto",
    backgroundColor: '#ffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: 'auto',
    flex: 1
  },
  card: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    width: '100%',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },

  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  textRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    columnGap: 5,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  nameText: {
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },

  time: {
    fontSize: 12,
    color: '#666',
    flexShrink: 1,
  },

  text: {
    fontSize: 14,
    color: '#000000',
    flexShrink: 1,
    marginTop: 5,
  },

  attachmentImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 5,
  },
});