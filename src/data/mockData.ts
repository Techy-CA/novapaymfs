import type {
  Customer, Loan, Collection, Deposit, Employee,
  LedgerEntry, AuditLog, Recovery, DashboardKPIs, Notification
} from '../types';

// ─── Dashboard KPIs ────────────────────────────────────────────────────────
export const mockKPIs: DashboardKPIs = {
  totalAUM: 48200000,
  aumGrowth: 12.4,
  activeBorrowers: 2847,
  borrowerGrowth: 8.2,
  collectionRate: 96.3,
  collectionRateChange: -0.8,
  npaRatio: 2.1,
  npaChange: 0.3,
  todayCollection: 2845000,
  todayTarget: 2952000,
  todayLoansApproved: 12,
  activeLoans: 2156,
  totalDeposits: 19200000,
  netProfit: 820000,
  portfolioAtRisk: 2.1,
  operatingExpenseRatio: 12.4,
  returnOnAssets: 4.2,
  capitalAdequacyRatio: 18.6,
};

// ─── Customers ────────────────────────────────────────────────────────────
export const mockCustomers: Customer[] = [
  {
    id: 'c1', customerId: 'C-4201', name: 'Priya Sharma', phone: '9876543210',
    email: 'priya.s@email.com', dob: '1985-03-12', gender: 'female',
    address: { line1: '42 Nehru Nagar', city: 'Indore', state: 'MP', pincode: '452001' },
    aadhaar: '****-****-4521', pan: 'ABCPS1234D', kycStatus: 'verified',
    creditScore: 762, riskLevel: 'low', status: 'active',
    occupation: 'Small Business', monthlyIncome: 35000, activeLoans: 1,
    totalBorrowed: 50000, totalRepaid: 8000, joinedAt: new Date('2023-01-15'),
    fieldOfficerId: 'e1', branchId: 'br1',
  },
  {
    id: 'c2', customerId: 'C-4199', name: 'Rajesh Kumar', phone: '8765432109',
    dob: '1978-07-22', gender: 'male',
    address: { line1: '15 Gandhi Road', city: 'Indore', state: 'MP', pincode: '452002' },
    aadhaar: '****-****-3312', pan: 'DEFKR5678E', kycStatus: 'verified',
    creditScore: 748, riskLevel: 'low', status: 'active',
    occupation: 'Farmer', monthlyIncome: 28000, activeLoans: 1,
    totalBorrowed: 75000, totalRepaid: 16500, joinedAt: new Date('2022-08-20'),
    fieldOfficerId: 'e2', branchId: 'br1',
  },
  {
    id: 'c3', customerId: 'C-4195', name: 'Meena Devi', phone: '7654321098',
    dob: '1990-11-05', gender: 'female',
    address: { line1: '8 Saraswati Colony', city: 'Indore', state: 'MP', pincode: '452003' },
    aadhaar: '****-****-6789', pan: 'GHIMD9012F', kycStatus: 'verified',
    creditScore: 634, riskLevel: 'medium', status: 'active',
    occupation: 'Tailor', monthlyIncome: 18000, activeLoans: 1,
    totalBorrowed: 30000, totalRepaid: 3400, joinedAt: new Date('2023-06-10'),
    fieldOfficerId: 'e3', branchId: 'br2',
  },
  {
    id: 'c4', customerId: 'C-4188', name: 'Suresh Patel', phone: '6543210987',
    dob: '1975-02-28', gender: 'male',
    address: { line1: '22 Industrial Area', city: 'Indore', state: 'MP', pincode: '452010' },
    aadhaar: '****-****-1122', pan: 'JKLSP3456G', kycStatus: 'verified',
    creditScore: 548, riskLevel: 'high', status: 'active',
    occupation: 'Shop Owner', monthlyIncome: 45000, activeLoans: 1,
    totalBorrowed: 100000, totalRepaid: 0, joinedAt: new Date('2022-03-05'),
    fieldOfficerId: 'e5', branchId: 'br3',
  },
  {
    id: 'c5', customerId: 'C-4184', name: 'Anita Roy', phone: '5432109876',
    dob: '1988-09-14', gender: 'female',
    address: { line1: '5 Vijay Nagar', city: 'Indore', state: 'MP', pincode: '452010' },
    aadhaar: '****-****-4433', pan: 'MNOAR7890H', kycStatus: 'verified',
    creditScore: 719, riskLevel: 'low', status: 'active',
    occupation: 'Teacher', monthlyIncome: 32000, activeLoans: 1,
    totalBorrowed: 20000, totalRepaid: 5600, joinedAt: new Date('2023-04-20'),
    fieldOfficerId: 'e1', branchId: 'br1',
  },
  {
    id: 'c6', customerId: 'C-4177', name: 'Vikram Singh', phone: '4321098765',
    dob: '1970-06-18', gender: 'male',
    address: { line1: '9 Transport Nagar', city: 'Indore', state: 'MP', pincode: '452015' },
    aadhaar: '****-****-5544', pan: 'PQRVS2345I', kycStatus: 'verified',
    creditScore: 492, riskLevel: 'critical', status: 'active',
    occupation: 'Transporter', monthlyIncome: 60000, activeLoans: 1,
    totalBorrowed: 200000, totalRepaid: 17600, joinedAt: new Date('2021-11-30'),
    fieldOfficerId: 'e5', branchId: 'br3',
  },
  {
    id: 'c7', customerId: 'C-4170', name: 'Sunita Gupta', phone: '3210987654',
    dob: '1982-04-07', gender: 'female',
    address: { line1: '18 Rose Garden', city: 'Indore', state: 'MP', pincode: '452005' },
    aadhaar: '****-****-7788', pan: 'STUVG6789J', kycStatus: 'verified',
    creditScore: 698, riskLevel: 'low', status: 'active',
    occupation: 'Dairy Owner', monthlyIncome: 40000, activeLoans: 1,
    totalBorrowed: 45000, totalRepaid: 21600, joinedAt: new Date('2022-05-18'),
    fieldOfficerId: 'e3', branchId: 'br2',
  },
  {
    id: 'c8', customerId: 'C-4161', name: 'Deepak Jha', phone: '2109876543',
    dob: '1992-12-25', gender: 'male',
    address: { line1: '33 Pipliyahana', city: 'Indore', state: 'MP', pincode: '452011' },
    aadhaar: '****-****-9900', pan: 'VWXDJ0123K', kycStatus: 'pending',
    creditScore: 581, riskLevel: 'medium', status: 'active',
    occupation: 'IT Professional', monthlyIncome: 55000, activeLoans: 0,
    totalBorrowed: 0, totalRepaid: 0, joinedAt: new Date('2024-01-08'),
    fieldOfficerId: 'e2', branchId: 'br1',
  },
];

