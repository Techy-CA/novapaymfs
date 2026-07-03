import React, { useState } from 'react';
import { Bell, Search, Plus, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { logout } from '../../services/authService';
import { Button, IconButton } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import toast from 'react-hot-toast';

const pageTitles: Record<string, string> = {
  dashboard: 'CEO Dashboard', analytics: 'Analytics & Reports',
  loans: 'Loan Management', deposits: 'Deposit Management',
  collections: 'Daily Collections', recovery: 'Recovery Management',
  customers: 'Customer Portal', kyc: 'KYC Verification',
  accounting: 'Accounting & GL', treasury: 'Treasury',
  reports: 'Reports', employees: 'Employee Management',
  audit: 'Audit Logs', settings: 'System Settings',
  notifications: 'Notifications',
};

const pageSubtitles: Record<string, string> = {
  dashboard: 'Real-time portfolio overview',
  analytics: 'AI-powered business intelligence',
  loans: 'Manage loan lifecycle',
  collections: 'Daily EMI tracking',
  customers: 'Borrower management',
};

export const Topbar: React.FC = () => {
  const { activePage, notifications, openModal, toggleSidebar, currentUser } = useAppStore();
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unread = notifications.filter((n) => !n.isRead).length;
  const title = pageTitles[activePage] || 'NovaPay OS';
  const subtitle = pageSubtitles[activePage];
  const userName = currentUser?.name || currentUser?.email?.split('@')[0] || 'User';
  const userEmail = currentUser?.email || '';

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <header className="h-14 flex items-center gap-3 px-5 border-b border-slate-200 bg-white flex-shrink-0 shadow-sm">
      {/* Sidebar toggle */}
      <button onClick={toggleSidebar}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400
          hover:text-slate-700 hover:bg-slate-100 transition-all flex-shrink-0">
        <Menu size={16} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-[13.5px] font-bold text-slate-900 truncate">{title}</h1>
          {activePage === 'dashboard' && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md
              bg-emerald-100 border border-emerald-200 text-emerald-700 text-[9.5px] font-bold flex-shrink-0">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        {subtitle && <p className="text-[10.5px] text-slate-400 truncate">{subtitle}</p>}
      </div>

      {/* Search */}
      {showSearch && (
        <div className="flex items-center gap-2 fade-in">
          <input autoFocus placeholder="Search customers, loans..."
            className="w-64 px-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200
              text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
          <button onClick={() => setShowSearch(false)} className="text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {!showSearch && (
          <IconButton icon={<Search size={15} />} onClick={() => setShowSearch(true)} title="Search" />
        )}

        {/* Notifications bell */}
        <div className="relative">
          <IconButton icon={<Bell size={15} />} title="Notifications" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full
              bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>

        {/* Quick action */}
        <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => openModal('quick-action')}>
          Quick Action
        </Button>

        {/* User menu */}
        <div className="relative ml-1 pl-3 border-l border-slate-200">
          <button
            onClick={() => setShowUserMenu(v => !v)}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <Avatar name={userName} size="xs" />
            <span className="text-[11px] font-semibold text-slate-600 hidden sm:block max-w-[100px] truncate">
              {userName}
            </span>
            <ChevronDown size={11} className="text-slate-400" />
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200
              rounded-xl shadow-xl z-50 overflow-hidden fade-in">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 truncate">{userName}</p>
                <p className="text-xs text-slate-400 truncate">{userEmail}</p>
                <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wide
                  bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                  {currentUser?.role?.replace('_', ' ') || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold
                  text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Close menu on outside click */}
      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}
    </header>
  );
};