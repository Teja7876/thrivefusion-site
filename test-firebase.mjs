import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCZDZL10acbap8m1fSvI-9ZOgglrTTmfkA",
  authDomain: "tfa-knowledge-hub.firebaseapp.com",
  projectId: "tfa-knowledge-hub",
  storageBucket: "tfa-knowledge-hub.firebasestorage.app",
  messagingSenderId: "711770762801",
  appId: "1:711770762801:android:d60b53606a452417e76f10"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testSubmit() {
  try {
    console.log("Signing in anonymously...");
    await signInAnonymously(auth);
    console.log("Signed in anonymously! UID:", auth.currentUser?.uid);
    
    console.log("Attempting to write to contact_submissions...");
    const docRef = await addDoc(collection(db, "contact_submissions"), {
      name: "Test User",
      email: "test@example.com",
      message: "This is a test message.",
      createdAt: new Date().toISOString()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

testSubmit();
