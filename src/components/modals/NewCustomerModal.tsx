import React, { useState } from 'react';
import { Users, Upload } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input, Select, FormRow, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/appStore';
import { createCustomer } from '../../services/customerService';
import { createAuditLog } from '../../services/firestoreService';
import toast from 'react-hot-toast';

export const NewCustomerModal: React.FC = () => {
  const { activeModal, closeModal, currentUser } = useAppStore();
  const [tab, setTab] = useState<'personal' | 'address' | 'kyc'>('personal');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', altPhone: '', email: '', dob: '', gender: 'female',
    occupation: '', income: '', line1: '', city: '', state: 'MP', pincode: '',
    aadhaar: '', pan: '', notes: '',
  });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone) { toast.error('Name and phone required'); return; }
    setLoading(true);
    try {
      const custId = `C-${Date.now().toString().slice(-5)}`;
      await createCustomer({
        customerId: custId, name: form.name, phone: form.phone, altPhone: form.altPhone,
        email: form.email, dob: form.dob, gender: form.gender as any,
        address: { line1: form.line1, city: form.city, state: form.state, pincode: form.pincode },
        aadhaar: form.aadhaar, pan: form.pan,
        kycStatus: 'pending', creditScore: 650, riskLevel: 'medium', status: 'active',
        occupation: form.occupation, monthlyIncome: Number(form.income) || 0,
        activeLoans: 0, totalBorrowed: 0, totalRepaid: 0,
        fieldOfficerId: currentUser?.id || '', branchId: currentUser?.branch || 'main',
        notes: form.notes,
      });
      await createAuditLog({
        userId: currentUser?.id || '', userName: currentUser?.email || '', userRole: currentUser?.role || '',
        action: 'CREATE', entity: 'Customer',
        description: `New customer registered — ${form.name} (${custId})`,
        ipAddress: 'Browser', result: 'success',
      });
      toast.success(`${form.name} registered successfully!`);
      closeModal();
      setForm({ name: '', phone: '', altPhone: '', email: '', dob: '', gender: 'female', occupation: '', income: '', line1: '', city: '', state: 'MP', pincode: '', aadhaar: '', pan: '', notes: '' });
      setTab('personal');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [{ key: 'personal', label: '1. Personal' }, { key: 'address', label: '2. Address' }, { key: 'kyc', label: '3. KYC' }] as const;

  return (
    <Modal isOpen={activeModal === 'new-customer'} onClose={closeModal}
      title="Register New Customer" subtitle="Add a new borrower to Firebase" icon={<Users size={16} />} size="lg"
      footer={<><Button variant="secondary" size="sm" onClick={closeModal}>Cancel</Button>{tab !== 'kyc' ? <Button variant="secondary" size="sm" onClick={() => setTab(t => t === 'personal' ? 'address' : 'kyc')}>Next →</Button> : <Button variant="primary" size="sm" loading={loading} onClick={handleSubmit}>Register Customer</Button>}</>}>
      <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-xl border border-slate-200">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${tab === t.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t.label}</button>
        ))}
      </div>
      {tab === 'personal' && (
        <div className="space-y-3">
          <FormRow><Input label="Full Name *" placeholder="As per Aadhaar" value={form.name} onChange={set('name')} /><Input label="Mobile *" placeholder="10-digit" value={form.phone} onChange={set('phone')} /></FormRow>
          <FormRow><Input label="Alt. Phone" value={form.altPhone} onChange={set('altPhone')} /><Input label="Email" type="email" value={form.email} onChange={set('email')} /></FormRow>
          <FormRow><Input label="Date of Birth" type="date" value={form.dob} onChange={set('dob')} /><Select label="Gender" value={form.gender} onChange={set('gender')} options={[{ value: 'female', label: 'Female' }, { value: 'male', label: 'Male' }, { value: 'other', label: 'Other' }]} /></FormRow>
          <FormRow><Input label="Occupation" placeholder="e.g. Small Business" value={form.occupation} onChange={set('occupation')} /><Input label="Monthly Income (₹)" type="number" value={form.income} onChange={set('income')} /></FormRow>
          <Textarea label="Notes" placeholder="Additional notes..." value={form.notes} onChange={set('notes')} />
        </div>
      )}
      {tab === 'address' && (
        <div className="space-y-3">
          <Input label="Address Line 1 *" placeholder="House / Shop / Street" value={form.line1} onChange={set('line1')} />
          <FormRow cols={3}><Input label="City *" value={form.city} onChange={set('city')} /><Input label="State *" value={form.state} onChange={set('state')} /><Input label="Pincode *" placeholder="6 digits" value={form.pincode} onChange={set('pincode')} /></FormRow>
          {form.line1 && <div className="p-3 rounded-xl border border-slate-200 bg-slate-50"><p className="text-xs text-slate-500 mb-1">Preview</p><p className="text-sm text-slate-800">{[form.line1, form.city, form.state, form.pincode].filter(Boolean).join(', ')}</p></div>}
        </div>
      )}
      {tab === 'kyc' && (
        <div className="space-y-3">
          <FormRow><Input label="Aadhaar Number *" placeholder="XXXX-XXXX-XXXX" value={form.aadhaar} onChange={set('aadhaar')} /><Input label="PAN Number *" placeholder="ABCDE1234F" value={form.pan} onChange={set('pan')} /></FormRow>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {['Aadhaar Card', 'PAN Card', 'Passport Photo', 'Address Proof'].map(doc => (
              <div key={doc} className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
                <Upload size={18} className="mx-auto mb-2 text-slate-400 group-hover:text-blue-500" />
                <p className="text-xs font-semibold text-slate-600">{doc}</p>
                <p className="text-xs text-slate-400 mt-0.5">Click to upload</p>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">✓ KYC status set to Pending. Branch manager can verify after document review.</div>
        </div>
      )}
    </Modal>
  );
};
