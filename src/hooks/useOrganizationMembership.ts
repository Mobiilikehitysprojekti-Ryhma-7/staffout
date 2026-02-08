import { useEffect, useState } from 'react';
import { subscribeToUserOrganization } from '../services/users.service';
import { subscribeToOrganizationMembership } from '../services/members.service';
import { auth } from '../config/firebaseConfig'
export function useOrganizationMembership() {
    const user = auth.currentUser
    const [role, setRole] = useState<string | false>(false);

    useEffect(() => {
        if (!user) {
            setRole(false);
            return;
        }

        let unsubscribeOrg: (() => void) | undefined;
        let unsubscribeMember: (() => void) | undefined;

        unsubscribeOrg = subscribeToUserOrganization(orgId => {
            if (!orgId) {
                setRole(false);
                if (unsubscribeMember) unsubscribeMember();
                return;
            }

            if (unsubscribeMember) unsubscribeMember();

            unsubscribeMember = subscribeToOrganizationMembership(
                orgId,
                role => setRole(role)
            );
        });

        return () => {
            if (unsubscribeOrg) unsubscribeOrg();
            if (unsubscribeMember) unsubscribeMember();
        };
    }, [user]);

    return role;
}