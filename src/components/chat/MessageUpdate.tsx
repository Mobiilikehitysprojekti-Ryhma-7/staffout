import { BottomSheetView, BottomSheetModal, BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Button, Text, TextInput, Platform, StyleSheet, View, Pressable } from 'react-native';
import React, { useCallback } from 'react'
import SendButton from '../ui/MessageButtons';
import { useUserProfile } from '../../hooks/useUserProfile';

type MessageOptionsProps = {
  selectedMessage: { messageId: string; text: string; createdBy: string; } | null;
  setSelectedMessage: (message: { messageId: string; text: string; createdBy: string; } | null) => void;
  editMessage: string;
  setEditMessage: (text: string) => void;
  handleClose: () => void;
  handleUpdateMessage: () => void;
  handleDeleteMessage: () => void;
  confirmDeleteMessage: () => void;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}

export default function MessageOptions({ selectedMessage, setSelectedMessage, editMessage, setEditMessage, handleClose, handleUpdateMessage, handleDeleteMessage, confirmDeleteMessage, bottomSheetModalRef }: MessageOptionsProps) {
  
  const { user } = useUserProfile();
  const Input = Platform.OS === 'web' ? TextInput : BottomSheetTextInput
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={1} disappearsOnIndex={-1} pressBehavior="close" />,
    []
  );
  const disabled = !editMessage.trim() || editMessage === selectedMessage?.text;
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      enableDynamicSizing={true}
      onDismiss={() => setSelectedMessage(null)}
    >
      <BottomSheetView style={styles.container}>
        {selectedMessage && selectedMessage.createdBy === user?.uid &&
          <>
            <Text style={styles.label}>Päivitä viesti</Text>
              <View style={{ flexDirection: 'row', paddingTop: 10, width: "auto" }}>
                <Input
                  placeholder="Päivitä viesti"
                  style={styles.input}
                  value={editMessage}
                  onChangeText={setEditMessage}
                ></Input>
                <Pressable onPress={handleUpdateMessage} disabled={disabled}>
                  <SendButton disabled={disabled} />
                </Pressable>
              </View>
                </>
        }
            <View style={styles.buttonContainer}>
              <Button title="Poista viesti" onPress={Platform.OS === 'web' ? handleDeleteMessage : confirmDeleteMessage}></Button>
              <Button title="Peruuta" onPress={() => (handleClose())} />
            </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({

  container: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 5,
    textAlign: 'left',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
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
});