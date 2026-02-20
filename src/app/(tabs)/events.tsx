import { useCallback, useEffect, useState } from "react";
import { View, SafeAreaView, Text } from '@/src/components/Themed';
import { StyleSheet } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import EventForm from "../../components/events/EventForm";
import EventList from "../../components/events/EventList";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useOrganization } from '@/src/hooks/useOrganization';
import { useFocusEffect } from "expo-router";
import OrganizationCard from "../../components/ui/OrganizationCard";

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);

    const { user, reload, error } = useUserProfile();
    const { organization } = useOrganization(user, user?.organizationId);
  
       useFocusEffect(
         useCallback(() => {
           reload(true);
         }, [reload])
       );
  const organizationId = user?.organizationId;

  useEffect(() => {
    if (!organizationId) return;
    const unsub = onSnapshot(
      collection(db, "organizations", organizationId, "events"),
      snap => {
        setEvents(
          snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        );
      }
    );
    return unsub;
  }, [organizationId]);

  if (error) {
    return <View><Text>Error: {error}</Text></View>;
  }

  if (!organizationId) {
    return <View><Text>No organization selected.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
              <OrganizationCard
                organizationId={user?.organizationId}
                organizationName={organization?.name}
                organizationDescription={organization?.description}
                organizationAvatar={organization?.photoURL}
                interactive={false}
              />
        <EventForm organizationId={organizationId} />
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

