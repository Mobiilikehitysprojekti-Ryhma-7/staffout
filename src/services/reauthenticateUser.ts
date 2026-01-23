import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export default async function reauthenticateUser(password: string) {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error("No signed-in user");
  }

  const credential = EmailAuthProvider.credential(user.email, password);

  try {
    await reauthenticateWithCredential(user, credential);
    console.log("User re-authenticated successfully.");
  } catch (error: any) {
    if (error.code === 'auth/missing-password') {
      error.message = 'Salasana puuttuu!';
    }
    if (error.code === 'auth/invalid-credential') {
      error.message = 'Salasana on virheellinen!';
    }
    throw new Error(error.message || "Re-authentication failed");
  }
}