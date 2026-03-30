import React from 'react';
import { Home, Coffee, Clock, Wallet, BarChart3, Settings, LogOut, StickyNote } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'menu', icon: Coffee, label: 'Menu' },
    { id: 'history', icon: Clock, label: 'History' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'notes', icon: StickyNote, label: 'Notes' },
    { id: 'setting', icon: Settings, label: 'Setting' },
  ];

  return (
    <div className="w-24 bg-white border-r border-gray-100 flex flex-col items-center py-8 h-screen sticky top-0 shrink-0 transition-colors duration-300">
      <div className="mb-12 font-bold text-xl text-coffee-dark italic text-center leading-tight px-2">Bean Town Cafe</div>
      
      <div className="flex flex-col gap-4 flex-1 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 hover:scale-110",
                isActive 
                  ? "bg-coffee-dark text-white shadow-lg shadow-coffee-dark/30 scale-105" 
                  : "text-gray-400 hover:bg-coffee-light hover:text-coffee-dark"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <button className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300 hover:scale-110 mt-4">
        <LogOut size={24} />
        <span className="text-[10px] mt-1 font-medium">Logout</span>
      </button>
    </div>
  );
}
