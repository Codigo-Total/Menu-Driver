'use client';

import { useState } from 'react';
import { useProductStore } from '@/store/product/product.slice';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProductForm } from '@/components/admin/ProductForm';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertCircle,
  Package,
  ArrowUpRight,
  Globe,
  Settings2
} from 'lucide-react';
import { Product } from '@/types/menu.types';
import { motion } from 'framer-motion';
import { useLangStore } from '@/store/lang/lang.slice';
import { cn } from '@/lib/cn';

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { t, lang } = useLangStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.es.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [isManualMode, setIsManualMode] = useState(false);

  const handleCreate = (data: Omit<Product, 'id'>) => {
    addProduct(data);
    setIsModalOpen(false);
  };

  const handleUpdate = (data: Omit<Product, 'id'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      setIsModalOpen(false);
      setEditingProduct(undefined);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
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

  return (
    <div className="space-y-8 pb-12 transition-colors duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('admin.products_title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t('admin.products_subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => {
              setEditingProduct(undefined);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            {t('admin.add_product')}
          </Button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         {[
           { label: t('admin.total_items'), value: products.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
           { label: t('admin.low_stock'), value: products.filter(p => p.stock < 5).length, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-500/10' },
           { label: t('admin.featured'), value: products.filter(p => p.isPopular).length, icon: ArrowUpRight, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10' },
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
           </div>
         ))}
      </div>

      {/* Search & Filters */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-yellow-500 transition-colors" />
        <input
          type="text"
          placeholder={t('admin.search_products')}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-yellow-500 outline-none transition-all hover:shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Products Table/Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('admin.product')}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('admin.category')}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('admin.price')}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('admin.stock')}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.map((product) => (
                  <motion.tr 
                    layout
                    key={product.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 font-bold flex items-center justify-center">
                          {product.image ? (
                            <img src={product.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{product.name[lang] || product.name.es}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                        {t('admin.category')} {product.categoryId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`} />
                        <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-500 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                          {product.stock} units
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2 rounded-lg text-slate-400 hover:text-brand-yellow-600 dark:hover:text-brand-yellow-500 hover:bg-brand-yellow-50 dark:hover:bg-brand-yellow-500/10 transition-all active:scale-90"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 border border-dashed border-slate-200 dark:border-slate-700">
              <Plus className="h-10 w-10 text-slate-200 dark:text-slate-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('admin.no_products')}</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mt-2">
              {t('admin.products_subtitle')}
            </p>
            <Button 
              variant="outline" 
              className="mt-8 border-slate-200 dark:border-slate-700 dark:text-slate-400"
              onClick={() => setIsModalOpen(true)}
            >
              {t('admin.add_first')}
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(undefined);
        }}
        title={editingProduct ? t('admin.edit_product') : t('admin.add_product')}
        headerAction={renderHeaderAction}
      >
        <ProductForm
          initialData={editingProduct}
          isManualMode={isManualMode}
          setIsManualMode={setIsManualMode}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingProduct(undefined);
          }}
          onSubmit={editingProduct ? handleUpdate : handleCreate}
        />
      </Modal>
    </div>
  );
}
