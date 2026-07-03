import type { RiskLevel, LoanStatus, KYCStatus, DepositType, RecoveryStage, LoanType, PaymentMethod, CollectionStatus } from '../types';

// ─── Formatting ──────────────────────────────────────────────────────────

export function formatCurrency(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-IN', {
    day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return formatDate(date);
}

// ─── Status Colors ────────────────────────────────────────────────────────

export function getRiskColor(risk: RiskLevel) {
  const map: Record<RiskLevel, { text: string; bg: string; dot: string }> = {
    low: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' },
    medium: { text: 'text-amber-400', bg: 'bg-amber-400/10', dot: 'bg-amber-400' },
    high: { text: 'text-rose-400', bg: 'bg-rose-400/10', dot: 'bg-rose-400' },
    critical: { text: 'text-rose-500', bg: 'bg-rose-500/15', dot: 'bg-rose-500' },
  };
  return map[risk];
}

export function getLoanStatusColor(status: LoanStatus) {
  const map: Record<LoanStatus, { text: string; bg: string; label: string }> = {
    draft: { text: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Draft' },
    pending_approval: { text: 'text-violet-400', bg: 'bg-violet-400/10', label: 'Pending' },
    approved: { text: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Approved' },
    disbursed: { text: 'text-teal-400', bg: 'bg-teal-400/10', label: 'Disbursed' },
    active: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Active' },
    overdue: { text: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Overdue' },
    npa: { text: 'text-rose-400', bg: 'bg-rose-400/10', label: 'NPA' },
    closed: { text: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Closed' },
    written_off: { text: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Written Off' },
  };
  return map[status];
}

export function getKYCColor(status: KYCStatus) {
  const map: Record<KYCStatus, { text: string; bg: string; label: string }> = {
    pending: { text: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Pending' },
    verified: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Verified' },
    rejected: { text: 'text-rose-400', bg: 'bg-rose-400/10', label: 'Rejected' },
    expired: { text: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Expired' },
  };
  return map[status];
}

export function getCollectionStatusColor(status: CollectionStatus) {
  const map: Record<CollectionStatus, { text: string; bg: string; label: string; icon: string }> = {
    collected: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Collected', icon: '✓' },
    missed: { text: 'text-rose-400', bg: 'bg-rose-400/10', label: 'Missed', icon: '✗' },
    partial: { text: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Partial', icon: '~' },
    pending: { text: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Pending', icon: '○' },
    holiday: { text: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Holiday', icon: '—' },
  };
  return map[status];
}

export function getRecoveryStageLabel(stage: RecoveryStage): string {
  const map: Record<RecoveryStage, string> = {
    early_warning: 'Early Warning',
    soft_recovery: 'Soft Recovery',
    npa_stage1: 'NPA Stage 1',
    npa_stage2: 'NPA Stage 2',
    legal: 'Legal',
    written_off: 'Written Off',
  };
  return map[stage];
}

export function getRecoveryStageColor(stage: RecoveryStage) {
  const map: Record<RecoveryStage, { text: string; bg: string }> = {
    early_warning: { text: 'text-blue-400', bg: 'bg-blue-400/10' },
    soft_recovery: { text: 'text-amber-400', bg: 'bg-amber-400/10' },
    npa_stage1: { text: 'text-rose-400', bg: 'bg-rose-400/10' },
    npa_stage2: { text: 'text-rose-500', bg: 'bg-rose-500/15' },
    legal: { text: 'text-violet-400', bg: 'bg-violet-400/10' },
    written_off: { text: 'text-gray-500', bg: 'bg-gray-500/10' },
  };
  return map[stage];
}

export function getLoanTypeLabel(type: LoanType): string {
  const map: Record<LoanType, string> = {
    business: 'Business',
    agriculture: 'Agriculture',
    education: 'Education',
    emergency: 'Emergency',
    housing: 'Housing',
    vehicle: 'Vehicle',
    personal: 'Personal',
  };
  return map[type];
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  const map: Record<PaymentMethod, string> = {
    cash: 'Cash',
    upi: 'UPI',
    neft: 'NEFT',
    rtgs: 'RTGS',
    cheque: 'Cheque',
    bank_transfer: 'Bank Transfer',
  };
  return map[method];
}

export function getDepositTypeLabel(type: DepositType): string {
  const map: Record<DepositType, string> = {
    savings: 'Savings',
    fixed: 'Fixed Deposit',
    recurring: 'Recurring',
    current: 'Current',
  };
  return map[type];
}

// ─── Credit Score ─────────────────────────────────────────────────────────

export function getCreditScoreColor(score: number): string {
  if (score >= 750) return 'text-emerald-400';
  if (score >= 650) return 'text-blue-400';
  if (score >= 550) return 'text-amber-400';
  return 'text-rose-400';
}

export function getCreditScoreLabel(score: number): string {
  if (score >= 750) return 'Excellent';
  if (score >= 650) return 'Good';
  if (score >= 550) return 'Fair';
  return 'Poor';
}

// ─── Calculations ─────────────────────────────────────────────────────────

export function calculateEMI(principal: number, rate: number, months: number): number {
  const r = rate / 100 / 12;
  if (r === 0) return principal / months;
  return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
}

export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ─── Avatar Colors ────────────────────────────────────────────────────────

const avatarGradients = [
  'from-blue-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-rose-500',
  'from-violet-500 to-pink-600',
  'from-teal-500 to-blue-600',
  'from-rose-500 to-amber-500',
];

export function getAvatarGradient(name: string): string {
  const idx = name.charCodeAt(0) % avatarGradients.length;
  return avatarGradients[idx];
}
