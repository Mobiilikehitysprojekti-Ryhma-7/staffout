import { db } from "../config/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

type createBenefitParams = {
    organizationId: string,
    badge: { family: string, name: string }
    description: string,
    title: string,
    photoURL: string,
    validUntil: Date
}

export async function createBenefit({organizationId, badge, description, title, photoURL, validUntil}: createBenefitParams) {
    const Ref = collection(db, "organizations", organizationId, "benefits");
    await addDoc(Ref, {
        createdAt: new Date(),
        badge,
        description,
        title,
        photoURL,
        validUntil
    });
}

export async function readAllBenefitsFromOrganization(organizationId: string) {
    const Ref = collection(db, "organizations", organizationId, "benefits");
    return getDocs(Ref);
}