// ─── Loans ────────────────────────────────────────────────────────────────
export const mockLoans: Loan[] = [
  {
    id: 'l1', loanId: 'L-1072', customerId: 'c1', customerName: 'Priya Sharma',
    type: 'business', purpose: 'Working capital for garment business',
    principalAmount: 50000, disbursedAmount: 48500, outstandingBalance: 42000,
    interestRate: 18, processingFee: 500, tenure: 12, repaymentFrequency: 'monthly',
    emiAmount: 4200, disbursementDate: '2026-05-01', firstEmiDate: '2026-06-05',
    nextDueDate: '2026-07-05', status: 'active', dpd: 0,
    totalPaid: 8200, totalInterestPaid: 200, penaltyAmount: 0,
    installmentsPaid: 2, totalInstallments: 12,
    approvedBy: 'Kavita Mehta', disbursedBy: 'Kavita Mehta',
    fieldOfficerId: 'e1', branchId: 'br1',
    creditScore: 762, riskLevel: 'low', createdAt: new Date('2026-04-28'), updatedAt: new Date(),
  },
  {
    id: 'l2', loanId: 'L-1071', customerId: 'c2', customerName: 'Rajesh Kumar',
    type: 'agriculture', purpose: 'Crop cultivation — kharif season',
    principalAmount: 75000, disbursedAmount: 73500, outstandingBalance: 58500,
    interestRate: 14, processingFee: 750, tenure: 12, repaymentFrequency: 'monthly',
    emiAmount: 6500, disbursementDate: '2026-04-15', firstEmiDate: '2026-05-15',
    nextDueDate: '2026-07-03', status: 'active', dpd: 0,
    totalPaid: 16500, totalInterestPaid: 1050, penaltyAmount: 0,
    installmentsPaid: 3, totalInstallments: 12,
    fieldOfficerId: 'e2', branchId: 'br1',
    creditScore: 748, riskLevel: 'low', createdAt: new Date('2026-04-10'), updatedAt: new Date(),
  },
  {
    id: 'l3', loanId: 'L-1069', customerId: 'c3', customerName: 'Meena Devi',
    type: 'education', purpose: 'Daughter\'s college fees',
    principalAmount: 30000, disbursedAmount: 29500, outstandingBalance: 26600,
    interestRate: 12, processingFee: 300, tenure: 8, repaymentFrequency: 'monthly',
    emiAmount: 3800, disbursementDate: '2026-05-20', firstEmiDate: '2026-06-20',
    nextDueDate: '2026-06-28', status: 'overdue', dpd: 8,
    totalPaid: 3400, totalInterestPaid: 300, penaltyAmount: 100,
    installmentsPaid: 1, totalInstallments: 8,
    fieldOfficerId: 'e3', branchId: 'br2',
    creditScore: 634, riskLevel: 'medium', createdAt: new Date('2026-05-15'), updatedAt: new Date(),
  },
  {
    id: 'l4', loanId: 'L-1065', customerId: 'c4', customerName: 'Suresh Patel',
    type: 'business', purpose: 'Shop renovation and stock purchase',
    principalAmount: 100000, disbursedAmount: 98500, outstandingBalance: 89000,
    interestRate: 20, processingFee: 1000, tenure: 12, repaymentFrequency: 'monthly',
    emiAmount: 8900, disbursementDate: '2026-05-10', firstEmiDate: '2026-06-10',
    nextDueDate: '2026-06-25', status: 'overdue', dpd: 12,
    totalPaid: 0, totalInterestPaid: 0, penaltyAmount: 800,
    installmentsPaid: 0, totalInstallments: 12,
    fieldOfficerId: 'e5', branchId: 'br3',
    creditScore: 548, riskLevel: 'high', createdAt: new Date('2026-05-05'), updatedAt: new Date(),
  },
  {
    id: 'l5', loanId: 'L-1063', customerId: 'c5', customerName: 'Anita Roy',
    type: 'emergency', purpose: 'Medical emergency — surgery expenses',
    principalAmount: 20000, disbursedAmount: 19500, outstandingBalance: 14400,
    interestRate: 15, processingFee: 200, tenure: 8, repaymentFrequency: 'monthly',
    emiAmount: 2400, disbursementDate: '2026-04-01', firstEmiDate: '2026-05-01',
    nextDueDate: '2026-07-10', status: 'active', dpd: 0,
    totalPaid: 5600, totalInterestPaid: 350, penaltyAmount: 0,
    installmentsPaid: 2, totalInstallments: 8,
    fieldOfficerId: 'e1', branchId: 'br1',
    creditScore: 719, riskLevel: 'low', createdAt: new Date('2026-03-28'), updatedAt: new Date(),
  },
  {
    id: 'l6', loanId: 'L-1058', customerId: 'c6', customerName: 'Vikram Singh',
    type: 'business', purpose: 'Truck purchase for transport business',
    principalAmount: 200000, disbursedAmount: 196000, outstandingBalance: 182400,
    interestRate: 22, processingFee: 2000, tenure: 24, repaymentFrequency: 'monthly',
    emiAmount: 15200, disbursementDate: '2026-03-15', firstEmiDate: '2026-04-15',
    nextDueDate: '2026-06-20', status: 'npa', dpd: 38,
    totalPaid: 17600, totalInterestPaid: 1200, penaltyAmount: 3800,
    installmentsPaid: 1, totalInstallments: 24,
    fieldOfficerId: 'e5', branchId: 'br3',
    creditScore: 492, riskLevel: 'critical', createdAt: new Date('2026-03-10'), updatedAt: new Date(),
  },
  {
    id: 'l7', loanId: 'L-1055', customerId: 'c7', customerName: 'Sunita Gupta',
    type: 'agriculture', purpose: 'Dairy expansion — 4 additional cows',
    principalAmount: 45000, disbursedAmount: 44000, outstandingBalance: 23400,
    interestRate: 14, processingFee: 450, tenure: 12, repaymentFrequency: 'monthly',
    emiAmount: 3900, disbursementDate: '2025-10-01', firstEmiDate: '2025-11-01',
    nextDueDate: '2026-07-08', status: 'active', dpd: 0,
    totalPaid: 21600, totalInterestPaid: 2480, penaltyAmount: 0,
    installmentsPaid: 6, totalInstallments: 12,
    fieldOfficerId: 'e3', branchId: 'br2',
    creditScore: 698, riskLevel: 'low', createdAt: new Date('2025-09-28'), updatedAt: new Date(),
  },
  {
    id: 'l8', loanId: 'L-1050', customerId: 'c8', customerName: 'Deepak Jha',
    type: 'business', purpose: 'Software startup — equipment purchase',
    principalAmount: 80000, disbursedAmount: 0, outstandingBalance: 80000,
    interestRate: 16, processingFee: 800, tenure: 12, repaymentFrequency: 'monthly',
    emiAmount: 7100, status: 'pending_approval', dpd: 0,
    totalPaid: 0, totalInterestPaid: 0, penaltyAmount: 0,
    installmentsPaid: 0, totalInstallments: 12,
    fieldOfficerId: 'e2', branchId: 'br1',
    creditScore: 581, riskLevel: 'medium', createdAt: new Date('2026-06-25'), updatedAt: new Date(),
  },
];

