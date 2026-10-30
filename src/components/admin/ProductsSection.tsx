import React, { useState } from 'react';
import {
  Pill,
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Save,
  Image as ImageIcon,
  Tag,
  Boxes,
  ShieldAlert,
  Layers,
  Sparkles,
  ExternalLink,
  MapPin,
  Key,
  Upload,
  Plus,
  Minus,
  Check,
  FileCode,
  DollarSign
} from 'lucide-react';
import { MedicineProduct, ProductCategory, ProductPackOption, StaffRole } from '../../types';
import { saveProductToFirestore, deleteProductFromFirestore, logAdminActivity } from '../../lib/firestoreService';

interface ProductsSectionProps {
  products: MedicineProduct[];
  categories: { id: string; name: string }[];
  onProductsUpdated: () => void;
  openAddModalInitially?: boolean;
  currentUserRole?: StaffRole;
}

const UK_REGIONS = [
  'England',
  'Scotland',
  'Wales',
  'Northern Ireland',
  'Scottish Highlands & Islands',
  'Channel Islands (Jersey & Guernsey)',
  'Isle of Man'
];

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  categories,
  onProductsUpdated,
  openAddModalInitially = false,
  currentUserRole = 'Super Admin'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'inStock' | 'lowStock' | 'outOfStock'>('All');

  // Edit / Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(openAddModalInitially);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MedicineProduct | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Digital Codes Import Modal
  const [digitalCodesModalProduct, setDigitalCodesModalProduct] = useState<MedicineProduct | null>(null);
  const [digitalCodesInput, setDigitalCodesInput] = useState('');
  const [isImportingCodes, setIsImportingCodes] = useState(false);
  const [codesImportSuccess, setCodesImportSuccess] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteCandidate, setDeleteCandidate] = useState<MedicineProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Active form tab in modal: 'general' | 'denominations' | 'regional'
  const [modalTab, setModalTab] = useState<'general' | 'denominations' | 'regional'>('general');

  // Form fields
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Sleep Aids');
  const [legalCategory, setLegalCategory] = useState<'POM' | 'P' | 'GSL' | 'CD'>('CD');
  const [basePrice, setBasePrice] = useState<number>(20.0);
  const [originalPrice, setOriginalPrice] = useState<number>(25.0);
  const [stockCount, setStockCount] = useState<number>(100);
  const [inStock, setInStock] = useState<boolean>(true);
  const [strength, setStrength] = useState('10mg');
  const [format, setFormat] = useState<'Tablets' | 'Capsules' | 'Liquid' | 'Spray' | 'Drops' | 'Cream'>('Tablets');
  const [unitsPerStrip, setUnitsPerStrip] = useState<number>(10);
  const [activeIngredient, setActiveIngredient] = useState('');
  const [badge, setBadge] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [bnfIndication, setBnfIndication] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [regionalAvailability, setRegionalAvailability] = useState<string[]>(UK_REGIONS);

  // Pack denominations state
  const [packOptions, setPackOptions] = useState<ProductPackOption[]>([
    { id: 'pack-1', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 20.0, originalPrice: 20.0, discountPercentage: 0 },
    { id: 'pack-2', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 38.0, originalPrice: 40.0, discountPercentage: 5, popular: true },
    { id: 'pack-3', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 54.0, originalPrice: 60.0, discountPercentage: 10 }
  ]);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setModalTab('general');
    setName('');
    setGenericName('');
    setBrand('');
    setCategory('Sleep Aids');
    setLegalCategory('CD');
    setBasePrice(20.0);
    setOriginalPrice(20.0);
    setStockCount(100);
    setInStock(true);
    setStrength('10mg');
    setFormat('Tablets');
    setUnitsPerStrip(10);
    setActiveIngredient('');
    setBadge('High Demand');
    setSku(`REM-MED-${Math.floor(1000 + Math.random() * 9000)}`);
    setDescription('');
    setBnfIndication('');
    setImageUrl('');
    setPrescriptionRequired(false);
    setBatchNumber(`LOT-${Math.floor(100000 + Math.random() * 900000)}`);
    setExpiryDate('2028-12-31');
    setRegionalAvailability([...UK_REGIONS]);
    setPackOptions([
      { id: 'pack-1', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 20.0, originalPrice: 20.0, discountPercentage: 0 },
      { id: 'pack-2', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 38.0, originalPrice: 40.0, discountPercentage: 5, popular: true }
    ]);
    setSaveMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: MedicineProduct) => {
    setIsEditing(true);
    setEditingProduct(product);
    setModalTab('general');
    setName(product.name || '');
    setGenericName(product.genericName || '');
    setBrand(product.brand || '');
    setCategory(product.category || 'Sleep Aids');
    setLegalCategory(product.legalCategory || 'CD');
    setBasePrice(product.basePrice || 20.0);
    setOriginalPrice(product.originalPrice || product.basePrice);
    setStockCount(product.stockCount ?? 100);
    setInStock(product.inStock ?? true);
    setStrength(product.strength || '');
    setFormat(product.format || 'Tablets');
    setUnitsPerStrip(product.unitsPerStrip || 10);
    setActiveIngredient(product.activeIngredient || '');
    setBadge(product.badge || '');
    setSku(product.sku || '');
    setDescription(product.description || '');
    setBnfIndication(product.bnfIndication || '');
    setImageUrl(product.imageUrl || '');
    setPrescriptionRequired(product.prescriptionRequired || false);
    setBatchNumber(product.batchNumber || `LOT-${Math.floor(100000 + Math.random() * 900000)}`);
    setExpiryDate(product.expiryDate || '2028-12-31');
    setRegionalAvailability(product.regionalAvailability?.length ? product.regionalAvailability : [...UK_REGIONS]);
    setPackOptions(product.packOptions?.length ? product.packOptions : [
      { id: 'pack-1', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: product.basePrice, discountPercentage: 0 }
    ]);
    setSaveMessage(null);
    setIsModalOpen(true);
  };

  // Denominations management
  const handleAddDenomination = () => {
    const strips = packOptions.length + 1;
    const tablets = strips * unitsPerStrip;
    const price = Number((basePrice * strips * 0.95).toFixed(2));
    const orig = Number((basePrice * strips).toFixed(2));
    const newPack: ProductPackOption = {
      id: `pack-${Date.now()}`,
      label: `${strips} Strips (${tablets} Tablets)`,
      stripsCount: strips,
      tabletsCount: tablets,
      price,
      originalPrice: orig,
      discountPercentage: 5,
      freeDelivery: strips >= 20
    };
    setPackOptions([...packOptions, newPack]);
  };

  const handleUpdateDenomination = (index: number, updates: Partial<ProductPackOption>) => {
    const updated = [...packOptions];
    updated[index] = { ...updated[index], ...updates };
    setPackOptions(updated);
  };

  const handleRemoveDenomination = (index: number) => {
    if (packOptions.length <= 1) {
      alert('Product must have at least one pack denomination tier.');
      return;
    }
    const updated = packOptions.filter((_, i) => i !== index);
    setPackOptions(updated);
  };

  // Regional toggle
  const toggleRegion = (region: string) => {
    if (regionalAvailability.includes(region)) {
      if (regionalAvailability.length === 1) {
        alert('Product must be available in at least one region.');
        return;
      }
      setRegionalAvailability(regionalAvailability.filter((r) => r !== region));
    } else {
      setRegionalAvailability([...regionalAvailability, region]);
    }
  };

  const toggleAllRegions = () => {
    if (regionalAvailability.length === UK_REGIONS.length) {
      setRegionalAvailability(['England']);
    } else {
      setRegionalAvailability([...UK_REGIONS]);
    }
  };

  // Quick stock adjuster
  const handleQuickAdjustStock = async (product: MedicineProduct, delta: number) => {
    const newCount = Math.max(0, (product.stockCount || 0) + delta);
    const updated: MedicineProduct = {
      ...product,
      stockCount: newCount,
      inStock: newCount > 0
    };
    await saveProductToFirestore(updated);
    await logAdminActivity(
      'Stock Adjusted',
      'Inventory',
      product.name,
      `Adjusted by ${delta > 0 ? '+' + delta : delta} (New count: ${newCount})`
    );
    onProductsUpdated();
  };

  // Digital codes modal handler
  const handleOpenCodesModal = (product: MedicineProduct) => {
    setDigitalCodesModalProduct(product);
    setDigitalCodesInput('');
    setCodesImportSuccess(null);
  };

  const handleImportDigitalCodes = async () => {
    if (!digitalCodesModalProduct || !digitalCodesInput.trim()) return;
    setIsImportingCodes(true);

    const newCodes = digitalCodesInput
      .split(/[\n,;]+/)
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (newCodes.length === 0) {
      alert('No valid codes found in input.');
      setIsImportingCodes(false);
      return;
    }

    const existingCodes = digitalCodesModalProduct.digitalCodes || [];
    const mergedCodes = Array.from(new Set([...existingCodes, ...newCodes]));

    const updated: MedicineProduct = {
      ...digitalCodesModalProduct,
      digitalCodes: mergedCodes
    };

    const success = await saveProductToFirestore(updated);
    if (success) {
      await logAdminActivity(
        'Imported Digital Codes',
        'Products',
        digitalCodesModalProduct.name,
        `Imported ${newCodes.length} codes. Total loaded: ${mergedCodes.length}`
      );
      setCodesImportSuccess(`Successfully imported ${newCodes.length} digital codes.`);
      setDigitalCodesInput('');
      onProductsUpdated();
    } else {
      alert('Failed to save imported digital codes to Firestore.');
    }
    setIsImportingCodes(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please provide a medication name.');
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const prodId = isEditing && editingProduct ? editingProduct.id : `rem-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(100 + Math.random() * 900)}`;

      const productPayload: MedicineProduct = {
        id: prodId,
        name: name.trim(),
        genericName: genericName.trim() || name.trim(),
        brand: brand.trim() || 'Square Pharmaceuticals',
        category,
        legalCategory,
        basePrice: Number(basePrice),
        originalPrice: Number(originalPrice || basePrice),
        rating: editingProduct?.rating || 4.9,
        reviewCount: editingProduct?.reviewCount || 120,
        inStock,
        stockCount: Number(stockCount),
        strength: strength.trim() || '10mg',
        format,
        unitsPerStrip: Number(unitsPerStrip),
        stripSize: `${unitsPerStrip} ${format} / Strip`,
        activeIngredient: activeIngredient.trim() || `${name} (Pure Ph. Eur)`,
        badge: badge.trim(),
        sku: sku.trim() || `REM-${prodId.toUpperCase()}`,
        description: description.trim() || `${name} genuine prescription blister pack from licensed UK dispensary.`,
        bnfIndication: bnfIndication.trim() || 'Short-term medical relief as prescribed by clinician.',
        dosageAdult: editingProduct?.dosageAdult || 'Take orally with water as instructed on blister packaging.',
        usageInstructions: editingProduct?.usageInstructions || [
          'Take with a full glass of water, with or without meals.',
          'Allow adequate time for therapeutic onset.',
          'Store below 25°C away from direct sunlight.'
        ],
        cautions: editingProduct?.cautions || [
          'May cause drowsiness; avoid driving or operating heavy equipment.',
          'Do not combine with alcohol or sedatives.'
        ],
        commonSideEffects: editingProduct?.commonSideEffects || [
          'Mild sedation or relaxation',
          'Lightheadedness'
        ],
        imageUrl: imageUrl.trim() || editingProduct?.imageUrl,
        deliveryEstimate: 'Guaranteed Next-Day Delivery via Royal Mail Tracked',
        prescriptionRequired,
        batchNumber: batchNumber.trim(),
        expiryDate: expiryDate.trim(),
        regionalAvailability,
        digitalCodes: editingProduct?.digitalCodes || [],
        packOptions
      };

      const success = await saveProductToFirestore(productPayload);
      if (success) {
        await logAdminActivity(
          isEditing ? 'Updated Medicine Catalog' : 'Added New Medicine',
          'Products',
          productPayload.name,
          `Base: £${productPayload.basePrice.toFixed(2)} | Stock: ${productPayload.stockCount} strips | ${packOptions.length} Denominations`
        );
        setSaveMessage('Medication saved to dispensary catalog successfully.');
        setTimeout(() => {
          setIsModalOpen(false);
          onProductsUpdated();
        }, 600);
      } else {
        alert('Failed to save product in database.');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('An unexpected error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      const success = await deleteProductFromFirestore(deleteCandidate.id);
      if (success) {
        await logAdminActivity(
          'Deleted Medicine from Catalog',
          'Products',
          deleteCandidate.name,
          `Removed SKU: ${deleteCandidate.sku}`
        );
        setDeleteCandidate(null);
        onProductsUpdated();
      } else {
        alert('Could not delete product.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name?.toLowerCase().includes(q) ||
      p.genericName?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q);

    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'inStock') matchesStock = p.inStock && (p.stockCount ?? 0) > 15;
    else if (stockFilter === 'lowStock') matchesStock = (p.stockCount ?? 0) > 0 && (p.stockCount ?? 0) <= 15;
    else if (stockFilter === 'outOfStock') matchesStock = !p.inStock || (p.stockCount ?? 0) === 0;

    return matchesSearch && matchesCat && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-heading">Product Catalog & Denominations</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 font-mono font-semibold">
              {products.length} Formulations Active
            </span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Manage denominations, regional distribution, strip pricing, digital batch authentication tokens, and inventory reserves.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-md transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, generic, SKU, brand..."
            className="w-full bg-[#01140e] border border-emerald-800/60 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-emerald-600/60 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#01140e] border border-emerald-800/60 rounded-xl px-3 py-2 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Sleep Aids">Sleep Aids</option>
            <option value="Anxiety & Calm">Anxiety & Calm</option>
            <option value="Pain Relief">Pain Relief</option>
            <option value="Nootropics & Focus">Nootropics & Focus</option>
          </select>

          {/* Stock Filter */}
          <div className="flex items-center bg-[#01140e] border border-emerald-800/60 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setStockFilter('All')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                stockFilter === 'All' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
              }`}
            >
              All Stock
            </button>
            <button
              onClick={() => setStockFilter('lowStock')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                stockFilter === 'lowStock' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:text-white'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setStockFilter('outOfStock')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                stockFilter === 'outOfStock' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:text-white'
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl overflow-hidden shadow-sm">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-xs text-emerald-400/70">
            No medications found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-800/40 text-emerald-400 font-semibold bg-[#01140e]/60">
                  <th className="p-4">Medication & Strength</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Base (1 Strip)</th>
                  <th className="p-4">Denominations</th>
                  <th className="p-4">Regional Availability</th>
                  <th className="p-4">Stock & Restock</th>
                  <th className="p-4">Digital Codes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/30 text-slate-200">
                {filteredProducts.map((p) => {
                  const isOut = !p.inStock || (p.stockCount ?? 0) === 0;
                  const isLow = (p.stockCount ?? 0) > 0 && (p.stockCount ?? 0) <= 15;
                  const codesCount = p.digitalCodes?.length || 0;
                  const regionsCount = p.regionalAvailability?.length || UK_REGIONS.length;

                  return (
                    <tr key={p.id} className="hover:bg-emerald-950/20 transition-colors">
                      {/* Name */}
                      <td className="p-4">
                        <div className="font-bold text-white text-xs">{p.name}</div>
                        <div className="text-[10px] text-emerald-400/80">
                          {p.genericName} • {p.strength} • <span className="font-mono text-emerald-300">{p.sku}</span>
                        </div>
                        {p.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 mt-1 inline-block">
                            {p.badge}
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="text-xs text-white font-medium">{p.category}</span>
                        <div className="text-[10px] text-emerald-500/80">{p.legalCategory} • {p.format}</div>
                      </td>

                      {/* Base Price */}
                      <td className="p-4 font-mono font-bold text-white">
                        £{(p.basePrice || 0).toFixed(2)}
                      </td>

                      {/* Denominations */}
                      <td className="p-4 text-xs">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50 font-semibold font-mono">
                          {p.packOptions?.length || 1} Tiers
                        </span>
                        <div className="text-[10px] text-emerald-400/70 mt-1 truncate max-w-[130px]">
                          {p.packOptions?.[p.packOptions.length - 1]?.label}
                        </div>
                      </td>

                      {/* Regional Availability */}
                      <td className="p-4 text-xs">
                        <span className="px-2 py-0.5 rounded-full bg-[#01140e] border border-emerald-800/60 text-emerald-300 font-medium">
                          {regionsCount === UK_REGIONS.length ? 'UK Nationwide' : `${regionsCount} Regions`}
                        </span>
                      </td>

                      {/* Stock & Quick Adjust */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isOut
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : isLow
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {isOut ? 'Depleted (0)' : isLow ? `Low (${p.stockCount})` : `In Stock (${p.stockCount})`}
                          </span>

                          {/* Quick Adjust Buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQuickAdjustStock(p, -10)}
                              className="p-1 rounded bg-[#01140e] hover:bg-rose-950 text-slate-300 hover:text-white border border-emerald-800/40 cursor-pointer"
                              title="Decrease stock by 10"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleQuickAdjustStock(p, 50)}
                              className="p-1 rounded bg-[#01140e] hover:bg-emerald-950 text-emerald-400 hover:text-white border border-emerald-800/40 cursor-pointer"
                              title="Restock +50 strips"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Digital Codes */}
                      <td className="p-4">
                        <button
                          onClick={() => handleOpenCodesModal(p)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#01140e] hover:bg-[#03261a] border border-emerald-800/50 text-emerald-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                          title="Import digital tokens & batch lot codes"
                        >
                          <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{codesCount} Codes</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg bg-[#03261a] hover:bg-[#053625] text-emerald-300 hover:text-white border border-emerald-700/50 transition-colors cursor-pointer"
                            title="Edit product, denominations and regions"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteCandidate(p)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/40 transition-colors cursor-pointer"
                            title="Delete medicine"
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
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ADD / EDIT MEDICINE MODAL WITH DENOMINATIONS & REGIONS
         ───────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#021811] border border-emerald-600/50 rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-serif-heading">
                    {isEditing ? `Edit ${name || 'Medication'}` : 'Register New Dispensary Medication'}
                  </h3>
                  <p className="text-[11px] text-emerald-400/80">Configure catalog specs, strip denominations, pricing, and regional rules</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-emerald-900/40 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-emerald-800/40 pb-2">
              <button
                type="button"
                onClick={() => setModalTab('general')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  modalTab === 'general' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
                }`}
              >
                1. General & Pricing
              </button>
              <button
                type="button"
                onClick={() => setModalTab('denominations')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'denominations' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
                }`}
              >
                <span>2. Denominations & Tiers</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-600/40 font-mono">
                  {packOptions.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('regional')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'regional' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
                }`}
              >
                <span>3. Regional Availability</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-600/40 font-mono">
                  {regionalAvailability.length}
                </span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* TAB 1: GENERAL & BASE PRICING */}
              {modalTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-emerald-300 mb-1">
                        Product Name & Strength <span className="text-rose-400">*</span>:
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sedil 5mg Tablets (Diazepam)"
                        className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-emerald-300 mb-1">Generic Active Ingredient:</label>
                      <input
                        type="text"
                        value={genericName}
                        onChange={(e) => setGenericName(e.target.value)}
                        placeholder="e.g. Diazepam"
                        className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-emerald-300 mb-1">Manufacturer / Brand:</label>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="e.g. Square Pharmaceuticals"
                        className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-emerald-300 mb-1">Category:</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ProductCategory)}
                        className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                      >
                        <option value="Sleep Aids">Sleep Aids</option>
                        <option value="Anxiety & Calm">Anxiety & Calm</option>
                        <option value="Pain Relief">Pain Relief</option>
                        <option value="Nootropics & Focus">Nootropics & Focus</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-emerald-300 mb-1">Base Price (1 Strip - £) <span className="text-rose-400">*</span>:</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={basePrice}
                        onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-emerald-300 mb-1">Compare Price (£):</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-emerald-300 mb-1">Current Stock Quantity (Strips):</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={stockCount}
                        onChange={(e) => setStockCount(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-emerald-300 mb-1">Units (Tablets) Per Strip:</label>
                      <input
                        type="number"
                        min="1"
                        value={unitsPerStrip}
                        onChange={(e) => setUnitsPerStrip(parseInt(e.target.value) || 10)}
                        className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-emerald-300 mb-1">Batch / Lot Number:</label>
                      <input
                        type="text"
                        value={batchNumber}
                        onChange={(e) => setBatchNumber(e.target.value)}
                        placeholder="LOT-920491"
                        className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-emerald-300 mb-1">Expiry Date:</label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-emerald-300 mb-1">Clinical Description:</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Pharmacology, formulation, and indication..."
                      className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[#01140e] border border-emerald-800/60 rounded-xl">
                    <input
                      type="checkbox"
                      id="inStockCheck"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-[#021811] border-emerald-700 cursor-pointer"
                    />
                    <label htmlFor="inStockCheck" className="text-xs text-white font-medium cursor-pointer">
                      Available for immediate dispense (In Stock)
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: DENOMINATIONS & PACK TIERS */}
              {modalTab === 'denominations' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">Strip Denominations & Volume Tiers</h4>
                      <p className="text-[11px] text-emerald-400/80">Configure quantity strip tiers, discounts, and free delivery thresholds.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddDenomination}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Tier</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {packOptions.map((pack, idx) => (
                      <div
                        key={pack.id || idx}
                        className="p-3 rounded-xl bg-[#01140e] border border-emerald-800/60 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                      >
                        {/* Label */}
                        <div className="sm:col-span-4">
                          <label className="text-[10px] text-emerald-400 font-medium block">Pack Label</label>
                          <input
                            type="text"
                            value={pack.label}
                            onChange={(e) => handleUpdateDenomination(idx, { label: e.target.value })}
                            className="w-full bg-[#021811] border border-emerald-700 rounded-lg p-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>

                        {/* Strips */}
                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-emerald-400 font-medium block">Strips</label>
                          <input
                            type="number"
                            min="1"
                            value={pack.stripsCount || 1}
                            onChange={(e) => {
                              const s = parseInt(e.target.value) || 1;
                              handleUpdateDenomination(idx, {
                                stripsCount: s,
                                tabletsCount: s * unitsPerStrip
                              });
                            }}
                            className="w-full bg-[#021811] border border-emerald-700 rounded-lg p-1.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>

                        {/* Tablets */}
                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-emerald-400 font-medium block">Tablets</label>
                          <input
                            type="number"
                            min="1"
                            value={pack.tabletsCount}
                            onChange={(e) => handleUpdateDenomination(idx, { tabletsCount: parseInt(e.target.value) || 1 })}
                            className="w-full bg-[#021811] border border-emerald-700 rounded-lg p-1.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>

                        {/* Price */}
                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-emerald-400 font-medium block">Price (£)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={pack.price}
                            onChange={(e) => handleUpdateDenomination(idx, { price: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-[#021811] border border-emerald-700 rounded-lg p-1.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>

                        {/* Actions & Free Delivery */}
                        <div className="sm:col-span-2 flex items-center justify-between gap-1 mt-3 sm:mt-0">
                          <label className="flex items-center gap-1 text-[11px] text-emerald-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={pack.freeDelivery || false}
                              onChange={(e) => handleUpdateDenomination(idx, { freeDelivery: e.target.checked })}
                              className="w-3.5 h-3.5 rounded text-emerald-500 bg-[#021811] border-emerald-700"
                            />
                            <span>Free Post</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => handleRemoveDenomination(idx)}
                            className="p-1.5 rounded-lg hover:bg-rose-950 text-rose-400 hover:text-rose-200"
                            title="Remove denomination"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: REGIONAL AVAILABILITY */}
              {modalTab === 'regional' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">Regional Dispensary Distribution</h4>
                      <p className="text-[11px] text-emerald-400/80">Select allowed territories for patient delivery and Royal Mail service coverage.</p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleAllRegions}
                      className="px-3 py-1.5 rounded-lg bg-[#01140e] hover:bg-[#03261a] border border-emerald-700/60 text-emerald-300 text-xs font-semibold cursor-pointer"
                    >
                      {regionalAvailability.length === UK_REGIONS.length ? 'Clear Non-England' : 'Select All Regions'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {UK_REGIONS.map((region) => {
                      const isSelected = regionalAvailability.includes(region);
                      return (
                        <div
                          key={region}
                          onClick={() => toggleRegion(region)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#03261a] border-emerald-500 text-white shadow-sm'
                              : 'bg-[#01140e] border-emerald-900/60 text-slate-400 hover:border-emerald-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                            <span className="font-medium text-xs">{region}</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            isSelected ? 'bg-emerald-600 border-emerald-400 text-white' : 'border-slate-700'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {saveMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs">
                  {saveMessage}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-emerald-800/40">
                <div className="text-[11px] text-emerald-400/70">
                  {packOptions.length} Denominations • {regionalAvailability.length} Regions
                </div>
                <div className="flex items-center gap-2">
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
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving to Database...' : isEditing ? 'Save Changes' : 'Create Medicine'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          DIGITAL CODES IMPORT MODAL
         ───────────────────────────────────────────────────────────── */}
      {digitalCodesModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-emerald-600/50 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-serif-heading">
                  Import Digital Codes & Serials
                </h3>
              </div>
              <button
                onClick={() => setDigitalCodesModalProduct(null)}
                className="p-1 rounded-lg hover:bg-emerald-900/40 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-emerald-400/80">
              Paste batches of digital verification tokens, e-prescription serials, or product authentication keys for <strong>{digitalCodesModalProduct.name}</strong>.
            </p>

            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">
                Batch Digital Codes (One per line or comma separated):
              </label>
              <textarea
                rows={6}
                value={digitalCodesInput}
                onChange={(e) => setDigitalCodesInput(e.target.value)}
                placeholder="REM-SEC-90218-A&#10;REM-SEC-90219-B&#10;REM-SEC-90220-C"
                className="w-full bg-[#01140e] border border-emerald-800/60 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {codesImportSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300">
                {codesImportSuccess}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-emerald-400/70 pt-2 border-t border-emerald-800/40">
              <span>Already Loaded: {digitalCodesModalProduct.digitalCodes?.length || 0} Codes</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDigitalCodesModalProduct(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#01140e] hover:bg-[#03261a] text-slate-300 font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleImportDigitalCodes}
                  disabled={isImportingCodes || !digitalCodesInput.trim()}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold disabled:opacity-50"
                >
                  {isImportingCodes ? 'Importing...' : 'Import Codes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-rose-600/50 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-700/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Medication</h3>
                <p className="text-[11px] text-rose-300/80">This action will remove it from the patient catalog.</p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/90 leading-relaxed bg-[#01140e] p-3 rounded-xl border border-rose-900/40">
              Are you sure you want to delete <span className="font-bold text-white">"{deleteCandidate.name}"</span>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl bg-[#03261a] hover:bg-[#043323] text-emerald-300 text-xs font-semibold border border-emerald-800 cursor-pointer"
              >
                Keep Medication
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
