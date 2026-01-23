import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

export type UserProfile = {
  first?: string;
  last?: string;
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
    const profile: UserProfile = { first: data?.first, last: data?.last };

    await writeCachedProfile(profile);
    return profile;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
