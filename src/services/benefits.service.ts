import { auth, db } from "../config/firebaseConfig";
import { collection, addDoc, getDocs, query, orderBy, limit, deleteDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import type { Benefit, BenefitCategory } from "../types/benefit";

export type Badge = { family: "fa" | "mi" | "mci" | ""; name: string };

type createBenefitParams = {
    organizationId: string,
    badge: Badge,
    category: string,
    description: string,
    title: string,
    photoURL: string,
    validUntil: Date
}

type BenefitDoc = {
    id: string,
    category: string,
    description: string,
    title: string,
    photoURL?: string,
    validUntil?: any,
    createdAt?: any,
    badge?: Badge;
}

// Type guards
function isBenefitCategory(v: any): v is BenefitCategory {
  return v === "sports" || v === "meals" || v === "culture" || v === "health" || v === "other";
}
function isBadge(v: any): v is Badge {
  return (
    v &&
    (v.family === "fa" || v.family === "mi" || v.family === "mci") &&
    typeof v.name === "string" &&
    v.name.length > 0
  );
}

// Default badge for the given category
function defaultBadge(cat: BenefitCategory): Badge {
  switch (cat) {
    case "sports": return { family: "fa", name: "bicycle" };
    case "meals": return { family: "mi", name: "restaurant" };
    case "culture": return { family: "mi", name: "theater-comedy" };
    case "health": return { family: "fa", name: "heartbeat" };
    default: return { family: "mci", name: "tag" };
  }
}

function timestampToDate(v: any): Date {
  // Firestore Timestamp -> Date
  if (v && typeof v.toDate === "function") return v.toDate();
  // already Date
  if (v instanceof Date) return v;
  return new Date(v);
}

// Map Firestore document to Benefit type
function mapBenefit(id: string, d: BenefitDoc): Benefit {
  const category: BenefitCategory = isBenefitCategory(d.category) ? d.category : "other";

  const image =
    d.photoURL && d.photoURL.trim().length > 0
      ? { uri: d.photoURL }
      : require("../../assets/benefitBG3.png");

  const badge = isBadge(d.badge)
    ? d.badge
    : defaultBadge(category);

  return {
    id,
    title: d.title ?? "",
    description: d.description ?? "",
    category: category,
    image,
    badge,
    validUntil: timestampToDate(d.validUntil),
    createdAt: timestampToDate(d.createdAt),
    photoURL: d.photoURL ?? "",
    };
}

export async function createBenefit({organizationId, badge, category, description, title, photoURL, validUntil}: createBenefitParams) {
    const benefitsRef = collection(db, "organizations", organizationId, "benefits");
    await addDoc(benefitsRef, {
        createdAt: serverTimestamp(),
        badge: badge || null,
        category,
        description,
        title,
        photoURL,
        validUntil
    });
}

export async function updateBenefit(oid: string, benefitId: string, title: string, description: string, category: string, photoURL?: string) {
    if (!auth.currentUser) return
    const benefitDoc = doc(db, "organizations", oid, "benefits", benefitId);
    await updateDoc(benefitDoc, {
        title: title,
        description: description,
        category: category,
        photoURL: photoURL
    });
}

export async function deleteBenefit(oid: string, benefitId: string) {
    if (!auth.currentUser) return
    const benefitDoc = doc(db, "organizations", oid, "benefits", benefitId);
    await deleteDoc(benefitDoc);
}

// Read all benefits for the given organization
export async function readAllBenefitsFromOrganization(organizationId: string): Promise<Benefit[]> {
    const benefitsRef = collection(db, "organizations", organizationId, "benefits");
    const q = query(benefitsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => mapBenefit(doc.id, doc.data() as BenefitDoc));
}

// Read latest 2 benefits for the given organization
export async function readLatestBenefitsFromOrganization(organizationId: string, n = 2
): Promise<Benefit[]> {
  const benefitsRef = collection(db, "organizations", organizationId, "benefits");
  const q = query(benefitsRef, orderBy("createdAt", "desc"), limit(n));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => mapBenefit(doc.id, doc.data() as BenefitDoc));
}