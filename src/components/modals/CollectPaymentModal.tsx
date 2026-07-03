import React, { useState } from 'react';
import { CheckCircle2, IndianRupee } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/appStore';
import { createCollection } from '../../services/firestoreService';
import { createAuditLog } from '../../services/firestoreService';
import toast from 'react-hot-toast';
import type { PaymentMethod, CollectionStatus } from '../../types';

export const CollectPaymentModal: React.FC = () => {
  const { activeModal, closeModal, currentUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    loanNumber: '', customerName: '', scheduledAmount: '', collectedAmount: '',
    method: 'cash', reference: '',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.customerName || !form.collectedAmount) { toast.error('Fill all required fields'); return; }
    setLoading(true);
    try {
      const collected = Number(form.collectedAmount);
      const scheduled = Number(form.scheduledAmount) || collected;
      const isPartial = collected < scheduled;
      const status: CollectionStatus = collected === 0 ? 'missed' : isPartial ? 'partial' : 'collected';
      const colId = `COL-${Date.now().toString().slice(-6)}`;

      await createCollection({
        collectionId: colId,
        loanId: '',
        loanNumber: form.loanNumber || 'MANUAL',
        customerId: '',
        customerName: form.customerName,
        scheduledAmount: scheduled,
        collectedAmount: collected,
        penaltyAmount: 0,
        totalAmount: collected,
        paymentMethod: form.method as PaymentMethod,
        referenceNumber: form.reference,
        collectedBy: currentUser?.name || 'Unknown',
        collectionDate: new Date().toISOString().split('T')[0],
        collectionTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        status,
        receiptNumber: `RCT-${Date.now().toString().slice(-5)}`,
        branchId: currentUser?.branch || 'main',
        installmentNo: 0,
      });

      await createAuditLog({
        userId: currentUser?.id || '',
        userName: currentUser?.email || '',
        userRole: currentUser?.role || '',
        action: 'CREATE',
        entity: 'Collection',
        description: `Collection recorded — ₹${collected.toLocaleString('en-IN')} from ${form.customerName}`,
        ipAddress: 'Browser',
        result: 'success',
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        closeModal();
        setForm({ loanNumber: '', customerName: '', scheduledAmount: '', collectedAmount: '', method: 'cash', reference: '' });
        toast.success(`₹${collected.toLocaleString('en-IN')} collected from ${form.customerName}`);
      }, 1600);
    } catch (err: any) {
      toast.error(err.message || 'Failed to record collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={activeModal === 'collect-payment'} onClose={closeModal}
      title="Record EMI Collection" subtitle="Log a payment received from borrower"
      icon={<CheckCircle2 size={16} />} size="md"
      footer={!success ? <><Button variant="secondary" size="sm" onClick={closeModal}>Cancel</Button><Button variant="success" size="sm" loading={loading} onClick={handleSubmit}>Confirm Collection</Button></> : undefined}>
      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <p className="text-base font-bold text-emerald-600 mb-1">Payment Recorded!</p>
          <p className="text-sm text-slate-500">Saved to Firebase successfully</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Input label="Customer Name *" placeholder="Borrower name" value={form.customerName} onChange={set('customerName')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Loan Number" placeholder="L-XXXX" value={form.loanNumber} onChange={set('loanNumber')} />
            <Input label="Scheduled Amount (₹)" type="number" placeholder="5000" prefix={<IndianRupee size={12} />} value={form.scheduledAmount} onChange={set('scheduledAmount')} />
          </div>
          <Input label="Collected Amount (₹) *" type="number" placeholder="Amount received" prefix={<IndianRupee size={12} />} value={form.collectedAmount} onChange={set('collectedAmount')} />
          <Select label="Payment Method" value={form.method} onChange={set('method')} options={[
            { value: 'cash', label: 'Cash' }, { value: 'upi', label: 'UPI' },
            { value: 'neft', label: 'NEFT' }, { value: 'rtgs', label: 'RTGS' }, { value: 'cheque', label: 'Cheque' },
          ]} />
          {form.method !== 'cash' && (
            <Input label="Reference / Transaction No." placeholder="UTR / UPI Ref" value={form.reference} onChange={set('reference')} />
          )}
          {form.collectedAmount && form.scheduledAmount && Number(form.collectedAmount) < Number(form.scheduledAmount) && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
              ⚠ Partial payment — balance ₹{(Number(form.scheduledAmount) - Number(form.collectedAmount)).toLocaleString('en-IN')} will remain outstanding.
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
