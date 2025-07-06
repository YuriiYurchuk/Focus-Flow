import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";

export const userCompletedTask = async (uid: string) => {
  if (!uid) return;

  const userRef = doc(db, `users/${uid}`);

  await updateDoc(userRef, {
    completedTasksCount: increment(1),
  });
};
