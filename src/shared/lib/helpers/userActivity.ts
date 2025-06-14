import {
  increment,
  doc,
  Timestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { differenceInCalendarDays, isSameDay } from "date-fns";
import { db } from "@/shared/lib/firebase";

export const uidToUserActivity = async (uid: string) => {
  const userRef = doc(db, `users/${uid}`);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;

  const userData = userSnap.data();
  const now = new Date();

  if (!userData.lastActiveAt?.toDate) return;

  const lastActiveAt = userData.lastActiveAt.toDate();

  if (isSameDay(now, lastActiveAt)) {
    return;
  }

  const diff = differenceInCalendarDays(now, lastActiveAt);

  if (diff === 1) {
    await updateDoc(userRef, {
      streak: increment(1),
      lastActiveAt: Timestamp.fromDate(now),
    });
  } else if (diff > 1) {
    await updateDoc(userRef, {
      streak: 0,
      lastActiveAt: Timestamp.fromDate(now),
    });
  }
};