// ─── Collections ──────────────────────────────────────────────────────────
export const mockCollections: Collection[] = [
  {
    id: 'col1', collectionId: 'COL-8821', loanId: 'l1', loanNumber: 'L-1072',
    customerId: 'c1', customerName: 'Priya Sharma',
    scheduledAmount: 4200, collectedAmount: 4200, penaltyAmount: 0, totalAmount: 4200,
    paymentMethod: 'cash', collectedBy: 'Amit Kumar',
    collectionDate: '2026-06-28', collectionTime: '09:14', status: 'collected',
    receiptNumber: 'RCT-4821', branchId: 'br1', installmentNo: 2, createdAt: new Date(),
  },
  {
    id: 'col2', collectionId: 'COL-8820', loanId: 'l2', loanNumber: 'L-1071',
    customerId: 'c2', customerName: 'Rajesh Kumar',
    scheduledAmount: 6500, collectedAmount: 6500, penaltyAmount: 0, totalAmount: 6500,
    paymentMethod: 'upi', referenceNumber: 'UPI12345678',
    collectedBy: 'Sonal Joshi',
    collectionDate: '2026-06-28', collectionTime: '09:32', status: 'collected',
    receiptNumber: 'RCT-4820', branchId: 'br1', installmentNo: 3, createdAt: new Date(),
  },
  {
    id: 'col3', collectionId: 'COL-8819', loanId: 'l5', loanNumber: 'L-1063',
    customerId: 'c5', customerName: 'Anita Roy',
    scheduledAmount: 2400, collectedAmount: 2400, penaltyAmount: 0, totalAmount: 2400,
    paymentMethod: 'cash', collectedBy: 'Amit Kumar',
    collectionDate: '2026-06-28', collectionTime: '10:05', status: 'collected',
    receiptNumber: 'RCT-4819', branchId: 'br1', installmentNo: 2, createdAt: new Date(),
  },
  {
    id: 'col4', collectionId: 'COL-8818', loanId: 'l7', loanNumber: 'L-1055',
    customerId: 'c7', customerName: 'Sunita Gupta',
    scheduledAmount: 3900, collectedAmount: 3900, penaltyAmount: 0, totalAmount: 3900,
    paymentMethod: 'neft', referenceNumber: 'NEFT9876543',
    collectedBy: 'Manoj Rawat',
    collectionDate: '2026-06-28', collectionTime: '10:48', status: 'collected',
    receiptNumber: 'RCT-4818', branchId: 'br2', installmentNo: 6, createdAt: new Date(),
  },
  {
    id: 'col5', collectionId: 'COL-8817', loanId: 'l3', loanNumber: 'L-1069',
    customerId: 'c3', customerName: 'Meena Devi',
    scheduledAmount: 3800, collectedAmount: 0, penaltyAmount: 100, totalAmount: 3900,
    paymentMethod: 'cash', collectedBy: 'Manoj Rawat',
    collectionDate: '2026-06-28', collectionTime: '11:52', status: 'missed',
    branchId: 'br2', installmentNo: 2, createdAt: new Date(),
  },
  {
    id: 'col6', collectionId: 'COL-8816', loanId: 'l4', loanNumber: 'L-1065',
    customerId: 'c4', customerName: 'Suresh Patel',
    scheduledAmount: 8900, collectedAmount: 0, penaltyAmount: 800, totalAmount: 9700,
    paymentMethod: 'cash', collectedBy: 'Rahul Verma',
    collectionDate: '2026-06-28', collectionTime: '12:20', status: 'missed',
    branchId: 'br3', installmentNo: 1, createdAt: new Date(),
  },
];

