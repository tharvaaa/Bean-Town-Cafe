import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CategorySelector } from './components/CategorySelector';
import { ProductCard } from './components/ProductCard';
import { CartSidebar } from './components/CartSidebar';
import { CheckoutModal } from './components/CheckoutModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SettingsTab } from './components/SettingsTab';
import { NotesTab } from './components/NotesTab';
import { printReceipt } from './utils/printReceipt';
import db, { type Product, type OrderItem, seedDatabase } from './db';
import { format } from 'date-fns';

const CATEGORIES = [
  { id: 'All', label: 'All', icon: '☕' },
  { id: 'Hot', label: 'Hot Coffee', icon: '☕' },
  { id: 'Cold', label: 'Cold Coffee', icon: '🧊' },
  { id: 'Coolers', label: 'Coolers', icon: '🍹' },
  { id: 'Snacks', label: 'Snacks', icon: '🥐' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{ paymentMethod: 'Cash' | 'UPI', total: number } | null>(null);

  useEffect(() => {
    const initDb = async () => {
      await seedDatabase();
      loadProducts(selectedCategory);
    };
    initDb();
  }, []);

  useEffect(() => {
    loadProducts(selectedCategory);
  }, [selectedCategory]);

  const loadProducts = async (category: string) => {
    if (category === 'All') {
      setProducts(await db.products.toArray());
    } else {
      setProducts(await db.products.where('category').equals(category).toArray());
    }
  };

  // 11 PM Audit Timer
  useEffect(() => {
    const checkTime = setInterval(async () => {
      const now = new Date();
      if (now.getHours() === 23 && now.getMinutes() === 0) {
        // Perform audit
        const todayStr = format(now, 'yyyy-MM-dd');
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const todaysOrders = await db.orders.where('timestamp').aboveOrEqual(startOfDay).toArray();
        
        const totalRevenue = todaysOrders.reduce((sum, order) => sum + order.total, 0);
        const totalExpenses = todaysOrders.reduce((sum, order) => {
          return sum + order.items.reduce((itemSum, item) => itemSum + (item.cost_of_making * item.quantity), 0);
        }, 0);
        
        const netProfit = totalRevenue - totalExpenses;

        const existingSummary = await db.dailySummaries.where('date').equals(todayStr).first();
        if (!existingSummary) {
          await db.dailySummaries.add({
            date: todayStr,
            totalRevenue,
            totalExpenses,
            netProfit,
            orderCount: todaysOrders.length
          });
          console.log('11 PM Audit completed for', todayStr);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTime);
  }, []);

  const handleAddToCart = (item: OrderItem) => {
    setCartItems(prev => {
      const existing = prev.findIndex(i => 
        i.productId === item.productId && 
        i.size === item.size
      );
      
      if (existing >= 0) {
        const newItems = [...prev];
        newItems[existing].quantity += 1;
        return newItems;
      }
      return [...prev, item];
    });
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCartItems(prev => {
      const newItems = [...prev];
      const newQuantity = newItems[index].quantity + delta;
      if (newQuantity <= 0) {
        newItems.splice(index, 1);
      } else {
        newItems[index].quantity = newQuantity;
      }
      return newItems;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = (paymentMethod: 'Cash' | 'UPI', total: number) => {
    setCheckoutData({ paymentMethod, total });
    setIsCheckoutOpen(true);
  };

  const handleCompletePayment = async () => {
    if (!checkoutData) return;

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Save to DB
    await db.orders.add({
      items: cartItems,
      subtotal,
      total: checkoutData.total,
      paymentMethod: checkoutData.paymentMethod,
      timestamp: new Date()
    });

    // Print Receipt
    printReceipt(cartItems, checkoutData.total, subtotal, 0, checkoutData.paymentMethod);

    // Reset
    setCartItems([]);
    setIsCheckoutOpen(false);
    setCheckoutData(null);
  };

  return (
    <div className="flex h-screen bg-coffee-bg overflow-hidden font-sans transition-colors duration-300">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        {activeTab === 'menu' && <Header />}
        
        {activeTab === 'home' && (
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-6xl font-cursive text-coffee-dark italic animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Welcome to Bean Town Cafe
            </h1>
          </div>
        )}

        {activeTab === 'menu' && (
          <>
            <CategorySelector 
              categories={CATEGORIES} 
              selectedCategory={selectedCategory} 
              onSelect={setSelectedCategory} 
            />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedCategory} Menu</h2>
              <span className="text-gray-500 font-medium">{products.length} Results</span>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar -mx-4 px-4 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAdd={handleAddToCart} 
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {activeTab === 'setting' && (
          <SettingsTab />
        )}

        {activeTab === 'notes' && (
          <NotesTab />
        )}

        {activeTab !== 'home' && activeTab !== 'menu' && activeTab !== 'analytics' && activeTab !== 'setting' && activeTab !== 'notes' && (
          <div className="flex-1 flex items-center justify-center text-gray-400 font-medium text-xl">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view coming soon...
          </div>
        )}
      </div>

      {activeTab === 'menu' && (
        <CartSidebar 
          items={cartItems} 
          onUpdateQuantity={handleUpdateQuantity} 
          onRemove={handleRemoveItem}
          onCheckout={handleCheckout}
        />
      )}

      {checkoutData && (
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
          total={checkoutData.total} 
          paymentMethod={checkoutData.paymentMethod}
          onComplete={handleCompletePayment}
        />
      )}
    </div>
  );
}
