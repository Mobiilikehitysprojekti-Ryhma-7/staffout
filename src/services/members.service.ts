import { db } from "../config/firebaseConfig";
import { collection, addDoc, setDoc, getDoc, getDocs, doc, onSnapshot } from "firebase/firestore";
import { auth } from "../config/firebaseConfig";

export async function createMember(role: string, organizationId: string) {
    const uid = auth.currentUser?.uid || null;
    if (!uid) return;

    const orgDocRef = doc(db, "organizations", organizationId);
    const orgSnap = await getDoc(orgDocRef);
    const memberSnap = await getDoc(doc(db, "organizations", organizationId, "members", uid));
    // Ensure the organization doc exists
    if (!orgSnap.exists()) {
        throw new Error(`Organization ${organizationId} does not exist`);
    }
    // Ensure the member does not already exist
    if (memberSnap.exists()) {
        throw new Error(`Member with UID ${uid} already exists in organization ${organizationId}`);
    }
    const memberRef = doc(db, "organizations", organizationId, "members", uid);
    await setDoc(memberRef, {
        role,
        createdAt: new Date()
    }, { merge: true });
}

export async function updateMemberRole(organizationId: string, uid: string, newRole: string) {
    const memberRef = doc(db, "organizations", organizationId, "members", uid);
    await setDoc(memberRef, {
        role: newRole
    }, { merge: true });
}

export async function removeMemberFromOrganization(organizationId: string, uid: string) {
    const memberRef = doc(db, "organizations", organizationId, "members", uid);
    await setDoc(memberRef, {}, { merge: true });
}

export async function isMemberOfOrganization(organizationId: string): Promise<boolean> {
    if (!auth.currentUser) return false;
    const memberRef = doc(db, "organizations", organizationId, "members", auth.currentUser?.uid);
    const snap = await getDoc(memberRef);
    return snap.exists();
}

export async function getAllMembersFromOrganization(organizationId: string) {
    const membersRef = collection(db, "organizations", organizationId, "members");
    const snap = await getDocs(membersRef);
    if (!snap.empty) {
        return snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        }));
    }
}

export async function getMemberRole(organizationId: string, uid: string) {
    const memberRef = doc(db, "organizations", organizationId, "members", uid);
    const snap = await getDoc(memberRef);
    if (snap.exists()) {
        return snap.data().role;
    }
}

// monitor membership status in real-time
export function subscribeToOrganizationMembership(
    organizationId: string,
    callback: (isMember: boolean) => void
) {
    const user = auth.currentUser
    if (!user) return () => { }

    const memberRef = doc(
        db,
        'organizations',
        organizationId,
        'members',
        user.uid
    )

    return onSnapshot(memberRef, snap => {
        callback(snap.exists())
    })
}