import { create } from 'zustand';
import type { ActivePage, ModalType, Notification, User } from '../types';

interface AppState {
  activePage: ActivePage;
  activeModal: ModalType;
  sidebarCollapsed: boolean;
  notifications: Notification[];
  currentUser: User | null;
  searchQuery: string;
  isAuthLoading: boolean;

  setActivePage: (page: ActivePage) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  setNotifications: (n: Notification[]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setSearchQuery: (q: string) => void;
  setCurrentUser: (user: User | null) => void;
  setAuthLoading: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activePage: 'dashboard',
  activeModal: null,
  sidebarCollapsed: false,
  notifications: [],
  currentUser: null,
  searchQuery: '',
  isAuthLoading: true,

  setActivePage: (page) => set({ activePage: page }),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setNotifications: (notifications) => set({ notifications }),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),
  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
    })),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setAuthLoading: (v) => set({ isAuthLoading: v }),
}));
