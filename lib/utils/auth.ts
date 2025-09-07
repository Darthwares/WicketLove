import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { User } from '@/types';

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      const newUser: Omit<User, 'id'> = {
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        role: 'batsman',
        battingStyle: 'right',
        bowlingStyle: 'none',
        preferredPosition: 'middle',
        rating: 1000,
        stats: {
          matches: 0,
          runs: 0,
          wickets: 0,
          average: 0,
          strikeRate: 0,
          economy: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      
      return { user: { ...newUser, id: firebaseUser.uid }, isNewUser: true };
    }
    
    const userData = { ...userDoc.data(), id: firebaseUser.uid } as User;
    return { user: userData, isNewUser: false };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = { ...userDoc.data(), id: firebaseUser.uid } as User;
        callback(userData);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}