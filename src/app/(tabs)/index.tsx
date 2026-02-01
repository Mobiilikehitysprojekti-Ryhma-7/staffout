import { StyleSheet, Pressable } from 'react-native';
import { SafeAreaView, Text, View } from '@/src/components/Themed';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import React, { useCallback, useMemo } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { BENEFITS } from "../../types/benefit";
import { LatestBenefits } from "../../components/benefits/LatestBenefits";
import { BenefitDetailsModal } from "../../components/benefits/BenefitDetailsModal";
import { useBenefitDetails } from "../../hooks/useBenefitDetails";
import { useOrganizationBenefits } from '@/src/hooks/useOrganizationBenefits';

export default function TabOneScreen() {
  const router = useRouter();
  const ubd = useBenefitDetails();

  const { user, reload } = useUserProfile();
  const first = user?.first || "";
  
  const { items: benefits } = useOrganizationBenefits(user?.organizationId);

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

        <LatestBenefits
          items={newest}
          onPressItem={ubd.openBenefit}
          rightSlot={
            <Pressable onPress={() => router.push("/benefits")} style={styles.linkBtn}>
              <Text style={styles.linkText}>Kaikki edut</Text>
            </Pressable>
          }
        />

        <BenefitDetailsModal
          visible={ubd.detailsOpen}
          benefit={ubd.selectedBenefit}
          onClose={ubd.closeBenefit}
        />
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