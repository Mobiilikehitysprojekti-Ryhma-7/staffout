import { useEffect, useState } from "react"; 
import { getOrganizationById } from "../services/organizations.service";
 
 export function useOrganization(user: any, organizationId?: string) {
    const [organization, setOrganization] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

 useEffect(() => {
   
      if (organizationId) {
        getOrganizationById(organizationId).then(o => {
          if (o) {
            setOrganization(o);
          } else {
            setError("Organization not found");
          }
        }).catch(e => {
          setError(e?.message || "Failed to load organization");
        });
      }
  }, [user]);

    return { organization, error };
 }