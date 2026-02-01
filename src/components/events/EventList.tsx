import { FlatList } from "react-native";
import EventItem from "./EventItem";

export default function EventList({ events }: { events: any[] }) {
  return (
    <FlatList
      data={events}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <EventItem event={item} />}
    />
  );
}