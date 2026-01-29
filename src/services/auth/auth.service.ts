import { auth } from '@/src/config/firebaseConfig';
import { clearUserCache } from '@/src/services/users.service';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    deleteUser,
    updateEmail as firebaseUpdateEmail,
    updatePassword as firebaseUpdatePassword,
    signOut
} from 'firebase/auth';

export async function createUser(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export async function signInUser(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}

export async function handleSignOut() {
    try {
        await signOut(auth);
        await clearUserCache();
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

export async function reauthenticateUser(password: string) {
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

export async function removeUser() {
    const user = auth.currentUser;
    if (user) {
        try {
            await deleteUser(user);
            console.log("User deleted successfully");
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }
}

export async function updateEmail(newEmail: string) {
    if (auth.currentUser) {
        try {
            await firebaseUpdateEmail(auth.currentUser, newEmail)
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

export async function updatePassword(newPassword: string) {
    if (!auth.currentUser) {
        throw new Error("No signed-in user");
    }

    try {
        await firebaseUpdatePassword(auth.currentUser, newPassword);
        console.log("Password updated successfully.");
    } catch (error: any) {
        console.error("Error updating password: ", error);
        throw new Error(error?.message || "Password update failed");
    }
}



