import { useEffect, useMemo, useRef, useState } from "react";
import type { Benefit, BenefitCategory } from "../types/benefit";
import { useOrganizationMembership } from './useOrganizationMembership';
import { useUserProfile } from "./useUserProfile";
import { doc, collection } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { uploadBenefitImage, getBenefitImageURL } from "../services/storage/storage.service";
import { readAllBenefitsFromOrganization, Badge, updateBenefit, deleteBenefit, createBenefit } from "../services/benefits.service";

export type SortKey = "title-asc" | "title-desc" | "category" | "validUntil";

// Hook managing filtering and sorting of benefits list.
// Maintains separate "applied" and "draft" states for both filter and sort,
// so that modals can edit draft state without immediately affecting the list.
export function useBenefits(all: Benefit[], defaultSort: SortKey = "validUntil") {

  const { user } = useUserProfile();
  const oid = user?.organizationId;
  const {role} = useOrganizationMembership();
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [benefitTitle, setBenefitTitle] = useState<string>('');
  const [benefitCategory, setBenefitCategory] = useState<BenefitCategory | null>(null);
  const [benefitPhotoURL, setBenefitPhotoURL] = useState<string>('');
  const [benefitDescription, setBenefitDescription] = useState<string>('');
  const [benefitValidUntil, setBenefitValidUntil] = useState<Date | null>(null);
  const [benefitBadge, setBenefitBadge] = useState<Badge>({ family: "", name: "" });
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const fetchSeqRef = useRef(0);

  async function fetchBenefits() {
    if (!oid) return;

    const seq = ++fetchSeqRef.current;   // this call is the newest (for now)
    setLoading(true);

    try {
      const list = await readAllBenefitsFromOrganization(oid);

      // If a newer fetch started while we waited, ignore this result
      if (seq !== fetchSeqRef.current) return;

      setBenefits((list ?? []) as Benefit[]);
    } finally {
      // Only the newest fetch is allowed to flip loading off
      if (seq === fetchSeqRef.current) setLoading(false);
    }
  }

  useEffect(() => {
    fetchBenefits();

    return () => {
      fetchSeqRef.current++; // invalidate any in-flight fetch
    };
  }, [oid]);

  const handleCreateBenefit = async () => {
    if (benefitTitle.trim().length === 0) {
      alert("Otsikko ei voi olla tyhjä.");
      return false;
    }
    if (oid && benefitTitle && benefitCategory && benefitDescription && benefitValidUntil) {

      try {

        const benefitRef = doc(collection(db, "benefits"));
        const benefitId = benefitRef.id; 

        let photoURL = "";
        if (base64Image) {
          const upload = await uploadBenefitImage(base64Image, benefitId);
          photoURL = await getBenefitImageURL(upload.path);
        }

        await createBenefit({
          organizationId: oid,
          badge: benefitBadge,
          category: benefitCategory,
          description: benefitDescription,
          title: benefitTitle,
          photoURL: photoURL,
          validUntil: benefitValidUntil
        });
        setBenefitTitle('');
        setBenefitCategory(null);
        setBenefitPhotoURL('');
        setBase64Image(null);
        setBenefitDescription('');
        setBenefitValidUntil(null);
        setBenefitBadge({ family: "", name: "" });
        alert("Etu luotu onnistuneesti.");
        await fetchBenefits();
        clearAll();
        return true;
      } catch (error) {
        console.error("Failed to create benefit:", error);
        return false;
      }
    }
    return false;
  }

  const handleUpdateBenefit = async (benefitId: string) => {
    if (benefitTitle.trim().length === 0) {
      alert("Otsikko ei voi olla tyhjä.");
      return false;
    }
    if (oid && benefitCategory) {
      try {
        await updateBenefit(oid, benefitId, benefitTitle, benefitDescription, benefitCategory, benefitPhotoURL);
        setBenefitTitle('');
        setBenefitCategory(null);
        setBenefitPhotoURL('');
        setBenefitDescription('');
        alert("Etu päivitetty.");
        await fetchBenefits();
        clearAll();
        return true;
      } catch (error) {
        console.error("Failed to update benefit:", error);
        return false;
      }
    }
    return false;
  }

  const handleDeleteBenefit = async (benefitId: string) => {
    if(!oid) return false;
    try {
      await deleteBenefit(oid, benefitId);
      alert("Etu poistettu.");
      await fetchBenefits();
      clearAll();
      return true;
    } catch (error) {
      console.error("Failed to delete benefit:", error);
      return false
    }
  }

  // Applied values
  const [appliedCats, setAppliedCats] = useState<Set<BenefitCategory>>(new Set());
  const [appliedSort, setAppliedSort] = useState<SortKey>(defaultSort);

  // Draft values
  const [draftCats, setDraftCats] = useState<Set<BenefitCategory>>(new Set());
  const [draftSort, setDraftSort] = useState<SortKey>(defaultSort);

  // Whether any filters or non-default sort is applied
  const hasActiveControls = appliedCats.size > 0 || appliedSort !== defaultSort;

  // Draft actions (open/apply/clear)
  const openFilterDraft = () => setDraftCats(new Set(appliedCats));
  const applyFilter = () => setAppliedCats(new Set(draftCats));
  const clearDraftCats = () => setDraftCats(new Set());

  const toggleDraftCat = (c: BenefitCategory) => {
    setDraftCats((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });
  };

  const openSortDraft = () => setDraftSort(appliedSort);
  const applySort = () => setAppliedSort(draftSort);

  // Clear everything back to defaults
  const clearAll = () => {
    setAppliedCats(new Set());
    setAppliedSort(defaultSort);
  };

  // Category labels for category sort using UI locale
  const categoryLabel: Record<BenefitCategory, string> = {
    sports: "Urheilu",
    meals: "Ruokailu",
    culture: "Kulttuuri",
    health: "Terveys",
    other: "Muu",
  };

  // Compute filtered + sorted items
  const items = useMemo(() => {
    const source = benefits ?? [];

    const base =
      appliedCats.size === 0 ? source : source.filter((b) => appliedCats.has(b.category));

    const copy = [...base];

    if (appliedSort === "title-asc")
      copy.sort((a, b) => a.title.localeCompare(b.title, "fi", { sensitivity: "base" }));

    if (appliedSort === "title-desc")
      copy.sort((a, b) => b.title.localeCompare(a.title, "fi", { sensitivity: "base" }));

    if (appliedSort === "category")
      copy.sort(
        (a, b) =>
          categoryLabel[a.category].localeCompare(categoryLabel[b.category]) ||
          a.title.localeCompare(b.title, "fi", { sensitivity: "base" })
      );
    
    if (appliedSort === "validUntil")
      copy.sort((a, b) => a.validUntil.getTime() - b.validUntil.getTime());

    return copy;
  }, [all, appliedCats, appliedSort, defaultSort]);

  return {
    // data
    items,
    hasActiveControls,

    // filter state + actions
    appliedCats,
    draftCats,
    openFilterDraft,
    toggleDraftCat,
    clearDraftCats,
    applyFilter,

    // sort state + actions
    appliedSort,
    draftSort,
    setDraftSort,
    openSortDraft,
    applySort,

    benefits,
    loading,
    role,
    handleCreateBenefit,
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
    handleUpdateBenefit,
    handleDeleteBenefit,
    base64Image,
    setBase64Image,

    // reset
    clearAll,
  };
}
