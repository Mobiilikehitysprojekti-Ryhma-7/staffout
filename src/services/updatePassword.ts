import { auth } from '../config/firebaseConfig';
import { updatePassword as updateP } from 'firebase/auth';

export async function updatePassword(newPassword: string) {
    if (!auth.currentUser) {
        throw new Error("No signed-in user");
    }
    
    try {
        await updateP(auth.currentUser, newPassword);
        console.log("Password updated successfully.");
    } catch (error: any) {
        console.error("Error updating password: ", error);
        throw new Error(error?.message || "Password update failed");
    }
}