// ─── Deposits ─────────────────────────────────────────────────────────────
export const mockDeposits: Deposit[] = [
  {
    id: 'd1', accountNumber: 'D-2041', customerId: 'c1', customerName: 'Priya Sharma',
    type: 'savings', principalAmount: 24500, currentBalance: 24500,
    interestRate: 4, openDate: '2023-01-15', status: 'active',
    accruedInterest: 980, totalInterestPaid: 1960, branchId: 'br1', createdAt: new Date('2023-01-15'),
  },
  {
    id: 'd2', accountNumber: 'D-2038', customerId: 'c2', customerName: 'Rajesh Kumar',
    type: 'fixed', principalAmount: 150000, currentBalance: 150000,
    interestRate: 8.5, tenure: 12, openDate: '2026-01-10',
    maturityDate: '2027-01-10', status: 'active',
    accruedInterest: 6375, totalInterestPaid: 0, branchId: 'br1', createdAt: new Date('2026-01-10'),
  },
  {
    id: 'd3', accountNumber: 'D-2035', customerId: 'c3', customerName: 'Meena Devi',
    type: 'recurring', principalAmount: 8400, currentBalance: 8400,
    interestRate: 6.5, tenure: 24, openDate: '2025-06-01', status: 'active',
    accruedInterest: 546, totalInterestPaid: 0, branchId: 'br2', createdAt: new Date('2025-06-01'),
  },
  {
    id: 'd4', accountNumber: 'D-2030', customerId: 'c4', customerName: 'Suresh Patel',
    type: 'fixed', principalAmount: 75000, currentBalance: 75000,
    interestRate: 8, tenure: 12, openDate: '2025-06-30',
    maturityDate: '2026-06-30', status: 'matured',
    accruedInterest: 6000, totalInterestPaid: 0, branchId: 'br3', createdAt: new Date('2025-06-30'),
  },
  {
    id: 'd5', accountNumber: 'D-2028', customerId: 'c5', customerName: 'Anita Roy',
    type: 'savings', principalAmount: 12300, currentBalance: 12300,
    interestRate: 4, openDate: '2023-04-20', status: 'active',
    accruedInterest: 492, totalInterestPaid: 984, branchId: 'br1', createdAt: new Date('2023-04-20'),
  },
  {
    id: 'd6', accountNumber: 'D-2024', customerId: 'c7', customerName: 'Sunita Gupta',
    type: 'recurring', principalAmount: 36000, currentBalance: 36000,
    interestRate: 6.5, tenure: 12, openDate: '2025-10-01', status: 'active',
    accruedInterest: 1755, totalInterestPaid: 0, branchId: 'br2', createdAt: new Date('2025-10-01'),
  },
];

