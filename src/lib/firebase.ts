import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import firebaseAppletConfig from "../../firebase-applet-config.json";

// Web App Firebase configuration from project config (puersleepv2)
const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey || "AIzaSyDJ7RXs6ZIDkhhRRSCXWSstrmQi_xRQDpU",
  authDomain: firebaseAppletConfig.authDomain || "puersleepv2.firebaseapp.com",
  projectId: firebaseAppletConfig.projectId || "puersleepv2",
  storageBucket: firebaseAppletConfig.storageBucket || "puersleepv2.firebasestorage.app",
  messagingSenderId: firebaseAppletConfig.messagingSenderId || "730215321053",
  appId: firebaseAppletConfig.appId || "1:730215321053:web:147161d4dea7878eac7a34",
  measurementId: firebaseAppletConfig.measurementId || "G-T17EV33WDN"
};

// Initialize or reuse Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics if supported in browser environment
export let analytics: any = null;
if (typeof window !== "undefined") {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.debug("[Firebase Analytics] Not initialized:", err);
  });
}

// Initialize Firestore (uses default Firestore database on puersleepv2)
const databaseId = firebaseAppletConfig.firestoreDatabaseId?.trim() ? firebaseAppletConfig.firestoreDatabaseId : undefined;
export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

// Export Firestore helpers
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
};

