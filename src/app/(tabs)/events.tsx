import { FlatList, Pressable } from "react-native";
import { Text, View } from '@/src/components/Themed';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useEffect, useState } from "react";
import { router } from "expo-router";

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snap) => {
      setEvents(
        snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      );
    });

    return unsub;
  }, []);

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(tabs)/events",
              params: { id: item.id }
            })
          }
        >
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18 }}>{item.title}</Text>
            <Text>{item.participants?.length || 0} participants</Text>
          </View>
        </Pressable>
      )}
    />
  );
}
