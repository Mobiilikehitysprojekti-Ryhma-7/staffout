import { Button, KeyboardAvoidingView, View, StyleSheet } from 'react-native';

import { Text, TextInput } from '@/src/components/Themed';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { useState, useEffect } from 'react';
import ImagePickerComponent from '@/src/components/ImagePicker';
import { updateUserProfile } from '@/src/services/users.service';
export default function ProfileSettingsScreen() {
  const { user, reload } = useUserProfile()
  const [firstName, setFirstName] = useState(user?.first || "");
  const [lastName, setLastName] = useState(user?.last || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoURL);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first || "");
      setLastName(user.last || "");
      setPhotoUrl(user.photoURL);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!firstName.trim() && !lastName.trim()) {
      alert("Etunimi ja sukunimi ei voi olla tyhjä");
      return
    }
    if (!firstName.trim()) {
      alert("Etunimi ei voi olla tyhjä");
      return
    }
    if (!lastName.trim()) {
      alert("Sukunimi ei voi olla tyhjä");
      return
    }
    setLoading(true);
    try {
      await updateUserProfile(firstName.trim(), lastName.trim(), photoUrl?.trim());
      await reload(true);
      alert("Profiili päivitetty onnistuneesti");
    } catch (error) {
      alert("Profiilin päivitys epäonnistui, error: " + error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.label}>Etunimi</Text>
      <TextInput
        style={styles.input}
        onChangeText={setFirstName}
        value={firstName}
        placeholder="Etunimi"
      />
      <Text style={styles.label}>Sukunimi</Text>
      <TextInput
        style={styles.input}
        onChangeText={setLastName}
        value={lastName}
        placeholder="Sukunimi"
      />
      <Text style={styles.label}>Profiilikuva</Text>
      <ImagePickerComponent />
      <View style={{ height: 20 }}></View>
       <Button title="Tallenna muutokset" disabled={loading} onPress={handleSubmit} /> 
      
    </KeyboardAvoidingView>
  );
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
    marginBottom: 20,
    alignItems: 'flex-start',
    width: '100%',
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
