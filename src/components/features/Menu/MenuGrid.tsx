"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { CategoryTabs } from "./CategoryNavigation";
import { FeaturedCarousel } from "./FeaturedCarousel";
import { useLangStore } from "@/store/lang/lang.slice";
import { useProductStore } from "@/store/product/product.slice";
import { useCategoryStore } from "@/store/category/category.slice";
import { UtensilsCrossed, SearchX } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Premium Menu Layout.
 * Sections: Featured Carousel → Category Navigation → Product Grid.
 * Generous spacing ("breathing room") between sections for luxury feel.
 */
export const MenuGrid = () => {
  const { hydrated, lang } = useLangStore();
  const { categories } = useCategoryStore();
  const { products } = useProductStore();

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const isCategorySelected = activeCategoryId !== null;

  // El carousel SOLO se muestra en la vista 'TODOS' (sin categoría)
  const featuredProducts = products.filter((p) => p.isPopular);

  const filteredProducts = products.filter((product) => {
    // Si hay una categoría seleccionada, la grilla muestra TODOS los productos de esa categoría
    if (isCategorySelected) {
      return product.categoryId === activeCategoryId;
    }
    // Si estamos en 'TODOS', la grilla oculta los que ya están en el carousel
    return !product.isPopular;
  });

  if (!hydrated) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <div className="flex flex-col w-full max-w-full">
      {/* ─── SECTION 1: Featured / Más Vendidos Carousel ─── */}
      {!isCategorySelected && featuredProducts.length > 0 && (
        <>
          <FeaturedCarousel products={featuredProducts} />
          {/* ─── Breathing Room ─── */}
          <div className="h-8" />
        </>
      )}

      {/* ─── SECTION 2: Category Navigation ─── */}
      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
      />

      {/* ─── Section Label ─── */}
      <div className="flex items-center gap-3 px-2 mt-6 mb-4">
        <div className="flex items-center gap-2 text-slate-400 dark:text-white/30">
          <UtensilsCrossed className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-[0.15em]">
            {lang === "es" ? "Menú Completo" : "Full Menu"}
          </span>
        </div>
        <div className="flex-1 h-px bg-slate-200/50 dark:bg-white/6" />
      </div>

      {/* ─── SECTION 3: Product Grid ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 pb-6"
      >
        {filteredProducts.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 mx-2 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/[0.06]">
          <SearchX className="h-10 w-10 text-slate-300 dark:text-white/10 mb-4" />
          <h3 className="text-sm font-semibold text-slate-400 dark:text-white/30 uppercase tracking-widest text-center px-4">
            {lang === "es" ? "No hay productos en esta categoría" : "No products in this category"}
          </h3>
          <button
            onClick={() => setActiveCategoryId(null)}
            className="mt-6 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 bg-brand-yellow-500 text-brand-yellow-950 shadow-lg shadow-brand-yellow-500/20 hover:scale-105 active:scale-95"
          >
            {lang === "es" ? "Ver todo el menú" : "View full menu"}
          </button>
        </div>
      )}
    </div>
  );
};
