import { db } from "../../config/firebaseConfig";
import { collection, addDoc, setDoc, getDoc, getDocs, doc } from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";

function createMessage(currentOrg: string, channelId: string, message: string, attachments: string) {
    const Ref = collection(db, "organizations", currentOrg, "channels", channelId, "messages");
    addDoc(Ref, {
        createdAt: new Date(),
        createBy: auth.currentUser?.uid || "unknown",
        message,
        attachments,
        editedAt: ""
    });
}

function readAllMessagesFromChannel(currentOrg: string, channelId: string) {
    const Ref = collection(db, "organizations", currentOrg, "channels", channelId, "messages");
    return getDocs(Ref);
}