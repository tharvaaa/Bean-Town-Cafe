import React from 'react';
import { Bell } from 'lucide-react';

export function Header() {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-gray-900">Choose Category</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" 
              alt="User" 
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-500 font-medium">I'm a Cashier ☕</span>
              <span className="text-sm font-bold text-gray-900">Sameer Laudu</span>
            </div>
          </div>
          <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm relative text-gray-600 hover:text-coffee-dark hover:shadow-md transition-all hover:scale-105">
            <Bell size={22} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
