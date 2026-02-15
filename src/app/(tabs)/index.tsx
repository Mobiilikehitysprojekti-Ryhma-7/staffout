import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, Text, View } from '@/src/components/Themed';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import React, { useCallback, useMemo } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { LatestBenefits } from "../../components/benefits/LatestBenefits";
import { BenefitDetailsModal } from "../../components/benefits/BenefitDetailsModal";
import { useBenefitDetails } from "../../hooks/useBenefitDetails";
import { useOrganizationBenefits } from '@/src/hooks/useOrganizationBenefits';
import { useOrganizationEvents } from '@/src/hooks/useOrganizationEvents';
import HomeEventPreview from "../../components/events/HomeEventPreview";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CityPieChart from '@/src/components/charts/CityPieChart';
import EventLocationPieChart from '@/src/components/charts/EventLocationPieChart';
import LatestMessages from '@/src/components/messages/LatestMessages';

export default function TabOneScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const ubd = useBenefitDetails();

  const { user, reload } = useUserProfile();
  
  const { items: benefits } = useOrganizationBenefits(user?.organizationId);
  const { items: events } = useOrganizationEvents(user?.organizationId);

   useFocusEffect(
      useCallback(() => {
        reload(true);
      }, [reload])
    );

  const newest = useMemo(() => {
    return [...benefits]
      .filter((b) => b.createdAt instanceof Date && !isNaN(b.createdAt.getTime()))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 2);
  }, [benefits]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.topTitle}>Yritys</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <HomeEventPreview
        events={events}
        onNavigate={() => router.push("/events")}
        />
        <LatestMessages />
        <LatestBenefits
          items={newest}
          onPressItem={ubd.openBenefit}
          rightSlot={
            <Pressable onPress={() => router.push("/benefits")} style={styles.linkBtn}>
              <Text style={styles.linkText}>Kaikki edut</Text>
            </Pressable>
          }
        />

        <CityPieChart />
        <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 8 }}>Tapahtumat paikkakunnittain</Text>
        <EventLocationPieChart />
        
      </ScrollView>

        <BenefitDetailsModal
          visible={ubd.detailsOpen}
          benefit={ubd.selectedBenefit}
          onClose={ubd.closeBenefit}
        />
     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff"
  },
  container: {
    paddingHorizontal: 20,
  },
  topTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 24,
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
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