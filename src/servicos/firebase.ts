import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDHXOZSy0cW9ZdAbJEQzPL_rc8AFmbae-o",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kaamoroti.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kaamoroti",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kaamoroti.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "307450704811",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID || "1:307450704811:web:90cbe2a54738f579c718ee",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BBEPB0JS1X",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
