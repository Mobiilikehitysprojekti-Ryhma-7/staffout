import React, { useState, useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import EventDetailsModal from "./EventDetailsModal";


export default function HomeEventPreview({ events, onNavigate }: { events: any[], onNavigate: () => void }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Sort and take the three latest events
  const latestEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => {
        const dateA = a.eventDate?.toDate ? a.eventDate.toDate() : new Date(a.eventDate);
        const dateB = b.eventDate?.toDate ? b.eventDate.toDate() : new Date(b.eventDate);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 3);
  }, [events]);

  function clean(s: string, max = 14) {
    return s.length > max ? s.slice(0, max - 1) + "…" : s;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Tulevat tapahtumat</Text>
        <Pressable onPress={onNavigate} style={styles.linkBtn}>
          <Text style={styles.linkText}>Näytä kaikki tapahtumat</Text>
        </Pressable>
      </View>

      <View style={styles.chipsRow}>
        {latestEvents.map((event) => (
          <Pressable
            key={event.id}
            onPress={() => {
              setSelectedEvent(event);
              setModalVisible(true);
            }}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
          >
            <Text style={styles.chipText} numberOfLines={1}>
              {clean(event.title)}
            </Text>
          </Pressable>
        ))}
      </View>

      <EventDetailsModal
        visible={modalVisible}
        event={selectedEvent}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
  },
  linkBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#111",
    marginLeft: 12,
  },
  linkText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
  chipsRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: "#E88C8C",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 72,
    maxWidth: 160,
  },
  chipPressed: {
    opacity: 0.85,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111",
  },
});
