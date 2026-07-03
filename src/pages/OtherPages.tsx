import React, { useState, useMemo } from 'react';
import {
  CalendarCheck, CheckCircle2, XCircle, Clock, MapPin, Plus, Search,
  PiggyBank, Users, AlertTriangle, Brain, BarChart3, TrendingUp,
  UserSquare2, Calculator, FileText, ShieldCheck, Building2,
  Bell, ArrowDown, Star, Activity, Eye, Download, Upload,
  Shield, Globe, Lock, CreditCard, Target, RefreshCw,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { KPICard } from '../components/ui/KPICard';
import { Card, CardHeader, TableCard } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { SearchInput } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Avatar } from '../components/ui/Avatar';
import { useAppStore } from '../store/appStore';
import {
  useCollections, useDeposits, useCustomers, useLoans,
  useEmployees, useLedger, useAuditLogs, useRecoveries,
} from '../hooks/useFirestore';
import { updateCollection } from '../services/firestoreService';
import {
  formatCurrency, formatDate, timeAgo,
  getCollectionStatusColor, getKYCColor, getRiskColor,
  getCreditScoreColor, getRecoveryStageLabel, getRecoveryStageColor,
  getDepositTypeLabel, getLoanStatusColor,
} from '../lib/utils';
import toast from 'react-hot-toast';

const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-bold text-slate-800">{p.value}</p>
      ))}
    </div>
  );
};

