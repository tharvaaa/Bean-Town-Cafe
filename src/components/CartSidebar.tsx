import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Minus, Plus, Trash2, Wallet, Banknote } from 'lucide-react';
import type { OrderItem } from '../db';
import { cn } from './Sidebar';

interface CartSidebarProps {
  items: OrderItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemove: (index: number) => void;
  onCheckout: (paymentMethod: 'Cash' | 'UPI', total: number) => void;
}

export function CartSidebar({ items, onUpdateQuantity, onRemove, onCheckout }: CartSidebarProps) {
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI'>('UPI');

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="w-[380px] bg-white/80 backdrop-blur-xl border-l border-gray-100 flex flex-col h-screen sticky top-0 shrink-0 p-6 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Bills</h2>
        <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-bold">
          {items.length} Items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar -mx-2 px-2">
        <AnimatePresence>
          {items.map((item, idx) => (
            <motion.div 
              key={`${item.productId}-${idx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-4 mb-6 p-3 bg-gray-50/50 rounded-2xl border border-gray-100/50"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                {/* Placeholder for item image if we pass it, otherwise just initials */}
                <div className="w-full h-full flex items-center justify-center bg-coffee-light/20 text-coffee-dark font-bold text-xl">
                  {item.name.substring(0, 2)}
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-gray-900 leading-tight pr-2">{item.name}</h4>
                  <span className="font-bold text-sm text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500">x {item.quantity}</span>
                    <button className="flex items-center gap-1 text-[10px] font-medium text-coffee-dark bg-coffee-light/20 px-2 py-1 rounded-md hover:bg-coffee-light/40 transition-colors">
                      Notes <Edit2 size={10} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 bg-white rounded-lg shadow-sm border border-gray-100">
                    <button onClick={() => onUpdateQuantity(idx, -1)} className="p-1 hover:text-red-500 transition-colors">
                      {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(idx, 1)} className="p-1 hover:text-green-500 transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {items.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Banknote size={32} className="text-gray-300" />
            </div>
            <p className="font-medium">No items in bill</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-200">
        <div className="flex justify-between items-end mb-8">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-3xl font-black text-gray-900">₹{total.toFixed(2)}</span>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'Cash', icon: Banknote },
              { id: 'UPI', icon: Wallet },
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={cn(
                    "flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all",
                    isSelected 
                      ? "border-coffee-dark bg-coffee-light/10 text-coffee-dark" 
                      : "border-gray-100 bg-white text-gray-400 hover:border-coffee-light"
                  )}
                >
                  <Icon size={20} className="mb-1" />
                  <span className="text-[10px] font-bold">{method.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCheckout(paymentMethod, total)}
          disabled={items.length === 0}
          className="w-full py-4 bg-coffee-dark text-white rounded-2xl font-bold text-lg shadow-xl shadow-coffee-dark/20 hover:bg-[#6b7280] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Print Bills
        </motion.button>
      </div>
    </div>
  );
}
