import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types/menu.types";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

interface ProductActions {
  setProducts: (products: Product[]) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const MOCK_PRODUCTS: Product[] = [
  // --- SNACKS (1) ---
  {
    id: "p2",
    categoryId: "1",
    name: { en: "Classic Burger", es: "Hamburguesa Clásica" },
    price: 8500000.0,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
    isPopular: true,
  },
  {
    id: "p3",
    categoryId: "1",
    name: { en: "French Fries", es: "Papas Fritas" },
    price: 3500.0,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "p4",
    categoryId: "1",
    name: { en: "Chicken Nuggets", es: "Nuggets de Pollo" },
    price: 4500.0,
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "p5",
    categoryId: "1",
    name: { en: "Gourmet Hot Dog", es: "Hot Dog Gourmet" },
    price: 5500.0,
    image:
      "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "p6",
    categoryId: "1",
    name: { en: "Cheese Nachos", es: "Nachos con Queso" },
    price: 4800.0,
    image:
      "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=600",
  },

  // --- BEBIDAS (2) ---
  {
    id: "p1",
    categoryId: "2",
    name: { en: "Coca Cola", es: "Coca Cola" },
    price: 2000.0,
    image:
      "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=600",
    isPopular: true,
  },
  {
    id: "p7",
    categoryId: "2",
    name: { en: "Craft Beer", es: "Cerveza Artesanal" },
    price: 3500.0,
    image:
      "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?auto=format&fit=crop&q=80&w=600",
    isPopular: true,
  },
  {
    id: "p8",
    categoryId: "2",
    name: { en: "Fresh Orange Juice", es: "Jugo de Naranja" },
    price: 2500.0,
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "p9",
    categoryId: "2",
    name: { en: "Iced Coffee", es: "Café Helado" },
    price: 2800.0,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600",
  },

  // --- POSTRES (3) ---
  {
    id: "p10",
    categoryId: "3",
    name: { en: "Vanilla Ice Cream", es: "Helado de Vainilla" },
    price: 2500.0,
    image:
      "https://images.unsplash.com/photo-1570197781417-0a8237580532?auto=format&fit=crop&q=80&w=600",
    isPopular: true,
  },
  {
    id: "p11",
    categoryId: "3",
    name: { en: "Chocolate Brownie", es: "Brownie de Chocolate" },
    price: 3200.0,
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "p12",
    categoryId: "3",
    name: { en: "Berry Cheesecake", es: "Cheesecake de Frutos Rojos" },
    price: 4500.0,
    image:
      "https://images.unsplash.com/photo-1508737804141-4c3b688e2546?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "p13",
    categoryId: "3",
    name: { en: "Tiramisu", es: "Tiramisú" },
    price: 5000.0,
    image:
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=600",
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
          products: state.products.map((p) => (p.id === id ? { ...p, ...productData } : p)),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "menu-driver-products-v2",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
