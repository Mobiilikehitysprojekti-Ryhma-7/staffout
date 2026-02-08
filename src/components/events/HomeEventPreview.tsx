import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import EventItem from "./EventItem";

export default function HomeEventPreview({ events, onNavigate }: { events: any[], onNavigate: () => void }) {
  // Sort and take the three latest events
  const latestEvents = [...events]
    .sort((a, b) => {
      const dateA = a.eventDate?.toDate ? a.eventDate.toDate() : new Date(a.eventDate);
      const dateB = b.eventDate?.toDate ? b.eventDate.toDate() : new Date(b.eventDate);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 3);

  return (
    <View style={{ margin: 16 }}>
      <View style={styles.headerRow}>
        <Text style={styles.topTitle}>Tulevat tapahtumat</Text>
        <Pressable onPress={onNavigate} style={styles.linkBtn}>
          <Text style={styles.linkText}>Näytä kaikki tapahtumat</Text>
        </Pressable>
      </View>
      <FlatList
        data={latestEvents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EventItem event={item} showActions={false} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  topTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 24,
  },
  linkBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#111",
  },
  linkText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
});
