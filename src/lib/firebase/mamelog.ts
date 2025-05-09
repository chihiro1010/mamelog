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
} from "firebase/firestore";
import db from "@/lib/firebase/firebase";
import { Mamelog } from "@/types/mamelog";

export const fetchMamelogs = async (userId: string): Promise<Mamelog[]> => {
  const q = query(
    collection(db, "mamelog"),
    where("regist_user", "==", userId)
  );
  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      create_at: data.create_at.toDate().toISOString(),
      update_at: data.update_at.toDate().toISOString(),
      exp_date: data.exp_date.toDate().toISOString(),
      purchase_date: data.purchase_date.toDate().toISOString(),
      roast_date: data.roast_date.toDate().toISOString(),
    };
  }) as Mamelog[];
};

export const addMamelog = async (data: Omit<Mamelog, "id">) => {
  const docRef = await addDoc(collection(db, "mamelog"), {
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
  console.log(id, data);
  const docRef = doc(db, "mamelog", id);
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
  ); // merge: true で既存フィールドを残す
}

export const deleteMamelog = async (id: string) => {
  try {
    await deleteDoc(doc(db, "mamelog", id));
    console.log("削除成功！");
  } catch (error) {
    console.error("削除エラー:", error);
  }
};
