import { useCallback, useRef, useState, useEffect } from "react";
import type { LocationDraft } from "@/src/types/LocationDraft";
import { getLocationDraft } from '@/src/services/users.service';

// Custom hook that manages the "use location" toggle and fetching a LocationDraft (loading + error included).
export function useLocation(params?: {
  onCityAutofill?: (city: string) => void;
  initialEnabled?: boolean;
  initialDraft?: LocationDraft | null;
}) {
  // Local states: toggle state, fetched location draft, request loading, and an optional error message.
  const [useGps, setUseGps] = useState(false);
  const [locationDraft, setLocationDraft] = useState<LocationDraft | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Initialize hook state from incoming params (e.g. saved user settings) when they change.
  useEffect(() => {
    if (params?.initialEnabled !== undefined) setUseGps(params.initialEnabled);
    if (params?.initialDraft !== undefined) setLocationDraft(params.initialDraft);
  }, [params?.initialEnabled, params?.initialDraft]);

  const reqIdRef = useRef(0);

  // Disable location: invalidate any pending request and reset GPS-related state.
  const disable = useCallback(() => {
    reqIdRef.current += 1;
    setUseGps(false);
    setGpsLoading(false);
    setGpsError(null);
    setLocationDraft(null);
  }, []);

  const enable = useCallback(async () => {
    // If the cached draft exists, just enable the toggle without fetching again.
    if (locationDraft) {
      setUseGps(true);
      return;
    }
    // Don't start a new fetch if one is already in progress.
    if (gpsLoading) return;

    setUseGps(true);
    setGpsError(null);
    setGpsLoading(true);

    const myReqId = ++reqIdRef.current;
    const res = await getLocationDraft({ withCity: true });

    // Ignore stale async responses if the user toggled off/on while the request was running.
    if (myReqId !== reqIdRef.current) return;

    setGpsLoading(false);

    if (!res.ok) {
      setUseGps(false);
      setLocationDraft(null);
      setGpsError(
        res.reason === "permission_denied"
          ? "Sijaintilupa evättiin."
          : "Sijaintia ei saatu."
      );
      return;
    }

    // Store the fetched draft and push the detected city back to the caller (UI autofill).
    setLocationDraft(res.data);
    if (res.data.city && params?.onCityAutofill) {
      params.onCityAutofill(res.data.city);
    }
  }, [gpsLoading, locationDraft, params]);

  const onToggleUseGps = useCallback(
    (value: boolean) => (value ? enable() : disable()),
    [enable, disable]
  );

  const refreshLocation = useCallback(async () => {
    setLocationDraft(null);
    await enable();
  }, [enable]);

  return {
    useGps,
    locationDraft,
    gpsLoading,
    gpsError,
    onToggleUseGps,
    refreshLocation,
    setLocationDraft,
    disableGps: disable,
  };
}
