'use client';

import { useState } from 'react';
import { useProductStore } from '@/store/product/product.slice';
import { useAuthStore } from '@/store/auth';
import { useCategoryStore } from '@/store/category/category.slice';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProductForm } from '@/components/admin/ProductForm';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package,
  LogOut,
  Moon,
  Sun,
  Layers,
  ShoppingBag,
  Globe,
  Settings2
} from 'lucide-react';
import { Product, Category } from '@/types/menu.types';
import { motion, AnimatePresence } from 'framer-motion';
import { useLangStore } from '@/store/lang/lang.slice';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/cn';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { logout } = useAuthStore();
  const router = useRouter();
  const { t, lang, setLanguage, hydrated } = useLangStore();
  const { theme, setTheme } = useTheme();
  
  if (!hydrated) return null;
  
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | Category | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.es.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(c => 
    c.name.es.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = (data: Omit<Product, 'id'>) => {
    addProduct(data);
    setIsModalOpen(false);
  };

  const handleUpdateProduct = (data: Omit<Product, 'id'>) => {
    if (editingItem && 'description' in editingItem) {
      updateProduct(editingItem.id, data);
      setIsModalOpen(false);
      setEditingItem(undefined);
    }
  };

  const handleCreateCategory = (data: Omit<Category, 'id'>) => {
    addCategory(data);
    setIsModalOpen(false);
  };

  const handleUpdateCategory = (data: Omit<Category, 'id'>) => {
    if (editingItem && !('description' in editingItem)) {
      updateCategory(editingItem.id, data);
      setIsModalOpen(false);
      setEditingItem(undefined);
    }
  };

  const [isManualMode, setIsManualMode] = useState(false);

  const openEditModal = (item: Product | Category) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const renderHeaderAction = (
    <button
      type="button"
      onClick={() => setIsManualMode(!isManualMode)}
      className={cn(
        "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-wider transition-all",
        isManualMode 
          ? "bg-brand-yellow-500 text-brand-yellow-950 shadow-2xl shadow-brand-yellow-500/30" 
          : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700"
      )}
    >
      {isManualMode ? <Settings2 className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
      {isManualMode ? t('admin.manual_mode') : t('admin.auto_translate')}
    </button>
  );

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? (cat.name[lang] || cat.name.es) : t('admin.no_category');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20">
      {/* Top Utility Bar - Responsive Stacking */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pt-4">
        <div className="flex w-full md:w-auto bg-white dark:bg-slate-900 p-1.5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('products')}
            className={cn(
              "flex-1 md:flex-none px-6 sm:px-8 py-3 rounded-[1.5rem] font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-3 whitespace-nowrap",
              activeTab === 'products' ? "bg-brand-yellow-500 text-brand-yellow-950 shadow-lg shadow-brand-yellow-500/20" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            )}
          >
            <ShoppingBag className="h-4 w-4" /> {t('admin.products_uppercase')}
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={cn(
              "flex-1 md:flex-none px-6 sm:px-8 py-3 rounded-[1.5rem] font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-3 whitespace-nowrap",
              activeTab === 'categories' ? "bg-brand-yellow-500 text-brand-yellow-950 shadow-lg shadow-brand-yellow-500/20" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            )}
          >
            <Layers className="h-4 w-4" /> {t('admin.categories_uppercase')}
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Language Switcher */}
          <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setLanguage('es')}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black transition-all",
                lang === 'es' ? "bg-brand-yellow-500 text-brand-yellow-950 shadow-md" : "text-slate-400"
              )}
            >
              ES
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black transition-all",
                lang === 'en' ? "bg-brand-yellow-500 text-brand-yellow-950 shadow-md" : "text-slate-400"
              )}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-brand-yellow-500 transition-all shadow-sm"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shadow-sm text-sm"
          >
            <LogOut className="h-4 w-4" /> {t('auth.logout')}
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {activeTab === 'products' 
            ? (lang === 'en' ? 'Products Management' : 'Gestión de Productos') 
            : (lang === 'en' ? 'Categories Management' : 'Gestión de Categorías')}
        </h1>
        <Button 
          onClick={() => {
            setEditingItem(undefined);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto bg-brand-yellow-500 hover:bg-brand-yellow-600 text-brand-yellow-950 px-8 py-6 rounded-[1.5rem] font-black shadow-xl shadow-brand-yellow-500/20 active:scale-95 transition-all text-base sm:text-lg"
          leftIcon={<Plus className="h-5 w-5 sm:h-6 sm:w-6" />}
        >
          {activeTab === 'products' ? t('admin.add_product') : t('admin.add_category')}
        </Button>
      </div>

      {/* Search */}
      <div className="relative group w-full sm:max-w-sm">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-yellow-500 transition-colors" />
        <input
          type="text"
          placeholder={activeTab === 'products' ? t('admin.search_products') : t('admin.search_categories')}
          className="w-full pl-16 pr-8 py-4 sm:py-5 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-brand-yellow-500 outline-none transition-all shadow-sm text-sm sm:text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'products' ? (
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
               <div className="overflow-x-auto px-4">
                <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
                  <thead>
                    <tr className="border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                      <th className="px-4 sm:px-8 py-7 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('admin.image')}</th>
                      <th className="px-4 sm:px-8 py-7 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('admin.name')}</th>
                      <th className="hidden md:table-cell px-8 py-7 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('admin.category')}</th>
                      <th className="hidden sm:table-cell px-8 py-7 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('admin.price')}</th>
                      <th className="px-4 sm:px-8 py-7 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {filteredProducts.map((product) => (
                      <motion.tr layout key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                        <td className="px-4 sm:px-8 py-6">
                          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                            {product.image ? (
                              <img src={product.image} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-slate-300">
                                <Package className="h-6 w-6 sm:h-8 sm:w-8" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-8 py-6">
                          <div className="max-w-[150px] sm:max-w-[300px]">
                            <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight break-words">{product.name[lang] || product.name.es}</p>
                            <p className="hidden sm:block text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{product.description[lang] || product.description.es}</p>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-8 py-6">
                          <span className="inline-flex px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {getCategoryName(product.categoryId)}
                          </span>
                        </td>
                        <td className="hidden sm:table-cell px-8 py-6">
                          <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</p>
                        </td>
                        <td className="px-4 sm:px-8 py-6">
                          <div className="flex items-center justify-end gap-2 sm:gap-3">
                            <button onClick={() => openEditModal(product)} className="p-3 sm:p-3.5 rounded-2xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all active:scale-90">
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button onClick={() => deleteProduct(product.id)} className="p-3 sm:p-3.5 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-90">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map((category) => (
                <motion.div
                  layout
                  key={category.id}
                  className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-brand-yellow-50 dark:group-hover:bg-brand-yellow-500/10 group-hover:text-brand-yellow-500 transition-all">
                      <Layers className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => openEditModal(category)} className="p-3 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                         <Edit2 className="h-4 w-4" />
                       </button>
                       <button onClick={() => deleteCategory(category.id)} className="p-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                         <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {category.name[lang] || category.name.es}
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">
                      {products.filter(p => p.categoryId === category.id).length} {t('admin.products_uppercase')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all hover:scale-[1.02] cursor-default">
          <p className="text-sm font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">
            {activeTab === 'products' ? t('admin.total_products') : (lang === 'en' ? 'Total Categories' : 'Total Categorías')}
          </p>
          <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">{activeTab === 'products' ? products.length : categories.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all hover:scale-[1.02] cursor-default">
          <p className="text-sm font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">{t('admin.products_in_stock')}</p>
          <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
            {products.filter(p => p.stock > 0).length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all hover:scale-[1.02] cursor-default">
          <p className="text-sm font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">{t('admin.out_of_stock')}</p>
          <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
            {products.filter(p => p.stock === 0).length}
          </p>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(undefined);
        }}
        size="lg"
        title={editingItem ? (activeTab === 'products' ? t('admin.edit_product') : 'Editar Categoría') : (activeTab === 'products' ? t('admin.add_product') : t('admin.add_category'))}
        headerAction={renderHeaderAction}
      >
        {activeTab === 'products' ? (
          <ProductForm
            initialData={editingItem as Product}
            isManualMode={isManualMode}
            setIsManualMode={setIsManualMode}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingItem(undefined);
            }}
            onSubmit={editingItem ? handleUpdateProduct : handleCreateProduct}
          />
        ) : (
          <CategoryForm
            initialData={editingItem as Category}
            isManualMode={isManualMode}
            setIsManualMode={setIsManualMode}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingItem(undefined);
            }}
            onSubmit={editingItem ? handleUpdateCategory : handleCreateCategory}
          />
        )}
      </Modal>
    </div>
  );
}
