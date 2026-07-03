import React, { useState } from 'react';
import { CreditCard, IndianRupee } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input, Select, FormRow } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/appStore';
import { createLoan } from '../../services/loanService';
import { createAuditLog } from '../../services/firestoreService';
import { calculateEMI } from '../../lib/utils';
import toast from 'react-hot-toast';
import type { LoanType, RepaymentFrequency, LoanStatus, RiskLevel } from '../../types';

export const NewLoanModal: React.FC = () => {
  const { activeModal, closeModal, currentUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '', customerId: '', type: 'business', purpose: '',
    amount: '', rate: '18', tenure: '12', frequency: 'monthly',
  });

  const emi = form.amount && form.rate && form.tenure
    ? calculateEMI(Number(form.amount), Number(form.rate), Number(form.tenure)) : 0;

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.customerName || !form.amount) { toast.error('Customer name and amount required'); return; }
    setLoading(true);
    try {
      const principal = Number(form.amount);
      const loanId = `L-${Date.now().toString().slice(-6)}`;
      await createLoan({
        loanId,
        customerId: form.customerId || '',
        customerName: form.customerName,
        type: form.type as LoanType,
        purpose: form.purpose,
        principalAmount: principal,
        disbursedAmount: 0,
        outstandingBalance: principal,
        interestRate: Number(form.rate),
        processingFee: Math.round(principal * 0.01),
        tenure: Number(form.tenure),
        repaymentFrequency: form.frequency as RepaymentFrequency,
        emiAmount: emi,
        status: 'pending_approval' as LoanStatus,
        dpd: 0,
        totalPaid: 0,
        totalInterestPaid: 0,
        penaltyAmount: 0,
        installmentsPaid: 0,
        totalInstallments: Number(form.tenure),
        fieldOfficerId: currentUser?.id || '',
        branchId: currentUser?.branch || 'main',
        creditScore: 650,
        riskLevel: 'medium' as RiskLevel,
      });

      await createAuditLog({
        userId: currentUser?.id || '',
        userName: currentUser?.email || '',
        userRole: currentUser?.role || '',
        action: 'CREATE',
        entity: 'Loan',
        description: `New loan application ${loanId} — ₹${principal.toLocaleString('en-IN')} for ${form.customerName}`,
        ipAddress: 'Browser',
        result: 'success',
      });

      toast.success(`Loan application ${loanId} submitted for approval!`);
      closeModal();
      setForm({ customerName: '', customerId: '', type: 'business', purpose: '', amount: '', rate: '18', tenure: '12', frequency: 'monthly' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={activeModal === 'new-loan'} onClose={closeModal}
      title="New Loan Application" subtitle="Submit for branch manager approval"
      icon={<CreditCard size={16} />} size="lg"
      footer={<><Button variant="secondary" size="sm" onClick={closeModal}>Cancel</Button><Button variant="primary" size="sm" loading={loading} onClick={handleSubmit}>Submit Application</Button></>}>
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700">
          Loan will be saved to Firebase with <strong>Pending Approval</strong> status.
        </div>
        <FormRow>
          <Input label="Customer Name *" placeholder="Full name" value={form.customerName} onChange={set('customerName')} />
          <Input label="Customer ID" placeholder="C-XXXX (optional)" value={form.customerId} onChange={set('customerId')} />
        </FormRow>
        <FormRow>
          <Select label="Loan Type *" value={form.type} onChange={set('type')} options={[
            { value: 'business', label: 'Business Loan' }, { value: 'agriculture', label: 'Agriculture Loan' },
            { value: 'education', label: 'Education Loan' }, { value: 'emergency', label: 'Emergency Loan' },
            { value: 'housing', label: 'Housing Loan' }, { value: 'personal', label: 'Personal Loan' },
          ]} />
          <Input label="Principal Amount (₹) *" type="number" placeholder="50000" prefix={<IndianRupee size={12} />} value={form.amount} onChange={set('amount')} />
        </FormRow>
        <Input label="Purpose / Description" placeholder="Describe the loan purpose..." value={form.purpose} onChange={set('purpose')} />
        <FormRow cols={3}>
          <Input label="Interest Rate (% p.a.)" type="number" placeholder="18" value={form.rate} onChange={set('rate')} />
          <Input label="Tenure (Months)" type="number" placeholder="12" value={form.tenure} onChange={set('tenure')} />
          <Select label="Repayment" value={form.frequency} onChange={set('frequency')} options={[
            { value: 'monthly', label: 'Monthly' }, { value: 'weekly', label: 'Weekly' }, { value: 'daily', label: 'Daily' },
          ]} />
        </FormRow>
        {emi > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Monthly EMI', value: `₹${emi.toLocaleString('en-IN')}`, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
              { label: 'Total Repayment', value: `₹${(emi * Number(form.tenure)).toLocaleString('en-IN')}`, color: 'text-slate-800', bg: 'bg-slate-50 border-slate-200' },
              { label: 'Total Interest', value: `₹${(emi * Number(form.tenure) - Number(form.amount)).toLocaleString('en-IN')}`, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
            ].map(item => (
              <div key={item.label} className={`p-3 ${item.bg} rounded-xl border text-center`}>
                <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                <p className={`text-sm font-extrabold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
