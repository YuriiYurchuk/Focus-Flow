/**
 * ▶ Як запустити:
 *   npm install firebase-admin --save-dev
 *   cd scripts/
 *   node scripts/seedAchievements.js
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { achievements } from "./data.js";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve("./serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function seedAchievements() {
  const batch = db.batch();

  achievements.forEach((achievement) => {
    const docRef = db.collection("achievements").doc(achievement.id);
    batch.set(docRef, achievement);
  });

  await batch.commit();
  console.log("Досягнення успішно додані у Firestore!");
}

seedAchievements().catch(console.error);