// ─── Employees ───────────────────────────────────────────────────────────
export const mockEmployees: Employee[] = [
  {
    id: 'e1', employeeId: 'E-101', name: 'Amit Kumar', email: 'amit.kumar@novapay.in',
    phone: '9900112233', role: 'field_officer', department: 'Collections',
    branch: 'Sector 4 Branch', branchId: 'br1', joinDate: '2020-03-15', salary: 28000,
    isActive: true, assignedBorrowers: 187, collectionTarget: 4900000,
    collectionAchieved: 4826500, collectionRate: 98.5, thisMonthCollection: 4820000,
    performanceScore: 98,
  },
  {
    id: 'e2', employeeId: 'E-102', name: 'Sonal Joshi', email: 'sonal.joshi@novapay.in',
    phone: '9900223344', role: 'field_officer', department: 'Collections',
    branch: 'Sector 7 Branch', branchId: 'br1', joinDate: '2021-06-01', salary: 25000,
    isActive: true, assignedBorrowers: 154, collectionTarget: 4300000,
    collectionAchieved: 4175300, collectionRate: 97.1, thisMonthCollection: 4170000,
    performanceScore: 95,
  },
  {
    id: 'e3', employeeId: 'E-103', name: 'Manoj Rawat', email: 'manoj.rawat@novapay.in',
    phone: '9900334455', role: 'field_officer', department: 'Collections',
    branch: 'Sector 2 Branch', branchId: 'br2', joinDate: '2021-09-12', salary: 25000,
    isActive: true, assignedBorrowers: 142, collectionTarget: 4000000,
    collectionAchieved: 3832000, collectionRate: 95.8, thisMonthCollection: 3840000,
    performanceScore: 92,
  },
  {
    id: 'e4', employeeId: 'E-104', name: 'Pooja Desai', email: 'pooja.desai@novapay.in',
    phone: '9900445566', role: 'field_officer', department: 'Collections',
    branch: 'Sector 1 Branch', branchId: 'br2', joinDate: '2022-01-08', salary: 24000,
    isActive: true, assignedBorrowers: 128, collectionTarget: 3700000,
    collectionAchieved: 3486200, collectionRate: 94.2, thisMonthCollection: 3510000,
    performanceScore: 90,
  },
  {
    id: 'e5', employeeId: 'E-105', name: 'Rahul Verma', email: 'rahul.verma@novapay.in',
    phone: '9900556677', role: 'field_officer', department: 'Collections',
    branch: 'Sector 9 Branch', branchId: 'br3', joinDate: '2023-04-20', salary: 22000,
    isActive: true, assignedBorrowers: 98, collectionTarget: 3200000,
    collectionAchieved: 2928000, collectionRate: 91.5, thisMonthCollection: 2960000,
    performanceScore: 85,
  },
  {
    id: 'e6', employeeId: 'E-106', name: 'Kavita Mehta', email: 'kavita.mehta@novapay.in',
    phone: '9900667788', role: 'branch_manager', department: 'Management',
    branch: 'Head Office', branchId: 'br1', joinDate: '2019-06-01', salary: 65000,
    isActive: false, assignedBorrowers: 0, collectionTarget: 0,
    collectionAchieved: 0, collectionRate: 0, thisMonthCollection: 0,
    performanceScore: 96,
  },
  {
    id: 'e7', employeeId: 'E-107', name: 'Neha Sharma', email: 'neha.sharma@novapay.in',
    phone: '9900778899', role: 'accountant', department: 'Finance',
    branch: 'Head Office', branchId: 'br1', joinDate: '2020-08-15', salary: 35000,
    isActive: true, assignedBorrowers: 0, collectionTarget: 0,
    collectionAchieved: 0, collectionRate: 0, thisMonthCollection: 0,
    performanceScore: 94,
  },
  {
    id: 'e8', employeeId: 'E-108', name: 'Ravi Shankar', email: 'ravi.shankar@novapay.in',
    phone: '9900889900', role: 'loan_officer', department: 'Credit',
    branch: 'Head Office', branchId: 'br1', joinDate: '2021-02-20', salary: 40000,
    isActive: true, assignedBorrowers: 0, collectionTarget: 0,
    collectionAchieved: 0, collectionRate: 0, thisMonthCollection: 0,
    performanceScore: 91,
  },
];

