import { db } from "../../config/firebaseConfig";
import { collection, addDoc, setDoc, getDoc, getDocs, doc } from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";

export async function createChannel(oid: string) {
    if (!auth.currentUser) return
    const channelRef = collection(db, "organizations", oid, "channels");
    const docRef = await addDoc(channelRef, {
        createdAt: new Date(),
        name: "test-channel",
    });
    return docRef
}

export async function getChannels(oid: string) {
    if (!auth.currentUser) return
    const channelRef = collection(db, "organizations", oid, "channels");
    const querySnapshot = await getDocs(channelRef);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}