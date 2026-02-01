import { db } from "../config/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

type createBenefitParams = {
    organizationId: string,
    category: string,
    description: string,
    title: string,
    photoURL: string,
    validUntil: Date
}

type Benefit = {
    id: string,
    category: string,
    description: string,
    title: string,
    photoURL: string,
    validUntil: Date,
    createdAt: Date
}

export async function createBenefit({organizationId, category, description, title, photoURL, validUntil}: createBenefitParams) {
    const benefitsRef = collection(db, "organizations", organizationId, "benefits");
    await addDoc(benefitsRef, {
        createdAt: new Date(),
        category,
        description,
        title,
        photoURL,
        validUntil
    });
}

export async function readAllBenefitsFromOrganization(organizationId: string): Promise<Benefit[]> {
    const benefitsRef = collection(db, "organizations", organizationId, "benefits");
    const snapshot = await getDocs(benefitsRef);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Benefit));
}