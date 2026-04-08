import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types/menu.types';

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

/**
 * Zustand store for cart management.
 * Handles adding/removing items and calculating totals.
 * UI state for the cart drawer is also managed here.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      setIsCartOpen: (open: boolean) => set({ isCartOpen: open }),

      addItem: (product: Product) => {
        const items = [...get().items];
        const existingItem = items.find((i) => i.id === product.id);
        
        if (existingItem) {
          existingItem.quantity += 1;
          set({ items });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((i) => i.id !== productId) });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const items = [...get().items];
        const item = items.find((i) => i.id === productId);
        if (item) {
          item.quantity = quantity;
          set({ items });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity, 
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'app-cart',
    }
  )
);
