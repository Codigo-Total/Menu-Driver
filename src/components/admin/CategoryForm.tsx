'use client';

import { useState } from 'react';
import { Category } from '@/types/menu.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, X } from 'lucide-react';
import { useLangStore } from '@/store/lang/lang.slice';

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: Omit<Category, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CategoryForm = ({ initialData, onSubmit, onCancel, isLoading }: CategoryFormProps) => {
  const { t } = useLangStore();
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: initialData?.name || { en: '', es: '' },
    icon: initialData?.icon || 'Package',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      name: { 
        es: formData.name.es, 
        en: formData.name.en || formData.name.es 
      }
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 px-1">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] sm:text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('admin.category_name')} (ES)</label>
          <Input
            placeholder="Ej: Snacks, Bebidas..."
            value={formData.name.es}
            className="h-12 sm:h-14 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl"
            onChange={(e) => setFormData({ 
              ...formData, 
              name: { ...formData.name, es: e.target.value } 
            })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] sm:text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('admin.category_name')} (EN)</label>
          <Input
            placeholder="Ej: Snacks, Drinks..."
            value={formData.name.en}
            className="h-12 sm:h-14 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl"
            onChange={(e) => setFormData({ 
              ...formData, 
              name: { ...formData.name, en: e.target.value } 
            })}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-10 border-t border-slate-100 dark:border-slate-800">
        <Button 
          type="submit" 
          isLoading={isLoading} 
          className="flex-1 bg-brand-yellow-500 hover:bg-brand-yellow-600 text-brand-yellow-950 font-black py-4 sm:py-6 rounded-2xl shadow-xl shadow-brand-yellow-500/20 active:scale-95 transition-all text-base sm:text-lg"
          leftIcon={<Save className="h-5 w-5 sm:h-6 sm:w-6" />}
        >
          {initialData ? 'Guardar Cambios' : 'Agregar Categoría'}
        </Button>
        <Button 
          variant="secondary" 
          type="button" 
          onClick={onCancel}
          className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black py-4 sm:py-6 rounded-2xl active:scale-95 transition-all text-base sm:text-lg"
          leftIcon={<X className="h-5 w-5 sm:h-6 sm:w-6" />}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};
