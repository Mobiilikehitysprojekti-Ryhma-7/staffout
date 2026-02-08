import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

type Organization = {
    name: string;
    description?: string;
    photoURL?: string;
    createdAt: Date;
};

export async function createOrganization(name: string, description?: string): Promise<string> {
    const docRef = await addDoc(collection(db, "organizations"), {
        name,
        description,
        createdAt: new Date(),
    });
    return docRef.id;
}

export async function updateOrganization(oid: string, name?: string, description?: string, photoURL?: string) {
    try {
        const updateData: any = {}
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (photoURL !== undefined) updateData.photoURL = photoURL;

        await setDoc(
            doc(db, "organizations", oid),
            updateData,
            { merge: true });
    } catch (error) {
        console.error("Error updating organization: ", error);

    }
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

