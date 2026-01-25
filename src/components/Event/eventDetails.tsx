import { View, Text, Button } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfig";
import { useEffect, useState } from "react";

export default function EventModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const ref = doc(db, "events", id!);
    const unsub = onSnapshot(ref, snap => {
      setEvent({ id: snap.id, ...snap.data() });
    });
    return unsub;
  }, [id]);

  if (!event) return null;

  const isParticipating = event.participants?.includes(userId);

  const toggleParticipation = async () => {
    const ref = doc(db, "events", id!);
    await updateDoc(ref, {
      participants: isParticipating
        ? arrayRemove(userId)
        : arrayUnion(userId)
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>{event.title}</Text>
      <Text>{event.description}</Text>

      <Text style={{ marginVertical: 10 }}>
        Participants: {event.participants?.length || 0}
      </Text>

      <Button
        title={isParticipating ? "Leave Event" : "Join Event"}
        onPress={toggleParticipation}
      />

      <Button title="Close" onPress={() => router.back()} />
    </View>
  );
}
