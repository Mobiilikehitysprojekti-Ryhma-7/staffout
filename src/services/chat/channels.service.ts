import { db } from "../../config/firebaseConfig";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";

export async function createChannel(oid: string, name: string) {
    if (!auth.currentUser) return
    const channelRef = collection(db, "organizations", oid, "channels");
    const docRef = await addDoc(channelRef, {
        createdAt: new Date(),
        name: name,
    });
    return docRef
}

export async function getChannels(oid: string) {
    if (!auth.currentUser) return
    const channelRef = collection(db, "organizations", oid, "channels");
    const querySnapshot = await getDocs(channelRef);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function updateChannel(oid: string, channelId: string, name: string) {
    if (!auth.currentUser) return
    const channelDoc = doc(db, "organizations", oid, "channels", channelId);
    await updateDoc(channelDoc, {
        name: name,
    });
}

export async function deleteChannel(oid: string, channelId: string) {
    if (!auth.currentUser) return
    const channelDoc = doc(db, "organizations", oid, "channels", channelId);
    await deleteDoc(channelDoc);
}