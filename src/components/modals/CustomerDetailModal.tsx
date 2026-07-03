import React from 'react';
import { Users, Phone, MapPin, Star } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { ProgressBar } from '../ui/ProgressBar';
import { useAppStore } from '../../store/appStore';
import { mockCustomers, mockLoans, mockDeposits } from '../../data/mockData';
import {
  formatCurrency, getKYCColor, getRiskColor, getCreditScoreColor, getCreditScoreLabel,
} from '../../lib/utils';

export const CustomerDetailModal: React.FC = () => {
  const { activeModal, closeModal } = useAppStore();
  const customer = mockCustomers[0];
  if (!customer) return null;

  const loans = mockLoans.filter(l => l.customerId === customer.id);
  const deposit = mockDeposits.find(d => d.customerId === customer.id);
  const rc = getRiskColor(customer.riskLevel);
  const kyc = getKYCColor(customer.kycStatus);
  const scoreColor = getCreditScoreColor(customer.creditScore);

  return (
    <Modal
      isOpen={activeModal === 'customer-detail'}
      onClose={closeModal}
      title="Customer Profile"
      subtitle={customer.customerId}
      icon={<Users size={16} />}
      size="xl"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={closeModal}>Close</Button>
          <Button variant="primary" size="sm">Edit Profile</Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Avatar name={customer.name} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-extrabold text-[var(--text-primary)]">{customer.name}</h3>
            <p className="text-[12px] text-[var(--text-muted)]">{customer.occupation} · {customer.address.city}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant={customer.kycStatus === 'verified' ? 'green' : 'amber'}>{kyc.label} KYC</Badge>
              <Badge variant={customer.status === 'active' ? 'green' : 'red'}>{customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}</Badge>
              <Badge variant={customer.riskLevel === 'low' ? 'green' : customer.riskLevel === 'medium' ? 'amber' : 'red'}>{customer.riskLevel.toUpperCase()} Risk</Badge>
            </div>
          </div>
          <div className="text-center flex-shrink-0">
            <div className={`text-[28px] font-black ${scoreColor}`}>{customer.creditScore}</div>
            <p className="text-[10px] text-[var(--text-muted)]">{getCreditScoreLabel(customer.creditScore)}</p>
            <ProgressBar value={customer.creditScore} max={900} size="xs" className="w-20 mt-1" />
          </div>
        </div>

        {/* Contact & info */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {[
            { label: 'Phone', value: customer.phone },
            { label: 'Date of Birth', value: customer.dob },
            { label: 'Aadhaar', value: customer.aadhaar },
            { label: 'PAN', value: customer.pan },
            { label: 'Monthly Income', value: formatCurrency(customer.monthlyIncome) },
            { label: 'Member Since', value: customer.joinedAt.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) },
          ].map(item => (
            <div key={item.label} className="flex justify-between py-2 border-b border-[var(--border)]">
              <span className="text-[11.5px] text-[var(--text-muted)]">{item.label}</span>
              <span className="text-[11.5px] font-semibold text-[var(--text-primary)]">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 p-3 bg-[var(--bg-card2)] rounded-xl border border-[var(--border)]">
          <MapPin size={13} className="text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
          <p className="text-[12px] text-[var(--text-secondary)]">
            {customer.address.line1}, {customer.address.city}, {customer.address.state} — {customer.address.pincode}
          </p>
        </div>

        {/* Loan summary */}
        {loans.length > 0 && (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)] mb-2">Active Loans</p>
            {loans.map(loan => (
              <div key={loan.id} className="flex items-center justify-between p-3 bg-[var(--bg-card2)] rounded-xl border border-[var(--border)] mb-2">
                <div>
                  <p className="text-[12px] font-bold text-blue-400">{loan.loanId}</p>
                  <p className="text-[10.5px] text-[var(--text-muted)]">{loan.type} · ₹{loan.principalAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold text-rose-400">{formatCurrency(loan.outstandingBalance, true)} due</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{loan.installmentsPaid}/{loan.totalInstallments} EMIs</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Financials summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Borrowed', value: formatCurrency(customer.totalBorrowed, true), color: 'text-blue-400' },
            { label: 'Total Repaid', value: formatCurrency(customer.totalRepaid, true), color: 'text-emerald-400' },
            { label: 'Deposit Balance', value: deposit ? formatCurrency(deposit.currentBalance, true) : '—', color: 'text-violet-400' },
          ].map(item => (
            <div key={item.label} className="p-3 bg-[var(--bg-card2)] rounded-xl border border-[var(--border)] text-center">
              <p className="text-[10px] text-[var(--text-muted)] mb-1">{item.label}</p>
              <p className={`text-[14px] font-extrabold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
