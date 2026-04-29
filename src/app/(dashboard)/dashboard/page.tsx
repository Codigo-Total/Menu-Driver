"use client";

import { useState } from "react";
import { useProductStore } from "@/store/product/product.slice";
import { useAuthStore } from "@/store/auth";
import { useCategoryStore } from "@/store/category/category.slice";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProductForm } from "@/components/admin/ProductForm";
import { CategoryForm } from "@/components/admin/CategoryForm";
import * as LucideIcons from "lucide-react";
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
  X,
} from "lucide-react";
import { formatPriceARS } from "@/lib/formatters";
import { Product, Category } from "@/types/menu.types";
import { motion, AnimatePresence } from "framer-motion";
import { useLangStore } from "@/store/lang/lang.slice";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { logout } = useAuthStore();
  const router = useRouter();
  const { t, lang, setLanguage, hydrated } = useLangStore();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | Category | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  if (!hydrated) return null;

  const filteredProducts = products.filter(
    (p) =>
      p.name.es.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.en.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredCategories = categories.filter(
    (c) =>
      c.name.es.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.en.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateProduct = (data: Omit<Product, "id">) => {
    addProduct(data);
    setIsModalOpen(false);
  };

  const handleUpdateProduct = (data: Omit<Product, "id">) => {
    if (editingItem && "description" in editingItem) {
      updateProduct(editingItem.id, data);
      setIsModalOpen(false);
      setEditingItem(undefined);
    }
  };

  const handleCreateCategory = (data: Omit<Category, "id">) => {
    addCategory(data);
    setIsModalOpen(false);
  };

  const handleUpdateCategory = (data: Omit<Category, "id">) => {
    if (editingItem && !("description" in editingItem)) {
      updateCategory(editingItem.id, data);
      setIsModalOpen(false);
      setEditingItem(undefined);
    }
  };

  const openEditModal = (item: Product | Category) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const getCategoryName = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name[lang] || cat.name.es : t("admin.no_category");
  };

  // Dynamic count helpers
  const totalCount = activeTab === "products" ? products.length : categories.length;
  const filteredCount =
    activeTab === "products" ? filteredProducts.length : filteredCategories.length;
  const isFiltered = searchTerm.length > 0;

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Row 1: Tabs + Compact Controls */}
      <div className="flex items-center justify-between gap-4 pt-4">
        {/* Tabs — clean, no container box */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => setActiveTab("products")}
            className={cn(
              "px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all flex items-center gap-2.5 whitespace-nowrap",
              activeTab === "products"
                ? "bg-brand-yellow-500 text-brand-yellow-950 shadow-md shadow-brand-yellow-500/20"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
            )}
          >
            <ShoppingBag className="h-4 w-4" /> {t("admin.products_uppercase")}
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={cn(
              "px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all flex items-center gap-2.5 whitespace-nowrap",
              activeTab === "categories"
                ? "bg-brand-yellow-500 text-brand-yellow-950 shadow-md shadow-brand-yellow-500/20"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
            )}
          >
            <Layers className="h-4 w-4" /> {t("admin.categories_uppercase")}
          </button>
        </div>

        {/* Compact Controls — icons only */}
        <div className="flex items-center gap-2">
          {/* Language Switcher — compact pill */}
          <div className="flex bg-slate-100/80 dark:bg-white/5 p-1 rounded-2xl">
            <button
              onClick={() => setLanguage("es")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-200 outline-none",
                lang === "es"
                  ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
              )}
            >
              ES
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-200 outline-none",
                lang === "en"
                  ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
              )}
            >
              EN
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "flex items-center justify-center w-[36px] h-[36px] rounded-2xl outline-none",
              "bg-slate-100/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/5",
              "text-slate-500 dark:text-slate-400",
              "transition-all duration-200 ease-out",
              "hover:bg-slate-200/80 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-slate-200",
              "active:scale-[0.95]",
            )}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-[16px] w-[16px] stroke-[1.75]" />
            ) : (
              <Moon className="h-[16px] w-[16px] stroke-[1.75]" />
            )}
          </button>

          {/* Logout — icon only */}
          <button
            onClick={() => {
              logout();
              router.push("/menu");
            }}
            className={cn(
              "flex items-center justify-center w-[36px] h-[36px] rounded-2xl outline-none",
              "bg-red-500/5 dark:bg-red-500/10 hover:bg-red-500/10 dark:hover:bg-red-500/20",
              "text-red-500/70 dark:text-red-400/70 hover:text-red-500 dark:hover:text-red-400",
              "active:scale-[0.95] transition-all duration-200",
            )}
            aria-label={t("auth.logout")}
            title={t("auth.logout")}
          >
            <LogOut className="h-[16px] w-[16px] stroke-2" />
          </button>
        </div>
      </div>

      {/* Row 2: Search + Count Badge + CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Search — takes remaining space */}
        <div className="relative group flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-yellow-500 transition-colors" />
          <input
            type="text"
            placeholder={
              activeTab === "products" ? t("admin.search_products") : t("admin.search_categories")
            }
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-yellow-500/20 focus:border-slate-200 outline-none transition-all shadow-sm text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Inline Count Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm whitespace-nowrap">
          <Package className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">
            {isFiltered ? (
              <>
                {filteredCount} <span className="text-slate-300 dark:text-slate-600">de</span>{" "}
                {totalCount}
              </>
            ) : (
              <>
                {totalCount}{" "}
                {activeTab === "products"
                  ? lang === "en"
                    ? "products"
                    : "productos"
                  : lang === "en"
                    ? "categories"
                    : "categorías"}
              </>
            )}
          </span>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => {
            setEditingItem(undefined);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto bg-brand-yellow-500 hover:bg-brand-yellow-600 text-brand-yellow-950 px-6 py-3.5 rounded-2xl font-black shadow-lg shadow-brand-yellow-500/20 active:scale-95 transition-all text-sm"
          leftIcon={<Plus className="h-4 w-4" />}
        >
          {activeTab === "products" ? t("admin.add_product") : t("admin.add_category")}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "products" ? (
            <div className="bg-white dark:bg-slate-900 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
                  <thead>
                    <tr className="border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                      <th className="px-4 sm:px-8 py-7 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {t("admin.image")}
                      </th>
                      <th className="px-4 sm:px-8 py-7 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {t("admin.name")}
                      </th>
                      <th className="hidden md:table-cell px-8 py-7 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {t("admin.category")}
                      </th>
                      <th className="hidden sm:table-cell px-8 py-7 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {t("admin.price")}
                      </th>
                      <th className="px-4 sm:px-8 py-7 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
                        {t("admin.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {filteredProducts.map((product) => (
                      <motion.tr
                        layout
                        key={product.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 sm:px-8 py-6">
                          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-sm">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-slate-300">
                                <Package className="h-6 w-6 sm:h-8 sm:w-8" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-8 py-6">
                          <div className="max-w-[150px] sm:max-w-[300px]">
                            <p className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white leading-tight wrap-break-word">
                              {product.name[lang] || product.name.es}
                            </p>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-8 py-6">
                          <span className="inline-flex px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {getCategoryName(product.categoryId)}
                          </span>
                        </td>
                        <td className="hidden sm:table-cell px-8 py-6">
                          <p className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white">
                            ${formatPriceARS(product.price)}
                          </p>
                        </td>
                        <td className="px-4 sm:px-8 py-6">
                          <div className="flex items-center justify-end gap-2 sm:gap-3">
                            <button
                              onClick={() => openEditModal(product)}
                              className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-700 dark:hover:text-blue-300 transition-all active:scale-95 group"
                              title={t("admin.edit_product")}
                            >
                              <Edit2 className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-300 transition-all active:scale-95 group"
                              title={t("admin.delete_product") || "Eliminar"}
                            >
                              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
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
            <>
              {filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories.map((category) => {
                    const IconComponent =
                      (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[
                        category.icon
                      ] || LucideIcons.Layers;
                    const productCount = products.filter(
                      (p) => p.categoryId === category.id,
                    ).length;
                    const otherLang = lang === "es" ? "en" : "es";
                    const secondaryName = category.name[otherLang];

                    return (
                      <motion.div
                        layout
                        key={category.id}
                        className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/30 dark:shadow-none hover:border-brand-yellow-500/30 dark:hover:border-brand-yellow-500/20 transition-all duration-300 group relative overflow-hidden"
                      >
                        {/* Row 1: Icon + Actions */}
                        <div className="flex items-start justify-between mb-7">
                          <div className="p-4 rounded-2xl bg-brand-yellow-50 dark:bg-brand-yellow-500/10 text-brand-yellow-600 dark:text-brand-yellow-400 ring-1 ring-brand-yellow-500/20 group-hover:scale-105 transition-transform duration-300">
                            <IconComponent className="h-7 w-7" strokeWidth={2} />
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEditModal(category)}
                              className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 ring-1 ring-slate-200/80 dark:ring-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 hover:ring-blue-500/30 transition-all active:scale-95"
                              title={t("admin.edit_category") || "Editar"}
                            >
                              <Edit2 className="h-[18px] w-[18px]" />
                            </button>
                            <button
                              onClick={() => deleteCategory(category.id)}
                              className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 ring-1 ring-slate-200/80 dark:ring-slate-700/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 hover:ring-rose-500/30 transition-all active:scale-95"
                              title={t("admin.delete_category") || "Eliminar"}
                            >
                              <Trash2 className="h-[18px] w-[18px]" />
                            </button>
                          </div>
                        </div>

                        {/* Row 2: Name + Secondary + Badge */}
                        <div>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                            {category.name[lang] || category.name.es}
                          </h3>
                          {secondaryName && (
                            <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-1 truncate">
                              {secondaryName}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-100 dark:ring-slate-700/50">
                              <Package className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                              <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                                {productCount}{" "}
                                {productCount === 1
                                  ? lang === "en" ? "product" : "producto"
                                  : lang === "en" ? "products" : "productos"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                  <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Layers className="h-7 w-7 text-slate-300 dark:text-slate-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {lang === "es" ? "Sin categorías aún" : "No categories yet"}
                  </h3>
                  <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs mt-1.5">
                    {lang === "es"
                      ? "Creá tu primera categoría para organizar tus productos"
                      : "Create your first category to organize your products"}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 border-slate-200 dark:border-slate-700 dark:text-slate-400"
                    onClick={() => {
                      setEditingItem(undefined);
                      setIsModalOpen(true);
                    }}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    {t("admin.add_category")}
                  </Button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(undefined);
        }}
        size="xl"
        title={
          editingItem
            ? activeTab === "products"
              ? t("admin.edit_product")
              : "Editar Categoría"
            : activeTab === "products"
              ? t("admin.add_product")
              : t("admin.add_category")
        }
      >
        {activeTab === "products" ? (
          <ProductForm
            initialData={editingItem as Product}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingItem(undefined);
            }}
            onSubmit={editingItem ? handleUpdateProduct : handleCreateProduct}
          />
        ) : (
          <CategoryForm
            initialData={editingItem as Category}
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
