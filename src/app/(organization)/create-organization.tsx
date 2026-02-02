import { Button, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import { TextInput, View, Text } from '@/src/components/Themed';
import { useState } from 'react';
import ImagePickerComponent from '@/src/components/ImagePicker';
import { joinOrganization } from './join-organization';
import { createOrganization } from '@/src/services/organizations.service';
export default function CreateOrganizationScreen() {
  const [organizationName, setOrganizationName] = useState("");
  const [description, setDescription] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (organizationName.length < 3) {
      setError("Organisaation nimen tulee olla vähintään 3 merkkiä pitkä.");
      return;
    }
    setIsLoading(true);
    try {
      const oid = await createOrganization(organizationName, description, photoURL);
      await joinOrganization(oid, "admin");
      console.log("Organization created with ID:", oid);
      setError("");
    } catch (error) {
      console.error("Error creating organization:", error);
      Alert.alert("Virhe", "Organisaation luominen epäonnistui. Yritä uudelleen.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}
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

      <ImagePickerComponent title="Valitse organisaation kuva" />
      <Button onPress={handleSubmit} disabled={isLoading} title="Luo Organisaatio" />
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
