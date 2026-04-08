import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import en from '@/translations/en.json';
import es from '@/translations/es.json';

type Language = 'en' | 'es';
type Translations = typeof en;

interface LangState {
  lang: Language;
  hydrated: boolean;
  setLanguage: (lang: Language) => void;
  setHydrated: () => void;
  t: (path: string) => string;
}

const dictionaries: Record<Language, Translations> = { en, es };

/**
 * Zustand store for language management with hydration support.
 * Only the language preference ('lang') is persisted to avoid stale translation objects.
 * Translations are always loaded from the source dictionaries based on the current 'lang'.
 */
export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: 'es', // Default language
      hydrated: false,

      setLanguage: (lang: Language) => set({ lang }),

      setHydrated: () => set({ hydrated: true }),

      t: (path: string) => {
        // Return empty string or path if not hydrated to avoid SSR mismatches
        if (!get().hydrated) return ''; 

        const currentLang = get().lang;
        const translations = dictionaries[currentLang];
        
        const keys = path.split('.');
        let result: any = translations;
        
        for (const key of keys) {
          if (result && typeof result === 'object' && key in result) {
            result = result[key];
          } else {
            return path; // Fallback to path if key not found
          }
        }
        
        return typeof result === 'string' ? result : path;
      }
    }),
    {
      name: 'app-language',
      // Explicitly only persist the 'lang' state
      partialize: (state) => ({ lang: state.lang }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
