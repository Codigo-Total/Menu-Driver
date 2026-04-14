import { useState, useEffect } from 'react';
import { Category } from '@/types/menu.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, X, Sparkles, Loader2, Globe, Settings2, Pencil } from 'lucide-react';
import { useLangStore } from '@/store/lang/lang.slice';
import { translateText } from '@/services/translation.service';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: Omit<Category, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isManualMode: boolean;
  setIsManualMode: (val: boolean) => void;
}

export const CategoryForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading,
  isManualMode,
  setIsManualMode
}: CategoryFormProps) => {
  const { t, lang } = useLangStore();
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: initialData?.name || { en: '', es: '' },
    icon: initialData?.icon || 'Package',
  });

  // Smart Sync Logic: Bidirectional and language-agnostic
  useEffect(() => {
    // Only auto-sync if NOT in manual mode
    if (isManualMode) return;

    const activeText = formData.name[lang];
    if (!activeText || activeText.length < 2) return;
    
    const timer = setTimeout(async () => {
      setIsTranslating(true);
      
      const result = await translateText(activeText, 'en', 'category');
      const { translatedText, detectedLang } = result;
      
      if (detectedLang.startsWith('es')) {
        setFormData(prev => ({
          ...prev,
          name: {
            es: activeText,
            en: translatedText
          }
        }));
      } else if (detectedLang.startsWith('en')) {
        const esResult = await translateText(activeText, 'es', 'category');
        setFormData(prev => ({
          ...prev,
          name: {
            en: activeText, 
            es: esResult.translatedText
          }
        }));
      }
      
      setIsTranslating(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [formData.name[lang], lang, isManualMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const otherLang = lang === 'es' ? 'en' : 'es';

  return (
    <form onSubmit={handleSubmit} className="space-y-8 px-1">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            {t('admin.category_name')}
            {isTranslating && <Loader2 className="h-4 w-4 animate-spin text-brand-yellow-500" />}
          </label>

          <div className="relative">
            <Input
              placeholder={lang === 'es' ? "Ej: Snacks, Bebidas..." : "Ex: Snacks, Drinks..."}
              value={formData.name[lang]}
              className="h-14 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl text-lg font-bold"
              onChange={(e) => {
                const val = e.target.value;
                const capitalized = val.charAt(0).toUpperCase() + val.slice(1);
                setFormData({ 
                  ...formData, 
                  name: { ...formData.name, [lang]: capitalized } 
                });
              }}
              required
            />
            {!isManualMode && formData.name[otherLang] && !isTranslating && (
              <button
                type="button"
                onClick={() => setIsManualMode(true)}
                className="absolute -bottom-6 left-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 hover:text-brand-yellow-600 transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                Auto-sincronizado: <span className="text-brand-yellow-600 dark:text-brand-yellow-400 mr-1">{formData.name[otherLang]}</span>
                <Pencil className="h-2.5 w-2.5" />
              </button>
            )}
          </div>

          {isManualMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-2"
            >
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2 block tracking-widest pl-1">
                Traducción ({otherLang.toUpperCase()})
              </label>
              <Input
                placeholder={`Nombre en ${otherLang === 'es' ? 'Español' : 'Inglés'}`}
                value={formData.name[otherLang]}
                className="h-12 bg-white dark:bg-slate-900 border-brand-yellow-100 dark:border-brand-yellow-900/30 rounded-xl text-sm font-bold border-2"
                onChange={(e) => {
                  const val = e.target.value;
                  const capitalized = val.charAt(0).toUpperCase() + val.slice(1);
                  setFormData({ 
                    ...formData, 
                    name: { ...formData.name, [otherLang]: capitalized } 
                  });
                }}
                required
              />
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-10 border-t border-slate-100 dark:border-slate-800">
        <Button 
          type="submit" 
          isLoading={isLoading} 
          className="flex-1 bg-brand-yellow-500 hover:bg-brand-yellow-600 text-brand-yellow-950 font-black py-4 sm:py-6 rounded-2xl shadow-xl shadow-brand-yellow-500/20 active:scale-95 transition-all text-base sm:text-lg"
          leftIcon={<Save className="h-5 w-5 sm:h-6 sm:w-6" />}
        >
          {initialData ? t('admin.save_changes') : t('admin.add_category')}
        </Button>
        <Button 
          variant="secondary" 
          type="button" 
          onClick={onCancel}
          className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black py-4 sm:py-6 rounded-2xl active:scale-95 transition-all text-base sm:text-lg"
          leftIcon={<X className="h-5 w-5 sm:h-6 sm:w-6" />}
        >
          {t('admin.cancel')}
        </Button>
      </div>
    </form>
  );
};
