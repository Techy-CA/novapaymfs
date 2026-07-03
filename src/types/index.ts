// ─── Core Entity Types ───────────────────────────────────────────────────────

export type UserRole =
  | 'ceo'
  | 'branch_manager'
  | 'loan_officer'
  | 'field_officer'
  | 'accountant'
  | 'auditor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch: string;
  avatar?: string;
  phone?: string;
  employeeId: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

// ─── Customer ────────────────────────────────────────────────────────────────

export type CustomerStatus = 'active' | 'inactive' | 'blacklisted' | 'deceased';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type KYCStatus = 'pending' | 'verified' | 'rejected' | 'expired';

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Customer {
  id: string;
  customerId: string;
  name: string;
  phone: string;
  altPhone?: string;
  email?: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  address: Address;
  aadhaar: string;
  pan: string;
  kycStatus: KYCStatus;
  creditScore: number;
  riskLevel: RiskLevel;
  status: CustomerStatus;
  occupation: string;
  monthlyIncome: number;
  activeLoans: number;
  totalBorrowed: number;
  totalRepaid: number;
  joinedAt: Date;
  fieldOfficerId: string;
  branchId: string;
  photo?: string;
  guarantors?: Guarantor[];
  notes?: string;
}

export interface Guarantor {
  name: string;
  phone: string;
  relationship: string;
  aadhaar: string;
  address: Address;
}

// ─── Loan ────────────────────────────────────────────────────────────────────

export type LoanStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'disbursed'
  | 'active'
  | 'overdue'
  | 'npa'
  | 'closed'
  | 'written_off';

export type LoanType =
  | 'business'
  | 'agriculture'
  | 'education'
  | 'emergency'
  | 'housing'
  | 'vehicle'
  | 'personal';

export type RepaymentFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface LoanScheduleItem {
  installmentNo: number;
  dueDate: string;
  principal: number;
  interest: number;
  totalDue: number;
  paidAmount: number;
  paidDate?: string;
  status: 'pending' | 'paid' | 'partial' | 'overdue' | 'waived';
  penaltyAmount: number;
  balance: number;
}

export interface Loan {
  id: string;
  loanId: string;
  customerId: string;
  customerName: string;
  type: LoanType;
  purpose: string;
  principalAmount: number;
  disbursedAmount: number;
  outstandingBalance: number;
  interestRate: number;
  processingFee: number;
  tenure: number;
  repaymentFrequency: RepaymentFrequency;
  emiAmount: number;
  disbursementDate?: string;
  firstEmiDate?: string;
  closureDate?: string;
  nextDueDate?: string;
  status: LoanStatus;
  dpd: number;
  totalPaid: number;
  totalInterestPaid: number;
  penaltyAmount: number;
  installmentsPaid: number;
  totalInstallments: number;
  schedule?: LoanScheduleItem[];
  approvedBy?: string;
  disbursedBy?: string;
  fieldOfficerId: string;
  branchId: string;
  collateralType?: string;
  collateralValue?: number;
  creditScore: number;
  riskLevel: RiskLevel;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  insuranceCoverage?: number;
}

// ─── Collection ───────────────────────────────────────────────────────────────

export type PaymentMethod = 'cash' | 'upi' | 'neft' | 'rtgs' | 'cheque' | 'bank_transfer';
export type CollectionStatus = 'collected' | 'missed' | 'partial' | 'pending' | 'holiday';

export interface Collection {
  id: string;
  collectionId: string;
  loanId: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  scheduledAmount: number;
  collectedAmount: number;
  penaltyAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  collectedBy: string;
  collectionDate: string;
  collectionTime?: string;
  status: CollectionStatus;
  gpsLocation?: { lat: number; lng: number };
  receiptNumber?: string;
  notes?: string;
  branchId: string;
  installmentNo: number;
  createdAt: Date;
}

// ─── Deposit ──────────────────────────────────────────────────────────────────

