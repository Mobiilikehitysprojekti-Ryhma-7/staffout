import { View, Text, TextInput, Button, Platform } from "react-native";
import Toast from 'react-native-toast-message';
import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import { regularStyles, typography } from "../../styles/regularStyles";
// import MapView, { Marker } from 'react-native-maps';

export default function EventForm({ organizationId, onEventCreated }: { organizationId: string, onEventCreated?: (event: any) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
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

    Toast.show({
      type: 'success',
      text1: 'Tapahtuma luotu',
      text2: `Tapahtuma "${title}" lisätty onnistuneesti!`,
      position: 'bottom',
    });

    setTitle("");
    setDescription("");
    setLocation("");
    setEventDate(new Date());
  };

  return (
    <View style={{marginBottom: 10}}>
      <Text style={typography.title}>Tapahtumat</Text>

      <TextInput
        placeholder="Otsikko"
        value={title}
        onChangeText={setTitle}
        style={regularStyles.input}
      />

      <TextInput
        placeholder="Tapahtuman kuvaus"
        value={description}
        onChangeText={setDescription}
        style={regularStyles.input}
      />

      <TextInput
        placeholder="Tapahtumapaikka (esim. osoite, tila, kaupunki)"
        value={location}
        onChangeText={setLocation}
        style={regularStyles.input}
      />

      <View style={{ marginBottom: 10 }}>
        <Button
          title={`📅 ${eventDate.toLocaleString()}`}
          onPress={() => setShowPicker(true)}
          color="#888"
        />
        {/* Platform-specific pickers */}
        {showPicker && (
          Platform.OS === "android" ? (
            <DateTimePicker
              value={eventDate}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                  // Set date, then show time picker
                  const newDate = new Date(eventDate);
                  newDate.setFullYear(selectedDate.getFullYear());
                  newDate.setMonth(selectedDate.getMonth());
                  newDate.setDate(selectedDate.getDate());
                  setEventDate(newDate);
                  setShowTimePicker(true);
                }
              }}
            />
          ) : (
            <DateTimePicker
              value={eventDate}
              mode="datetime"
              display="spinner"
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setEventDate(selectedDate);
              }}
            />
          )
        )}
        {/* Android time picker */}
        {showTimePicker && Platform.OS === "android" && (
          <DateTimePicker
            value={eventDate}
            mode="time"
            display="spinner"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) {
                // Combine date and time
                const newDate = new Date(eventDate);
                newDate.setHours(selectedTime.getHours());
                newDate.setMinutes(selectedTime.getMinutes());
                newDate.setSeconds(0);
                newDate.setMilliseconds(0);
                setEventDate(newDate);
              }
            }}
          />
        )}
      </View>


      <View style={{ marginBottom: 10 }}>
        <Button title="Luo tapahtuma" onPress={createEvent} color="#888" />
      </View>
    </View>
  );
}

