import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/menu.types';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

interface ProductActions {
  setProducts: (products: Product[]) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    categoryId: '1',
    name: { en: 'Coca Cola', es: 'Coca Cola' },
    description: { en: 'Refreshing cold beverage', es: 'Bebida fría refrescante' },
    price: 3.5,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f34a5bbf?auto=format&fit=crop&q=80&w=400',
    stock: 50,
    isPopular: true,
  },
  {
    id: 'p2',
    categoryId: '1',
    name: { en: 'Classic Burger', es: 'Hamburguesa Clásica' },
    description: { en: 'Beef, cheese, lettuce, tomato', es: 'Carne, queso, lechuga, tomate' },
    price: 12.0,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400',
    stock: 20,
    isPopular: true,
  },
  {
    id: 'p3',
    categoryId: '3',
    name: { en: 'French Fries', es: 'Papas Fritas' },
    description: { en: 'Golden and crispy', es: 'Doradas y crujientes' },
    price: 5.5,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400',
    stock: 100,
  },
];

export const useProductStore = create<ProductState & ProductActions>()(
  persist(
    (set) => ({
      products: MOCK_PRODUCTS,
      isLoading: false,
      error: null,

      setProducts: (products) => set({ products }),

      addProduct: (productData) =>
        set((state) => ({
          products: [
            ...state.products,
            { ...productData, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),

      updateProduct: (id, productData) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...productData } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'menu-driver-products',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
