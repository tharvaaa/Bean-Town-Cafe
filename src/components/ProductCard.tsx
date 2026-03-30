import React, { useState } from 'react';
import { motion } from 'motion/react';
import type { Product, OrderItem } from '../db';
import { cn } from './Sidebar';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onAdd: (item: Omit<OrderItem, 'productId'> & { productId: number }) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const [size, setSize] = useState<'S' | 'M' | 'L'>('M');

  const handleAdd = () => {
    onAdd({
      productId: product.id!,
      name: product.name,
      price: product.price,
      cost_of_making: product.cost_of_making,
      quantity: 1,
      size,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-transparent hover:border-coffee-dark/20"
    >
      <div className="flex gap-4 mb-6">
        <motion.img 
          whileHover={{ scale: 1.1 }}
          src={product.image} 
          alt={product.name} 
          className="w-24 h-32 object-cover rounded-2xl shadow-md"
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col justify-between py-1">
          <div>
            <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{product.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
          </div>
          <div className="text-xl font-bold text-gray-900 mt-2">
            ₹{product.price.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mb-6 flex-1 flex flex-col justify-center">
        {/* Size */}
        <div>
          <span className="text-xs font-semibold text-gray-500 mb-3 block text-center">Select Size</span>
          <div className="flex gap-3 justify-center">
            {['S', 'M', 'L'].map((s) => (
              <motion.button 
                key={s}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSize(s as any)}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  size === s 
                    ? "bg-coffee-dark text-white shadow-lg shadow-coffee-dark/30 scale-110" 
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                )}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAdd}
        className="w-full py-4 bg-coffee-dark text-white rounded-2xl font-semibold shadow-lg shadow-coffee-dark/20 hover:bg-[#6b7280] transition-colors mt-auto"
      >
        Add to Billing
      </motion.button>
    </motion.div>
  );
}
