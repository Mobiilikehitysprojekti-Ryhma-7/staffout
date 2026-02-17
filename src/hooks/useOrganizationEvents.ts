import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export function useOrganizationEvents(organizationId?: string) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!organizationId) {
      setItems([]);
      return;
    }
    const ref = collection(db, 'organizations', organizationId, 'events');
    const unsub = onSnapshot(ref, snap => {
      setItems(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          organizationId // Always include organizationId in the event object
        }))
      );
    });
    return unsub;
  }, [organizationId]);

  return { items };
}
