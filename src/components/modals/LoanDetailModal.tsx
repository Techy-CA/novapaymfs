import React from 'react';
import { CreditCard, TrendingDown, Calendar, User, IndianRupee } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { useAppStore } from '../../store/appStore';
import { mockLoans } from '../../data/mockData';
import { formatCurrency, getLoanStatusColor, getRiskColor, getLoanTypeLabel } from '../../lib/utils';

export const LoanDetailModal: React.FC = () => {
  const { activeModal, closeModal } = useAppStore();
  const loan = mockLoans[0]; // Demo: show first loan
  if (!loan) return null;

  const sc = getLoanStatusColor(loan.status);
  const rc = getRiskColor(loan.riskLevel);
  const progress = (loan.installmentsPaid / loan.totalInstallments) * 100;

  return (
    <Modal
      isOpen={activeModal === 'loan-detail'}
      onClose={closeModal}
      title={`Loan ${loan.loanId}`}
      subtitle={`${getLoanTypeLabel(loan.type)} — ${loan.customerName}`}
      icon={<CreditCard size={16} />}
      size="xl"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={closeModal}>Close</Button>
          <Button variant="primary" size="sm">Download Statement</Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Status row */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={loan.status === 'active' ? 'green' : loan.status === 'overdue' ? 'amber' : loan.status === 'npa' ? 'red' : 'blue'}>
            {sc.label}
          </Badge>
          <Badge variant={loan.riskLevel === 'low' ? 'green' : loan.riskLevel === 'medium' ? 'amber' : 'red'}>
            {loan.riskLevel.toUpperCase()} RISK
          </Badge>
          <span className="text-[11px] text-[var(--text-muted)]">Credit Score: <strong className={rc.text}>{loan.creditScore}</strong></span>
          <span className="text-[11px] text-[var(--text-muted)]">DPD: <strong className={loan.dpd > 0 ? 'text-rose-400' : 'text-emerald-400'}>{loan.dpd} days</strong></span>
        </div>

        {/* Key financials */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Principal', value: formatCurrency(loan.principalAmount, true), color: 'text-[var(--text-primary)]' },
            { label: 'Outstanding', value: formatCurrency(loan.outstandingBalance, true), color: 'text-rose-400' },
            { label: 'EMI Amount', value: formatCurrency(loan.emiAmount, true), color: 'text-blue-400' },
            { label: 'Total Paid', value: formatCurrency(loan.totalPaid, true), color: 'text-emerald-400' },
          ].map(item => (
            <div key={item.label} className="p-3 bg-[var(--bg-card2)] rounded-xl border border-[var(--border)] text-center">
              <p className="text-[10px] text-[var(--text-muted)] mb-1">{item.label}</p>
              <p className={`text-[14px] font-extrabold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-2">
            <span>Repayment Progress</span>
            <span>{loan.installmentsPaid} of {loan.totalInstallments} EMIs paid</span>
          </div>
          <ProgressBar value={progress} max={100} size="md" showLabel />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
          {[
            { label: 'Interest Rate', value: `${loan.interestRate}% p.a.` },
            { label: 'Tenure', value: `${loan.tenure} months` },
            { label: 'Disbursement Date', value: loan.disbursementDate || '—' },
            { label: 'Next Due Date', value: loan.nextDueDate || '—' },
            { label: 'Processing Fee', value: formatCurrency(loan.processingFee) },
            { label: 'Penalty Amount', value: loan.penaltyAmount > 0 ? formatCurrency(loan.penaltyAmount) : '—' },
            { label: 'Approved By', value: loan.approvedBy || '—' },
            { label: 'Field Officer', value: 'Amit Kumar' },
          ].map(item => (
            <div key={item.label} className="flex justify-between py-2 border-b border-[var(--border)]">
              <span className="text-[11.5px] text-[var(--text-muted)]">{item.label}</span>
              <span className="text-[11.5px] font-semibold text-[var(--text-primary)]">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Purpose */}
        <div className="p-3 bg-[var(--bg-card2)] rounded-xl border border-[var(--border)]">
          <p className="text-[10.5px] text-[var(--text-muted)] mb-1">Loan Purpose</p>
          <p className="text-[12.5px] text-[var(--text-secondary)]">{loan.purpose}</p>
        </div>
      </div>
    </Modal>
  );
};
