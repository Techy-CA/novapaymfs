import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, where, orderBy, limit,
  onSnapshot, serverTimestamp, QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Customer } from '../types';

const COLLECTION = 'customers';

function fromFirestore(id: string, data: any): Customer {
  return {
    ...data,
    id,
    joinedAt: data.joinedAt?.toDate?.() ?? new Date(),
  } as Customer;
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'joinedAt'>) {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...customer,
    joinedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getCustomers(branchId?: string): Promise<Customer[]> {
  const constraints: QueryConstraint[] = [orderBy('joinedAt', 'desc')];
  if (branchId) constraints.unshift(where('branchId', '==', branchId));
  const snap = await getDocs(query(collection(db, COLLECTION), ...constraints));
  return snap.docs.map(d => fromFirestore(d.id, d.data()));
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return fromFirestore(snap.id, snap.data());
}

export async function updateCustomer(id: string, data: Partial<Customer>) {
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteCustomer(id: string) {
  await deleteDoc(doc(db, COLLECTION, id));
}

export function subscribeCustomers(callback: (customers: Customer[]) => void) {
  const q = query(collection(db, COLLECTION), orderBy('joinedAt', 'desc'), limit(500));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => fromFirestore(d.id, d.data())));
  });
}
