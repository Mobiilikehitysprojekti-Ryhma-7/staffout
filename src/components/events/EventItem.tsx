import { View, Text, Button, Alert, Pressable } from "react-native";
import {
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfig";
// import MapView, { Marker } from 'react-native-maps';

export default function EventItem({ event, onPress, showActions = true }: any) {
  const userId = auth.currentUser?.uid;
  // Defensive: ensure event is an object and participants is always an array
  const participants = Array.isArray(event?.participants) ? event.participants : [];
  const isParticipant = participants.includes(userId);

  const toggleParticipation = async () => {
    if (!userId) return;
    if (!event.organizationId) {
      console.error("Event is missing organizationId, cannot update participation.", event);
      return;
    }
    await updateDoc(doc(db, "organizations", event.organizationId, "events", event.id), {
      participants: isParticipant
        ? arrayRemove(userId)
        : arrayUnion(userId)
    });
  };

  const deleteEvent = async () => {
    try {
      await deleteDoc(doc(db, "organizations", event.organizationId, "events", event.id));
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        backgroundColor: "#E97A7Af0"
      }}
    >
      <Pressable onPress={onPress}>
        <Text style={{ fontSize: 18 }}>{event.title}</Text>
        <Text>
          {event.description && event.description.length > 60
            ? event.description.slice(0, 60) + '...'
            : event.description}
        </Text>
        {event.location && (
          <Text style={{ color: '#444', marginTop: 2 }}>📍 {event.location}</Text>
        )}
        <Text>
          📅 {event.eventDate?.toDate().toLocaleString()}
        </Text>
        <Text>
          👥 {event.participants?.length || 0}
        </Text>
      </Pressable>

      {showActions && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
          <Button
            title={isParticipant ? "Poistu" : "Liity"}
            onPress={toggleParticipation}
            color="#888"
          />
          <View style={{ width: 12 }} />
          <Button title="Poista tapahtuma" color="#B32626" onPress={deleteEvent} />
        </View>
      )}
    </View>
  );
}