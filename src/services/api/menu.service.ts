import { Category, Product } from '@/types/menu.types';

// Mock Categories
const categories: Category[] = [
  { id: '1', name: { en: 'Drinks', es: 'Bebidas' }, icon: 'GlassWater' },
  { id: '2', name: { en: 'Burgers', es: 'Hamburguesas' }, icon: 'Beef' },
  { id: '3', name: { en: 'Snacks', es: 'Aperitivos' }, icon: 'Cookie' },
  { id: '4', name: { en: 'Combos', es: 'Combos' }, icon: 'Box' },
  { id: '5', name: { en: 'Desserts', es: 'Postres' }, icon: 'IceCream' },
];

// Mock Products
const products: Product[] = [
  {
    id: 'p1',
    categoryId: '1',
    name: { en: 'Coca Cola', es: 'Coca Cola' },
    description: { en: 'Refreshing cold beverage', es: 'Bebida fría refrescante' },
    price: 3.5,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f34a5bbf?auto=format&fit=crop&q=80&w=400',
    isPopular: true,
  },
  {
    id: 'p2',
    categoryId: '2',
    name: { en: 'Classic Burger', es: 'Hamburguesa Clásica' },
    description: { en: 'Beef, cheese, lettuce, tomato', es: 'Carne, queso, lechuga, tomate' },
    price: 12.0,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400',
    isPopular: true,
  },
  {
    id: 'p3',
    categoryId: '3',
    name: { en: 'French Fries', es: 'Papas Fritas' },
    description: { en: 'Golden and crispy', es: 'Doradas y crujientes' },
    price: 5.5,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'p4',
    categoryId: '4',
    name: { en: 'Family Combo', es: 'Combo Familiar' },
    description: { en: '4 burgers, 2 large fries, 1L drink', es: '4 hamburguesas, 2 papas grandes, bebida 1L' },
    price: 45.0,
    image: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'p5',
    categoryId: '5',
    name: { en: 'Chocolate Cake', es: 'Pastel de Chocolate' },
    description: { en: 'Rich dark chocolate', es: 'Rico chocolate negro' },
    price: 8.0,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400',
  },
];

export const menuService = {
  getCategories: async (): Promise<Category[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(categories), 500);
    });
  },

  getProducts: async (categoryId?: string): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!categoryId) return resolve(products);
        resolve(products.filter((p) => p.categoryId === categoryId));
      }, 500);
    });
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(products.find((p) => p.id === id)), 300);
    });
  },
};
