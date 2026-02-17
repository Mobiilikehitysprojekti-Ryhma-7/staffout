import React, { useEffect, useState, useMemo } from 'react';
import { PieChart } from 'react-native-gifted-charts';
import { View, Text, StyleSheet } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/config/firebaseConfig';
import { useUserProfile } from '@/src/hooks/useUserProfile';

const styles = StyleSheet.create({
  legendWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
    gap: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  legendLabel: {
    fontSize: 13,
    color: '#333',
  },
});

const PIE_COLORS = [
  '#FFB300', '#FF7043', '#29B6F6', '#66BB6A', '#AB47BC', '#FFA726', '#8D6E63', '#26A69A', '#EC407A', '#789262'
];

export default function EventLocationPieChart() {
  const { user } = useUserProfile();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.organizationId) return;
    const ref = collection(db, 'organizations', user.organizationId, 'events');
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user?.organizationId]);

  // Count events by location (case-insensitive, non-empty only)
  const locationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((event: any) => {
      const loc = (event.location || '').trim();
      if (loc) {
        const key = loc.toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, [events]);

  const pieData = Object.entries(locationCounts).map(([location, count], i) => ({
    value: count,
    label: location.charAt(0).toUpperCase() + location.slice(1),
    color: PIE_COLORS[i % PIE_COLORS.length],
    location: location.charAt(0).toUpperCase() + location.slice(1),
  }));

  return (
    <View style={{ alignItems: 'center' }}>
      <PieChart
        data={pieData}
        donut
        showText
        textColor="#333"
        textSize={12}
        radius={90}
        innerRadius={55}
        focusOnPress
        showValuesAsLabels
        showTextBackground
        textBackgroundRadius={18}
        strokeColor="#fff"
        strokeWidth={2}
        labelsPosition="outward"
        //labelPositionOffset={16}
        //labelFontSize={13}
        //labelColor="#333"
      />
      <View style={styles.legendWrap}>
        {pieData.map((item, i) => (
          <View key={item.location} style={styles.legendRow}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.location}</Text>
          </View>
        ))}
      </View>
    </View>
	);
}
