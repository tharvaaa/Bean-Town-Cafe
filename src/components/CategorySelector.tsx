import React from 'react';
import { motion } from 'motion/react';
import { cn } from './Sidebar';

interface CategorySelectorProps {
  categories: { id: string; label: string; icon: string }[];
  selectedCategory: string;
  onSelect: (id: string) => void;
}

export function CategorySelector({ categories, selectedCategory, onSelect }: CategorySelectorProps) {
  return (
    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 mb-8">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex flex-col items-center justify-center min-w-[100px] h-[110px] rounded-[28px] transition-all duration-300 relative overflow-hidden",
              isSelected 
                ? "bg-white shadow-md border-2 border-coffee-dark" 
                : "bg-white shadow-sm border-2 border-transparent hover:border-coffee-light"
            )}
          >
            {isSelected && (
              <motion.div 
                layoutId="activeCategory" 
                className="absolute inset-0 bg-coffee-light/20" 
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="text-3xl mb-2 relative z-10">{cat.icon}</span>
            <span className={cn(
              "text-sm font-semibold relative z-10",
              isSelected ? "text-coffee-dark" : "text-gray-500"
            )}>
              {cat.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
