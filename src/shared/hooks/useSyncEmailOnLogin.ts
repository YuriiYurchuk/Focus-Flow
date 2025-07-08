import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/shared/lib/firebase";

export const useSyncEmailOnLogin = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists()) return;

          const firestoreEmail = userDocSnap.data().email;
          const authEmail = user.email;

          if (authEmail && firestoreEmail !== authEmail) {
            await updateDoc(userDocRef, { email: authEmail });
          }
        } catch (error) {
          console.error("Error syncing email:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);
};
