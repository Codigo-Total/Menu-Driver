"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { CategoryTabs } from "./CategoryNavigation";
import { useLangStore } from "@/store/lang/lang.slice";

/**
 * Mobile-First Menu Grid for Uber Riders.
 * Optimized for touch interfaces and varying screen sizes.
 * High-performance, with 1 column on mobile and 2/3 on tablets.
 */
import { useProductStore } from "@/store/product/product.slice";
import { useCategoryStore } from "@/store/category/category.slice";

export const MenuGrid = () => {
  const { hydrated } = useLangStore();
  const { categories } = useCategoryStore();
  const { products } = useProductStore();

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !activeCategoryId || product.categoryId === activeCategoryId;

    return matchesCategory;
  });

  if (!hydrated) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-full">
      {/* Circular Horizontal Categories */}
      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
      />

      {/* Responsive Grid System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 animate-in fade-in zoom-in-95 duration-500 pb-20">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 mx-2">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest text-center">
            No se encontraron productos para tu viaje.
          </h3>
        </div>
      )}
    </div>
  );
};
