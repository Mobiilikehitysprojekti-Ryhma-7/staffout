import { updateEmail as updateE } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export async function updateEmail(newEmail: string) {
    if (auth.currentUser) {
        try {
            await updateE(auth.currentUser, newEmail)
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                error.message = 'Sähköposti on jo käytössä!';
            }

            if (error.code === 'auth/invalid-email') {
                error.message = 'Sähköpostiosoite on virheellinen!';
            }
            throw new Error(error.message || "Email update failed");
        }
    }
}