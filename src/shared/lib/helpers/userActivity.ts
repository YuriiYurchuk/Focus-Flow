import { increment, doc, Timestamp, updateDoc } from "firebase/firestore";
import { differenceInCalendarDays, isSameDay } from "date-fns";
import { db } from "@/shared/lib/firebase";
import type { IUser } from "@/entities/user/types";

export const uidToUserActivity = async (user: IUser) => {
  const userRef = doc(db, `users/${user.uid}`);
  const now = new Date();
  const lastActiveAt = user.lastActiveAt.toDate();

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
