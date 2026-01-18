import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
type UserProfile = {
  uid: string;
  email: string | null;
  first?: string;
  last?: string;
};
export async function getUser(): Promise<UserProfile | null> {
  const user = auth.currentUser;

  if (!user) {
    console.error("No authenticated user found.");
    return null;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      console.warn("No user data found.");
      return {
        uid: user.uid,
        email: user.email,
      };
    }

    const data = snap.data();

    return {
      uid: user.uid,
      email: user.email,
      first: data.first,
      last: data.last,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
