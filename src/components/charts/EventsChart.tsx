import React, { useCallback, useMemo, useState } from 'react';
import { LineChart } from 'react-native-gifted-charts';
import { getAllEventsFromOrganization } from '@/src/services/events.service';
import { useFocusEffect } from 'expo-router';
import { useUserProfile } from '@/src/hooks/useUserProfile';

export default function EventsChart() {
  const { user } = useUserProfile();
  const [events, setEvents] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [user?.organizationId])
  );

  async function fetchEvents() {
    if (!user?.organizationId || !user?.uid) return;
    const allEvents = await getAllEventsFromOrganization(user.organizationId);
    // Only events where user is a participant
    const joinedEvents = allEvents.filter(
      (event: any) => Array.isArray(event.participants) && event.participants.includes(user.uid)
    );
    setEvents(joinedEvents || []);
  }

  // Count events joined per day for the current month
  const countEventsPerDay = (events: any[]): Record<string, number> => {
    const counts: Record<string, number> = {};
    events.forEach((event: any) => {
      if (
        event.eventDate &&
        event.eventDate.toDate().getMonth() === new Date().getMonth() &&
        event.eventDate.toDate().getFullYear() === new Date().getFullYear()
      ) {
        const day = event.eventDate.toDate().getDate();
        if (!counts[day]) {
          counts[day] = 1;
        } else {
          counts[day]++;
        }
      }
    });
    return counts;
  };

  const result = useMemo(() => countEventsPerDay(events), [events]);

  const barData = Array.from({ length: new Date().getDate() }, (_, i) => ({
    value: result[i + 1] || 0,
    label: (i + 1) % 3 === 0 ? (i + 1).toString() : '',
  }));

  return (
    <LineChart
      areaChart
      data={barData}
      height={250}
      initialSpacing={0}
      spacing={15}
      color1="orange"
      textColor1="darkorange"
      hideDataPoints
      dataPointsColor1="orange"
      startFillColor1="orange"
      startOpacity={0.8}
      endOpacity={0.3}
      xAxisLabelTextStyle={{ marginHorizontal: -5 }}
    />
  );
}
