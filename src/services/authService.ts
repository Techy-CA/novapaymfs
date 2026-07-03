import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { User } from '../types';

// ─── Auto-build user profile from Firebase Auth ───────────────────────────────
function buildDefaultUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Admin',
    email: firebaseUser.email || '',
    role: 'ceo',
    branch: 'Head Office',
    employeeId: 'E-001',
    isActive: true,
    createdAt: new Date(),
  };
}

// ─── Login ────────────────────────────────────────────────────────────────────
export async function loginWithEmail(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  // Try Firestore profile first
  try {
    const snap = await getDoc(doc(db, 'users', cred.user.uid));
    if (snap.exists()) {
      const data = snap.data();
      // Update last login
      await setDoc(doc(db, 'users', cred.user.uid), { lastLogin: serverTimestamp() }, { merge: true });
      return { ...data, id: snap.id, createdAt: data.createdAt?.toDate?.() ?? new Date() } as User;
    }
  } catch {
    // Firestore not accessible — fall through
  }

  // No Firestore profile — auto-create from Auth and save it
  const user = buildDefaultUser(cred.user);
  try {
    await setDoc(doc(db, 'users', cred.user.uid), {
      ...user,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } catch {
    // Still return user even if Firestore save fails
  }
  return user;
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logout() {
  await signOut(auth);
}

// ─── Get profile ──────────────────────────────────────────────────────────────
export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    return { ...data, id: snap.id, createdAt: data.createdAt?.toDate?.() ?? new Date() } as User;
  } catch {
    return null;
  }
}

// ─── Password reset ───────────────────────────────────────────────────────────
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

// ─── Auth state change listener ───────────────────────────────────────────────
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}