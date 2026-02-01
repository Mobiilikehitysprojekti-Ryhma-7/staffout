import { useEffect, useState, useCallback } from 'react';
import { getUser, UserProfile } from '../services/users.service';

export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (forceRefresh = false) => {
    setError(null);
    try {
      setUser(await getUser(forceRefresh));
    } catch (e: any) {
      setError(e?.message || 'Failed to load user.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { user, error, reload: load };
}
