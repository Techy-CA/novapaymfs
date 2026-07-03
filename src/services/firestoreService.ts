import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, where, orderBy, limit,
  onSnapshot, serverTimestamp, QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Collection, Deposit, Employee, Recovery, LedgerEntry, AuditLog, Notification } from '../types';

// ─── Generic helpers ──────────────────────────────────────────────────────────
function tsToDate(val: any): Date {
  return val?.toDate?.() ?? new Date();
}

// ═══════════════════════════════════════════════════════════════════
// COLLECTIONS (EMI Payments)
// ═══════════════════════════════════════════════════════════════════
export async function createCollection(data: Omit<Collection, 'id' | 'createdAt'>) {
  const ref = await addDoc(collection(db, 'collections'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getCollections(dateStr?: string): Promise<Collection[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(200)];
  if (dateStr) constraints.unshift(where('collectionDate', '==', dateStr));
  const snap = await getDocs(query(collection(db, 'collections'), ...constraints));
  return snap.docs.map(d => ({ ...d.data(), id: d.id, createdAt: tsToDate(d.data().createdAt) } as Collection));
}

export async function updateCollection(id: string, data: Partial<Collection>) {
  await updateDoc(doc(db, 'collections', id), data);
}

export function subscribeCollections(date: string, callback: (c: Collection[]) => void) {
  const q = query(
    collection(db, 'collections'),
    where('collectionDate', '==', date),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ ...d.data(), id: d.id, createdAt: tsToDate(d.data().createdAt) } as Collection)));
  });
}

// ═══════════════════════════════════════════════════════════════════
// DEPOSITS
// ═══════════════════════════════════════════════════════════════════
export async function createDeposit(data: Omit<Deposit, 'id' | 'createdAt'>) {
  const ref = await addDoc(collection(db, 'deposits'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getDeposits(): Promise<Deposit[]> {
  const snap = await getDocs(query(collection(db, 'deposits'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ ...d.data(), id: d.id, createdAt: tsToDate(d.data().createdAt) } as Deposit));
}

export async function updateDeposit(id: string, data: Partial<Deposit>) {
  await updateDoc(doc(db, 'deposits', id), data);
}

export function subscribeDeposits(callback: (d: Deposit[]) => void) {
  const q = query(collection(db, 'deposits'), orderBy('createdAt', 'desc'), limit(300));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ ...d.data(), id: d.id, createdAt: tsToDate(d.data().createdAt) } as Deposit)));
  });
}

// ═══════════════════════════════════════════════════════════════════
// EMPLOYEES
// ═══════════════════════════════════════════════════════════════════
export async function createEmployee(data: Omit<Employee, 'id'>) {
  const ref = await addDoc(collection(db, 'employees'), data);
  return ref.id;
}

export async function getEmployees(): Promise<Employee[]> {
  const snap = await getDocs(query(collection(db, 'employees'), orderBy('name')));
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as Employee));
}

export async function updateEmployee(id: string, data: Partial<Employee>) {
  await updateDoc(doc(db, 'employees', id), data);
}

export function subscribeEmployees(callback: (e: Employee[]) => void) {
  return onSnapshot(query(collection(db, 'employees'), orderBy('name')), snap => {
    callback(snap.docs.map(d => ({ ...d.data(), id: d.id } as Employee)));
  });
}

