import { useCallback, useEffect, useState } from "react";
import type { Benefit } from "../types/benefit";
import { readAllBenefitsFromOrganization } from "../services/benefits.service";

// Hook to fetch benefits for a given organization.
export function useOrganizationBenefits(organizationId?: string) {
  const [items, setItems] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!organizationId) return;
    setLoading(true);
    try {
      const data = await readAllBenefitsFromOrganization(organizationId);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, loading, reload };
}