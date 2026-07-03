import React, { useState, useEffect } from 'react';
import { subscribeLoans } from '../services/loanService';
import { subscribeCustomers } from '../services/customerService';
import {
  subscribeCollections, subscribeDeposits, subscribeEmployees,
  subscribeRecoveries, subscribeLedger, subscribeAuditLogs,
  computeKPIs,
} from '../services/firestoreService';
import type { Loan, Customer, Collection, Deposit, Employee, Recovery, LedgerEntry, AuditLog, DashboardKPIs } from '../types';

// ─── Loans ────────────────────────────────────────────────────────────────────
export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = subscribeLoans((data) => { setLoans(data); setLoading(false); });
    return unsub;
  }, []);
  return { loans, loading };
}

// ─── Customers ────────────────────────────────────────────────────────────────
export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = subscribeCustomers((data) => { setCustomers(data); setLoading(false); });
    return unsub;
  }, []);
  return { customers, loading };
}

// ─── Collections ──────────────────────────────────────────────────────────────
export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];
  useEffect(() => {
    const unsub = subscribeCollections(today, (data) => { setCollections(data); setLoading(false); });
    return unsub;
  }, [today]);
  return { collections, loading };
}

// ─── All Collections (for history) ───────────────────────────────────────────
export function useAllCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Listen to all recent collections (no date filter)
    const unsub = subscribeCollections('', (data) => { setCollections(data); setLoading(false); });
    return unsub;
  }, []);
  return { collections, loading };
}

// ─── Deposits ─────────────────────────────────────────────────────────────────
export function useDeposits() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = subscribeDeposits((data) => { setDeposits(data); setLoading(false); });
    return unsub;
  }, []);
  return { deposits, loading };
}

// ─── Employees ────────────────────────────────────────────────────────────────
export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = subscribeEmployees((data) => { setEmployees(data); setLoading(false); });
    return unsub;
  }, []);
  return { employees, loading };
}

// ─── Recoveries ───────────────────────────────────────────────────────────────
export function useRecoveries() {
  const [recoveries, setRecoveries] = useState<Recovery[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = subscribeRecoveries((data) => { setRecoveries(data); setLoading(false); });
    return unsub;
  }, []);
  return { recoveries, loading };
}

// ─── Ledger ───────────────────────────────────────────────────────────────────
export function useLedger() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = subscribeLedger((data) => { setEntries(data); setLoading(false); });
    return unsub;
  }, []);
  return { entries, loading };
}

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = subscribeAuditLogs((data) => { setLogs(data); setLoading(false); });
    return unsub;
  }, []);
  return { logs, loading };
}

// ─── KPIs ─────────────────────────────────────────────────────────────────────
export function useKPIs() {
  const [kpis, setKpis] = useState<Partial<DashboardKPIs>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    computeKPIs().then(data => { setKpis(data); setLoading(false); }).catch(() => setLoading(false));
    // Refresh every 2 minutes
    const interval = setInterval(() => {
      computeKPIs().then(setKpis).catch(() => {});
    }, 120000);
    return () => clearInterval(interval);
  }, []);
  return { kpis, loading };
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
export function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" style={{ opacity: 1 - i * 0.15 }} />
      ))}
    </div>
  );
}
