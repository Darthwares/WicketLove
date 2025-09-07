import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyA51kRrQ1EKpbBxq9DTBsevX1d4leMjquA",
  authDomain: "wicketlove-66015.firebaseapp.com",
  projectId: "wicketlove-66015",
  storageBucket: "wicketlove-66015.firebasestorage.app",
  messagingSenderId: "416939721597",
  appId: "1:416939721597:web:f8f86fc0cc69030bc60214",
  measurementId: "G-6RQF9XW3RQ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(console.error);
  
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser doesn\'t support persistence.');
    }
  });
}

let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics, googleProvider };