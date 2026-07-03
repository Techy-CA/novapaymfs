import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { onAuthChange, getUserProfile } from './services/authService';
import { useAppStore } from './store/appStore';
import { LoginPage } from './pages/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DashboardPage } from './pages/DashboardPage';
import { LoansPage } from './pages/LoansPage';
import {
  CollectionsPage, DepositsPage, CustomersPage, RecoveryPage,
  AnalyticsPage, EmployeesPage, AccountingPage, AuditPage,
  KYCPage, TreasuryPage, ReportsPage, SettingsPage, NotificationsPage,
} from './pages/OtherPages';
import { NewLoanModal } from './components/modals/NewLoanModal';
import { CollectPaymentModal } from './components/modals/CollectPaymentModal';
import { NewCustomerModal } from './components/modals/NewCustomerModal';
import { NewDepositModal } from './components/modals/NewDepositModal';
import { LoanDetailModal } from './components/modals/LoanDetailModal';
import { CustomerDetailModal } from './components/modals/CustomerDetailModal';
import { NewEmployeeModal, QuickActionModal } from './components/modals/OtherModals';
import { Zap } from 'lucide-react';
import type { User } from './types';

const TOAST_OPTS = {
  style: {
    background: '#fff', color: '#0f172a',
    border: '1px solid #e2e8f0', borderRadius: '12px',
    fontSize: '12.5px', fontFamily: 'Inter, sans-serif',
    boxShadow: '0 10px 25px rgba(15,23,42,0.12)',
  },
  success: { iconTheme: { primary: '#059669', secondary: '#fff' as const } },
  error:   { iconTheme: { primary: '#dc2626', secondary: '#fff' as const } },
};

// ─── Page Router ──────────────────────────────────────────────────────────────
const PageRouter: React.FC = () => {
  const { activePage } = useAppStore();
  switch (activePage) {
    case 'dashboard':     return <DashboardPage />;
    case 'loans':         return <LoansPage />;
    case 'collections':   return <CollectionsPage />;
    case 'deposits':      return <DepositsPage />;
    case 'customers':     return <CustomersPage />;
    case 'recovery':      return <RecoveryPage />;
    case 'analytics':     return <AnalyticsPage />;
    case 'employees':     return <EmployeesPage />;
    case 'accounting':    return <AccountingPage />;
    case 'audit':         return <AuditPage />;
    case 'kyc':           return <KYCPage />;
    case 'treasury':      return <TreasuryPage />;
    case 'reports':       return <ReportsPage />;
    case 'settings':      return <SettingsPage />;
    case 'notifications': return <NotificationsPage />;
    default:              return <DashboardPage />;
  }
};

// ─── Loader ───────────────────────────────────────────────────────────────────
const AuthLoader: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center"
    style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8edf8 100%)' }}>
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
      style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
      <Zap size={26} className="text-white" />
    </div>
    <div className="w-6 h-6 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mb-3" />
    <p className="text-sm font-semibold text-slate-600">NovaPay MFI OS</p>
    <p className="text-xs text-slate-400 mt-1">Connecting to Firebase...</p>
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const { currentUser, isAuthLoading, setCurrentUser, setAuthLoading } = useAppStore();

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Try Firestore profile first, fallback to Auth data
        const profile = await getUserProfile(firebaseUser.uid);
        const user: User = profile ?? {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Admin',
          email: firebaseUser.email || '',
          role: 'ceo',
          branch: 'Head Office',
          employeeId: 'E-001',
          isActive: true,
          createdAt: new Date(),
        };
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, [setCurrentUser, setAuthLoading]);

  if (isAuthLoading) return <AuthLoader />;

  if (!currentUser) {
    return (
      <>
        <LoginPage onLogin={() => {}} />
        <Toaster position="bottom-right" toastOptions={TOAST_OPTS} />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin' }}>
          <PageRouter />
        </main>
      </div>

      <NewLoanModal />
      <CollectPaymentModal />
      <NewCustomerModal />
      <NewDepositModal />
      <LoanDetailModal />
      <CustomerDetailModal />
      <NewEmployeeModal />
      <QuickActionModal />

      <Toaster position="bottom-right" toastOptions={TOAST_OPTS} />
    </div>
  );
};

export default App;