// ─── Recoveries ───────────────────────────────────────────────────────────
export const mockRecoveries: Recovery[] = [
  {
    id: 'r1', loanId: 'l6', loanNumber: 'L-1058', customerId: 'c6', customerName: 'Vikram Singh',
    outstanding: 182400, dpd: 38, stage: 'npa_stage2',
    lastContactDate: '2026-06-25', nextActionDate: '2026-06-29', nextAction: 'Legal Notice Dispatch',
    assignedOfficerId: 'e5', assignedOfficerName: 'Rahul Verma',
    recoveryNotes: ['Called on Jun 25, no response', 'Visited on Jun 22, guarantor contacted'],
    priority: 'critical', branchId: 'br3', createdAt: new Date('2026-05-20'), updatedAt: new Date(),
  },
  {
    id: 'r2', loanId: 'l4', loanNumber: 'L-1065', customerId: 'c4', customerName: 'Suresh Patel',
    outstanding: 89000, dpd: 12, stage: 'soft_recovery',
    lastContactDate: '2026-06-27', nextActionDate: '2026-06-28', nextAction: 'Personal Visit',
    assignedOfficerId: 'e3', assignedOfficerName: 'Manoj Rawat',
    recoveryNotes: ['Promised payment by Jun 30', 'Business cash flow issues cited'],
    priority: 'high', branchId: 'br3', createdAt: new Date('2026-06-16'), updatedAt: new Date(),
  },
  {
    id: 'r3', loanId: 'l3', loanNumber: 'L-1069', customerId: 'c3', customerName: 'Meena Devi',
    outstanding: 26600, dpd: 8, stage: 'early_warning',
    lastContactDate: '2026-06-26', nextActionDate: '2026-06-28', nextAction: 'Reminder SMS + Call',
    assignedOfficerId: 'e3', assignedOfficerName: 'Manoj Rawat',
    recoveryNotes: ['First time delay, usually regular payer'],
    priority: 'medium', branchId: 'br2', createdAt: new Date('2026-06-21'), updatedAt: new Date(),
  },
];

