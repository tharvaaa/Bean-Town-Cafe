import Dexie, { type EntityTable } from 'dexie';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  cost_of_making: number;
  category: string;
  image: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  cost_of_making: number;
  quantity: number;
  size?: 'S' | 'M' | 'L';
  notes?: string;
}

export interface Order {
  id?: number;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: 'Cash' | 'UPI';
  timestamp: Date;
}

export interface DailySummary {
  id?: number;
  date: string; // YYYY-MM-DD
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  orderCount: number;
}

export interface Note {
  id?: number;
  content: string;
  timestamp: Date;
}

export interface Problem {
  id?: number;
  content: string;
  timestamp: Date;
}

const db = new Dexie('CoffeeShopDB') as Dexie & {
  products: EntityTable<Product, 'id'>;
  orders: EntityTable<Order, 'id'>;
  dailySummaries: EntityTable<DailySummary, 'id'>;
  notes: EntityTable<Note, 'id'>;
  problems: EntityTable<Problem, 'id'>;
};

db.version(2).stores({
  products: '++id, name, category',
  orders: '++id, timestamp',
  dailySummaries: '++id, date',
  notes: '++id, timestamp',
  problems: '++id, timestamp'
});

export const seedDatabase = async () => {
  const count = await db.products.count();
  if (count === 0) {
    await db.products.bulkAdd([
      {
        name: 'Caramel Frappuccino',
        description: 'Caramel syrup with coffee, milk, and whipped cream',
        price: 320,
        cost_of_making: 120,
        category: 'Coffee',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80',
      },
      {
        name: 'Chocolate Frappuccino',
        description: 'Sweet chocolate with coffee, milk, and whipped cream',
        price: 360,
        cost_of_making: 140,
        category: 'Coffee',
        image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?w=500&q=80',
      },
      {
        name: 'Peppermint Macchiato',
        description: 'Fresh peppermint mixed with choco, and blended cream',
        price: 420,
        cost_of_making: 160,
        category: 'Coffee',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80',
      },
      {
        name: 'Coffee Latte Frappuccino',
        description: 'Special coffee, choco cream, and whipped cream',
        price: 380,
        cost_of_making: 150,
        category: 'Coffee',
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80',
      },
      {
        name: 'Matcha Latte',
        description: 'Premium matcha green tea with steamed milk',
        price: 340,
        cost_of_making: 130,
        category: 'Milk Based',
        image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=500&q=80',
      },
      {
        name: 'Strawberry Smoothie',
        description: 'Fresh strawberries blended with yogurt and ice',
        price: 400,
        cost_of_making: 160,
        category: 'Coolers',
        image: 'https://images.unsplash.com/photo-1626804475297-41609ea0aa4eb?w=500&q=80',
      },
      {
        name: 'Croissant',
        description: 'Buttery, flaky, freshly baked pastry',
        price: 200,
        cost_of_making: 60,
        category: 'Snack',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?w=500&q=80',
      },
      {
        name: 'Cheesecake',
        description: 'Classic New York style cheesecake',
        price: 440,
        cost_of_making: 180,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80',
      }
    ]);
  }
};

export default db;
