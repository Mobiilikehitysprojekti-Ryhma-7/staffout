import { useState } from "react";
import type { Benefit } from "../types/benefit";

export function useBenefitDetails() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);

  const openBenefit = (b: Benefit) => {
    setSelectedBenefit(b);
    setDetailsOpen(true);
  };

  const closeBenefit = () => {
    setDetailsOpen(false);
    setSelectedBenefit(null);
  };

  return { detailsOpen, selectedBenefit, openBenefit, closeBenefit };
}
