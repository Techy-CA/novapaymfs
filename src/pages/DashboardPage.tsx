import React from 'react';
import {
  TrendingUp, Users, Target, AlertCircle, CreditCard, CheckCircle2,
  XCircle, Clock, Brain, Activity, Zap, ArrowRight, BarChart3, PiggyBank,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { KPICard } from '../components/ui/KPICard';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/appStore';
import { useKPIs, useLoans, useCollections, useEmployees } from '../hooks/useFirestore';
import { formatCurrency, timeAgo } from '../lib/utils';

const PIE_COLORS = ['#2563eb', '#059669', '#d97706', '#7c3aed'];

const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs shadow-lg">
      <p className="text-slate-500 mb-1.5 font-medium">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="text-slate-900 font-bold">₹{p.value}L</span>
        </div>
      ))}
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const { openModal } = useAppStore();
  const { kpis, loading: kpiLoading } = useKPIs();
  const { loans, loading: loansLoading } = useLoans();
  const { collections, loading: collectionsLoading } = useCollections();
  const { employees } = useEmployees();

  const collectionPct = kpis.todayTarget && kpis.todayTarget > 0
    ? Math.round(((kpis.todayCollection || 0) / kpis.todayTarget) * 100)
    : 0;

  const loanTypeMix = React.useMemo(() => {
    if (!loans.length) return [];
    const counts: Record<string, number> = {};
    loans.forEach(l => { counts[l.type] = (counts[l.type] || 0) + 1; });
    const total = loans.length;
    return Object.entries(counts).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round((count / total) * 100),
    }));
  }, [loans]);

  const fieldOfficers = employees.filter(e => e.role === 'field_officer').slice(0, 5);

  const EmptyState = ({ text }: { text: string }) => (
    <div className="flex items-center justify-center py-8 text-slate-400 text-sm">{text}</div>
  );

  return (
    <div className="space-y-4 fade-in">
      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Total AUM" value={kpis.totalAUM || 0} valueFormatType="currency-compact"
          change={kpis.aumGrowth} changeLabel="vs last month" icon={<TrendingUp size={16} />} accentColor="green" />
        <KPICard label="Active Borrowers" value={kpis.activeBorrowers || 0} valueFormatType="number"
          change={kpis.borrowerGrowth} icon={<Users size={16} />} accentColor="blue" />
        <KPICard label="Collection Rate" value={kpis.collectionRate || 0} valueFormatType="percent"
          change={kpis.collectionRateChange} sub="Target: 98%" icon={<Target size={16} />} accentColor="amber" />
        <KPICard label="NPA Ratio" value={kpis.npaRatio || 0} valueFormatType="percent"
          change={kpis.npaChange} sub="Industry avg: 3.5%" icon={<AlertCircle size={16} />} accentColor="red" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader title="Loan Portfolio Mix" icon={<BarChart3 size={14} className="text-blue-600" />} />
          {loanTypeMix.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={loanTypeMix} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text={loansLoading ? 'Loading...' : 'No loan data yet. Create your first loan.'} />
          )}
        </Card>

        <Card>
          <CardHeader title="Loan Type Distribution" icon={<PiggyBank size={14} className="text-violet-600" />} />
          {loanTypeMix.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={loanTypeMix} cx="50%" cy="50%" innerRadius={42} outerRadius={62}
                    paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {loanTypeMix.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, '']}
                    contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {loanTypeMix.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-slate-500 truncate">{item.name} {item.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState text={loansLoading ? 'Loading...' : 'No data yet'} />
          )}
        </Card>
      </div>

      {/* Operations row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Quick actions */}
        <Card>
          <CardHeader title="Quick Actions" icon={<Zap size={14} className="text-amber-500" />} />
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { label: 'New Loan', icon: <CreditCard size={18} />, color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100 border-blue-200', modal: 'new-loan' as const },
              { label: 'Collect EMI', icon: <CheckCircle2 size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200', modal: 'collect-payment' as const },
              { label: 'Add Client', icon: <Users size={18} />, color: 'text-violet-600', bg: 'bg-violet-50 hover:bg-violet-100 border-violet-200', modal: 'new-customer' as const },
              { label: 'New Deposit', icon: <PiggyBank size={18} />, color: 'text-amber-600', bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200', modal: 'new-deposit' as const },
            ].map((action) => (
              <button key={action.label} onClick={() => openModal(action.modal)}
                className={`${action.bg} border rounded-xl p-3 text-center hover:shadow-sm transition-all cursor-pointer group`}>
                <div className={`${action.color} flex justify-center mb-1.5 group-hover:scale-110 transition-transform`}>{action.icon}</div>
                <p className="text-xs font-semibold text-slate-700">{action.label}</p>
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {loans.filter(l => l.status === 'overdue' || l.status === 'npa').length > 0 && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <Clock size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-700">
                    {loans.filter(l => l.status === 'overdue' || l.status === 'npa').length} overdue loans
                  </p>
                  <p className="text-xs text-amber-600/80">Immediate action required</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-blue-50 border border-blue-200">
              <Brain size={13} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-700">AI Risk Engine Active</p>
                <p className="text-xs text-blue-600/80">Monitoring {loans.length} active accounts</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Today's collections */}
        <Card>
          <CardHeader title="Today's Collections"
            subtitle={new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            icon={<CheckCircle2 size={14} className="text-emerald-600" />} />
          <div className="mb-3">
            <div className="text-2xl font-extrabold text-emerald-600 tracking-tight">
              {formatCurrency(kpis.todayCollection || 0, true)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 mb-2">
              of {formatCurrency(kpis.todayTarget || 0, true)} target
            </div>
            <ProgressBar value={collectionPct} max={100} showLabel size="sm" />
          </div>
          <div className="space-y-0.5 max-h-[200px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {collectionsLoading ? (
              <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-8 bg-slate-100 rounded-lg animate-pulse" />)}</div>
            ) : collections.length === 0 ? (
              <EmptyState text="No collections recorded today." />
            ) : collections.slice(0, 10).map((col) => {
              const isCollected = col.status === 'collected';
              const isMissed = col.status === 'missed';
              return (
                <div key={col.id} className="flex items-center gap-2.5 px-1 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isCollected ? 'bg-emerald-100' : isMissed ? 'bg-red-100' : 'bg-amber-100'}`}>
                    {isCollected ? <CheckCircle2 size={13} className="text-emerald-600" />
                      : isMissed ? <XCircle size={13} className="text-red-600" />
                      : <Clock size={13} className="text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{col.customerName}</p>
                    <p className="text-xs text-slate-400">{col.loanNumber}</p>
                  </div>
                  <div className={`text-xs font-bold flex-shrink-0 ${isCollected ? 'text-emerald-600' : isMissed ? 'text-red-500' : 'text-amber-600'}`}>
                    {isCollected ? `+${formatCurrency(col.collectedAmount, true)}` : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Officers + Activity */}
        <div className="space-y-3">
          <Card>
            <CardHeader title="Top Officers" icon={<Users size={13} className="text-blue-600" />} />
            {fieldOfficers.length === 0 ? (
              <EmptyState text="No field officers yet." />
            ) : (
              <div className="space-y-2.5">
                {fieldOfficers.map((emp, i) => (
                  <div key={emp.id} className="flex items-center gap-3">
                    <span className={`text-xs font-black w-4 text-center flex-shrink-0 ${i === 0 ? 'text-amber-500' : 'text-slate-400'}`}>{i + 1}</span>
                    <Avatar name={emp.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{emp.name}</p>
                      <ProgressBar value={emp.collectionRate || 0} max={100} size="xs" className="mt-0.5" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 flex-shrink-0">{emp.collectionRate || 0}%</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card elevated>
            <CardHeader title="Activity" icon={<Activity size={13} className="text-blue-600" />} />
            {loans.length === 0 ? (
              <EmptyState text="No activity yet." />
            ) : (
              <div className="space-y-2.5">
                {loans.slice(0, 3).map((loan) => (
                  <div key={loan.id} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 mt-0.5">
                      <CreditCard size={10} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{loan.loanId} — {loan.status}</p>
                      <p className="text-xs text-slate-400">{timeAgo(loan.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
