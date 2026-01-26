import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BENEFITS } from "../../types/benefit";
import { BenefitsHeader } from "../../components/benefits/BenefitsHeader";
import { BenefitsFilterModal } from "../../components/benefits/BenefitsFilterModal";
import { BenefitsSortModal } from "../../components/benefits/BenefitsSortModal";
import { BenefitDetailsModal } from "../../components/benefits/BenefitDetailsModal";
import { BenefitsList } from "../../components/benefits/BenefitsList";
import { useBenefits } from "../../hooks/useBenefits";
import { useBenefitDetails } from "../../hooks/useBenefitDetails";

export default function Benefits() {
  // Modal visibility UI-only state
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // List state
  const ub = useBenefits(BENEFITS, "title-asc");
  // Details modal state
  const ubd = useBenefitDetails();

  const openFilter = () => {
    // Open draft from currently applied selection
    ub.openFilterDraft();
    setFilterOpen(true);
  };

  const openSort = () => {
    // Open draft from currently applied sort
    ub.openSortDraft();
    setSortOpen(true);
  };


  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.topTitle}>Yritys</Text>

        <BenefitsHeader
          showClear={ub.hasActiveControls}
          onClearAll={ub.clearAll}
          onSortPress={openSort}
          onFilterPress={openFilter}
        />

        <BenefitsList items={ub.items} onPressItem={ubd.openBenefit} />

        <BenefitDetailsModal
          visible={ubd.detailsOpen}
          benefit={ubd.selectedBenefit}
          onClose={ubd.closeBenefit}
        />

        <BenefitsFilterModal
          visible={filterOpen}
          selected={ub.draftCats}
          onToggle={ub.toggleDraftCat}
          onClear={ub.clearDraftCats}
          onClose={() => setFilterOpen(false)}
          onApply={() => {
            ub.applyFilter();
            setFilterOpen(false);
          }}
        />

        <BenefitsSortModal
          visible={sortOpen}
          value={ub.draftSort}
          onChange={ub.setDraftSort}
          onClose={() => setSortOpen(false)}
          onApply={() => {
            ub.applySort();
            setSortOpen(false);
          }}
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
});
