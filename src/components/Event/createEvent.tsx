import { Button } from "react-native";
import { View, TextInput } from '@/src/components/Themed';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useState } from "react";
import { router } from "expo-router";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createEvent = async () => {
    await addDoc(collection(db, "events"), {
      title,
      description,
      participants: [],
      createdAt: serverTimestamp()
    });

    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Title" onChangeText={setTitle} />
      <TextInput placeholder="Description" onChangeText={setDescription} />
      <Button title="Create Event" onPress={createEvent} />
    </View>
  );
}
