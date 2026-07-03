import React from 'react';
import {
  LayoutDashboard, CreditCard, PiggyBank, CalendarCheck, AlertTriangle,
  Users, ShieldCheck, Calculator, Building2, UserSquare2, FileText,
  BarChart3, Settings, Bell, ChevronRight, Zap, TrendingUp, LogOut,
} from 'lucide-react';
import type { ActivePage } from '../../types';
import { useAppStore } from '../../store/appStore';
import { logout } from '../../services/authService';
import { Avatar } from '../ui/Avatar';
import toast from 'react-hot-toast';

interface NavItem {
  page: ActivePage;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  badgeColor?: 'red' | 'amber' | 'green' | 'blue';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { page: 'dashboard', label: 'CEO Dashboard', icon: <LayoutDashboard size={15} /> },
      { page: 'analytics', label: 'Analytics', icon: <TrendingUp size={15} /> },
    ],
  },
  {
    title: 'Operations',
    items: [
      { page: 'loans', label: 'Loan Management', icon: <CreditCard size={15} /> },
      { page: 'deposits', label: 'Deposits', icon: <PiggyBank size={15} /> },
      { page: 'collections', label: 'Daily Collections', icon: <CalendarCheck size={15} /> },
      { page: 'recovery', label: 'Recovery', icon: <AlertTriangle size={15} /> },
    ],
  },
  {
    title: 'Customers',
    items: [
      { page: 'customers', label: 'Customer Portal', icon: <Users size={15} /> },
      { page: 'kyc', label: 'KYC Verification', icon: <ShieldCheck size={15} /> },
    ],
  },
  {
    title: 'Finance',
    items: [
      { page: 'accounting', label: 'Accounting & GL', icon: <Calculator size={15} /> },
      { page: 'treasury', label: 'Treasury', icon: <Building2 size={15} /> },
      { page: 'reports', label: 'Reports', icon: <BarChart3 size={15} /> },
    ],
  },
  {
    title: 'Admin',
    items: [
      { page: 'employees', label: 'Employees', icon: <UserSquare2 size={15} /> },
      { page: 'audit', label: 'Audit Logs', icon: <FileText size={15} /> },
      { page: 'settings', label: 'Settings', icon: <Settings size={15} /> },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, notifications, sidebarCollapsed, currentUser } = useAppStore();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  if (sidebarCollapsed) return null;

  const userName = currentUser?.name || currentUser?.email?.split('@')[0] || 'User';
  const userRole = currentUser?.role?.replace('_', ' ').toUpperCase() || 'USER';

  return (
    <nav className="w-[220px] min-w-[220px] flex flex-col h-screen bg-white border-r border-slate-200 overflow-y-auto shadow-sm"
      style={{ scrollbarWidth: 'thin' }}>

      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <div className="text-[13.5px] font-bold text-slate-900 tracking-tight">NovaPay</div>
            <div className="text-[9px] text-slate-400 uppercase tracking-widest">Microfinance OS</div>
          </div>
        </div>
      </div>

      {/* Live badge */}
      <div className="px-3 pt-3 pb-1">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="pulse-dot flex-shrink-0" />
          <span className="text-[10px] text-emerald-700 font-semibold">
            Live · {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 px-2 py-2">
        {navSections.map((section) => (
          <div key={section.title} className="mb-3">
            <div className="px-2 py-1 text-[9.5px] font-bold uppercase tracking-[1.2px] text-slate-400 mb-0.5">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button key={item.page} onClick={() => setActivePage(item.page)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg
                    text-[12px] font-medium transition-all duration-150 mb-0.5 text-left relative group
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />}
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}>
                    {item.icon}
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold text-white flex-shrink-0
                      ${item.badgeColor === 'red' ? 'bg-red-500' : item.badgeColor === 'amber' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Notifications */}
        <button onClick={() => setActivePage('notifications')}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg
            text-[12px] font-medium transition-all duration-150 text-left relative mb-0.5
            ${activePage === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
          {activePage === 'notifications' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />}
          <Bell size={15} className="text-slate-400" />
          <span className="flex-1">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold text-white bg-red-500">{unreadCount}</span>
          )}
        </button>
      </div>

      {/* User footer */}
      <div className="border-t border-slate-100 p-3 flex-shrink-0">
        <div className="flex items-center gap-2.5 px-1 py-1.5 rounded-xl hover:bg-slate-50 transition-all group">
          <Avatar name={userName} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-[11.5px] font-semibold text-slate-800 truncate">{userName}</div>
            <div className="text-[9.5px] text-slate-400 capitalize">{userRole}</div>
          </div>
          <button onClick={handleLogout} title="Logout"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg
              hover:bg-red-50 text-slate-400 hover:text-red-500">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </nav>
  );
};