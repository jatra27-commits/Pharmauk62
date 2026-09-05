import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Pill, 
  Truck, 
  CheckCircle2, 
  Calendar,
  Building
} from 'lucide-react';
import { OrderRecord } from '../types';

interface InvoiceModalProps {
  order: OrderRecord | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  onClose
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-[#0f172a] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions bar (print/close) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Invoice Container */}
        <div className="bg-[#111c30] border border-slate-700 rounded-xl p-6 space-y-6 text-xs text-slate-300">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-serif-heading font-extrabold text-sm">
                  PS
                </div>
                <span className="text-base font-bold text-white font-serif-heading">
                  PureSleep Pharma UK
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                GPhC Registered Online Pharmacy Dispensary #9012384
              </p>
              <p className="text-[10px] text-slate-500">
                14 Harley Street, Marylebone, London W1G 9PQ
              </p>
            </div>

            <div className="text-left sm:text-right space-y-0.5">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Official Pharmacy Receipt
              </span>
              <p className="font-mono font-bold text-white text-sm">Invoice #{order.id}</p>
              <p className="text-[11px] text-slate-400">Date: {order.date}</p>
              <p className="text-[10px] text-slate-500 font-mono">Tracking: {order.trackingNumber}</p>
            </div>
          </div>

          {/* Patient & Dispatch Details */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase">Patient Delivery Address:</span>
              <p className="font-bold text-white mt-0.5">{order.customerName}</p>
              <p>{order.deliveryAddress}</p>
              <p>{order.city}, {order.postcode}</p>
              <p className="text-slate-400 text-[11px]">Phone: {order.phone}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-cyan-400 uppercase">Dispatch & Payment:</span>
              <p className="font-semibold text-white mt-0.5">{order.shippingMethod}</p>
              <p className="capitalize">Method: {order.paymentMethod.replace('_', ' ')}</p>
              <p className="text-cyan-300 font-medium">Status: {order.status}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-cyan-400">
                  <th className="pb-2">Medication Description</th>
                  <th className="pb-2 text-center">Pack Size</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Price</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {(order.items || []).map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2 text-white font-medium">
                      {item?.product?.name || 'Medication'}
                      <span className="block text-[10px] text-slate-400">
                        {item?.product?.format || 'Tablets'} • {item?.product?.strength || ''}
                      </span>
                    </td>
                    <td className="py-2 text-center text-slate-300">{item?.selectedPack?.tabletsCount || 0} Tabs</td>
                    <td className="py-2 text-center text-white">{item?.quantity || 1}</td>
                    <td className="py-2 text-right text-cyan-400">£{(item?.selectedPack?.price || 0).toFixed(2)}</td>
                    <td className="py-2 text-right text-white font-semibold">
                      £{((item?.selectedPack?.price || 0) * (item?.quantity || 1)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Breakdown */}
          <div className="border-t border-slate-800 pt-3 space-y-1 text-right text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-white">£{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-cyan-400">
                <span>Discounts & Promos:</span>
                <span>-£{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Discreet Delivery ({order.shippingMethod}):</span>
              <span className="text-white">
                {order.shippingFee === 0 ? 'FREE' : `£${order.shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-white border-t border-slate-800 pt-2">
              <span>Total Paid:</span>
              <span className="text-cyan-400 text-base">£{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* GPhC Stamp & Verification */}
          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <strong className="text-white block">Superintendent Pharmacist Verified</strong>
                <span>Prescription protocol checked in accordance with BNF standards.</span>
              </div>
            </div>
            <div className="text-center sm:text-right font-mono text-[9px] text-slate-500">
              BARCODE: ||| | |||| | ||| ||||| |||
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
