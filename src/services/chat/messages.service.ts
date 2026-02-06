import { db } from "../../config/firebaseConfig";
import { collection, addDoc, setDoc, getDoc, getDocs, doc, orderBy, query } from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";

export async function createMessage(currentOrg: string, channelId: string, text: string, attachments: string[]) {
    if (!auth.currentUser) return
    const messagesRef = collection(db, "organizations", currentOrg, "channels", channelId, "messages");
    addDoc(messagesRef, {
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