export type DepositType = 'savings' | 'fixed' | 'recurring' | 'current';
export type DepositStatus = 'active' | 'matured' | 'closed' | 'premature_closed';

export interface Deposit {
  id: string;
  accountNumber: string;
  customerId: string;
  customerName: string;
  type: DepositType;
  principalAmount: number;
  currentBalance: number;
  interestRate: number;
  tenure?: number;
  openDate: string;
  maturityDate?: string;
  lastTransactionDate?: string;
  nomineeName?: string;
  status: DepositStatus;
  accruedInterest: number;
  totalInterestPaid: number;
  branchId: string;
  createdAt: Date;
}

// ─── Employee ─────────────────────────────────────────────────────────────────

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  branch: string;
  branchId: string;
  managerId?: string;
  joinDate: string;
  salary: number;
  isActive: boolean;
  assignedBorrowers: number;
  collectionTarget: number;
  collectionAchieved: number;
  collectionRate: number;
  thisMonthCollection: number;
  performanceScore: number;
  avatar?: string;
}

// ─── Accounting ───────────────────────────────────────────────────────────────

export type TransactionType = 'debit' | 'credit';
export type VoucherType = 'journal' | 'payment' | 'receipt' | 'contra';

export interface LedgerEntry {
  id: string;
  voucherNumber: string;
  voucherType: VoucherType;
  date: string;
  accountCode: string;
  accountName: string;
  description: string;
  debitAmount: number;
  creditAmount: number;
  balance: number;
  referenceId?: string;
  referenceType?: string;
  createdBy: string;
  branchId: string;
  createdAt: Date;
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'LOGIN' | 'LOGOUT' | 'APPROVE' | 'REJECT' | 'EXPORT';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  entity: string;
  entityId?: string;
  description: string;
  ipAddress: string;
  userAgent?: string;
  result: 'success' | 'failed' | 'warning';
  metadata?: Record<string, unknown>;
  timestamp: Date;
  branchId?: string;
}

// ─── Recovery ─────────────────────────────────────────────────────────────────

export type RecoveryStage =
  | 'early_warning'
  | 'soft_recovery'
  | 'npa_stage1'
  | 'npa_stage2'
  | 'legal'
  | 'written_off';

export interface Recovery {
  id: string;
  loanId: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  outstanding: number;
  dpd: number;
  stage: RecoveryStage;
  lastContactDate?: string;
  nextActionDate: string;
  nextAction: string;
  assignedOfficerId: string;
  assignedOfficerName: string;
  recoveryNotes: string[];
  legalCaseNumber?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  promiseToPay?: { date: string; amount: number };
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Dashboard KPIs ───────────────────────────────────────────────────────────

export interface DashboardKPIs {
  totalAUM: number;
  aumGrowth: number;
  activeBorrowers: number;
  borrowerGrowth: number;
  collectionRate: number;
  collectionRateChange: number;
  npaRatio: number;
  npaChange: number;
  todayCollection: number;
  todayTarget: number;
  todayLoansApproved: number;
  activeLoans: number;
  totalDeposits: number;
  netProfit: number;
  portfolioAtRisk: number;
  operatingExpenseRatio: number;
  returnOnAssets: number;
  capitalAdequacyRatio: number;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationType = 'info' | 'warning' | 'danger' | 'success';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type ActivePage =
  | 'dashboard'
  | 'loans'
  | 'deposits'
  | 'collections'
  | 'recovery'
  | 'customers'
  | 'kyc'
  | 'accounting'
  | 'treasury'
  | 'employees'
  | 'audit'
  | 'analytics'
  | 'reports'
  | 'settings'
  | 'notifications';

export type ModalType =
  | 'new-loan'
  | 'loan-detail'
  | 'collect-payment'
  | 'new-customer'
  | 'customer-detail'
  | 'new-deposit'
  | 'quick-action'
  | 'new-employee'
  | 'kyc-review'
  | null;
