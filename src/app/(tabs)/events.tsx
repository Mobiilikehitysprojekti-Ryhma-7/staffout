import { useEffect, useState } from "react";
import { View, SafeAreaView } from '@/src/components/Themed';
import { StyleSheet } from "react-native";
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
    <SafeAreaView style={styles.safe}>
    <View style={{ flex: 1, padding: 16 }}>
      <EventForm />
      <EventList events={events} />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff"
  },
  container: {
    flex: 1,
    paddingHorizontal: 20
  },
  topTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 24,
  },
});

