import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Category } from '@/types/menu.types';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

interface CategoryActions {
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: { es: 'Snacks', en: 'Snacks' }, icon: 'Package' },
  { id: '2', name: { es: 'Bebidas', en: 'Drinks' }, icon: 'Coffee' },
  { id: '3', name: { es: 'Postres', en: 'Desserts' }, icon: 'PieChart' },
];

export const useCategoryStore = create<CategoryState & CategoryActions>()(
  persist(
    (set) => ({
      categories: DEFAULT_CATEGORIES,
      isLoading: false,
      error: null,

      setCategories: (categories) => set({ categories }),

      addCategory: (categoryData) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { ...categoryData, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),

      updateCategory: (id, categoryData) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...categoryData } : c
          ),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'menu-driver-categories',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