// ─── Ledger Entries ───────────────────────────────────────────────────────
export const mockLedgerEntries: LedgerEntry[] = [
  {
    id: 'le1', voucherNumber: 'JV-4821', voucherType: 'journal', date: '2026-06-28',
    accountCode: 'LA001', accountName: 'Loan Disbursement', description: 'Loan L-1072 disbursed to Priya Sharma',
    debitAmount: 50000, creditAmount: 0, balance: -50000,
    referenceId: 'l1', referenceType: 'loan', createdBy: 'Kavita Mehta', branchId: 'br1', createdAt: new Date(),
  },
  {
    id: 'le2', voucherNumber: 'RV-4820', voucherType: 'receipt', date: '2026-06-28',
    accountCode: 'CA001', accountName: 'EMI Collection — Cash', description: 'Daily EMI collection batch — 28 Jun',
    debitAmount: 0, creditAmount: 2845000, balance: 2845000,
    createdBy: 'System', branchId: 'br1', createdAt: new Date(),
  },
  {
    id: 'le3', voucherNumber: 'RV-4819', voucherType: 'receipt', date: '2026-06-27',
    accountCode: 'IN001', accountName: 'Interest Income', description: 'Monthly interest accrual — June 2026',
    debitAmount: 0, creditAmount: 482000, balance: 482000,
    createdBy: 'System', branchId: 'br1', createdAt: new Date(),
  },
  {
    id: 'le4', voucherNumber: 'PV-4818', voucherType: 'payment', date: '2026-06-27',
    accountCode: 'EX001', accountName: 'Staff Salaries', description: 'Monthly salary disbursement — June 2026',
    debitAmount: 320000, creditAmount: 0, balance: -320000,
    createdBy: 'Neha Sharma', branchId: 'br1', createdAt: new Date(),
  },
  {
    id: 'le5', voucherNumber: 'PV-4817', voucherType: 'payment', date: '2026-06-26',
    accountCode: 'EX002', accountName: 'Office Rent', description: 'Quarterly office rent — Q2 2026',
    debitAmount: 45000, creditAmount: 0, balance: -45000,
    createdBy: 'Neha Sharma', branchId: 'br1', createdAt: new Date(),
  },
  {
    id: 'le6', voucherNumber: 'JV-4816', voucherType: 'journal', date: '2026-06-26',
    accountCode: 'PR001', accountName: 'Loan Loss Provision', description: 'Provision for NPA — L-1058',
    debitAmount: 36480, creditAmount: 0, balance: -36480,
    createdBy: 'Neha Sharma', branchId: 'br1', createdAt: new Date(),
  },
];

// ─── Audit Logs ───────────────────────────────────────────────────────────
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'al1', userId: 'u1', userName: 'sarah.chen', userRole: 'CEO', action: 'VIEW',
    entity: 'Dashboard', description: 'CEO Dashboard accessed', ipAddress: '192.168.1.1',
    result: 'success', timestamp: new Date('2026-06-28T11:52:14'),
  },
  {
    id: 'al2', userId: 'e1', userName: 'amit.kumar', userRole: 'Field Officer', action: 'CREATE',
    entity: 'Collection', entityId: 'col1', description: 'EMI recorded — L-1072 ₹4,200',
    ipAddress: '10.0.0.14', result: 'success', timestamp: new Date('2026-06-28T11:48:32'),
  },
  {
    id: 'al3', userId: 'e2', userName: 'sonal.joshi', userRole: 'Field Officer', action: 'UPDATE',
    entity: 'Customer', entityId: 'c2', description: 'Phone number updated — C-4199',
    ipAddress: '10.0.0.22', result: 'success', timestamp: new Date('2026-06-28T11:42:19'),
  },
  {
    id: 'al4', userId: 'unknown', userName: 'unknown', userRole: '—', action: 'LOGIN',
    entity: 'Auth', description: 'Invalid credentials — 3rd failed attempt',
    ipAddress: '203.45.67.89', result: 'failed', timestamp: new Date('2026-06-28T11:30:05'),
  },
  {
    id: 'al5', userId: 'e6', userName: 'kavita.mehta', userRole: 'Branch Manager', action: 'APPROVE',
    entity: 'Loan', entityId: 'l1', description: 'Loan L-1072 approved — ₹50,000',
    ipAddress: '10.0.0.5', result: 'success', timestamp: new Date('2026-06-28T11:14:28'),
  },
  {
    id: 'al6', userId: 'system', userName: 'system', userRole: 'Automation', action: 'CREATE',
    entity: 'Notification', description: '8 overdue SMS alerts dispatched',
    ipAddress: 'Internal', result: 'success', timestamp: new Date('2026-06-28T10:58:11'),
  },
  {
    id: 'al7', userId: 'e3', userName: 'manoj.rawat', userRole: 'Field Officer', action: 'DELETE',
    entity: 'Collection', entityId: 'col5', description: 'Collection reversal attempt — supervisor override required',
    ipAddress: '10.0.0.31', result: 'warning', timestamp: new Date('2026-06-28T10:44:03'),
  },
  {
    id: 'al8', userId: 'e8', userName: 'ravi.shankar', userRole: 'Loan Officer', action: 'CREATE',
    entity: 'Loan', description: 'New loan application created — L-1072',
    ipAddress: '10.0.0.8', result: 'success', timestamp: new Date('2026-06-28T09:30:22'),
  },
];

