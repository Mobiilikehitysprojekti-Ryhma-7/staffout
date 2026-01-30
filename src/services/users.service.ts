import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

export type UserProfile = {
  first?: string;
  last?: string;
  photoURL?: string;
  organizationId?: string;
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
    const profile: UserProfile = { first: data?.first, last: data?.last, photoURL: data?.photoURL, organizationId: data?.organizationId };

    await writeCachedProfile(profile);
    return profile;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export async function updateUserProfile(first?: string, last?: string, photoURL?: string) {
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

    await setDoc(
      doc(db, "users", user.uid),
      updateData,
      { merge: true }
    );
  } catch (error) {
    console.error("Error setting user data: ", error);
  }
}

export async function updateUserOrganization(organizationId: string) {
  const user = auth.currentUser;
  if (!user) {
    return;
  }
  try {
    await setDoc(
      doc(db, "users", user.uid),
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