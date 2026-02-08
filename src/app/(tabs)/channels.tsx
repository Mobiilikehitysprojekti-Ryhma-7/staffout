import { Alert, Text, Button, FlatList, StyleSheet, Pressable, View } from 'react-native'
import { useCallback, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import useChannels from '@/src/hooks/useChannels';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import ChannelForm from '@/src/components/channels/ChannelForm';
import MoreButton from '@/src/components/ui/MoreButton';
import ChannelEdit from '@/src/components/channels/ChannelEdit';

export default function Channels() {
  const {
    channels,
    loading,
    role,
    channelName,
    setChannelName,
    handleCreate,
    handleEdit,
    handleDelete,
  } = useChannels();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['25%'], []);
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={1} disappearsOnIndex={-1} pressBehavior="close" />,
    []
  );

  const [activeForm, setActiveForm] = useState<'create' | 'edit' | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  const openCreateForm = () => {
    setActiveForm('create');
    setSelectedChannelId(null);
    bottomSheetModalRef.current?.present();
  };

  const openEditForm = (channelId: string, name: string) => {
    setActiveForm('edit');
    setSelectedChannelId(channelId);
    setChannelName(name);
    bottomSheetModalRef.current?.present();
  };

  const handleClose = () => {
    setActiveForm(null);
    setSelectedChannelId(null);
    setChannelName('');
    bottomSheetModalRef.current?.dismiss();
  };

  const confirmDelete = () => {
    if (!selectedChannelId) return;
    Alert.alert(
      'Poista kanava',
      'Haluatko varmasti poistaa kanavan? Tätä toimintoa ei voi perua.',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            const deleted = await handleDelete(selectedChannelId);
            if (deleted) handleClose();
          },
        },
      ]
    );
  };

  if (loading) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {channels.length > 0 ?
        <FlatList style={{ width: '100%'}}
          data={channels}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1, gap: 10, alignItems: 'center' }}>
              <Pressable onPress={() => router.push({ pathname: "/(chat)/messages", params: { channelId: item.id, name: item.name } })} style={styles.channelItem}>
                <Feather name="hash" size={20} color="#ffffff" />
                <Text style={styles.title}>{item.name}</Text>
              </Pressable>
               {role === 'admin' &&
              <Pressable onPress={() => openEditForm(item.id, item.name)}>  
                  <MoreButton></MoreButton>
              </Pressable>}
            </View>
          )}
        />
        : <Text style={styles.title}>Ei kanavia</Text>}


      {role === 'admin' && (
        <>
          <Button title="Luo kanava" onPress={openCreateForm} />
          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            enablePanDownToClose
            onDismiss={handleClose}
          >
            {activeForm === 'create' && (
              <ChannelForm
                channelName={channelName}
                setChannelName={setChannelName}
                handleCreate={async () => {
                  const created = await handleCreate();
                  if (created) handleClose();
                }}
                handleCancel={handleClose}
              />
            )}
            {activeForm === 'edit' && (
              <ChannelEdit
                channelName={channelName}
                setChannelName={setChannelName}
                handleEdit={async () => {
                  if (!selectedChannelId) return;
                  const updated = await handleEdit(selectedChannelId);
                  if (updated) handleClose();
                }}
                handleDelete={confirmDelete}
                handleCancel={handleClose}
              />
            )}
          </BottomSheetModal>
        </>
      )}
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
    backgroundColor: "#111",
    justifyContent: "center",
    flex: 1,
    marginVertical: 10,
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


