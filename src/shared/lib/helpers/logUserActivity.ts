import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type {
  ActivityType,
  IActivityMetadata,
} from "@/entities/activity/types";

const MAX_LOGS = 30;

export const logUserActivity = async (
  userId: string,
  type: ActivityType,
  message: string,
  metadata?: IActivityMetadata
): Promise<void> => {
  try {
    const logsRef = collection(db, "users", userId, "activityLogs");

    const logsQuery = query(
      logsRef,
      orderBy("timestamp", "desc"),
      limit(MAX_LOGS)
    );
    const snapshot = await getDocs(logsQuery);

    if (snapshot.docs.length >= MAX_LOGS) {
      const oldestDoc = snapshot.docs[snapshot.docs.length - 1];
      await deleteDoc(oldestDoc.ref);
    }

    const newLogRef = doc(logsRef);

    await setDoc(newLogRef, {
      id: newLogRef.id,
      type,
      message,
      metadata: metadata ?? {},
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Не вдалося зберегти активність:", error);
  }
};
