import {
  increment,
  doc,
  Timestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { differenceInCalendarDays, isSameDay } from "date-fns";
import { db } from "@/shared/lib/firebase";
import { processUserAchievements } from "@/shared/lib/helpers/processUserAchievements";

export const userActivity = async (uid: string) => {
  try {
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

      await processUserAchievements(uid, {
        streak: (userData.streak || 0) + 1,
      });
    } else if (diff > 1) {
      if ((userData.streak || 0) >= 7) {
        await updateDoc(userRef, {
          streakBreaksCount: increment(1),
        });
      }

      await updateDoc(userRef, {
        streak: 0,
        lastActiveAt: Timestamp.fromDate(now),
      });

      await processUserAchievements(uid, {
        streak: 0,
        streakBreaksCount:
          (userData.streakBreaksCount || 0) +
          ((userData.streak || 0) >= 7 ? 1 : 0),
      });
    }
  } catch (error) {
    console.error("Error updating user activity:", error);
  }
};
