// ✅ Use `import` instead of `require`
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";
import { onValueCreated } from "firebase-functions/v2/database";
import logger from "firebase-functions/logger";

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// ✅ Initialize Firebase Admin
initializeApp();

// ✅ Firestore function to sync `active` field
export const syncActiveStatus = onDocumentWritten("activeUsers/{uid}", async (event) => {
  const db = getFirestore();
  const uid = event.params.uid;

  const before = event.data?.before?.data();
  const after = event.data?.after?.data();

  // Skip if `active` field didn't change
  if (!after || before?.active === after.active) {
    logger.log(`🟡 No change in active status for ${uid}`);
    return;
  }

  const newActive = after.active;

  try {
    await db.doc(`users/${uid}`).update({ active: newActive });
    logger.log(`✅ Updated users/${uid} active to: ${newActive}`);
  } catch (error) {
    logger.error("❌ Error updating user active status:", error);
  }
});