// ─── Notifications ────────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  {
    id: 'n1', title: '8 Overdue EMIs Today', type: 'danger', isRead: false,
    message: '₹1,24,200 pending — Immediate action required on 8 accounts.',
    createdAt: new Date('2026-06-28T08:00:00'),
  },
  {
    id: 'n2', title: 'Fraud Alert — AI Detection', type: 'danger', isRead: false,
    message: '3 suspicious transactions flagged by AI engine. Review required.',
    createdAt: new Date('2026-06-28T07:45:00'),
  },
  {
    id: 'n3', title: 'Loan L-1072 Approved', type: 'success', isRead: true,
    message: '₹50,000 business loan for Priya Sharma approved by Kavita Mehta.',
    createdAt: new Date('2026-06-28T11:14:28'),
  },
  {
    id: 'n4', title: 'FD Maturity Alert', type: 'warning', isRead: false,
    message: '28 fixed deposits maturing this month. Total value: ₹14.2L. Action needed.',
    createdAt: new Date('2026-06-27T18:00:00'),
  },
  {
    id: 'n5', title: 'Daily Collection — 96.4%', type: 'info', isRead: true,
    message: 'Today\'s collection rate: 96.4% (₹2,84,500 / ₹2,95,200 target).',
    createdAt: new Date('2026-06-28T18:30:00'),
  },
];

// ─── Chart Data ───────────────────────────────────────────────────────────
export const portfolioChartData = [
  { month: 'Jan', disbursed: 42, collected: 39 },
  { month: 'Feb', disbursed: 48, collected: 46 },
  { month: 'Mar', disbursed: 51, collected: 49.5 },
  { month: 'Apr', disbursed: 58, collected: 56.5 },
  { month: 'May', disbursed: 62, collected: 60.5 },
  { month: 'Jun', disbursed: 68.4, collected: 67 },
];

export const regionData = [
  { sector: 'Sec 1', rate: 94.2, amount: 35.1 },
  { sector: 'Sec 2', rate: 95.8, amount: 38.4 },
  { sector: 'Sec 3', rate: 92.1, amount: 24.8 },
  { sector: 'Sec 4', rate: 98.5, amount: 48.2 },
  { sector: 'Sec 7', rate: 97.1, amount: 41.7 },
  { sector: 'Sec 9', rate: 91.5, amount: 29.6 },
];

export const revenueData = [
  { month: 'Jan', revenue: 5.8, expense: 3.2, profit: 2.6 },
  { month: 'Feb', revenue: 6.4, expense: 3.5, profit: 2.9 },
  { month: 'Mar', revenue: 7.1, expense: 3.8, profit: 3.3 },
  { month: 'Apr', revenue: 7.8, expense: 4.0, profit: 3.8 },
  { month: 'May', revenue: 8.2, expense: 4.1, profit: 4.1 },
  { month: 'Jun', revenue: 8.4, expense: 4.2, profit: 4.2 },
];

export const collectionWeeklyData = [
  { week: 'Wk 1', rate: 94.2 },
  { week: 'Wk 2', rate: 96.1 },
  { week: 'Wk 3', rate: 95.4 },
  { week: 'Wk 4', rate: 97.2 },
  { week: 'Wk 5', rate: 96.3 },
];

export const depositTrendData = [
  { month: 'Jan', amount: 140 },
  { month: 'Feb', amount: 152 },
  { month: 'Mar', amount: 164 },
  { month: 'Apr', amount: 175 },
  { month: 'May', amount: 182 },
  { month: 'Jun', amount: 192 },
];

export const loanTypeMix = [
  { name: 'Business', value: 42, color: '#3b82f6' },
  { name: 'Agriculture', value: 28, color: '#10b981' },
  { name: 'Education', value: 18, color: '#f59e0b' },
  { name: 'Emergency', value: 12, color: '#8b5cf6' },
];
