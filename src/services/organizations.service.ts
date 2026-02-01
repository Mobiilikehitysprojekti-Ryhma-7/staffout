import { addDoc, collection, doc, getDoc } from "firebase/firestore";
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

export async function getOrganizationById(orgId: string): Promise<Organization | null> {
    const docRef = doc(db, "organizations", orgId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Organization;
    } else {
        return null;
    }
}
    
