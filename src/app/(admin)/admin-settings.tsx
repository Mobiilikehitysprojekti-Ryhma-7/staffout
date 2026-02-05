import { Button, StyleSheet, KeyboardAvoidingView, TextInput, View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import ImagePickerComponent from '@/src/components/ImagePicker';
import { getOrganizationAvatarURL, uploadOrganizationAvatar } from '@/src/services/storage/storage.service';
import { getOrganizationById, updateOrganization } from '@/src/services/organizations.service';
import { router } from 'expo-router';

export default function AdminSettingsScreen() {
  const [organizationName, setOrganizationName] = useState('');
  const [description, setDescription] = useState('');
  const [photoURL, setPhotoURL] = useState<string | undefined>(undefined);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useUserProfile();
  const oid = user?.organizationId;

  useEffect(() => {
    if (oid) {
      getOrganizationById(oid).then(o => {
        if (o) {
          setOrganizationName(o.name || "");
          setDescription(o.description || "");
          setPhotoURL(o.photoURL || "");
        }
      });
    }
  }, [oid])

  const handleSubmit = async () => {
    if (organizationName.length < 3) {
      setError("Organisaation nimen tulee olla vähintään 3 merkkiä pitkä.");
      return;
    }

    // Check if nothing changed
    if (oid) {
      const org = await getOrganizationById(oid);
      if (org &&
        org.name === organizationName &&
        org.description === description &&
        !base64Image) {
        setError("Ei muutoksia tallennettavaksi.");
        return;
      }
    }

    setLoading(true);
    try {
      let url = photoURL; 
      if (oid) {
        if (base64Image) {
          const data = await uploadOrganizationAvatar(base64Image, oid);
          if (data) {
            url = await getOrganizationAvatarURL(data.path);
            setPhotoURL(url); 
          }
        }
        await updateOrganization(oid, organizationName, description, url);
      }
      setError("");
      setLoading(false);
      alert("Organisaatio päivitetty onnistuneesti");
    } catch (error) {
      console.error("Error editing organization:", error);
      setLoading(false);
      alert("Organisaation päivitys epäonnistui, error: " + error);
    }
  }
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={{ marginBottom: 20 }}>
      <Button title="Hallitse jäseniä" onPress={() => router.push('/(admin)/manage-members')}></Button>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.label}>Organisaation nimi</Text>
      <TextInput
        style={styles.input}
        onChangeText={setOrganizationName}
        value={organizationName}
        placeholder="Organisaation nimi"
      />
      <Text style={styles.label}>Kuvaus</Text>
      <TextInput
        style={styles.input}
        onChangeText={setDescription}
        value={description}
        placeholder="Kuvaus"
      />
      <ImagePickerComponent title="Vaihda organisaation kuva" onImageSelected={setBase64Image} photoURL={photoURL} avatar={"organization"} />
      <View style={{ height: 20 }}></View>
      <Button title="Tallenna muutokset" disabled={loading} onPress={handleSubmit} />

    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 5,
    alignItems: 'flex-start',
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '400',
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
