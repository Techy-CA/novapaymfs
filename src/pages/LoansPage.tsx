import React, { useState, useMemo } from 'react';
import { CreditCard, Plus, Search, TrendingUp, Clock, AlertCircle, CheckCircle2, Eye, ShieldAlert, RefreshCw } from 'lucide-react';
import { KPICard } from '../components/ui/KPICard';
import { TableCard } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { SearchInput } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAppStore } from '../store/appStore';
import { useLoans } from '../hooks/useFirestore';
import { approveLoan, updateLoan } from '../services/loanService';
import { formatCurrency, getLoanStatusColor, getRiskColor, getLoanTypeLabel } from '../lib/utils';
import toast from 'react-hot-toast';

const statusVariantMap: Record<string, any> = {
  active: 'green', overdue: 'amber', npa: 'red',
  pending_approval: 'purple', approved: 'blue', disbursed: 'teal',
  closed: 'gray', written_off: 'gray', draft: 'gray',
};

export const LoansPage: React.FC = () => {
  const { openModal, currentUser } = useAppStore();
  const { loans, loading } = useLoans();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const counts = useMemo(() => ({
    all: loans.length,
    pending: loans.filter(l => l.status === 'pending_approval').length,
    active: loans.filter(l => l.status === 'active' || l.status === 'disbursed').length,
    overdue: loans.filter(l => l.status === 'overdue' || l.status === 'npa').length,
    closed: loans.filter(l => l.status === 'closed' || l.status === 'written_off').length,
  }), [loans]);

  const filtered = useMemo(() => {
    let data = loans;
    if (activeTab === 'pending') data = data.filter(l => l.status === 'pending_approval');
    else if (activeTab === 'active') data = data.filter(l => l.status === 'active' || l.status === 'disbursed');
    else if (activeTab === 'overdue') data = data.filter(l => l.status === 'overdue' || l.status === 'npa');
    else if (activeTab === 'closed') data = data.filter(l => l.status === 'closed' || l.status === 'written_off');
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(l =>
        l.customerName.toLowerCase().includes(q) || l.loanId.toLowerCase().includes(q)
      );
    }
    return data;
  }, [loans, activeTab, search]);

  const totalDisbursed = loans.filter(l => l.status !== 'pending_approval').reduce((s, l) => s + l.disbursedAmount, 0);

  const handleApprove = async (id: string) => {
    try {
      await approveLoan(id, currentUser?.name || 'Admin');
      toast.success('Loan approved!');
    } catch { toast.error('Approval failed'); }
  };

  return (
    <div className="space-y-4 fade-in">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Active Loans" value={counts.active} valueFormatType="number" icon={<CreditCard size={15} />} accentColor="blue" />
        <KPICard label="Total Disbursed" value={totalDisbursed} valueFormatType="currency-compact" icon={<TrendingUp size={15} />} accentColor="green" />
        <KPICard label="Pending Approval" value={counts.pending} valueFormatType="number" sub="Needs review" icon={<Clock size={15} />} accentColor="amber" />
        <KPICard label="Overdue" value={counts.overdue} valueFormatType="number" icon={<AlertCircle size={15} />} accentColor="red" />
      </div>

      <TableCard>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <Tabs tabs={[
            { key: 'all', label: 'All Loans', count: counts.all },
            { key: 'pending', label: 'Pending', count: counts.pending },
            { key: 'active', label: 'Active', count: counts.active },
            { key: 'overdue', label: 'Overdue', count: counts.overdue },
            { key: 'closed', label: 'Closed', count: counts.closed },
          ]} activeTab={activeTab} onChange={setActiveTab} />
          <div className="flex gap-2">
            <SearchInput icon={<Search size={13} />} placeholder="Search loans..." value={search}
              onChange={e => setSearch(e.target.value)} onClear={() => setSearch('')} className="w-52" />
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => openModal('new-loan')}>New Loan</Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2 p-4">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <CreditCard size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">No loans found</p>
            <p className="text-xs mt-1">{loans.length === 0 ? 'Create your first loan to get started.' : 'Try adjusting your filters.'}</p>
            {loans.length === 0 && (
              <Button variant="primary" size="sm" className="mt-4" icon={<Plus size={13} />} onClick={() => openModal('new-loan')}>Create First Loan</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Loan ID</th><th>Borrower</th><th>Type</th><th>Principal</th>
                  <th>EMI</th><th>Outstanding</th><th>Progress</th><th>Status</th><th>Risk</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((loan) => {
                  const sc = getLoanStatusColor(loan.status);
                  const rc = getRiskColor(loan.riskLevel);
                  const progress = loan.totalInstallments > 0
                    ? (loan.installmentsPaid / loan.totalInstallments) * 100 : 0;
                  return (
                    <tr key={loan.id}>
                      <td><span className="font-mono text-xs text-blue-600 font-bold">{loan.loanId}</span></td>
                      <td className="font-semibold text-slate-800">{loan.customerName}</td>
                      <td className="text-slate-500">{getLoanTypeLabel(loan.type)}</td>
                      <td className="font-semibold text-slate-700">{formatCurrency(loan.principalAmount, true)}</td>
                      <td className="text-slate-500">{formatCurrency(loan.emiAmount, true)}/mo</td>
                      <td>
                        <span className={loan.status === 'overdue' || loan.status === 'npa' ? 'text-red-600 font-semibold' : 'text-slate-700'}>
                          {formatCurrency(loan.outstandingBalance, true)}
                        </span>
                      </td>
                      <td>
                        <div className="w-20">
                          <ProgressBar value={progress} max={100} size="xs" />
                          <span className="text-xs text-slate-400">{loan.installmentsPaid}/{loan.totalInstallments}</span>
                        </div>
                      </td>
                      <td><Badge variant={statusVariantMap[loan.status] || 'gray'}>{sc.label}</Badge></td>
                      <td><span className={`text-xs font-bold ${rc.text}`}>{loan.riskLevel.charAt(0).toUpperCase() + loan.riskLevel.slice(1)}</span></td>
                      <td>
                        <div className="flex gap-1">
                          {loan.status === 'pending_approval'
                            ? <Button variant="success" size="xs" icon={<CheckCircle2 size={10} />} onClick={() => handleApprove(loan.id)}>Approve</Button>
                            : loan.status === 'npa'
                            ? <Button variant="danger" size="xs" icon={<ShieldAlert size={10} />}>Escalate</Button>
                            : <Button variant="secondary" size="xs" icon={<Eye size={10} />} onClick={() => openModal('loan-detail')}>View</Button>
                          }
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} of {loans.length} loans</span>
          <span>{loading && <RefreshCw size={12} className="animate-spin inline mr-1" />}Live data from Firebase</span>
        </div>
      </TableCard>
    </div>
  );
};
