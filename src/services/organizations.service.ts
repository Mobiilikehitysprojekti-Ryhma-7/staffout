import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export async function createOrganization(name: string, photoURL?: string) {
    await addDoc(collection(db, "organizations"), {
        name,
        createdAt: new Date(),
        photoURL
    });
}
