import React, { useState } from 'react';
import {
  FolderTree,
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Save,
  Pill,
  ExternalLink
} from 'lucide-react';
import { CategoryItem, MedicineProduct } from '../../types';
import { saveCategoryToFirestore, deleteCategoryFromFirestore, logAdminActivity } from '../../lib/firestoreService';

interface CategoriesSectionProps {
  categories: CategoryItem[];
  products: MedicineProduct[];
  onCategoriesUpdated: () => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  products,
  onCategoriesUpdated
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Product counts per category
  const getProductCount = (categoryName: string) => {
    return products.filter((p) => p.category?.toLowerCase() === categoryName?.toLowerCase()).length;
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setActive(true);
    setSaveMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setIsEditing(true);
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setActive(cat.active ?? true);
    setSaveMessage(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const catId = isEditing && editingCategory ? editingCategory.id : `cat-${Date.now()}`;
      const updatedCategory: CategoryItem = {
        id: catId,
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description.trim(),
        active
      };

      const success = await saveCategoryToFirestore(updatedCategory);
      if (success) {
        setSaveMessage('Category updated in Firestore database.');
        await logAdminActivity(
          isEditing ? `Edited category: ${name}` : `Created category: ${name}`,
          'Categories',
          catId
        );
        onCategoriesUpdated();
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSaving(false);
        }, 500);
      }
    } catch (err) {
      console.error('Error saving category:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (cat: CategoryItem) => {
    const updated: CategoryItem = {
      ...cat,
      active: !cat.active
    };
    await saveCategoryToFirestore(updated);
    await logAdminActivity(
      `Toggled active status of category ${cat.name} to ${!cat.active}`,
      'Categories',
      cat.id
    );
    onCategoriesUpdated();
  };

  const handleDeleteCategory = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      const success = await deleteCategoryFromFirestore(deleteCandidate.id);
      if (success) {
        await logAdminActivity(
          `Deleted category: ${deleteCandidate.name}`,
          'Categories',
          deleteCandidate.id
        );
        onCategoriesUpdated();
      }
      setDeleteCandidate(null);
    } catch (err) {
      console.error('Failed to delete category:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-heading">Category Management</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 font-semibold font-mono">
              {categories.length} Categories
            </span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Configure pharmaceutical treatment categories, clinical group descriptions, and frontend filter classification.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-lg transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-4">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name or clinical scope..."
            className="w-full bg-[#01140e] border border-emerald-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400"
          />
          <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#01140e] border-b border-emerald-800/50 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                <th className="p-4">Category Name & Slug</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-center">Product Count</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40 text-xs text-emerald-200">
              {filteredCategories.map((cat) => {
                const count = getProductCount(cat.name);
                const isActive = cat.active ?? true;

                return (
                  <tr key={cat.id} className="hover:bg-[#032117] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
                          <FolderTree className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{cat.name}</div>
                          <div className="text-[10px] font-mono text-emerald-400/80">/{cat.slug}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-emerald-300/80 max-w-sm text-xs">
                      {cat.description || 'No description provided'}
                    </td>

                    <td className="p-4 text-center">
                      <span className="font-mono font-bold text-white px-2.5 py-1 rounded-full bg-[#01140e] border border-emerald-800/60 text-xs">
                        {count} medicine{count === 1 ? '' : 's'}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{isActive ? 'Active' : 'Disabled'}</span>
                        </span>
                      </button>
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg bg-[#03261a] hover:bg-[#053625] text-emerald-300 hover:text-white border border-emerald-700/50 transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(cat)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/40 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-emerald-600/50 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-serif-heading">
                  {isEditing ? 'Edit Category' : 'Create New Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveMessage && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-emerald-300 mb-1">
                  Category Name <span className="text-rose-400">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Muscle Relaxants & Spasm"
                  className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-300 mb-1">URL Slug:</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. muscle-relaxants"
                  className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-300 mb-1">Clinical Scope & Description:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide medications included and clinical indication context..."
                  className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#01140e] border border-emerald-800/60 rounded-xl">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-[#021811] border-emerald-700 cursor-pointer"
                />
                <label htmlFor="catActive" className="text-xs text-white font-medium cursor-pointer">
                  Active in customer store navigation
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-800/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#03261a] hover:bg-[#043323] text-emerald-300 text-xs font-semibold border border-emerald-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-rose-600/50 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-700/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Category</h3>
                <p className="text-[11px] text-rose-300/80">Permanent database action.</p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/90 leading-relaxed bg-[#01140e] p-3 rounded-xl border border-rose-900/40">
              Are you sure you want to delete category <span className="font-bold text-white">"{deleteCandidate.name}"</span>? Any medications assigned to this category will still remain in the catalog.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl bg-[#03261a] hover:bg-[#043323] text-emerald-300 text-xs font-semibold border border-emerald-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
