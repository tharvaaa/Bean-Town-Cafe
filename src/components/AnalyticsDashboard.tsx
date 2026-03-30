import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, Activity, BarChart2 } from 'lucide-react';
import db, { type DailySummary, type Order } from '../db';
import { format, subDays } from 'date-fns';

interface ProductStats {
  name: string;
  quantitySold: number;
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
}

export function AnalyticsDashboard() {
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [stats, setStats] = useState({ revenue: 0, expenses: 0, profit: 0 });
  const [productStats, setProductStats] = useState<ProductStats[]>([]);
  const [showDetailed, setShowDetailed] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const allSummaries = await db.dailySummaries.orderBy('date').reverse().limit(30).toArray();
      setSummaries(allSummaries.reverse()); // Chronological order for chart

      const totalRev = allSummaries.reduce((sum, s) => sum + s.totalRevenue, 0);
      const totalExp = allSummaries.reduce((sum, s) => sum + s.totalExpenses, 0);
      setStats({
        revenue: totalRev,
        expenses: totalExp,
        profit: totalRev - totalExp
      });
    };
    loadData();
  }, []);

  const generateDetailedAnalysis = async () => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const startOfDay = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    
    const todaysOrders = await db.orders.where('timestamp').aboveOrEqual(startOfDay).toArray();
    
    const statsMap = new Map<string, ProductStats>();

    todaysOrders.forEach(order => {
      order.items.forEach(item => {
        const existing = statsMap.get(item.name) || {
          name: item.name,
          quantitySold: 0,
          totalRevenue: 0,
          totalCost: 0,
          netProfit: 0
        };

        existing.quantitySold += item.quantity;
        existing.totalRevenue += (item.price * item.quantity);
        existing.totalCost += (item.cost_of_making * item.quantity);
        existing.netProfit = existing.totalRevenue - existing.totalCost;

        statsMap.set(item.name, existing);
      });
    });

    const sortedStats = Array.from(statsMap.values()).sort((a, b) => b.netProfit - a.netProfit);
    setProductStats(sortedStats);
    setShowDetailed(true);
  };

  const handleExport = async () => {
    try {
      const products = await db.products.toArray();
      const orders = await db.orders.toArray();
      const dailySummaries = await db.dailySummaries.toArray();

      const backup = {
        timestamp: new Date().toISOString(),
        data: { products, orders, dailySummaries }
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coffee-shop-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export backup:', error);
      alert('Failed to export backup');
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Analytics</h1>
          <p className="text-gray-500">Track your coffee shop's performance</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={generateDetailedAnalysis}
            className="flex items-center gap-2 bg-coffee-light text-coffee-dark px-6 py-3 rounded-2xl font-semibold shadow-sm hover:bg-gray-200 transition-colors"
          >
            <BarChart2 size={20} />
            Generate Detailed Analysis
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-coffee-dark text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-coffee-dark/20 hover:bg-[#6b7280] transition-colors"
          >
            <Download size={20} />
            Export Backup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[32px] shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
            <DollarSign size={32} className="text-green-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Total Revenue</p>
            <h3 className="text-3xl font-black text-gray-900">₹{stats.revenue.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
            <TrendingDown size={32} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Total Expenses (COGS)</p>
            <h3 className="text-3xl font-black text-gray-900">₹{stats.expenses.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
            <TrendingUp size={32} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Net Profit</p>
            <h3 className="text-3xl font-black text-gray-900">₹{stats.profit.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      {showDetailed && (
        <div className="bg-white p-8 rounded-[32px] shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart2 size={24} className="text-coffee-dark" />
            Today's Detailed Analysis
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-4 font-semibold text-gray-500">Product</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-right">Qty Sold</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-right">Revenue</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-right">Cost</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-right">Profit</th>
                </tr>
              </thead>
              <tbody>
                {productStats.map((stat, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">{stat.name}</td>
                    <td className="py-4 px-4 text-right text-gray-600">{stat.quantitySold}</td>
                    <td className="py-4 px-4 text-right text-gray-600">₹{stat.totalRevenue.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right text-gray-600">₹{stat.totalCost.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-bold text-green-600">₹{stat.netProfit.toFixed(2)}</td>
                  </tr>
                ))}
                {productStats.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No sales data for today yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-[32px] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity size={24} className="text-coffee-dark" />
            Revenue Trend (Last 30 Days)
          </h3>
        </div>
        <div className="h-[400px] w-full">
          {summaries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summaries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#898989" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#898989" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dx={-10} tickFormatter={(value) => `₹${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Revenue']}
                  labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}
                />
                <Area type="monotone" dataKey="totalRevenue" stroke="#898989" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 font-medium">
              No data available yet. Complete some orders to see trends.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

