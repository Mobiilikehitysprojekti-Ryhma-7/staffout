import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

export async function setUser(firstName: string, lastName: string) {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found.");
        return;
    }
    try {
        await setDoc(doc(db, "users", user.uid), {
            first: firstName,
            last: lastName,
        }, { merge: true });
    } catch (error) {
        console.error("Error setting user data: ", error);
    }
}

// TODO profiilikuvan päivitys, sähköpostin päivitys, salasanan päivitys jne.
