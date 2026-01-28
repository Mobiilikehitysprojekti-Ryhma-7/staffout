import { db } from "../config/firebaseConfig";
import { collection, addDoc, setDoc, getDoc, getDocs, doc } from "firebase/firestore";
import { auth } from "../config/firebaseConfig";

export async function createOrganizationMember(role: string, organizationId: string) {
    const uid = auth.currentUser?.uid || null;
    if (!uid) return;
    const orgRef = doc(db, "organizations", organizationId, "members", uid);
    return setDoc(orgRef, {
        role,
        createdAt: new Date()
    });
}

export async function getAllMembersFromOrganization(organizationId: string) {
    const membersRef = collection(db, "organizations", organizationId, "members");
    const snap = await getDocs(membersRef);
    if (!snap.empty) {
        return snap.docs.map(doc => doc.data());
    }
}

export async function getMemberRole(organizationId: string, uid: string) {
    const memberRef = doc(db, "organizations", organizationId, "members", uid);
    const snap = await getDoc(memberRef);
    if (snap.exists()) {
        return snap.data().role
    }
}