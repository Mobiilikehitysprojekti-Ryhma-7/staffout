import { db } from "../../config/firebaseConfig";
import { collection, addDoc, setDoc, getDocs, doc, orderBy, query, deleteDoc, where, collectionGroup, limit } from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";

export async function createMessage(currentOrg: string, channelId: string, text: string, attachments: string[]) {
    if (!auth.currentUser) return
    const messagesRef = collection(db, "organizations", currentOrg, "channels", channelId, "messages");
    addDoc(messagesRef, {
        oid: currentOrg,
        channelId: channelId,
        createdAt: new Date(),
        createdBy: auth.currentUser.uid,
        text: text,
        attachments: attachments,
        editedAt: ""
    });
}

export async function getMessages(currentOrg: string, channelId: string) {
    const messagesRef = collection(db, "organizations", currentOrg, "channels", channelId, "messages")

    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function updateMessage(currentOrg: string, channelId: string, messageId: string, text: string) {
    const messageRef = doc(db, "organizations", currentOrg, "channels", channelId, "messages", messageId);
    await setDoc(messageRef, {
        text: text,
        editedAt: new Date()
    }, { merge: true });
}

export async function deleteMessage(currentOrg: string, channelId: string, messageId: string) {
    const messageRef = doc(db, "organizations", currentOrg, "channels", channelId, "messages", messageId);
    await deleteDoc(messageRef);
}

export async function getAllUserMessages() {
    if (!auth.currentUser) return

    const q = query(collectionGroup(db, "messages"), where("createdBy", "==", auth.currentUser.uid));

    const querySnapshot = await getDocs(q);
         return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    ;
}

export async function getLatestMessages(oid: string) {
    if (!auth.currentUser || !oid ) return []

    const q = query(collectionGroup(db, "messages"), 
        where("oid", "==", oid), 
        orderBy("createdAt", "desc"), 
        limit(5));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}