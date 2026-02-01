import { View } from "react-native";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

import EventForm from "../../components/events/EventForm";
import EventList from "../../components/events/EventList";

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), snap => {
      setEvents(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });

    return unsub;
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <EventForm />
      <EventList events={events} />
    </View>
  );
}

/*import {
  FlatList,
  Pressable,
  TextInput,
  Button,
  Alert
} from "react-native";
import { Text, View } from '@/src/components/Themed';
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useEffect, useState } from "react";

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  //const userId = auth.currentUser?.uid;
  const userId = "user";

  // Subscribe to events
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), snap => {
      setEvents(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });

    return unsub;
  }, []);

  // Create event
  const createEvent = async () => {
    if (!title.trim()) return;

    await addDoc(collection(db, "events"), {
      title,
      description,
      participants: [],
      createdBy: userId,
      createdAt: serverTimestamp()
    });

    setTitle("");
    setDescription("");
  };

  // Join / Leave
  const toggleParticipation = async (event: any) => {
    if (!userId) return;

    const ref = doc(db, "events", event.id);
    const isParticipant = event.participants?.includes(userId);

    await updateDoc(ref, {
      participants: isParticipant
        ? arrayRemove(userId)
        : arrayUnion(userId)
    });
  };

  // Delete event (creator only)
  const deleteEvent = async (eventId: string) => {
    Alert.alert(
      "Delete Event",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "events", eventId));
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* CREATE EVENT */
     /* <Text style={{ fontSize: 20, marginBottom: 8 }}>
        Create Event
      </Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 8
        }}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 8
        }}
      />

      <Button title="Create Event" onPress={createEvent} />

      {/* EVENT LIST */
    /* <FlatList
        data={events}
        keyExtractor={item => item.id}
        contentContainerStyle={{ marginTop: 20 }}
        renderItem={({ item }) => {
          const isParticipant =
            item.participants?.includes(userId);
          const isOwner = item.createdBy === userId;

          return (
            <View
              style={{
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderRadius: 8
              }}
            >
              <Text style={{ fontSize: 18 }}>
                {item.title}
              </Text>

              <Text style={{ marginVertical: 4 }}>
                {item.description}
              </Text>

              <Text>
                👥 {item.participants?.length || 0} participants
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 8,
                  gap: 8
                }}
              >
                <Button
                  title={isParticipant ? "Leave" : "Join"}
                  onPress={() => toggleParticipation(item)}
                />

                <Button
                    title="Delete"
                    color="red"
                    onPress={() => deleteEvent(item.id)}
                  />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}*/