const EmptyState = ({ icon, text, sub, action }: { icon: React.ReactNode; text: string; sub?: string; action?: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
    <div className="text-slate-300 mb-3">{icon}</div>
    <p className="text-sm font-semibold text-slate-600">{text}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

const LoadingRows = () => (
  <div className="space-y-2 p-4">
    {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" style={{ opacity: 1 - i * 0.2 }} />)}
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// COLLECTIONS
// ═══════════════════════════════════════════════════════════════════
export const CollectionsPage: React.FC = () => {
  const { openModal } = useAppStore();
  const { collections, loading } = useCollections();
  const [search, setSearch] = useState('');

  const stats = useMemo(() => {
    const collected = collections.filter(c => c.status === 'collected');
    const missed = collections.filter(c => c.status === 'missed');
    const pending = collections.filter(c => c.status === 'pending');
    const totalCollected = collected.reduce((s, c) => s + c.collectedAmount, 0);
    const totalTarget = collections.reduce((s, c) => s + c.scheduledAmount, 0);
    return { collected: collected.length, missed: missed.length, pending: pending.length, totalCollected, totalTarget };
  }, [collections]);

  const filtered = useMemo(() => {
    if (!search) return collections;
    const q = search.toLowerCase();
    return collections.filter(c => c.customerName.toLowerCase().includes(q) || c.loanNumber.toLowerCase().includes(q));
  }, [collections, search]);

  return (
    <div className="space-y-4 fade-in">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Collected Today" value={stats.totalCollected} valueFormatType="currency-compact" icon={<CheckCircle2 size={15} />} accentColor="green" />
        <KPICard label="Today's Target" value={stats.totalTarget} valueFormatType="currency-compact" icon={<Target size={15} />} accentColor="blue" />
        <KPICard label="Pending" value={stats.pending} valueFormatType="number" icon={<Clock size={15} />} accentColor="amber" />
        <KPICard label="Missed Today" value={stats.missed} valueFormatType="number" icon={<XCircle size={15} />} accentColor="red" />
      </div>

      <TableCard>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-sm font-bold text-slate-800">Collection Ledger — {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</h3>
          <div className="flex gap-2">
            <SearchInput icon={<Search size={13} />} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} onClear={() => setSearch('')} className="w-44" />
            <Button variant="primary" size="sm" icon={<Plus size={12} />} onClick={() => openModal('collect-payment')}>Record Collection</Button>
          </div>
        </div>
        {loading ? <LoadingRows /> : filtered.length === 0 ? (
          <EmptyState icon={<CalendarCheck size={40} />} text="No collections today" sub="Collections recorded today will appear here." action={<Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => openModal('collect-payment')}>Record First Collection</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Time</th><th>Borrower</th><th>Loan</th><th>Scheduled</th><th>Collected</th><th>Method</th><th>Officer</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map(col => {
                  const sc = getCollectionStatusColor(col.status);
                  return (
                    <tr key={col.id}>
                      <td className="font-mono text-xs">{col.collectionTime || '—'}</td>
                      <td className="font-semibold text-slate-800">{col.customerName}</td>
                      <td className="font-mono text-xs text-blue-600">{col.loanNumber}</td>
                      <td className="font-semibold text-slate-700">{formatCurrency(col.scheduledAmount, true)}</td>
                      <td>{col.status === 'missed' ? <span className="text-slate-400">—</span> : <span className="text-emerald-600 font-semibold">{formatCurrency(col.collectedAmount, true)}</span>}</td>
                      <td className="capitalize text-slate-500">{col.paymentMethod || '—'}</td>
                      <td className="text-slate-500">{col.collectedBy || '—'}</td>
                      <td><Badge variant={col.status === 'collected' ? 'green' : col.status === 'missed' ? 'red' : 'amber'}>{sc.label}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
          <span>{filtered.length} records</span>
          <span>{loading && <RefreshCw size={12} className="animate-spin inline mr-1" />}Live · Firebase</span>
        </div>
      </TableCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// DEPOSITS
// ═══════════════════════════════════════════════════════════════════
export const DepositsPage: React.FC = () => {
  const { openModal } = useAppStore();
  const { deposits, loading } = useDeposits();

  const totalDeposits = deposits.reduce((s, d) => s + d.currentBalance, 0);
  const activeCount = deposits.filter(d => d.status === 'active').length;
  const matured = deposits.filter(d => d.status === 'matured').length;

  return (
    <div className="space-y-4 fade-in">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Total Deposits" value={totalDeposits} valueFormatType="currency-compact" icon={<PiggyBank size={15} />} accentColor="green" />
        <KPICard label="Active Accounts" value={activeCount} valueFormatType="number" icon={<Users size={15} />} accentColor="blue" />
        <KPICard label="Total Accounts" value={deposits.length} valueFormatType="number" icon={<Building2 size={15} />} accentColor="purple" />
        <KPICard label="Matured FDs" value={matured} valueFormatType="number" sub="Action needed" icon={<CalendarCheck size={15} />} accentColor="amber" />
      </div>

      <TableCard>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Deposit Accounts</h3>
          <Button variant="primary" size="sm" icon={<Plus size={12} />} onClick={() => openModal('new-deposit')}>Open Account</Button>
        </div>
        {loading ? <LoadingRows /> : deposits.length === 0 ? (
          <EmptyState icon={<PiggyBank size={40} />} text="No deposit accounts yet" sub="Open your first deposit account to get started." action={<Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => openModal('new-deposit')}>Open Account</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Account No.</th><th>Customer</th><th>Type</th><th>Balance</th><th>Rate</th><th>Open Date</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {deposits.map(dep => (
                  <tr key={dep.id}>
                    <td><span className="font-mono text-xs text-blue-600 font-bold">{dep.accountNumber}</span></td>
                    <td className="font-semibold text-slate-800">{dep.customerName}</td>
                    <td className="text-slate-500">{getDepositTypeLabel(dep.type)}</td>
                    <td className="font-bold text-emerald-600">{formatCurrency(dep.currentBalance, true)}</td>
                    <td className="text-slate-600">{dep.interestRate}% p.a.</td>
                    <td className="text-slate-500 text-xs">{dep.openDate}</td>
                    <td><Badge variant={dep.status === 'active' ? 'green' : dep.status === 'matured' ? 'amber' : 'gray'}>{dep.status.charAt(0).toUpperCase() + dep.status.slice(1)}</Badge></td>
                    <td><Button variant="secondary" size="xs" icon={<Eye size={10} />}>View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// CUSTOMERS
// ═══════════════════════════════════════════════════════════════════
export const CustomersPage: React.FC = () => {
  const { openModal } = useAppStore();
  const { customers, loading } = useCustomers();
  const { deposits } = useDeposits();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(c =>
      c.name.toLowerCase().includes(q) || c.customerId.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [customers, search]);

  return (
    <div className="space-y-4 fade-in">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Total Customers" value={customers.length} valueFormatType="number" icon={<Users size={15} />} accentColor="blue" />
        <KPICard label="Active" value={customers.filter(c => c.status === 'active').length} valueFormatType="number" icon={<CheckCircle2 size={15} />} accentColor="green" />
        <KPICard label="KYC Verified" value={customers.filter(c => c.kycStatus === 'verified').length} valueFormatType="number" icon={<ShieldCheck size={15} />} accentColor="purple" />
        <KPICard label="KYC Pending" value={customers.filter(c => c.kycStatus === 'pending').length} valueFormatType="number" sub="Needs action" icon={<Clock size={15} />} accentColor="amber" />
      </div>

      <TableCard>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-sm font-bold text-slate-800">Customer Directory</h3>
          <div className="flex gap-2">
            <SearchInput icon={<Search size={13} />} placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} onClear={() => setSearch('')} className="w-52" />
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => openModal('new-customer')}>Add Customer</Button>
          </div>
        </div>
        {loading ? <LoadingRows /> : filtered.length === 0 ? (
          <EmptyState icon={<Users size={40} />} text={customers.length === 0 ? 'No customers yet' : 'No results found'}
            sub={customers.length === 0 ? 'Register your first customer to begin.' : 'Try a different search.'}
            action={customers.length === 0 ? <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => openModal('new-customer')}>Add First Customer</Button> : undefined} />
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>ID</th><th>Customer</th><th>Phone</th><th>Loans</th><th>Credit Score</th><th>KYC</th><th>Risk</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(c => {
                  const rc = getRiskColor(c.riskLevel);
                  const kyc = getKYCColor(c.kycStatus);
                  const scoreColor = getCreditScoreColor(c.creditScore);
                  return (
                    <tr key={c.id}>
                      <td><span className="font-mono text-xs text-blue-600 font-bold">{c.customerId}</span></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar name={c.name} size="xs" />
                          <div>
                            <p className="font-semibold text-slate-800 text-xs">{c.name}</p>
                            <p className="text-xs text-slate-400">{c.occupation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-slate-600">{c.phone}</td>
                      <td><Badge variant={c.activeLoans > 0 ? 'blue' : 'gray'}>{c.activeLoans > 0 ? `${c.activeLoans} active` : 'None'}</Badge></td>
                      <td><span className={`font-bold text-sm ${scoreColor}`}>{c.creditScore}</span></td>
                      <td><Badge variant={c.kycStatus === 'verified' ? 'green' : c.kycStatus === 'rejected' ? 'red' : 'amber'}>{kyc.label}</Badge></td>
                      <td><Badge variant={c.riskLevel === 'low' ? 'green' : c.riskLevel === 'medium' ? 'amber' : 'red'}>{c.riskLevel.charAt(0).toUpperCase() + c.riskLevel.slice(1)}</Badge></td>
                      <td><Badge variant={c.status === 'active' ? 'green' : 'red'}>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</Badge></td>
                      <td><Button variant="secondary" size="xs" icon={<Eye size={10} />} onClick={() => openModal('customer-detail')}>Profile</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
          <span>Showing {filtered.length} of {customers.length}</span>
          <span>{loading && <RefreshCw size={12} className="animate-spin inline mr-1" />}Live · Firebase</span>
        </div>
      </TableCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// RECOVERY
// ═══════════════════════════════════════════════════════════════════
export const RecoveryPage: React.FC = () => {
  const { recoveries, loading } = useRecoveries();
  const totalNPA = recoveries.reduce((s, r) => s + r.outstanding, 0);
  const critical = recoveries.filter(r => r.priority === 'critical').length;

  return (
    <div className="space-y-4 fade-in">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Total Outstanding" value={totalNPA} valueFormatType="currency-compact" icon={<AlertTriangle size={15} />} accentColor="red" />
        <KPICard label="Cases Active" value={recoveries.length} valueFormatType="number" icon={<Clock size={15} />} accentColor="amber" />
        <KPICard label="Critical Priority" value={critical} valueFormatType="number" icon={<ShieldCheck size={15} />} accentColor="red" />
        <KPICard label="Legal Cases" value={recoveries.filter(r => r.stage === 'legal').length} valueFormatType="number" icon={<Shield size={15} />} accentColor="purple" />
      </div>

      <TableCard>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Recovery Pipeline</h3>
          <Button variant="primary" size="sm" icon={<Plus size={12} />}>Add Case</Button>
        </div>
        {loading ? <LoadingRows /> : recoveries.length === 0 ? (
          <EmptyState icon={<AlertTriangle size={40} />} text="No recovery cases" sub="Overdue loans flagged for recovery will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Loan</th><th>Borrower</th><th>Outstanding</th><th>DPD</th><th>Stage</th><th>Next Action</th><th>Officer</th><th>Priority</th></tr></thead>
              <tbody>
                {recoveries.map(r => {
                  const sc = getRecoveryStageColor(r.stage);
                  return (
                    <tr key={r.id}>
                      <td><span className="font-mono text-xs text-blue-600 font-bold">{r.loanNumber}</span></td>
                      <td className="font-semibold text-slate-800">{r.customerName}</td>
                      <td><span className="font-bold text-red-600">{formatCurrency(r.outstanding, true)}</span></td>
                      <td><span className={`font-bold text-sm ${r.dpd >= 30 ? 'text-red-600' : r.dpd >= 15 ? 'text-amber-600' : 'text-blue-600'}`}>{r.dpd}d</span></td>
                      <td><Badge variant={sc.text.includes('rose') || sc.text.includes('red') ? 'red' : sc.text.includes('amber') ? 'amber' : sc.text.includes('blue') ? 'blue' : 'purple'}>{getRecoveryStageLabel(r.stage)}</Badge></td>
                      <td className="text-slate-600 text-xs">{r.nextAction}</td>
                      <td className="text-slate-500">{r.assignedOfficerName}</td>
                      <td><Badge variant={r.priority === 'critical' ? 'red' : r.priority === 'high' ? 'amber' : r.priority === 'medium' ? 'blue' : 'gray'}>{r.priority.charAt(0).toUpperCase() + r.priority.slice(1)}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </TableCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════════
export const AnalyticsPage: React.FC = () => {
  const { loans } = useLoans();
  const { customers } = useCustomers();
  const { collections } = useCollections();

  const loanStatusData = useMemo(() => {
    const groups: Record<string, number> = {};
    loans.forEach(l => { groups[l.status] = (groups[l.status] || 0) + 1; });
    return Object.entries(groups).map(([status, count]) => ({ name: getLoanStatusColor(status as any).label, value: count }));
  }, [loans]);

  const kpiRatios = [
    { label: 'Active Loans', value: loans.filter(l => l.status === 'active').length },
    { label: 'Total Customers', value: customers.length },
    { label: 'KYC Verified', value: customers.filter(c => c.kycStatus === 'verified').length },
    { label: 'Collections Today', value: collections.filter(c => c.status === 'collected').length },
    { label: 'NPA Loans', value: loans.filter(l => l.status === 'npa').length },
    { label: 'Pending Approval', value: loans.filter(l => l.status === 'pending_approval').length },
  ];

  return (
    <div className="space-y-4 fade-in">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Total Loans" value={loans.length} valueFormatType="number" icon={<CreditCard size={15} />} accentColor="blue" />
        <KPICard label="Total Customers" value={customers.length} valueFormatType="number" icon={<Users size={15} />} accentColor="green" />
        <KPICard label="Today Collections" value={collections.filter(c => c.status === 'collected').length} valueFormatType="number" icon={<CheckCircle2 size={15} />} accentColor="teal" />
        <KPICard label="NPA Loans" value={loans.filter(l => l.status === 'npa').length} valueFormatType="number" icon={<AlertTriangle size={15} />} accentColor="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Loans by Status" icon={<BarChart3 size={14} className="text-blue-600" />} />
          {loanStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={loanStatusData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState icon={<BarChart3 size={36} />} text="No loan data to chart" sub="Create loans to see analytics." />}
        </Card>

        <Card>
          <CardHeader title="Live Key Metrics" icon={<Activity size={14} className="text-emerald-600" />} />
          <div className="space-y-1">
            {kpiRatios.map(item => (
              <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-600">{item.label}</span>
                <span className="text-sm font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="AI Intelligence Engine" subtitle="Automated risk analysis" icon={<Brain size={14} className="text-violet-600" />} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Portfolio Health', text: `${loans.filter(l => l.status === 'active').length} active loans performing. ${loans.filter(l => l.status === 'overdue').length} overdue require immediate attention.` },
            { title: 'Collection Efficiency', text: `${collections.filter(c => c.status === 'collected').length} of ${collections.length} scheduled collections completed today.` },
            { title: 'Customer Risk', text: `${customers.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical').length} high-risk customers identified for enhanced monitoring.` },
            { title: 'KYC Compliance', text: `${customers.filter(c => c.kycStatus === 'verified').length} verified customers. ${customers.filter(c => c.kycStatus === 'pending').length} pending verification.` },
          ].map(insight => (
            <div key={insight.title} className="p-3 bg-violet-50 border border-violet-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="pulse-dot flex-shrink-0" style={{ background: '#7c3aed' }} />
                <span className="text-xs font-bold text-violet-700">{insight.title}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// EMPLOYEES
// ═══════════════════════════════════════════════════════════════════
export const EmployeesPage: React.FC = () => {
  const { openModal } = useAppStore();
  const { employees, loading } = useEmployees();

  return (
    <div className="space-y-4 fade-in">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Total Staff" value={employees.length} valueFormatType="number" icon={<UserSquare2 size={15} />} accentColor="blue" />
        <KPICard label="Field Officers" value={employees.filter(e => e.role === 'field_officer').length} valueFormatType="number" icon={<Users size={15} />} accentColor="green" />
        <KPICard label="Active" value={employees.filter(e => e.isActive).length} valueFormatType="number" icon={<CheckCircle2 size={15} />} accentColor="teal" />
        <KPICard label="On Leave" value={employees.filter(e => !e.isActive).length} icon={<Clock size={15} />} accentColor="amber" />
      </div>

      <TableCard>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Employee Directory</h3>
          <Button variant="primary" size="sm" icon={<Plus size={12} />} onClick={() => openModal('new-employee')}>Add Employee</Button>
        </div>
        {loading ? <LoadingRows /> : employees.length === 0 ? (
          <EmptyState icon={<UserSquare2 size={40} />} text="No employees added yet" sub="Add your first employee to get started." action={<Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => openModal('new-employee')}>Add Employee</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>ID</th><th>Employee</th><th>Role</th><th>Branch</th><th>Borrowers</th><th>Collection Rate</th><th>This Month</th><th>Status</th></tr></thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td><span className="font-mono text-xs text-blue-600 font-bold">{emp.employeeId}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={emp.name} size="xs" />
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="capitalize text-slate-500 text-xs">{emp.role.replace('_', ' ')}</td>
                    <td className="text-slate-500 text-xs">{emp.branch}</td>
                    <td>{emp.assignedBorrowers > 0 ? <span className="font-semibold text-slate-700">{emp.assignedBorrowers}</span> : <span className="text-slate-400">—</span>}</td>
                    <td>
                      {emp.collectionRate > 0 ? (
                        <div className="flex items-center gap-2">
                          <ProgressBar value={emp.collectionRate} max={100} size="xs" className="w-16" />
                          <span className={`text-xs font-bold ${emp.collectionRate >= 95 ? 'text-emerald-600' : emp.collectionRate >= 85 ? 'text-blue-600' : 'text-amber-600'}`}>{emp.collectionRate}%</span>
                        </div>
                      ) : <span className="text-slate-400">—</span>}
                    </td>
                    <td>{emp.thisMonthCollection > 0 ? <span className="font-bold text-emerald-600">{formatCurrency(emp.thisMonthCollection, true)}</span> : <span className="text-slate-400">—</span>}</td>
                    <td><Badge variant={emp.isActive ? 'green' : 'amber'}>{emp.isActive ? 'Active' : 'On Leave'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// ACCOUNTING
// ═══════════════════════════════════════════════════════════════════
export const AccountingPage: React.FC = () => {
  const { entries, loading } = useLedger();
  const totalDebit = entries.reduce((s, e) => s + e.debitAmount, 0);
  const totalCredit = entries.reduce((s, e) => s + e.creditAmount, 0);

  return (
    <div className="space-y-4 fade-in">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Total Credits" value={totalCredit} valueFormatType="currency-compact" icon={<TrendingUp size={15} />} accentColor="green" />
        <KPICard label="Total Debits" value={totalDebit} valueFormatType="currency-compact" icon={<ArrowDown size={15} />} accentColor="red" />
        <KPICard label="Net Position" value={totalCredit - totalDebit} valueFormatType="currency-compact" icon={<Star size={15} />} accentColor="blue" />
        <KPICard label="GL Entries" value={entries.length} valueFormatType="number" icon={<FileText size={15} />} accentColor="purple" />
      </div>

      <TableCard>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">General Ledger</h3>
          <Button variant="secondary" size="sm" icon={<Download size={12} />}>Export</Button>
        </div>
        {loading ? <LoadingRows /> : entries.length === 0 ? (
          <EmptyState icon={<Calculator size={40} />} text="No ledger entries yet" sub="Accounting transactions will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Date</th><th>Voucher</th><th>Account</th><th>Description</th><th>Debit</th><th>Credit</th></tr></thead>
              <tbody>
                {entries.map(entry => (
                  <tr key={entry.id}>
                    <td className="text-slate-500 text-xs">{entry.date}</td>
                    <td><span className="font-mono text-xs text-blue-600 font-bold">{entry.voucherNumber}</span></td>
                    <td className="font-semibold text-slate-800">{entry.accountName}</td>
                    <td className="text-slate-500 text-xs max-w-xs truncate">{entry.description}</td>
                    <td>{entry.debitAmount > 0 ? <span className="text-red-600 font-semibold">{formatCurrency(entry.debitAmount, true)}</span> : <span className="text-slate-300">—</span>}</td>
                    <td>{entry.creditAmount > 0 ? <span className="text-emerald-600 font-semibold">{formatCurrency(entry.creditAmount, true)}</span> : <span className="text-slate-300">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// AUDIT LOGS
// ═══════════════════════════════════════════════════════════════════
export const AuditPage: React.FC = () => {
  const { logs, loading } = useAuditLogs();

  return (
    <div className="space-y-4 fade-in">
      <TableCard>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText size={14} className="text-amber-500" /> Audit Log — Real-time Activity
          </h3>
          <Button variant="secondary" size="sm" icon={<Download size={12} />}>Export</Button>
        </div>
        {loading ? <LoadingRows /> : logs.length === 0 ? (
          <EmptyState icon={<FileText size={40} />} text="No audit events yet" sub="All system actions are logged here automatically." />
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity</th><th>Description</th><th>Result</th></tr></thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td className="font-mono text-xs text-slate-500 whitespace-nowrap">{log.timestamp.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="font-semibold text-slate-800 text-xs">{log.userName}</td>
                    <td>
                      <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded
                        ${log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-700'
                        : log.action === 'DELETE' ? 'bg-red-100 text-red-700'
                        : log.action === 'APPROVE' ? 'bg-blue-100 text-blue-700'
                        : log.action === 'LOGIN' ? 'bg-violet-100 text-violet-700'
                        : 'bg-slate-100 text-slate-500'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="text-slate-600 text-xs">{log.entity}</td>
                    <td className="text-slate-500 text-xs max-w-xs truncate">{log.description}</td>
                    <td><Badge variant={log.result === 'success' ? 'green' : log.result === 'failed' ? 'red' : 'amber'}>{log.result.charAt(0).toUpperCase() + log.result.slice(1)}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
          <span>{logs.length} events</span>
          <span>{loading && <RefreshCw size={12} className="animate-spin inline mr-1" />}Live · Firebase</span>
        </div>
      </TableCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// KYC
// ═══════════════════════════════════════════════════════════════════
export const KYCPage: React.FC = () => {
  const { customers, loading } = useCustomers();
  const pending = customers.filter(c => c.kycStatus === 'pending');
  const verified = customers.filter(c => c.kycStatus === 'verified');

  return (
    <div className="space-y-4 fade-in">
      <div className="grid grid-cols-3 gap-3">
        <KPICard label="Pending KYC" value={pending.length} sub="Awaiting verification" icon={<Clock size={15} />} accentColor="amber" />
        <KPICard label="Verified" value={verified.length} icon={<ShieldCheck size={15} />} accentColor="green" />
        <KPICard label="Rejected" value={customers.filter(c => c.kycStatus === 'rejected').length} icon={<XCircle size={15} />} accentColor="red" />
      </div>

      <Card>
        <CardHeader title="KYC Review Queue" icon={<ShieldCheck size={14} className="text-teal-600" />} />
        {loading ? <LoadingRows /> : pending.length === 0 ? (
          <EmptyState icon={<ShieldCheck size={40} />} text="No pending KYC reviews" sub="All customers are verified. New pending verifications appear here." />
        ) : (
          <div className="space-y-3">
            {pending.map(c => (
              <div key={c.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Avatar name={c.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.customerId} · {c.phone} · {c.occupation}</p>
                  <p className="text-xs text-amber-600 mt-1 font-medium">⚠ KYC documents pending verification</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="success" size="sm" icon={<CheckCircle2 size={11} />}>Verify</Button>
                  <Button variant="danger" size="sm" icon={<XCircle size={11} />}>Reject</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// TREASURY
// ═══════════════════════════════════════════════════════════════════
export const TreasuryPage: React.FC = () => {
  const { deposits } = useDeposits();
  const totalDeposits = deposits.filter(d => d.status === 'active').reduce((s, d) => s + d.currentBalance, 0);

  return (
    <div className="space-y-4 fade-in">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Total Deposits" value={totalDeposits} valueFormatType="currency-compact" icon={<Building2 size={15} />} accentColor="green" />
        <KPICard label="Active FDs" value={deposits.filter(d => d.type === 'fixed' && d.status === 'active').length} icon={<TrendingUp size={15} />} accentColor="blue" />
        <KPICard label="Savings Accounts" value={deposits.filter(d => d.type === 'savings').length} icon={<PiggyBank size={15} />} accentColor="purple" />
        <KPICard label="Matured FDs" value={deposits.filter(d => d.status === 'matured').length} sub="Action needed" icon={<CalendarCheck size={15} />} accentColor="amber" />
      </div>

      <Card>
        <CardHeader title="Investment Portfolio" icon={<Building2 size={14} className="text-violet-600" />} />
        {deposits.filter(d => d.type === 'fixed').length === 0 ? (
          <EmptyState icon={<Building2 size={40} />} text="No fixed deposits yet" sub="Fixed deposits will appear here." />
        ) : (
          <div className="space-y-2">
            {deposits.filter(d => d.type === 'fixed').map(dep => (
              <div key={dep.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{dep.customerName} — {dep.accountNumber}</p>
                  <p className="text-xs text-slate-400">Opened {dep.openDate} {dep.maturityDate && `· Matures ${dep.maturityDate}`}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{formatCurrency(dep.currentBalance, true)}</p>
                  <p className="text-xs text-slate-400">{dep.interestRate}% p.a.</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// REPORTS
// ═══════════════════════════════════════════════════════════════════
export const ReportsPage: React.FC = () => {
  const reports = [
    { name: 'Daily Collection Report', desc: 'EMI collections by officer', icon: <CalendarCheck size={20} className="text-emerald-600" />, tag: 'Operations' },
    { name: 'Portfolio At Risk', desc: 'PAR 30, 60, 90 day breakdown', icon: <AlertTriangle size={20} className="text-amber-600" />, tag: 'Risk' },
    { name: 'Branch Performance', desc: 'Officer-wise collection metrics', icon: <MapPin size={20} className="text-blue-600" />, tag: 'Performance' },
    { name: 'NPA & Recovery', desc: 'Non-performing assets status', icon: <Shield size={20} className="text-red-600" />, tag: 'Risk' },
    { name: 'P&L Statement', desc: 'Monthly profit and loss', icon: <Calculator size={20} className="text-violet-600" />, tag: 'Finance' },
    { name: 'Customer Onboarding', desc: 'New customer & KYC status', icon: <Users size={20} className="text-teal-600" />, tag: 'CRM' },
    { name: 'Disbursement Report', desc: 'Loans disbursed summary', icon: <CreditCard size={20} className="text-blue-600" />, tag: 'Loans' },
    { name: 'Regulatory Report', desc: 'RBI submission format', icon: <FileText size={20} className="text-amber-600" />, tag: 'Compliance' },
  ];

  return (
    <div className="space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800">Report Center</h2>
        <Button variant="primary" size="sm" icon={<Download size={12} />}>Bulk Export</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {reports.map(r => (
          <div key={r.name} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
            <div className="mb-3">{r.icon}</div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">{r.name}</h3>
            <p className="text-xs text-slate-500 mb-3">{r.desc}</p>
            <div className="flex items-center justify-between">
              <Badge variant="blue" dot={false}>{r.tag}</Badge>
              <Button variant="ghost" size="xs" icon={<Download size={10} />} className="opacity-0 group-hover:opacity-100 transition-opacity">Export</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════
export const SettingsPage: React.FC = () => {
  const { currentUser } = useAppStore();
  const integrations = [
    { name: 'Firebase Auth', status: true }, { name: 'Firestore Database', status: true },
    { name: 'Firebase Storage', status: true }, { name: 'Firebase Analytics', status: true },
    { name: 'Razorpay Payments', status: false }, { name: 'Twilio SMS', status: false },
    { name: 'WhatsApp Business', status: false }, { name: 'CIBIL Credit Bureau', status: false },
  ];

  return (
    <div className="space-y-4 fade-in">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Organization Settings" icon={<Building2 size={14} className="text-blue-600" />} />
          <div className="space-y-3">
            {[
              { label: 'Organization Name', value: 'NovaPay Microfinance Ltd.' },
              { label: 'Registered Address', value: 'Indore, Madhya Pradesh' },
              { label: 'RBI License No.', value: 'NBFC-MFI-MP-2020-00142' },
              { label: 'Default Interest Rate (%)', value: '18' },
              { label: 'Late Penalty (%)', value: '2' },
              { label: 'Max Loan Per Borrower (₹)', value: '500000' },
            ].map(field => (
              <div key={field.label}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{field.label}</label>
                <input className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-800" defaultValue={field.value} />
              </div>
            ))}
            <Button variant="primary" size="sm" className="mt-2">Save Settings</Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Current User" icon={<Users size={14} className="text-blue-600" />} />
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Avatar name={currentUser?.name || 'User'} size="lg" />
              <div>
                <p className="font-bold text-slate-800">{currentUser?.name || '—'}</p>
                <p className="text-xs text-slate-500">{currentUser?.email || '—'}</p>
                <Badge variant="blue" className="mt-1">{currentUser?.role || '—'}</Badge>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Firebase Integrations" icon={<Globe size={14} className="text-teal-600" />} />
            <div className="grid grid-cols-2 gap-2">
              {integrations.map(integ => (
                <div key={integ.name} className={`p-2.5 rounded-xl border text-xs ${integ.status ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full mb-1 ${integ.status ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <p className="font-semibold text-slate-700">{integ.name}</p>
                  <p className={`text-xs ${integ.status ? 'text-emerald-600' : 'text-slate-400'}`}>{integ.status ? 'Connected' : 'Not configured'}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════
export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();

  return (
    <div className="space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800">Notifications</h2>
        {notifications.some(n => !n.isRead) && (
          <Button variant="secondary" size="sm" onClick={markAllNotificationsRead}>Mark all read</Button>
        )}
      </div>
      <div className="space-y-2 max-w-2xl">
        {notifications.length === 0 ? (
          <EmptyState icon={<Bell size={40} />} text="No notifications" sub="System alerts and updates will appear here." />
        ) : notifications.map(n => (
          <div key={n.id} onClick={() => markNotificationRead(n.id)}
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all
              ${!n.isRead ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
              ${n.type === 'danger' ? 'bg-red-100 text-red-600'
              : n.type === 'warning' ? 'bg-amber-100 text-amber-600'
              : n.type === 'success' ? 'bg-emerald-100 text-emerald-600'
              : 'bg-blue-100 text-blue-600'}`}>
              <Bell size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">{n.title}</p>
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 ml-2" />}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
              <p className="text-xs text-slate-400 mt-1.5">{timeAgo(n.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
