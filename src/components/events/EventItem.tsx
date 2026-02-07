import { View, Text, Button, Alert } from "react-native";
import {
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfig";

export default function EventItem({ event }: any) {
  const userId = auth.currentUser?.uid;
  const isParticipant = event.participants?.includes(userId);

  const toggleParticipation = async () => {
    if (!userId) return;

    await updateDoc(doc(db, "events", event.id), {
      participants: isParticipant
        ? arrayRemove(userId)
        : arrayUnion(userId)
    });
  };

  const deleteEvent = async () => {
    Alert.alert("Delete event?", "This cannot be undone", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "organizations", event.organizationId, "events", event.id));
          } catch (error) {
            console.error("Error deleting event: ", error);
          }
        }
      }
    ]);
  };

  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12
      }}
    >
      <Text style={{ fontSize: 18 }}>{event.title}</Text>
      <Text>{event.description}</Text>

      <Text>
        📅 {event.eventDate?.toDate().toLocaleString()}
      </Text>

      <Text>
        👥 {event.participants?.length || 0}
      </Text>

      <Button
        title={isParticipant ? "Leave" : "Join"}
        onPress={toggleParticipation}
      />

      <Button title="Delete" color="red" onPress={deleteEvent} />
    </View>
  );
}