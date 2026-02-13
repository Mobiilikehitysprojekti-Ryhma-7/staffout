import { Button, KeyboardAvoidingView, View, StyleSheet } from 'react-native';

import { Text, TextInput } from '@/src/components/Themed';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { useState, useEffect } from 'react';
import ImagePickerComponent from '@/src/components/ImagePicker';
import { updateUserProfile } from '@/src/services/users.service';
import { uploadAvatar, getAvatarURL } from '@/src/services/storage/storage.service';
import { PRESET_CITIES } from '@/src/constants/cities'
import { CitySelect } from '@/src/components/ui/CitySelect'
import { getLocationDraft } from "@/src/services/users.service";
import { LocationOpt } from "@/src/components/ui/LocationOpt";
import { useLocation } from "@/src/hooks/useLocation";

export default function ProfileSettingsScreen() {
  const { user, reload } = useUserProfile()
  const [firstName, setFirstName] = useState(user?.first || "");
  const [lastName, setLastName] = useState(user?.last || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || undefined);
  const [city, setCity] = useState(user?.city || "");
  const [loading, setLoading] = useState(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Initialize location switch + seed draft from the saved profile.
  const initialEnabled =
    user?.locationEnabled !== undefined ? user.locationEnabled : !!user?.location;
  const initialDraft = (user?.location as any) ?? null;

  const {
    useGps,
    locationDraft,
    gpsLoading,
    gpsError,
    onToggleUseGps,
  } = useLocation({
    onCityAutofill: setCity,
    initialEnabled,
    initialDraft,
  });

  useEffect(() => {
    if (user) {
      setFirstName(user.first || "");
      setLastName(user.last || "");
      setPhotoURL(user.photoURL || undefined);
      setCity(user.city || "");
    }
  }, [user]);



  const handleRefreshLocation = async () => {
    try {
      // Fetch a fresh device location draft (and reverse-geocoded city).
      const res = await getLocationDraft({ withCity: true });
      if (!res.ok) {
        return;
      }

      // Update UI city and persist the new location+city to the user profile.
      if (res.data.city) setCity(res.data.city);

      await updateUserProfile(
        firstName.trim(),
        lastName.trim(),
        photoURL ?? "",
        res.data.city ?? city,
        res.data
      );

      await reload(true);
      alert("Sijainti päivitetty!");
    } catch (error) {
    } finally {
    }
  };


  const handleSubmit = async () => {
    if (!firstName.trim() && !lastName.trim()) {
      setError("Etunimi ja sukunimi ei voi olla tyhjä");
      return
    }
    if (!firstName.trim()) {
      setError("Etunimi ei voi olla tyhjä");
      return
    }
    if (!lastName.trim()) {
      setError("Sukunimi ei voi olla tyhjä");
      return
    }
    if (useGps && !locationDraft) {
      setError("Odota että sijainti haetaan valmiiksi (tai kytke sijainti pois).");
      return;
    }

    // Check if nothing changed
    if (user) {
      if (user &&
        user.first === firstName &&
        user.last === lastName &&
        user.city === city &&
        user.locationEnabled === useGps &&
        user.location === locationDraft &&
        !base64Image) {
        setError("Ei muutoksia tallennettavaksi.");
        return;
      }
    }

    setLoading(true);

    try {
      let url = photoURL;
      if (base64Image) {
        const data = await uploadAvatar(base64Image);
        if (data) {
          console.log(data)
          url = await getAvatarURL(data.path);
        }
      }

      setPhotoURL(url);
      await updateUserProfile(firstName.trim(), lastName.trim(), url, city, useGps ? locationDraft : null);

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
      {error && <Text style={styles.error}>{error}</Text>}
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

      {/* location switch and manual city selection */}
      <View style={styles.locationRow}>
        <View style={styles.locationLeft}>
          <LocationOpt
            useGps={useGps}
            onToggleUseGps={onToggleUseGps}
            gpsLoading={gpsLoading}
            gpsError={gpsError}
            onRefresh={handleRefreshLocation}
          />
        </View>
        
        <View style={styles.locationRight}>
          <Text style={styles.label}>Asuinkaupunki</Text>
          <CitySelect value={city} onChange={setCity} options={PRESET_CITIES} />
        </View>
      </View>
      
      <ImagePickerComponent title="Vaihda profiilikuva" onImageSelected={setBase64Image} photoURL={photoURL} />
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
    marginBottom: 5,
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
  error: {
    color: 'red',
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '400',
  },
  locationRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  locationLeft: {
    flexShrink: 0,
  },
  locationRight: {
    flexGrow: 1,
    minWidth: 180,
  },
});
