import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, where, orderBy, limit,
  onSnapshot, serverTimestamp, Timestamp, writeBatch,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Loan, LoanStatus } from '../types';

const COLLECTION = 'loans';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fromFirestore(id: string, data: any): Loan {
  return {
    ...data,
    id,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  } as Loan;
}

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createLoan(loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...loan,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// ─── Read All ─────────────────────────────────────────────────────────────────
export async function getLoans(branchId?: string): Promise<Loan[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  if (branchId) constraints.unshift(where('branchId', '==', branchId));
  const snap = await getDocs(query(collection(db, COLLECTION), ...constraints));
  return snap.docs.map(d => fromFirestore(d.id, d.data()));
}

// ─── Read One ─────────────────────────────────────────────────────────────────
export async function getLoan(id: string): Promise<Loan | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return fromFirestore(snap.id, snap.data());
}

// ─── Update ───────────────────────────────────────────────────────────────────
export async function updateLoan(id: string, data: Partial<Loan>) {
  await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
}

// ─── Approve ─────────────────────────────────────────────────────────────────
export async function approveLoan(id: string, approvedBy: string) {
  await updateDoc(doc(db, COLLECTION, id), {
    status: 'approved' as LoanStatus,
    approvedBy,
    updatedAt: serverTimestamp(),
  });
}

// ─── Disburse ─────────────────────────────────────────────────────────────────
export async function disburseLoan(id: string, disbursedBy: string) {
  await updateDoc(doc(db, COLLECTION, id), {
    status: 'disbursed' as LoanStatus,
    disbursedBy,
    disbursementDate: new Date().toISOString().split('T')[0],
    updatedAt: serverTimestamp(),
  });
}

// ─── Real-time listener ───────────────────────────────────────────────────────
export function subscribeLoans(callback: (loans: Loan[]) => void) {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'), limit(200));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => fromFirestore(d.id, d.data())));
  });
}

// ─── By Customer ─────────────────────────────────────────────────────────────
export async function getLoansByCustomer(customerId: string): Promise<Loan[]> {
  const snap = await getDocs(
    query(collection(db, COLLECTION), where('customerId', '==', customerId))
  );
  return snap.docs.map(d => fromFirestore(d.id, d.data()));
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function deleteLoan(id: string) {
  await deleteDoc(doc(db, COLLECTION, id));
}
