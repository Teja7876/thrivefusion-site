import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  // Use service account credentials if available
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (serviceAccountPath) {
    try {
      const serviceAccount = require(`../../../${serviceAccountPath}`);
      return initializeApp({
        credential: cert(serviceAccount)
      });
    } catch (e) {
      console.warn("Could not load service account from GOOGLE_APPLICATION_CREDENTIALS path:", e);
    }
  }
  
  // Fallback to default application credentials
  return initializeApp();
}

export const adminDb = getFirestore(getAdminApp());