// ═══════════════════════════════════════════════════════════════════
// RECOVERY
// ═══════════════════════════════════════════════════════════════════
export async function createRecovery(data: Omit<Recovery, 'id' | 'createdAt' | 'updatedAt'>) {
  const ref = await addDoc(collection(db, 'recovery'), {
    ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getRecoveries(): Promise<Recovery[]> {
  const snap = await getDocs(query(collection(db, 'recovery'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({
    ...d.data(), id: d.id,
    createdAt: tsToDate(d.data().createdAt),
    updatedAt: tsToDate(d.data().updatedAt),
  } as Recovery));
}

export async function updateRecovery(id: string, data: Partial<Recovery>) {
  await updateDoc(doc(db, 'recovery', id), { ...data, updatedAt: serverTimestamp() });
}

export function subscribeRecoveries(callback: (r: Recovery[]) => void) {
  return onSnapshot(query(collection(db, 'recovery'), orderBy('dpd', 'desc')), snap => {
    callback(snap.docs.map(d => ({
      ...d.data(), id: d.id,
      createdAt: tsToDate(d.data().createdAt),
      updatedAt: tsToDate(d.data().updatedAt),
    } as Recovery)));
  });
}

// ═══════════════════════════════════════════════════════════════════
// LEDGER ENTRIES
// ═══════════════════════════════════════════════════════════════════
export async function createLedgerEntry(data: Omit<LedgerEntry, 'id' | 'createdAt'>) {
  const ref = await addDoc(collection(db, 'ledger'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getLedgerEntries(): Promise<LedgerEntry[]> {
  const snap = await getDocs(query(collection(db, 'ledger'), orderBy('createdAt', 'desc'), limit(100)));
  return snap.docs.map(d => ({ ...d.data(), id: d.id, createdAt: tsToDate(d.data().createdAt) } as LedgerEntry));
}

export function subscribeLedger(callback: (l: LedgerEntry[]) => void) {
  return onSnapshot(query(collection(db, 'ledger'), orderBy('createdAt', 'desc'), limit(100)), snap => {
    callback(snap.docs.map(d => ({ ...d.data(), id: d.id, createdAt: tsToDate(d.data().createdAt) } as LedgerEntry)));
  });
}

// ═══════════════════════════════════════════════════════════════════
// AUDIT LOGS
// ═══════════════════════════════════════════════════════════════════
export async function createAuditLog(data: Omit<AuditLog, 'id' | 'timestamp'>) {
  await addDoc(collection(db, 'auditLogs'), { ...data, timestamp: serverTimestamp() });
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const snap = await getDocs(query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(200)));
  return snap.docs.map(d => ({ ...d.data(), id: d.id, timestamp: tsToDate(d.data().timestamp) } as AuditLog));
}

export function subscribeAuditLogs(callback: (a: AuditLog[]) => void) {
  return onSnapshot(query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(200)), snap => {
    callback(snap.docs.map(d => ({ ...d.data(), id: d.id, timestamp: tsToDate(d.data().timestamp) } as AuditLog)));
  });
}

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════
export async function createNotification(data: Omit<Notification, 'id' | 'createdAt'>) {
  await addDoc(collection(db, 'notifications'), { ...data, createdAt: serverTimestamp() });
}

export async function markNotificationRead(id: string) {
  await updateDoc(doc(db, 'notifications', id), { isRead: true });
}

export function subscribeNotifications(userId: string, callback: (n: Notification[]) => void) {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ ...d.data(), id: d.id, createdAt: tsToDate(d.data().createdAt) } as Notification)));
  });
}

// ═══════════════════════════════════════════════════════════════════
// KPIs — computed from Firestore aggregations
// ═══════════════════════════════════════════════════════════════════
export async function computeKPIs() {
  const [loansSnap, customersSnap, collectionsSnap, depositsSnap] = await Promise.all([
    getDocs(collection(db, 'loans')),
    getDocs(collection(db, 'customers')),
    getDocs(query(collection(db, 'collections'), where('collectionDate', '==', new Date().toISOString().split('T')[0]))),
    getDocs(collection(db, 'deposits')),
  ]);

  const loans = loansSnap.docs.map(d => d.data());
  const customers = customersSnap.docs.map(d => d.data());
  const todayCollections = collectionsSnap.docs.map(d => d.data());
  const deposits = depositsSnap.docs.map(d => d.data());

  const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'disbursed');
  const overdueLoans = loans.filter(l => l.status === 'overdue' || l.status === 'npa');
  const totalAUM = activeLoans.reduce((s: number, l: any) => s + (l.outstandingBalance || 0), 0);
  const todayCollected = todayCollections.filter((c: any) => c.status === 'collected').reduce((s: number, c: any) => s + (c.collectedAmount || 0), 0);
  const todayTarget = todayCollections.reduce((s: number, c: any) => s + (c.scheduledAmount || 0), 0);
  const totalDeposits = deposits.filter(d => d.status === 'active').reduce((s: number, d: any) => s + (d.currentBalance || 0), 0);
  const npaLoans = loans.filter(l => l.status === 'npa');
  const npaValue = npaLoans.reduce((s: number, l: any) => s + (l.outstandingBalance || 0), 0);
  const npaRatio = totalAUM > 0 ? (npaValue / totalAUM) * 100 : 0;
  const collectionRate = todayTarget > 0 ? (todayCollected / todayTarget) * 100 : 0;

  return {
    totalAUM,
    activeBorrowers: customers.filter(c => c.status === 'active').length,
    collectionRate: Math.round(collectionRate * 10) / 10,
    npaRatio: Math.round(npaRatio * 10) / 10,
    todayCollection: todayCollected,
    todayTarget,
    activeLoans: activeLoans.length,
    totalDeposits,
    netProfit: 0,
    aumGrowth: 0,
    borrowerGrowth: 0,
    collectionRateChange: 0,
    npaChange: 0,
    todayLoansApproved: loans.filter(l => {
      const d = l.updatedAt?.toDate?.();
      return d && d.toDateString() === new Date().toDateString() && l.status === 'approved';
    }).length,
    portfolioAtRisk: npaRatio,
    operatingExpenseRatio: 0,
    returnOnAssets: 0,
    capitalAdequacyRatio: 0,
  };
}
