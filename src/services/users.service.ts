import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc, onSnapshot, deleteField } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { cleanCity } from "../utils/cleanCity";
import * as Location from "expo-location";
import { geohashForLocation } from "geofire-common";
import { LocationDraft } from "../types/LocationDraft";
import { Platform } from "react-native";

export type UserProfile = {
  uid?: string;
  first?: string;
  last?: string;
  photoURL?: string;
  organizationId?: string;
  city?: string;
  location?: LocationDraft | null;
  locationEnabled?: boolean;
};

const USER_PROFILE_KEY = "user-profile";

async function readCachedProfile(): Promise<UserProfile | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return jsonValue ? (JSON.parse(jsonValue) as UserProfile) : null;
  } catch (error) {
    console.error("Error reading cached user profile:", error);
    return null;
  }
}

async function writeCachedProfile(value: UserProfile) {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(value));
  } catch (error) {
    console.error("Error caching user profile:", error);
  }
}

export async function clearUserCache() {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  } catch (error) {
    console.error("Error clearing cached user profile:", error);
  }
}

export async function getUser(forceRefresh = false): Promise<UserProfile | null> {
  const current = auth.currentUser;
  if (!current) {
    console.error("No authenticated user found.");
    return null;
  }

  if (!forceRefresh) {
    const cached = await readCachedProfile();
    if (cached) return cached;
  }

  try {
    const snap = await getDoc(doc(db, "users", current.uid));
    const data = snap.data();
    const profile: UserProfile = { uid: current.uid, first: data?.first, last: data?.last, photoURL: data?.photoURL, organizationId: data?.organizationId, city: data?.city, location: data?.location ?? null, locationEnabled: data?.locationEnabled ?? (!!data?.location) };

    await writeCachedProfile(profile);
    return profile;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export async function getUserById(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    const data = snap.data();
    if (!data) return null;
    const profile: UserProfile = { uid: uid, first: data?.first, last: data?.last, photoURL: data?.photoURL, organizationId: data?.organizationId, city: data?.city, location: data.location ?? null, locationEnabled: data.locationEnabled ?? (!!data.location) };
    return profile;
  } catch (error) {
    console.error("Error fetching user data by ID:", error);
    return null;
  }
}

export async function updateUserProfile(first?: string, last?: string, photoURL?: string, city?: string, location?: LocationDraft | null) {
  const user = auth.currentUser;
  if (!user) {
    console.error("No authenticated user found.");
    return;
  }
  try {
    const updateData: any = {};
    if (first !== undefined) updateData.first = first;
    if (last !== undefined) updateData.last = last;
    if (photoURL !== undefined) updateData.photoURL = photoURL;
    if (city !== undefined) {
      const cityClean = cleanCity(city);
      updateData.city = cityClean ? cityClean : city;
    }

    // If location is null -> user disabled location: remove location + mark disabled.
    // If location is provided -> store location + mark enabled, and update city from GPS when available.
    if (location === null) {
      updateData.location = deleteField();
      updateData.locationEnabled = false; 
    } else if (location !== undefined) {
      updateData.location = location;
      updateData.locationEnabled = true;
      if (location.city) updateData.city = location.city;
    }

    await setDoc(
      doc(db, "users", user.uid),
      updateData,
      { merge: true }
    );
  } catch (error) {
    console.error("Error setting user data: ", error);
  }
}

export async function updateUserOrganization(organizationId: string, uid: string = "") {
  const user = auth.currentUser;
  if (!user) return
  let userId

  if (!uid) {
    userId = user.uid;
  } else {
    userId = uid;
  }
  try {
    await setDoc(
      doc(db, "users", userId),
      {
        organizationId,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error setting user organization: ", error);
  }
}

export async function getUserOrganizationId(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  const data = snap.data();
  return data?.organizationId || null;
}

// monitor user's organizationId in real-time
export function subscribeToUserOrganization(
  callback: (orgId: string | null) => void
) {
  const user = auth.currentUser
  if (!user) return () => { }

  const userRef = doc(db, 'users', user.uid)

  return onSnapshot(userRef, snap => {
    if (!snap.exists()) {
      callback(null)
      return
    }

    callback(snap.data()?.organizationId ?? null)
  })
}

// reverse-geocode coordinates to a city name for web platform
async function reverseGeocodeCityWeb(latitude: number, longitude: number) {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

  const r = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!r.ok) return undefined;

  const json = await r.json();
  const a = json?.address ?? {};
  return (
    a.city ||
    a.town ||
    a.village ||
    a.municipality ||
    a.county ||
    undefined
  );
}

export async function getLocationDraft(opts?: { withCity?: boolean }) {
  // Ask for foreground location permission
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return { ok: false as const, reason: "permission_denied" as const };
  }

  try {
    const last = await Location.getLastKnownPositionAsync({});
    const fresh = last?.timestamp && Date.now() - last.timestamp < 5 * 60 * 1000;

    // Use last known location if it’s fresh. Otherwise fetch a new GPS position
    const loc = fresh
      ? last
      : await Location.getCurrentPositionAsync({
          accuracy: Location.LocationAccuracy.Balanced,
        });
    const { latitude, longitude, accuracy } = loc.coords;

    // If requested, reverse-geocode coordinates to a city name
    let city: string | undefined;
    if (opts?.withCity) {
      if (Platform.OS === "web") {
        city = await reverseGeocodeCityWeb(latitude, longitude);
      } else {
        const places = await Location.reverseGeocodeAsync({ latitude, longitude });
        const p = places?.[0];
        city = p?.city || p?.subregion || p?.region || undefined;
      }
    }

    // Build a LocationDraft payload for Firestore (coords, accuracy, geohash, city)
    const draft: LocationDraft = {
      lat: latitude,
      lng: longitude,
      accuracy: accuracy ?? null,
      geohash: geohashForLocation([latitude, longitude]),
      ...(city ? { city } : {}),
    };

    return { ok: true as const, data: draft };
  } catch (e) {
    return { ok: false as const, reason: "location_failed" as const, error: String(e) };
  }
}