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
    description: {
      en: "Beef, cheese, lettuce, tomato",
      es: "Carne, queso fresco, lechuga y tomate",
    },
    price: 12.0,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
    stock: 20,
    isPopular: true,
  },
  {
    id: "p3",
    categoryId: "1",
    name: { en: "French Fries", es: "Papas Fritas" },
    description: {
      en: "Golden and crispy with sea salt",
      es: "Doradas y crujientes al estilo casero",
    },
    price: 5.5,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600",
    stock: 100,
  },
  {
    id: "p4",
    categoryId: "1",
    name: { en: "Chicken Nuggets", es: "Nuggets de Pollo" },
    description: { en: "Crispy chicken breast bites", es: "Bocados de pechuga crujiente" },
    price: 7.0,
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=600",
    stock: 30,
  },
  {
    id: "p5",
    categoryId: "1",
    name: { en: "Gourmet Hot Dog", es: "Hot Dog Gourmet" },
    description: {
      en: "Grilled sausage, bacon, and cheddar",
      es: "Salchicha asada, bacon y cheddar",
    },
    price: 8.5,
    image:
      "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&q=80&w=600",
    stock: 40,
  },
  {
    id: "p6",
    categoryId: "1",
    name: { en: "Cheese Nachos", es: "Nachos con Queso" },
    description: {
      en: "Tortilla chips with melted cheese",
      es: "Totopos de maíz con queso fundido",
    },
    price: 9.0,
    image:
      "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=600",
    stock: 25,
  },

  // --- BEBIDAS (2) ---
  {
    id: "p1",
    categoryId: "2",
    name: { en: "Coca Cola", es: "Coca Cola" },
    description: { en: "Refreshing cold beverage", es: "Bebida fría y refrescante" },
    price: 3.5,
    image:
      "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=600",
    stock: 50,
    isPopular: true,
  },
  {
    id: "p7",
    categoryId: "2",
    name: { en: "Craft Beer", es: "Cerveza Artesanal" },
    description: { en: "Premium locally brewed IPA", es: "IPA premium de barril" },
    price: 6.5,
    image:
      "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?auto=format&fit=crop&q=80&w=600",
    stock: 60,
    isPopular: true,
  },
  {
    id: "p8",
    categoryId: "2",
    name: { en: "Fresh Orange Juice", es: "Jugo de Naranja" },
    description: { en: "Freshly squeezed natural juice", es: "Exprimido 100% natural al instante" },
    price: 4.5,
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=600",
    stock: 40,
  },
  {
    id: "p9",
    categoryId: "2",
    name: { en: "Iced Coffee", es: "Café Helado" },
    description: {
      en: "Cold brew with a touch of milk",
      es: "Cold brew premium con un toque de leche",
    },
    price: 5.0,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600",
    stock: 35,
  },

  // --- POSTRES (3) ---
  {
    id: "p10",
    categoryId: "3",
    name: { en: "Vanilla Ice Cream", es: "Helado de Vainilla" },
    description: { en: "Classic creamy vanilla", es: "Vainilla cremosa artesanal" },
    price: 4.0,
    image:
      "https://images.unsplash.com/photo-1570197781417-0a8237580532?auto=format&fit=crop&q=80&w=600",
    stock: 20,
    isPopular: true,
  },
  {
    id: "p11",
    categoryId: "3",
    name: { en: "Chocolate Brownie", es: "Brownie de Chocolate" },
    description: { en: "Warm brownie with fudge", es: "Recién horneado, con chispas 70% cacao" },
    price: 5.5,
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=600",
    stock: 15,
  },
  {
    id: "p12",
    categoryId: "3",
    name: { en: "Berry Cheesecake", es: "Cheesecake de Frutos Rojos" },
    description: {
      en: "New York style with berry compote",
      es: "Estilo New York relleno de compota de frutos rojos",
    },
    price: 6.5,
    image:
      "https://images.unsplash.com/photo-1508737804141-4c3b688e2546?auto=format&fit=crop&q=80&w=600",
    stock: 12,
  },
  {
    id: "p13",
    categoryId: "3",
    name: { en: "Tiramisu", es: "Tiramisú" },
    description: {
      en: "Italian coffee-flavored dessert",
      es: "El clásico postre italiano al café",
    },
    price: 7.0,
    image:
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=600",
    stock: 10,
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
