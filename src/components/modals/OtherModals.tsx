import React, { useState } from 'react';
import { UserSquare2, Zap, CreditCard, CheckCircle2, Users, PiggyBank, BarChart3, FileText, Shield, AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input, Select, FormRow } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/appStore';
import { createEmployee } from '../../services/firestoreService';
import { createAuditLog } from '../../services/firestoreService';
import toast from 'react-hot-toast';
import type { ActivePage, ModalType } from '../../types';

export const NewEmployeeModal: React.FC = () => {
  const { activeModal, closeModal, currentUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'field_officer', branch: 'Head Office', department: 'Collections', salary: '' });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email) { toast.error('Name and email required'); return; }
    setLoading(true);
    try {
      const empId = `E-${Date.now().toString().slice(-4)}`;
      await createEmployee({
        employeeId: empId, name: form.name, email: form.email, phone: form.phone,
        role: form.role as any, department: form.department, branch: form.branch, branchId: 'main',
        joinDate: new Date().toISOString().split('T')[0], salary: Number(form.salary) || 0,
        isActive: true, assignedBorrowers: 0, collectionTarget: 0,
        collectionAchieved: 0, collectionRate: 0, thisMonthCollection: 0, performanceScore: 0,
      });
      await createAuditLog({ userId: currentUser?.id || '', userName: currentUser?.email || '', userRole: currentUser?.role || '', action: 'CREATE', entity: 'Employee', description: `New employee added — ${form.name} (${empId})`, ipAddress: 'Browser', result: 'success' });
      toast.success(`${form.name} added successfully!`);
      closeModal();
      setForm({ name: '', email: '', phone: '', role: 'field_officer', branch: 'Head Office', department: 'Collections', salary: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={activeModal === 'new-employee'} onClose={closeModal}
      title="Add New Employee" subtitle="Create employee record in Firebase" icon={<UserSquare2 size={16} />} size="md"
      footer={<><Button variant="secondary" size="sm" onClick={closeModal}>Cancel</Button><Button variant="primary" size="sm" loading={loading} onClick={handleSubmit}>Add Employee</Button></>}>
      <div className="space-y-3">
        <FormRow><Input label="Full Name *" placeholder="Employee name" value={form.name} onChange={set('name')} /><Input label="Email *" type="email" placeholder="name@novapay.in" value={form.email} onChange={set('email')} /></FormRow>
        <FormRow><Input label="Phone" placeholder="10-digit number" value={form.phone} onChange={set('phone')} /><Input label="Monthly Salary (₹)" type="number" value={form.salary} onChange={set('salary')} /></FormRow>
        <FormRow>
          <Select label="Role *" value={form.role} onChange={set('role')} options={[{ value: 'field_officer', label: 'Field Officer' }, { value: 'loan_officer', label: 'Loan Officer' }, { value: 'branch_manager', label: 'Branch Manager' }, { value: 'accountant', label: 'Accountant' }, { value: 'auditor', label: 'Auditor' }]} />
          <Select label="Department" value={form.department} onChange={set('department')} options={[{ value: 'Collections', label: 'Collections' }, { value: 'Credit', label: 'Credit' }, { value: 'Finance', label: 'Finance' }, { value: 'Management', label: 'Management' }]} />
        </FormRow>
        <Input label="Branch" value={form.branch} onChange={set('branch')} />
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700">✉ Employee will be saved to Firestore. Send them a login invite from Firebase Console.</div>
      </div>
    </Modal>
  );
};

interface QuickAction {
  label: string; icon: React.ReactNode; color: string; bg: string;
  modal?: ModalType; page?: ActivePage; desc: string;
}

export const QuickActionModal: React.FC = () => {
  const { activeModal, closeModal, openModal, setActivePage } = useAppStore();

  const actions: QuickAction[] = [
    { label: 'New Loan', desc: 'Apply for a loan', icon: <CreditCard size={20} />, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100', modal: 'new-loan' },
    { label: 'Collect EMI', desc: 'Record a payment', icon: <CheckCircle2 size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100', modal: 'collect-payment' },
    { label: 'Add Customer', desc: 'Register borrower', icon: <Users size={20} />, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200 hover:bg-violet-100', modal: 'new-customer' },
    { label: 'Open Deposit', desc: 'New deposit account', icon: <PiggyBank size={20} />, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200 hover:bg-amber-100', modal: 'new-deposit' },
    { label: 'Analytics', desc: 'Business insights', icon: <BarChart3 size={20} />, color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200 hover:bg-teal-100', page: 'analytics' },
    { label: 'Recovery', desc: 'Overdue accounts', icon: <AlertTriangle size={20} />, color: 'text-red-600', bg: 'bg-red-50 border-red-200 hover:bg-red-100', page: 'recovery' },
    { label: 'Reports', desc: 'Download reports', icon: <FileText size={20} />, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100', page: 'reports' },
    { label: 'KYC Review', desc: 'Verify identities', icon: <Shield size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100', page: 'kyc' },
  ];

  const handleAction = (action: QuickAction) => {
    closeModal();
    setTimeout(() => { if (action.modal) openModal(action.modal); else if (action.page) setActivePage(action.page); }, 150);
  };

  return (
    <Modal isOpen={activeModal === 'quick-action'} onClose={closeModal}
      title="Quick Actions" subtitle="What would you like to do?" icon={<Zap size={16} />} size="md">
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map(action => (
          <button key={action.label} onClick={() => handleAction(action)}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-150 text-left group ${action.bg}`}>
            <div className={`${action.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>{action.icon}</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800">{action.label}</p>
              <p className="text-xs text-slate-500">{action.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
};
