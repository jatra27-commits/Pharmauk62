import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Pill,
  FolderTree,
  Boxes,
  Ticket,
  RefreshCw,
  Megaphone,
  MessageSquareText,
  Mail,
  BarChart3,
  SlidersHorizontal,
  LogOut,
  ChevronRight,
  ShieldCheck,
  X,
  Lock,
  ExternalLink,
  PoundSterling,
  Users,
  Shield
} from 'lucide-react';
import { AdminMenuKey, StaffRole } from '../../types';
import { canAccessTab, ROLE_PERMISSIONS } from '../../utils/staffPermissions';

export type { AdminMenuKey };

export interface AdminSidebarProps {
  activeMenu: AdminMenuKey;
  onSelectMenu: (menu: AdminMenuKey) => void;
  ordersCount?: { total: number; pending: number };
  pendingOrdersCount?: number;
  lowStockCount?: number;
  mobileOpen?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile: () => void;
  onLockAdmin?: () => void;
  onLockSession?: () => void;
  onExitToStore?: () => void;
  onBackToStore?: () => void;
  currentUserRole?: StaffRole;
}

interface MenuItemConfig {
  key: AdminMenuKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeMenu,
  onSelectMenu,
  ordersCount,
  pendingOrdersCount = 0,
  lowStockCount = 0,
  mobileOpen,
  isOpenMobile,
  onCloseMobile,
  onLockAdmin,
  onLockSession,
  onExitToStore,
  onBackToStore,
  currentUserRole = 'Super Admin'
}) => {
  const isMobileOpen = mobileOpen ?? isOpenMobile ?? false;
  const lockHandler = onLockAdmin || onLockSession || (() => {});
  const exitHandler = onExitToStore || onBackToStore || (() => {});
  const pendingCount = ordersCount?.pending ?? pendingOrdersCount;
  const totalOrdersCount = ordersCount?.total ?? 0;

  const menuItems: MenuItemConfig[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      key: 'orders',
      label: 'Order Management',
      icon: ShoppingBag,
      badge: pendingCount > 0 ? `${pendingCount} new` : totalOrdersCount > 0 ? totalOrdersCount : undefined,
      badgeColor: pendingCount > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-950 text-emerald-400'
    },
    {
      key: 'products',
      label: 'Product Catalog',
      icon: Pill
    },
    {
      key: 'finance',
      label: 'Financials & Fees',
      icon: PoundSterling
    },
    {
      key: 'inventory',
      label: 'Stockroom & Reserves',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} alert` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    },
    {
      key: 'staff',
      label: 'Staff & Permissions',
      icon: Users
    },
    {
      key: 'categories',
      label: 'Categories',
      icon: FolderTree
    },
    {
      key: 'coupons',
      label: 'Coupons & Vouchers',
      icon: Ticket
    },
    {
      key: 'autorefill',
      label: 'Repeat Refills',
      icon: RefreshCw
    },
    {
      key: 'banners',
      label: 'Store Banners',
      icon: Megaphone
    },
    {
      key: 'reviews',
      label: 'Reviews & FAQ',
      icon: MessageSquareText
    },
    {
      key: 'subscribers',
      label: 'Subscribers',
      icon: Mail
    },
    {
      key: 'analytics',
      label: 'Dispensary Analytics',
      icon: BarChart3
    },
    {
      key: 'settings',
      label: 'Store Settings',
      icon: SlidersHorizontal
    }
  ];

  const handleItemClick = (key: AdminMenuKey) => {
    onSelectMenu(key);
    onCloseMobile();
  };

  const roleDetails = ROLE_PERMISSIONS[currentUserRole] || ROLE_PERMISSIONS['Super Admin'];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#01140e] border-r border-emerald-800/40 text-emerald-100">
      {/* Top Header */}
      <div>
        <div className="p-4 sm:p-5 border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white tracking-wide">PureSleep</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-emerald-400/70 truncate">Dispensary Control Hub</p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/50 transition-colors"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Role Indicator */}
        <div className="px-4 py-2.5 bg-[#021b13] border-b border-emerald-900/40 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-white font-semibold truncate max-w-[120px]">{currentUserRole}</span>
          </div>
          <span className="text-emerald-400 font-mono text-[10px]">GPhC #9012384</span>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.key;
            const isAllowed = canAccessTab(currentUserRole, item.key);

            return (
              <button
                key={item.key}
                id={`admin-nav-${item.key}`}
                onClick={() => handleItemClick(item.key)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-md shadow-emerald-950/60'
                    : isAllowed
                    ? 'text-emerald-300/80 hover:text-white hover:bg-[#032318]'
                    : 'text-slate-500 hover:text-slate-400 hover:bg-[#021a12]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : isAllowed ? 'text-emerald-400 group-hover:text-emerald-200' : 'text-slate-500'
                  }`} />
                  <span className={!isAllowed ? 'line-through text-slate-500' : ''}>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {!isAllowed && (
                    <Lock className="w-3 h-3 text-slate-500" title="Restricted for current role" />
                  )}
                  {item.badge !== undefined && isAllowed && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-emerald-950 text-emerald-300'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-emerald-800/40 bg-[#011811] space-y-2">
        <button
          onClick={exitHandler}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-[#03261a] hover:bg-[#053323] text-emerald-300 hover:text-white border border-emerald-700/40 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Back to Patient Store</span>
        </button>
        <button
          onClick={lockHandler}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/40 transition-colors cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Lock Admin Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-64px)] sticky top-16 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
