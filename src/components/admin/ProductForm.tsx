'use client';

import { useState, useRef } from 'react';
import { Product } from '@/types/menu.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, X, ImageIcon, Upload, Link as LinkIcon } from 'lucide-react';
import { useLangStore } from '@/store/lang/lang.slice';
import { useCategoryStore } from '@/store/category/category.slice';
import { cn } from '@/lib/cn';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProductForm = ({ initialData, onSubmit, onCancel, isLoading }: ProductFormProps) => {
  const { t, lang } = useLangStore();
  const { categories } = useCategoryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : '1'),
    name: initialData?.name || { en: '', es: '' },
    description: initialData?.description || { en: '', es: '' },
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    image: initialData?.image || '',
    isPopular: initialData?.isPopular || false,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      name: { 
        es: formData.name.es, 
        en: formData.name.en || formData.name.es 
      },
      description: { 
        es: formData.description.es, 
        en: formData.description.en || formData.description.es 
      }
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Name & Category Dropdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('admin.product_name')}</label>
          <Input
            placeholder="Ej: Snack Mix Premium"
            value={formData.name.es}
            className="h-14 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl"
            onChange={(e) => setFormData({ 
              ...formData, 
              name: { ...formData.name, es: e.target.value } 
            })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('admin.categories_title')}</label>
          <select
            className="w-full h-14 px-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-brand-yellow-500 outline-none transition-all font-bold appearance-none cursor-pointer"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="dark:bg-slate-900">
                {cat.name[lang] || cat.name.es}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Descripción</label>
        <textarea
          placeholder="Escribe una breve descripción del producto..."
          className="w-full p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-brand-yellow-500 outline-none text-base min-h-[160px] transition-all resize-none"
          value={formData.description.es}
          onChange={(e) => setFormData({ 
            ...formData, 
            description: { ...formData.description, es: e.target.value } 
          })}
        />
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Precio ($)</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            className="h-14 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Stock</label>
          <Input
            type="number"
            placeholder="0"
            className="h-14 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      {/* Dual Image Selection */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('admin.image_source')}</label>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full md:w-auto">
            <button
              type="button"
              onClick={() => setImageMode('url')}
              className={cn(
                "flex-1 md:flex-none px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2",
                imageMode === 'url' ? "bg-white dark:bg-slate-700 text-brand-yellow-600 dark:text-brand-yellow-400 shadow-sm" : "text-slate-400"
              )}
            >
              <LinkIcon className="h-4 w-4" /> {t('admin.url_image')}
            </button>
            <button
              type="button"
              onClick={() => setImageMode('upload')}
              className={cn(
                "flex-1 md:flex-none px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2",
                imageMode === 'upload' ? "bg-white dark:bg-slate-700 text-brand-yellow-600 dark:text-brand-yellow-400 shadow-sm" : "text-slate-400"
              )}
            >
              <Upload className="h-4 w-4" /> {t('admin.upload_image')}
            </button>
          </div>
        </div>

        {imageMode === 'url' ? (
          <Input
            placeholder="https://ejemplo.com/imagen.jpg"
            value={formData.image}
            className="h-14 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl"
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            leftIcon={<ImageIcon className="h-5 w-5 text-slate-400" />}
          />
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl cursor-pointer hover:border-brand-yellow-500 transition-all group"
          >
            <Upload className="h-10 w-10 text-slate-300 dark:text-slate-600 group-hover:text-brand-yellow-500 mb-4 transition-colors" />
            <p className="font-bold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
              {t('admin.choose_file')}
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload}
            />
          </div>
        )}
        
        {formData.image && (
          <div className="relative h-48 w-48 mx-auto md:mx-0 rounded-[2.5rem] overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-xl">
            <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, image: '' })}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
        <Button 
          type="submit" 
          isLoading={isLoading} 
          className="flex-1 bg-brand-yellow-500 hover:bg-brand-yellow-600 text-brand-yellow-950 font-black py-4 sm:py-6 rounded-2xl shadow-xl shadow-brand-yellow-500/20 active:scale-95 transition-all text-lg"
          leftIcon={<Save className="h-6 w-6" />}
        >
          {initialData ? 'Guardar Cambios' : 'Agregar Producto'}
        </Button>
        <Button 
          variant="secondary" 
          type="button" 
          onClick={onCancel}
          className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black py-4 sm:py-6 rounded-2xl active:scale-95 transition-all text-lg"
          leftIcon={<X className="h-6 w-6" />}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};
