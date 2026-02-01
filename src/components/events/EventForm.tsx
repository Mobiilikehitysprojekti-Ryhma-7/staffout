import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EventForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const createEvent = async () => {
    if (!title.trim()) return;

    await addDoc(collection(db, "events"), {
      title,
      description,
      eventDate: Timestamp.fromDate(eventDate),
      participants: [],
      createdBy: auth.currentUser?.uid,
      createdAt: serverTimestamp()
    });

    setTitle("");
    setDescription("");
    setEventDate(new Date());
  };

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 20 }}>Create Event</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 8, marginVertical: 6 }}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, padding: 8, marginBottom: 6 }}
      />

      <Button
        title={`📅 ${eventDate.toLocaleString()}`}
        onPress={() => setShowPicker(true)}
      />

      {showPicker && (
        <DateTimePicker
          value={eventDate}
          mode="datetime"
          display="default"
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
                setEventDate(selectedDate);
          }}
        }
    />
)}

      <Button title="Create Event" onPress={createEvent} />
    </View>
  );
}
