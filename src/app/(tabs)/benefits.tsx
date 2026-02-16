import React, { useState, useRef, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BenefitsHeader } from "../../components/benefits/BenefitsHeader";
import { BenefitsFilterModal } from "../../components/benefits/BenefitsFilterModal";
import { BenefitsSortModal } from "../../components/benefits/BenefitsSortModal";
import { BenefitDetailsModal } from "../../components/benefits/BenefitDetailsModal";
import { BenefitsList } from "../../components/benefits/BenefitsList";
import { useBenefits } from "../../hooks/useBenefits";
import { useBenefitDetails } from "../../hooks/useBenefitDetails";
import { useOrganizationBenefits } from "@/src/hooks/useOrganizationBenefits";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import BenefitForm from '@/src/components/benefits/BenefitForm';
import BenefitEdit from "@/src/components/benefits/BenefitEdit";

export default function Benefits() {
  const { user } = useUserProfile();
  const { items: orgBenefits } = useOrganizationBenefits(user?.organizationId);
  const ub = useBenefits(orgBenefits ?? [], "validUntil");

  const {
    benefits,
    role,
    benefitTitle,
    setBenefitTitle,
    benefitCategory,
    setBenefitCategory,
    benefitBadge,
    setBenefitBadge,
    benefitPhotoURL,
    setBenefitPhotoURL,
    benefitDescription,
    setBenefitDescription,
    benefitValidUntil,
    setBenefitValidUntil,
    setBase64Image,
    handleCreateBenefit,
    handleUpdateBenefit,
    handleDeleteBenefit,
  } = ub;

  // Modal visibility UI-only state
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={1} disappearsOnIndex={-1} pressBehavior="close" />,
    []
  );

  const [activeForm, setActiveForm] = useState<'create' | 'edit' | null>(null);
  const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null);

  const openCreateForm = () => {
    setActiveForm('create');
    setSelectedBenefitId(null);
    bottomSheetModalRef.current?.present();
  };

  const openEditForm = (b: any) => {
    setActiveForm("edit");
    setSelectedBenefitId(b.id);
    setBenefitTitle(b.title ?? "");
    setBenefitDescription(b.description ?? "");
    setBenefitCategory(b.category ?? null);
    setBenefitPhotoURL(b.photoURL ?? "");
    setBenefitValidUntil(b.validUntil ?? null);
    setBenefitBadge(b.badge ?? { family: "", name: "" });
    bottomSheetModalRef.current?.present();
  };

  const handleClose = () => {
    setActiveForm(null);
    setSelectedBenefitId(null);
    setBenefitTitle('');
    setBenefitCategory(null);
    setBenefitBadge({ family: "", name: "" });
    setBenefitPhotoURL('');
    setBenefitDescription('');
    setBenefitValidUntil(null);
    bottomSheetModalRef.current?.dismiss();
  };

  const confirmDelete = () => {
    if (!selectedBenefitId) return;
    Alert.alert(
      'Poista etu',
      'Haluatko varmasti poistaa edun? Tätä toimintoa ei voi perua.',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            const deleted = await handleDeleteBenefit(selectedBenefitId);
            if (deleted) handleClose();
          },
        },
      ]
    );
  };

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

  const onMoreFromDetails = () => {
    const b = ubd.selectedBenefit;
    if (!b) return;

    ubd.closeBenefit();

    openEditForm(b);
  };


/*   useEffect(() => {
    console.log("UI items:", ub.items.length, ub.items[0]?.title);
  }, [ub.items]); */


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
          canEdit={role === "admin"}
          onMorePress={onMoreFromDetails}
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

        {role === 'admin' && (
          <>
            <Button title="Luo etu" onPress={openCreateForm} />
            <BottomSheetModal
              ref={bottomSheetModalRef}
              backdropComponent={renderBackdrop}
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
              enablePanDownToClose
              onDismiss={handleClose}
            >
              {activeForm === 'create' && (
                <BenefitForm
                  benefitTitle={benefitTitle}
                  setBenefitTitle={setBenefitTitle}
                  benefitCategory={benefitCategory}
                  setBenefitCategory={setBenefitCategory}
                  benefitValidUntil={benefitValidUntil}
                  setBenefitValidUntil={setBenefitValidUntil}
                  benefitPhotoURL={benefitPhotoURL}
                  setBenefitPhotoURL={setBenefitPhotoURL}
                  setBase64Image={setBase64Image}
                  benefitDescription={benefitDescription}
                  setBenefitDescription={setBenefitDescription}
                  handleCreate={async () => {
                    const created = await handleCreateBenefit();
                    if (created) handleClose();
                  }}
                  handleCancel={handleClose}
                />
              )}
              {activeForm === "edit" && (
                <BenefitEdit
                  benefitTitle={benefitTitle}
                  setBenefitTitle={setBenefitTitle}
                  benefitDescription={benefitDescription}
                  setBenefitDescription={setBenefitDescription}
                  benefitCategory={benefitCategory}
                  setBenefitCategory={setBenefitCategory}
                  onUpdate={async () => {
                    if (!selectedBenefitId) return;
                    const updated = await handleUpdateBenefit(selectedBenefitId);
                    if (updated) handleClose();
                  }}
                  onDelete={confirmDelete}
                  onCancel={handleClose}
                />
              )}
            </BottomSheetModal>
          </>
        )}
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
