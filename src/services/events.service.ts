import { auth, db } from "../config/firebaseConfig";
import { collection, addDoc, setDoc, getDoc, getDocs, doc } from "firebase/firestore";

type createEventParams = {
    organizationId: string, 
    description: string, 
    title: string, 
    startDate: Date, 
    endDate: Date, 
    photoURL: string, 
    location: string
}

export async function createEvent({organizationId, description, title, startDate, endDate, photoURL, location}: createEventParams) {
    const Ref = collection(db, "organizations", organizationId, "events");
    if (!auth.currentUser) return;
    await addDoc(Ref, {
        createdAt: new Date(),
        createdBy: auth.currentUser.uid,
        description,
        title,
        startDate,
        endDate,
        photoURL,
        location
    });
}
export async function getAllEventsFromOrganization(organizationId: string) {
    const eventsRef = collection(db, "organizations", organizationId, "events");
    const snap = await getDocs(eventsRef);
    if (!snap.empty) {
        return snap.docs.map(doc => doc.data());
    }
}

