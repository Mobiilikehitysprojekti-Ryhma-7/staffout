import { useCallback, useEffect, useState } from "react";
import { getAllMembersFromOrganization } from "@/src/services/members.service";
import { getUserById } from "@/src/services/users.service";

// Fetches user documents for all members in an organization.

export function useOrganizationUsers(orgId?: string) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!orgId) return;

    setLoading(true);
    try {
      const memberDocs = await getAllMembersFromOrganization(orgId);
      const ids = (memberDocs ?? []).map((m: any) => m?.id).filter(Boolean);

      const userDocs = await Promise.all(ids.map((id: string) => getUserById(id)));
      setUsers(userDocs.filter(Boolean));
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { users, loading, reload };
}
