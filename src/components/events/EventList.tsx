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
        data={[...events].sort((a, b) => {
          const dateA = a.eventDate?.toDate ? a.eventDate.toDate() : new Date(a.eventDate);
          const dateB = b.eventDate?.toDate ? b.eventDate.toDate() : new Date(b.eventDate);
          return dateB.getTime() - dateA.getTime();
        })}
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