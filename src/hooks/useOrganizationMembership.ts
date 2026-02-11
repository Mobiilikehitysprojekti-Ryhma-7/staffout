import { useEffect, useState } from 'react';
import { subscribeToUserOrganization } from '../services/users.service';
import { subscribeToOrganizationMembership } from '../services/members.service';
import { auth } from '../config/firebaseConfig';

type AuthUser = { uid?: string } | null | undefined;

export function useOrganizationMembership(userParam?: AuthUser) {
    const [role, setRole] = useState<string | false | null>(null);
    const [loading, setLoading] = useState(true);
    const user = userParam ?? auth.currentUser;

    useEffect(() => {
        setLoading(true);
        setRole(null);
        if (!user) {
            setLoading(false);
            return;
        }
        
        let unsubscribeOrg: (() => void) | undefined;
        let unsubscribeMember: (() => void) | undefined;

        unsubscribeOrg = subscribeToUserOrganization((orgId) => {
            if (!orgId) {
                setRole(false);
                setLoading(false);
                if (unsubscribeMember) unsubscribeMember();
                return;
            }

            if (unsubscribeMember) unsubscribeMember();

            unsubscribeMember = subscribeToOrganizationMembership(orgId, (role) => {
                setRole(role);
                setLoading(false);
            });
        });

        return () => {
            if (unsubscribeOrg) unsubscribeOrg();
            if (unsubscribeMember) unsubscribeMember();
        };
    }, [user]);

    return { role, loading };
}