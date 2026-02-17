import { View, Text, TextInput, Button, Platform } from "react-native";
import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
// import MapView, { Marker } from 'react-native-maps';


export default function EventForm({ organizationId, onEventCreated }: { organizationId: string, onEventCreated?: (event: any) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  // const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);

  const createEvent = async () => {
    if (!title.trim() || !organizationId) return;
    // if (!location.trim()) return; // Require location if needed

    const docRef = await addDoc(
      collection(db, "organizations", organizationId, "events"),
      {
        title,
        description,
        location,
        eventDate: Timestamp.fromDate(eventDate),
        participants: [],
        createdBy: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
        organizationId, // Ensure this is always present
      }
    );

    // Optionally fetch the created event data (with id)
    const newEvent = {
      id: docRef.id,
      title,
      description,
      location,
      eventDate,
      participants: [],
      createdBy: auth.currentUser?.uid,
      createdAt: new Date(), // serverTimestamp is not available immediately, so use local time for now
    };
    if (onEventCreated) onEventCreated(newEvent);

    setTitle("");
    setDescription("");
    setLocation("");
    setEventDate(new Date());
  };

  return (
    <View style={{marginBottom: 24}}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Tapahtumat</Text>

      <TextInput
        placeholder="Otsikko"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 8, marginVertical: 6 }}
      />

      <TextInput
        placeholder="Tapahtuman kuvaus"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, padding: 8, marginBottom: 6 }}
      />

      <TextInput
        placeholder="Tapahtumapaikka (esim. osoite, tila, kaupunki)"
        value={location}
        onChangeText={setLocation}
        style={{ borderWidth: 1, padding: 8, marginBottom: 6 }}
      />

      <View style={{ marginBottom: 16 }}>
        <Button
          title={`📅 ${eventDate.toLocaleString()}`}
          onPress={() => setShowPicker(true)}
          color="#888"
        />
        {showPicker && (
          <DateTimePicker
            value={eventDate}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              if (Platform.OS === 'android') {
                setShowPicker(false);
              }
              if (selectedDate) {
                setEventDate(selectedDate);
              }
            }}
          />
        )}
      </View>


      <View style={{ marginBottom: 8 }}>
        <Button title="Luo tapahtuma" onPress={createEvent} color="#888" />
      </View>
    </View>
  );
}

