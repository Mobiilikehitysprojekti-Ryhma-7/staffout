import { FlatList } from "react-native";
import React, { useState } from "react";
import EventItem from "./EventItem";
import EventDetailsModal from "./EventDetailsModal";

export default function EventList({ events }: { events: any[] }) {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const handleOpenModal = (event: any) => setSelectedEvent(event);
  const handleCloseModal = () => setSelectedEvent(null);

  return (
    <>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EventItem event={item} onPress={() => handleOpenModal(item)} />
        )}
      />
      <EventDetailsModal
        visible={!!selectedEvent}
        event={selectedEvent}
        onClose={handleCloseModal}
      />
    </>
  );
}