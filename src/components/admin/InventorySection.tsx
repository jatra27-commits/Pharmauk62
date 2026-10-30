import React, { useState } from 'react';
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Save,
  Pill,
  RefreshCw,
  TrendingDown
} from 'lucide-react';
import { MedicineProduct } from '../../types';
import { saveProductToFirestore, logAdminActivity } from '../../lib/firestoreService';

interface InventorySectionProps {
  products: MedicineProduct[];
  onProductsUpdated?: () => void;
  onInventoryUpdated?: () => void;
}

export const InventorySection: React.FC<InventorySectionProps> = ({
  products,
  onProductsUpdated,
  onInventoryUpdated
}) => {
  const triggerRefresh = () => {
    if (onProductsUpdated) onProductsUpdated();
    if (onInventoryUpdated) onInventoryUpdated();
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [stockLevelFilter, setStockLevelFilter] = useState<'All' | 'low' | 'out' | 'healthy'>('All');
  
  // Track local edits per product ID: { [productId]: number }
  const [localStock, setLocalStock] = useState<{ [id: string]: number }>({});
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ [id: string]: string }>({});

  const getEffectiveStock = (product: MedicineProduct) => {
    return localStock[product.id] !== undefined ? localStock[product.id] : (product.stockCount ?? 0);
  };

  const handleAdjustDelta = (product: MedicineProduct, delta: number) => {
    const current = getEffectiveStock(product);
    const updated = Math.max(0, current + delta); // Prevent negative stock
    setLocalStock((prev) => ({ ...prev, [product.id]: updated }));
  };

  const handleDirectInput = (product: MedicineProduct, valStr: string) => {
    const num = parseInt(valStr, 10);
    const updated = isNaN(num) ? 0 : Math.max(0, num); // Prevent negative stock
    setLocalStock((prev) => ({ ...prev, [product.id]: updated }));
  };

  const handleSaveStock = async (product: MedicineProduct) => {
    const newCount = getEffectiveStock(product);
    setSavingProductId(product.id);

    try {
      const updatedProduct: MedicineProduct = {
        ...product,
        stockCount: newCount,
        inStock: newCount > 0 // Automatically marked out of stock if 0
      };

      const success = await saveProductToFirestore(updatedProduct);
      if (success) {
        setFeedbackMsg((prev) => ({ ...prev, [product.id]: 'Stock saved!' }));
        await logAdminActivity(
          `Updated stock for ${product.name} to ${newCount} strips`,
          'Inventory',
          product.id,
          `Previous: ${product.stockCount}, New: ${newCount}`
        );
        triggerRefresh();
        setTimeout(() => {
          setFeedbackMsg((prev) => {
            const copy = { ...prev };
            delete copy[product.id];
            return copy;
          });
        }, 2000);
      }
    } catch (err) {
      console.error('Error saving inventory:', err);
    } finally {
      setSavingProductId(null);
    }
  };

  // Quick Restock action (+20 to all low stock items)
  const [isBulkRestocking, setIsBulkRestocking] = useState(false);
  const handleBulkRestockLow = async () => {
    const lowStockItems = products.filter((p) => p.stockCount <= 15);
    if (lowStockItems.length === 0) return;
    
    setIsBulkRestocking(true);
    for (const item of lowStockItems) {
      const updated: MedicineProduct = {
        ...item,
        stockCount: item.stockCount + 25,
        inStock: true
      };
      await saveProductToFirestore(updated);
    }
    await logAdminActivity(
      `Bulk restocked ${lowStockItems.length} low-stock medicines (+25 strips each)`,
      'Inventory',
      'Bulk Action'
    );
    triggerRefresh();
    setIsBulkRestocking(false);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.genericName?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q);

    const count = getEffectiveStock(p);
    let matchesStock = true;
    if (stockLevelFilter === 'low') {
      matchesStock = count > 0 && count <= 15;
    } else if (stockLevelFilter === 'out') {
      matchesStock = count === 0;
    } else if (stockLevelFilter === 'healthy') {
      matchesStock = count > 15;
    }

    return matchesSearch && matchesStock;
  });

  const lowCount = products.filter((p) => p.stockCount > 0 && p.stockCount <= 15).length;
  const outCount = products.filter((p) => p.stockCount === 0 || !p.inStock).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-heading">Inventory & Stock Control</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 font-semibold font-mono">
              Live Vault
            </span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Real-time blister strip inventory. Adjust individual batches or set exact quantities. Negative stock is strictly prevented.
          </p>
        </div>

        {lowCount > 0 && (
          <button
            onClick={handleBulkRestockLow}
            disabled={isBulkRestocking}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isBulkRestocking ? 'animate-spin' : ''}`} />
            <span>{isBulkRestocking ? 'Restocking...' : `Restock Low Items (${lowCount})`}</span>
          </button>
        )}
      </div>

      {/* Overview Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setStockLevelFilter('All')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            stockLevelFilter === 'All' ? 'bg-[#03261a] border-emerald-500' : 'bg-[#021811] border-emerald-800/40'
          }`}
        >
          <div className="text-[11px] text-emerald-400 font-medium">All Medicines</div>
          <div className="text-xl font-bold text-white font-mono mt-0.5">{products.length}</div>
        </div>

        <div 
          onClick={() => setStockLevelFilter('healthy')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            stockLevelFilter === 'healthy' ? 'bg-[#03261a] border-emerald-500' : 'bg-[#021811] border-emerald-800/40'
          }`}
        >
          <div className="text-[11px] text-emerald-300 font-medium">Healthy Stock (&gt;15)</div>
          <div className="text-xl font-bold text-emerald-300 font-mono mt-0.5">
            {products.filter((p) => p.stockCount > 15).length}
          </div>
        </div>

        <div 
          onClick={() => setStockLevelFilter('low')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            stockLevelFilter === 'low' ? 'bg-amber-950/60 border-amber-500' : 'bg-[#021811] border-amber-800/40'
          }`}
        >
          <div className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Low Stock (&le;15)</span>
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono mt-0.5">{lowCount}</div>
        </div>

        <div 
          onClick={() => setStockLevelFilter('out')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            stockLevelFilter === 'out' ? 'bg-rose-950/60 border-rose-500' : 'bg-[#021811] border-rose-900/40'
          }`}
        >
          <div className="text-[11px] text-rose-300 font-medium flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            <span>Out of Stock (0)</span>
          </div>
          <div className="text-xl font-bold text-rose-300 font-mono mt-0.5">{outCount}</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-4">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inventory by medication name or SKU..."
            className="w-full bg-[#01140e] border border-emerald-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400"
          />
          <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl overflow-hidden shadow-sm">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-emerald-400/80 space-y-2">
            <Boxes className="w-10 h-10 text-emerald-700 mx-auto" />
            <div className="text-sm font-bold text-white">No medications match the search</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#01140e] border-b border-emerald-800/50 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  <th className="p-4">Medication & SKU</th>
                  <th className="p-4">Category & Format</th>
                  <th className="p-4 text-center">Status Badge</th>
                  <th className="p-4">Current Stock & Quick Adjust</th>
                  <th className="p-4 text-right">Save Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/40 text-xs text-emerald-200">
                {filteredProducts.map((p) => {
                  const currentCount = getEffectiveStock(p);
                  const isLow = currentCount > 0 && currentCount <= 15;
                  const isOut = currentCount === 0;
                  const hasUnsavedChanges = localStock[p.id] !== undefined && localStock[p.id] !== p.stockCount;
                  const feedback = feedbackMsg[p.id];
                  const isSaving = savingProductId === p.id;

                  return (
                    <tr key={p.id} className="hover:bg-[#032117] transition-colors">
                      {/* Name & SKU */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-300 font-bold shrink-0">
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{p.name}</div>
                            <div className="text-[10px] font-mono text-emerald-400/80">
                              SKU: {p.sku || 'N/A'} • {p.strength}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <div className="font-medium text-white">{p.category}</div>
                        <div className="text-[10px] text-emerald-500/80">{p.format} ({p.unitsPerStrip || 10}/strip)</div>
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            isOut
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : isLow
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {isOut ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'IN STOCK'}
                        </span>
                      </td>

                      {/* Interactive Stock Adjuster */}
                      <td className="p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          {/* Exact number input */}
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={currentCount}
                              onChange={(e) => handleDirectInput(p, e.target.value)}
                              className={`w-20 px-2.5 py-1 rounded-lg font-mono font-bold text-xs text-center border focus:outline-none ${
                                isOut
                                  ? 'bg-rose-950/60 border-rose-700 text-rose-200'
                                  : isLow
                                  ? 'bg-amber-950/60 border-amber-700 text-amber-200'
                                  : 'bg-[#01140e] border-emerald-700 text-white focus:border-emerald-400'
                              }`}
                            />
                            <span className="text-[11px] text-emerald-400/80">strips</span>
                          </div>

                          {/* Quick buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleAdjustDelta(p, -5)}
                              className="px-2 py-1 rounded bg-[#01140e] hover:bg-rose-950 text-rose-300 border border-emerald-800 text-[10px] font-bold cursor-pointer"
                              title="Decrease 5 strips"
                            >
                              -5
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustDelta(p, -1)}
                              className="p-1 rounded bg-[#01140e] hover:bg-rose-950 text-rose-300 border border-emerald-800 text-xs font-bold cursor-pointer"
                              title="Decrease 1 strip"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustDelta(p, 1)}
                              className="p-1 rounded bg-[#01140e] hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-bold cursor-pointer"
                              title="Increase 1 strip"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustDelta(p, 10)}
                              className="px-2 py-1 rounded bg-[#01140e] hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[10px] font-bold cursor-pointer"
                              title="Increase 10 strips"
                            >
                              +10
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustDelta(p, 50)}
                              className="px-2 py-1 rounded bg-[#01140e] hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[10px] font-bold cursor-pointer"
                              title="Increase 50 strips"
                            >
                              +50
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Save Action */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {feedback && (
                            <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                              {feedback}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleSaveStock(p)}
                            disabled={isSaving}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 ${
                              hasUnsavedChanges
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white shadow-md'
                                : 'bg-[#03261a] hover:bg-[#053625] text-emerald-300 hover:text-white border border-emerald-700/50'
                            }`}
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Update'}</span>
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
    </div>
  );
};
