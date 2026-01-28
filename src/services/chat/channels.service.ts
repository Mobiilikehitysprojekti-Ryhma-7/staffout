import { db } from "../../config/firebaseConfig";
import { collection, addDoc, setDoc, getDoc, getDocs, doc } from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";

function createChannel(currentOrg: string) {
    const Ref = collection(db, "organizations", currentOrg, "channels");
    addDoc(Ref, {
        createdAt: new Date(),
        createBy: auth.currentUser?.uid || "unknown",
        name: "test-channel",
    });
}

function readAllChannelsFromOrg(currentOrg: string) {
    const Ref = collection(db, "organizations", currentOrg, "channels");
    return getDocs(Ref);
}