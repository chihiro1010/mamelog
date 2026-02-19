import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  Timestamp,
  query,
  where,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import db from "@/lib/firebase/firebase";
import { Mamelog } from "@/types/mamelog";

const ensureDb = () => {
  if (!db) {
    throw new Error("Firestoreが初期化されていません");
  }
  return db;
};

export const fetchMamelogs = async (userId: string): Promise<Mamelog[]> => {
  const firestore = ensureDb();
  const q = query(
    collection(firestore, "mamelog"),
    where("regist_user", "==", userId)
  );
  const snap = await getDocs(q);

  return snap.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      ...data,
      id: docSnap.id,
      create_at: data.create_at.toDate().toISOString(),
      update_at: data.update_at.toDate().toISOString(),
      exp_date: data.exp_date.toDate().toISOString(),
      purchase_date: data.purchase_date.toDate().toISOString(),
      roast_date: data.roast_date.toDate().toISOString(),
    };
  }) as Mamelog[];
};

export const addMamelog = async (data: Omit<Mamelog, "id">) => {
  const firestore = ensureDb();
  const docRef = await addDoc(collection(firestore, "mamelog"), {
    ...data,
    exp_date: Timestamp.fromDate(new Date(data.exp_date)),
    purchase_date: Timestamp.fromDate(new Date(data.purchase_date)),
    roast_date: Timestamp.fromDate(new Date(data.roast_date)),
    create_at: Timestamp.now(),
    update_at: Timestamp.now(),
  });
  return docRef.id;
};

export async function setMamelog(id: string, data: Mamelog) {
  const firestore = ensureDb();
  const docRef = doc(firestore, "mamelog", id);
  await setDoc(
    docRef,
    {
      ...data,
      exp_date: Timestamp.fromDate(new Date(data.exp_date)),
      purchase_date: Timestamp.fromDate(new Date(data.purchase_date)),
      roast_date: Timestamp.fromDate(new Date(data.roast_date)),
      create_at: Timestamp.fromDate(new Date(data.create_at)),
      update_at: Timestamp.now(),
    },
    { merge: true }
  );
}

export const deleteMamelog = async (id: string) => {
  try {
    const firestore = ensureDb();
    await deleteDoc(doc(firestore, "mamelog", id));
  } catch (error) {
    console.error("削除エラー:", error);
  }
};

export const deleteMamelogsByUser = async (userId: string) => {
  const firestore = ensureDb();
  const q = query(collection(firestore, "mamelog"), where("regist_user", "==", userId));
  const snap = await getDocs(q);

  const batch = writeBatch(firestore);
  snap.docs.forEach((docSnap) => {
    batch.delete(doc(firestore, "mamelog", docSnap.id));
  });

  await batch.commit();
};
