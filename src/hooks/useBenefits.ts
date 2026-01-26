import { useMemo, useState } from "react";
import type { Benefit, BenefitCategory } from "../types/benefit";

export type SortKey = "title-asc" | "title-desc" | "category";

// Hook managing filtering and sorting of benefits list.
// Maintains separate "applied" and "draft" states for both filter and sort,
// so that modals can edit draft state without immediately affecting the list.
export function useBenefits(all: Benefit[], defaultSort: SortKey = "title-asc") {

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

  // Compute filtered + sorted items
  const items = useMemo(() => {
    const base =
      appliedCats.size === 0 ? all : all.filter((b) => appliedCats.has(b.category));

    const copy = [...base];

    if (appliedSort === "title-asc")
      copy.sort((a, b) => a.title.localeCompare(b.title, "fi", { sensitivity: "base" }));

    if (appliedSort === "title-desc")
      copy.sort((a, b) => b.title.localeCompare(a.title, "fi", { sensitivity: "base" }));

    if (appliedSort === "category")
      copy.sort(
        (a, b) =>
          a.category.localeCompare(b.category) ||
          a.title.localeCompare(b.title, "fi", { sensitivity: "base" })
      );

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

    // reset
    clearAll,
  };
}
