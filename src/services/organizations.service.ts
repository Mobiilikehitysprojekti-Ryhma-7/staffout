import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

type Organization = {
    name: string;
    description?: string;
    photoURL?: string;
    createdAt: Date;
};

export async function createOrganization(name: string, description?: string, photoURL?: string): Promise<string> {
    const docRef = await addDoc(collection(db, "organizations"), {
        name,
        description,
        photoURL,
        createdAt: new Date(),
    });
    return docRef.id;
}

    
