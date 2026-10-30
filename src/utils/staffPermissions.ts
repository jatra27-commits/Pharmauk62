import { StaffRole, AdminMenuKey } from '../types';

export interface RolePermissionDetails {
  title: string;
  description: string;
  badgeColor: string;
  allowedTabs: AdminMenuKey[];
  capabilities: {
    canViewFinancials: boolean;
    canExportReports: boolean;
    canApproveRefunds: boolean;
    canVerifyPayments: boolean;
    canReviewSuspiciousOrders: boolean;
    canResendNotifications: boolean;
    canEditProducts: boolean;
    canManagePricing: boolean;
    canImportCodes: boolean;
    canManageStock: boolean;
    canManageStaff: boolean;
    canManageSettings: boolean;
  };
}

export const ROLE_PERMISSIONS: Record<StaffRole, RolePermissionDetails> = {
  'Super Admin': {
    title: 'Super Admin',
    description: 'Unrestricted central control over all clinical dispensary operations, finances, catalog, orders, and staff permissions.',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    allowedTabs: [
      'dashboard',
      'orders',
      'products',
      'finance',
      'inventory',
      'staff',
      'categories',
      'coupons',
      'autorefill',
      'banners',
      'reviews',
      'subscribers',
      'analytics',
      'settings'
    ],
    capabilities: {
      canViewFinancials: true,
      canExportReports: true,
      canApproveRefunds: true,
      canVerifyPayments: true,
      canReviewSuspiciousOrders: true,
      canResendNotifications: true,
      canEditProducts: true,
      canManagePricing: true,
      canImportCodes: true,
      canManageStock: true,
      canManageStaff: true,
      canManageSettings: true
    }
  },
  'Finance Manager': {
    title: 'Finance Manager',
    description: 'Executive oversight of gross sales, net margins, payment gateway reconciliation, refund approvals, and accounting exports.',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    allowedTabs: [
      'dashboard',
      'finance',
      'orders',
      'analytics',
      'coupons',
      'autorefill'
    ],
    capabilities: {
      canViewFinancials: true,
      canExportReports: true,
      canApproveRefunds: true,
      canVerifyPayments: true,
      canReviewSuspiciousOrders: true,
      canResendNotifications: false,
      canEditProducts: false,
      canManagePricing: false,
      canImportCodes: false,
      canManageStock: false,
      canManageStaff: false,
      canManageSettings: false
    }
  },
  'Order Manager': {
    title: 'Order Manager',
    description: 'Fulfillment operations, prescription verification, fraud review, dispatch tracking, and delivery notifications.',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    allowedTabs: [
      'dashboard',
      'orders',
      'inventory',
      'autorefill',
      'subscribers'
    ],
    capabilities: {
      canViewFinancials: false,
      canExportReports: false,
      canApproveRefunds: false, // can flag/request, but only Finance/SuperAdmin approves
      canVerifyPayments: true,
      canReviewSuspiciousOrders: true,
      canResendNotifications: true,
      canEditProducts: false,
      canManagePricing: false,
      canImportCodes: false,
      canManageStock: false,
      canManageStaff: false,
      canManageSettings: false
    }
  },
  'Customer Support': {
    title: 'Customer Support',
    description: 'Assisting patients, order status tracking, resending dispatch notifications, reviews, and customer inquiries.',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    allowedTabs: [
      'dashboard',
      'orders',
      'reviews',
      'subscribers',
      'autorefill'
    ],
    capabilities: {
      canViewFinancials: false,
      canExportReports: false,
      canApproveRefunds: false,
      canVerifyPayments: false,
      canReviewSuspiciousOrders: false,
      canResendNotifications: true,
      canEditProducts: false,
      canManagePricing: false,
      canImportCodes: false,
      canManageStock: false,
      canManageStaff: false,
      canManageSettings: false
    }
  },
  'Inventory Manager': {
    title: 'Inventory Manager',
    description: 'Product catalog stewardship, denomination pack tiers, regional delivery rules, pricing adjustments, digital code imports, and stock reserves.',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    allowedTabs: [
      'dashboard',
      'products',
      'inventory',
      'categories',
      'banners'
    ],
    capabilities: {
      canViewFinancials: false,
      canExportReports: false,
      canApproveRefunds: false,
      canVerifyPayments: false,
      canReviewSuspiciousOrders: false,
      canResendNotifications: false,
      canEditProducts: true,
      canManagePricing: true,
      canImportCodes: true,
      canManageStock: true,
      canManageStaff: false,
      canManageSettings: false
    }
  }
};

export function canAccessTab(role: StaffRole | string, tab: AdminMenuKey): boolean {
  if (role === 'Super Admin') return true;
  return ROLE_PERMISSIONS[role as StaffRole]?.allowedTabs?.includes(tab) ?? false;
}

export function getRoleCapabilities(role: StaffRole | string) {
  return ROLE_PERMISSIONS[role as StaffRole]?.capabilities || ROLE_PERMISSIONS['Customer Support'].capabilities;
}
