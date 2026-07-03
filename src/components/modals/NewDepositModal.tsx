import React, { useState } from 'react';
import { PiggyBank, IndianRupee } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input, Select, FormRow } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/appStore';
import { createDeposit } from '../../services/firestoreService';
import { createAuditLog } from '../../services/firestoreService';
import toast from 'react-hot-toast';
import type { DepositType, DepositStatus } from '../../types';

export const NewDepositModal: React.FC = () => {
  const { activeModal, closeModal, currentUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customerName: '', type: 'savings', amount: '', rate: '4', tenure: '', nominee: '', openDate: new Date().toISOString().split('T')[0] });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  const rateMap: Record<string, string> = { savings: '4', fixed: '8.5', recurring: '6.5', current: '0' };

  const maturityAmount = form.amount && form.rate && form.tenure
    ? Number(form.amount) * Math.pow(1 + Number(form.rate) / 100, Number(form.tenure) / 12) : 0;

  const handleSubmit = async () => {
    if (!form.customerName || !form.amount) { toast.error('Customer and amount required'); return; }
    setLoading(true);
    try {
      const accNum = `D-${Date.now().toString().slice(-5)}`;
      await createDeposit({
        accountNumber: accNum, customerId: '', customerName: form.customerName,
        type: form.type as DepositType, principalAmount: Number(form.amount),
        currentBalance: Number(form.amount), interestRate: Number(form.rate),
        tenure: form.tenure ? Number(form.tenure) : undefined,
        openDate: form.openDate,
        maturityDate: form.tenure ? (() => { const d = new Date(form.openDate); d.setMonth(d.getMonth() + Number(form.tenure)); return d.toISOString().split('T')[0]; })() : undefined,
        nomineeName: form.nominee, status: 'active' as DepositStatus,
        accruedInterest: 0, totalInterestPaid: 0, branchId: currentUser?.branch || 'main',
      });
      await createAuditLog({ userId: currentUser?.id || '', userName: currentUser?.email || '', userRole: currentUser?.role || '', action: 'CREATE', entity: 'Deposit', description: `Deposit account opened — ${accNum} for ${form.customerName}`, ipAddress: 'Browser', result: 'success' });
      toast.success(`Deposit account ${accNum} opened for ${form.customerName}`);
      closeModal();
      setForm({ customerName: '', type: 'savings', amount: '', rate: '4', tenure: '', nominee: '', openDate: new Date().toISOString().split('T')[0] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to open account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={activeModal === 'new-deposit'} onClose={closeModal}
      title="Open Deposit Account" subtitle="Save to Firebase immediately" icon={<PiggyBank size={16} />} size="md"
      footer={<><Button variant="secondary" size="sm" onClick={closeModal}>Cancel</Button><Button variant="primary" size="sm" loading={loading} onClick={handleSubmit}>Open Account</Button></>}>
      <div className="space-y-3">
        <Input label="Customer Name *" placeholder="Search or enter name" value={form.customerName} onChange={set('customerName')} />
        <FormRow>
          <Select label="Account Type *" value={form.type} onChange={e => { setForm(f => ({ ...f, type: e.target.value, rate: rateMap[e.target.value] || '4' })); }} options={[{ value: 'savings', label: 'Savings Account' }, { value: 'fixed', label: 'Fixed Deposit (FD)' }, { value: 'recurring', label: 'Recurring (RD)' }, { value: 'current', label: 'Current Account' }]} />
          <Input label="Amount (₹) *" type="number" placeholder="10000" prefix={<IndianRupee size={12} />} value={form.amount} onChange={set('amount')} />
        </FormRow>
        <FormRow>
          <Input label="Interest Rate (% p.a.)" type="number" value={form.rate} onChange={set('rate')} />
          {(form.type === 'fixed' || form.type === 'recurring') && <Input label="Tenure (Months)" type="number" placeholder="12" value={form.tenure} onChange={set('tenure')} />}
        </FormRow>
        <FormRow><Input label="Opening Date" type="date" value={form.openDate} onChange={set('openDate')} /><Input label="Nominee Name" placeholder="Optional" value={form.nominee} onChange={set('nominee')} /></FormRow>
        {maturityAmount > 0 && form.tenure && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <p className="text-xs text-emerald-600 mb-1">Maturity Amount</p>
              <p className="text-base font-extrabold text-emerald-700">₹{Math.round(maturityAmount).toLocaleString('en-IN')}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
              <p className="text-xs text-blue-600 mb-1">Interest Earned</p>
              <p className="text-base font-extrabold text-blue-700">₹{Math.round(maturityAmount - Number(form.amount)).toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
