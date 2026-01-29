import { useEffect, useState } from 'react';
import { subscribeToUserOrganization } from '../services/users.service';
import { subscribeToOrganizationMembership } from '../services/members.service';

export function useOrganizationMembership(user: any) {
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        if (!user) {
            setIsMember(false);
            return;
        }

        let unsubscribeOrg: (() => void) | undefined;
        let unsubscribeMember: (() => void) | undefined;

        unsubscribeOrg = subscribeToUserOrganization(orgId => {
            if (!orgId) {
                setIsMember(false);
                if (unsubscribeMember) unsubscribeMember();
                return;
            }

            if (unsubscribeMember) unsubscribeMember();

            unsubscribeMember = subscribeToOrganizationMembership(
                orgId,
                isMember => setIsMember(isMember)
            );
        });

        return () => {
            if (unsubscribeOrg) unsubscribeOrg();
            if (unsubscribeMember) unsubscribeMember();
        };
    }, [user]);

    return isMember;
}