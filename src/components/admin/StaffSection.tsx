import React, { useState } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Edit2,
  Trash2,
  Check,
  X,
  Lock,
  Unlock,
  Key,
  Mail,
  Phone,
  Briefcase,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { StaffMember, StaffRole } from '../../types';
import { ROLE_PERMISSIONS, RolePermissionDetails } from '../../utils/staffPermissions';
import { saveStaffMemberToFirestore, deleteStaffMemberFromFirestore, logAdminActivity } from '../../lib/firestoreService';

interface StaffSectionProps {
  staffMembers: StaffMember[];
  currentRole: StaffRole;
  onRoleChanged: (role: StaffRole) => void;
  onStaffUpdated: () => void;
}

const ALL_ROLES: StaffRole[] = [
  'Super Admin',
  'Finance Manager',
  'Order Manager',
  'Customer Support',
  'Inventory Manager'
];

export const StaffSection: React.FC<StaffSectionProps> = ({
  staffMembers,
  currentRole,
  onRoleChanged,
  onStaffUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'matrix'>('members');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<StaffRole>('Order Manager');
  const [formDepartment, setFormDepartment] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setFormName('');
    setFormEmail('');
    setFormRole('Order Manager');
    setFormDepartment('Dispense Operations');
    setFormPhone('');
    setFormStatus('Active');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormName(staff.name);
    setFormEmail(staff.email);
    setFormRole(staff.role);
    setFormDepartment(staff.department || '');
    setFormPhone(staff.phone || '');
    setFormStatus(staff.status);
    setIsModalOpen(true);
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      alert('Please fill in both name and email.');
      return;
    }

    setIsSubmitting(true);
    const newStaff: StaffMember = {
      id: editingStaff ? editingStaff.id : `staff-${Date.now()}`,
      name: formName.trim(),
      email: formEmail.trim(),
      role: formRole,
      department: formDepartment.trim() || 'Dispensary Staff',
      phone: formPhone.trim() || '+44 7700 900000',
      status: formStatus,
      lastLogin: editingStaff ? editingStaff.lastLogin : 'Never logged in',
      createdAt: editingStaff ? editingStaff.createdAt : Date.now(),
      avatarColor: formRole === 'Super Admin' ? 'from-emerald-500 to-teal-700' :
                   formRole === 'Finance Manager' ? 'from-amber-500 to-orange-700' :
                   formRole === 'Order Manager' ? 'from-blue-500 to-indigo-700' :
                   formRole === 'Customer Support' ? 'from-purple-500 to-pink-700' : 'from-teal-500 to-emerald-800'
    };

    const success = await saveStaffMemberToFirestore(newStaff);
    if (success) {
      await logAdminActivity(
        editingStaff ? 'Updated Staff Permissions' : 'Added New Staff Member',
        'Settings',
        newStaff.name,
        `Role set to ${newStaff.role} (${newStaff.department})`
      );
      setNotification(`Staff record for ${newStaff.name} saved successfully.`);
      setIsModalOpen(false);
      onStaffUpdated();
      setTimeout(() => setNotification(null), 3000);
    } else {
      alert('Failed to save staff record to Firestore.');
    }
    setIsSubmitting(false);
  };

  const handleDeleteStaff = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to revoke access and delete staff record for ${name}?`)) {
      const success = await deleteStaffMemberFromFirestore(id);
      if (success) {
        await logAdminActivity('Revoked Staff Access', 'Settings', name);
        onStaffUpdated();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-heading">Staff & Access Control (RBAC)</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 font-mono font-semibold">
              GPhC Security Roles
            </span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Enforce role-based security boundaries across Super Admin, Finance Manager, Order Manager, Customer Support, and Inventory Manager.
          </p>
        </div>

        {/* Action Controls & Tab switcher */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center bg-[#01140e] border border-emerald-800/60 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('members')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'members' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
              }`}
            >
              Staff Directory ({staffMembers.length})
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'matrix' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
              }`}
            >
              Role Permission Matrix
            </button>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-300 animate-fadeIn">
          <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Active Role Quick-Switch Banner */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-600/50 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-emerald-400/80 font-medium">Active Operating Role (Live Session)</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{currentRole}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${ROLE_PERMISSIONS[currentRole].badgeColor}`}>
                Active Mode
              </span>
            </div>
          </div>
        </div>

        {/* Switchers */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-emerald-400/70">Test Permissions As:</span>
          {ALL_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => onRoleChanged(role)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                currentRole === role
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-[#01140e] text-emerald-300 border-emerald-800/50 hover:bg-[#03261a]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: MEMBERS DIRECTORY */}
      {activeTab === 'members' && (
        <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white font-serif-heading">Active Staff & Dispensary Officers</h2>
              <p className="text-xs text-emerald-400/80">Authorized dispensary employees with granted operational tiers</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-800/40 text-emerald-400 font-semibold">
                  <th className="pb-3">Staff Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Granted Role</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Last Active</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/30 text-slate-200">
                {staffMembers.map((staff) => {
                  const roleConfig = ROLE_PERMISSIONS[staff.role] || ROLE_PERMISSIONS['Super Admin'];
                  return (
                    <tr key={staff.id} className="hover:bg-emerald-950/20">
                      <td className="py-3.5 font-medium flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${staff.avatarColor || 'from-emerald-600 to-teal-800'} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                          {staff.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{staff.name}</div>
                          {staff.phone && <div className="text-[11px] text-emerald-400/70">{staff.phone}</div>}
                        </div>
                      </td>
                      <td className="py-3.5 text-slate-300 font-mono text-[11px]">{staff.email}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${roleConfig.badgeColor}`}>
                          {staff.role}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-300">{staff.department}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          staff.status === 'Active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' : 'bg-slate-900 text-slate-400 border border-slate-700'
                        }`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-400">{staff.lastLogin}</td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onRoleChanged(staff.role)}
                            className="p-1.5 rounded-lg bg-[#01140e] hover:bg-emerald-900/50 text-emerald-400 hover:text-white border border-emerald-800/40 transition-colors cursor-pointer"
                            title={`Switch active session to ${staff.role}`}
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(staff)}
                            className="p-1.5 rounded-lg bg-[#01140e] hover:bg-emerald-900/50 text-emerald-400 hover:text-white border border-emerald-800/40 transition-colors cursor-pointer"
                            title="Edit Staff Member"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {staffMembers.length > 1 && (
                            <button
                              onClick={() => handleDeleteStaff(staff.id, staff.name)}
                              className="p-1.5 rounded-lg bg-[#01140e] hover:bg-rose-950/60 text-rose-400 hover:text-rose-200 border border-rose-900/40 transition-colors cursor-pointer"
                              title="Revoke Staff Access"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ROLE PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-5">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-white font-serif-heading">Role Access Permission Matrix</h2>
            <p className="text-xs text-emerald-400/80">
              Clear breakdown of administrative capabilities by designated dispensary role
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-800/40 text-emerald-400 font-semibold">
                  <th className="pb-3">Dispensary Capability</th>
                  {ALL_ROLES.map((role) => (
                    <th key={role} className="pb-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] border ${ROLE_PERMISSIONS[role].badgeColor}`}>
                        {role}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/30 text-slate-200">
                <tr>
                  <td className="py-3 font-medium text-white">Full Financials & Gross/Net Margins</td>
                  {ALL_ROLES.map((role) => (
                    <td key={role} className="py-3 text-center">
                      {ROLE_PERMISSIONS[role].capabilities.canViewFinancials ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400/60 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 font-medium text-white">Export Financial & CSV Reports</td>
                  {ALL_ROLES.map((role) => (
                    <td key={role} className="py-3 text-center">
                      {ROLE_PERMISSIONS[role].capabilities.canExportReports ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400/60 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 font-medium text-white">Approve & Settle Refunds</td>
                  {ALL_ROLES.map((role) => (
                    <td key={role} className="py-3 text-center">
                      {ROLE_PERMISSIONS[role].capabilities.canApproveRefunds ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400/60 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 font-medium text-white">Verify Bank/Crypto Payments</td>
                  {ALL_ROLES.map((role) => (
                    <td key={role} className="py-3 text-center">
                      {ROLE_PERMISSIONS[role].capabilities.canVerifyPayments ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400/60 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 font-medium text-white">Review Suspicious Orders & Fraud Risk</td>
                  {ALL_ROLES.map((role) => (
                    <td key={role} className="py-3 text-center">
                      {ROLE_PERMISSIONS[role].capabilities.canReviewSuspiciousOrders ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400/60 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 font-medium text-white">Resend Dispatch & Delivery Notifications</td>
                  {ALL_ROLES.map((role) => (
                    <td key={role} className="py-3 text-center">
                      {ROLE_PERMISSIONS[role].capabilities.canResendNotifications ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400/60 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 font-medium text-white">Add/Edit Medicine Catalog & Formulations</td>
                  {ALL_ROLES.map((role) => (
                    <td key={role} className="py-3 text-center">
                      {ROLE_PERMISSIONS[role].capabilities.canEditProducts ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400/60 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 font-medium text-white">Set Denominations & Pricing Tiers</td>
                  {ALL_ROLES.map((role) => (
                    <td key={role} className="py-3 text-center">
                      {ROLE_PERMISSIONS[role].capabilities.canManagePricing ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400/60 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 font-medium text-white">Import Digital Codes & Batches</td>
                  {ALL_ROLES.map((role) => (
                    <td key={role} className="py-3 text-center">
                      {ROLE_PERMISSIONS[role].capabilities.canImportCodes ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400/60 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 font-medium text-white">Monitor & Restock Inventory Reserves</td>
                  {ALL_ROLES.map((role) => (
                    <td key={role} className="py-3 text-center">
                      {ROLE_PERMISSIONS[role].capabilities.canManageStock ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400/60 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 font-medium text-white">Manage Staff & Role Permissions</td>
                  {ALL_ROLES.map((role) => (
                    <td key={role} className="py-3 text-center">
                      {ROLE_PERMISSIONS[role].capabilities.canManageStaff ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400/60 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#021811] border border-emerald-700/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-800/40 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-serif-heading">
                  {editingStaff ? 'Edit Staff Member Permissions' : 'Register New Staff Member'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-emerald-900/40 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-emerald-300 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Dr. Alistair Vance"
                  className="w-full bg-[#01140e] border border-emerald-800/60 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-emerald-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="staff@puresleep.co.uk"
                    className="w-full bg-[#01140e] border border-emerald-800/60 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-emerald-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+44 7700 900000"
                    className="w-full bg-[#01140e] border border-emerald-800/60 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-emerald-300 mb-1">Assigned Role (RBAC Tier)</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as StaffRole)}
                  className="w-full bg-[#01140e] border border-emerald-800/60 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r} — {ROLE_PERMISSIONS[r].title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-emerald-400/80 mt-1">
                  {ROLE_PERMISSIONS[formRole].description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-emerald-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    placeholder="e.g. Accounts & Settlement"
                    className="w-full bg-[#01140e] border border-emerald-800/60 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-emerald-300 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                    className="w-full bg-[#01140e] border border-emerald-800/60 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-800/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#01140e] hover:bg-[#03261a] text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingStaff ? 'Save Changes' : 'Create Staff Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
