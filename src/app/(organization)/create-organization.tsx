import { Button, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { TextInput, View, Text } from '@/src/components/Themed';
import { useState } from 'react';
import ImagePickerComponent from '@/src/components/ImagePicker';
export default function CreateOrganizationScreen() {
  const [organizationName, setOrganizationName] = useState("");
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  function handleCreateOrganization() {
  }
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TextInput
        style={styles.input}
        value={organizationName}
        onChangeText={setOrganizationName}
        placeholder="Organisaation Nimi"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        maxLength={120}
        placeholder="Kuvaus"
        editable={!isLoading}
      />

      <ImagePickerComponent/>
      <View style={{ height: 20 }} />
      <Button onPress={handleCreateOrganization} disabled={isLoading} title="Luo Organisaatio" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    width: '100%',
    borderRadius: 5,
  },
});
