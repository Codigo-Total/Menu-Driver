"use client";

import { Product } from "@/types/menu.types";
import { useLangStore } from "@/store/lang/lang.slice";
import { useCartStore } from "@/store/cart/cart.slice";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

/**
 * Mobile-First Product Card Component.
 * Optimized for Uber rides: High contrast, large touch targets, and app-like feel.
 * Cleaned up: Removed favorites and info icons as per user request.
 */
export const ProductCard = ({ product }: ProductCardProps) => {
  const { lang, hydrated } = useLangStore();
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  if (!hydrated) return null;

  const name = product.name[lang] || product.name["en"];
  const description = product.description[lang] || product.description["en"];

  return (
    <div
      onClick={() => router.push(`/product/${product.id}`)}
      className="group relative flex flex-col bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-4 transition-all duration-500 hover:shadow-xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-white dark:bg-slate-950 shadow-inner">
        <img
          src={product.image}
          alt={name}
          className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110"
        />

        {/* Floating Badges */}
        {product.isPopular && (
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[9px] uppercase font-black px-3 py-1.5 rounded-lg shadow-lg border border-slate-100 dark:border-slate-800 tracking-widest text-brand-yellow-600">
            {lang === "es" ? "Popular" : "Popular"}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 px-1">
        <div className="flex flex-col mb-3">
          <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white leading-none mb-1.5 uppercase tracking-tighter">
            {name}
          </h3>
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest line-clamp-1">
            {description.split(".")[0]}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
            ${product.price.toFixed(2)}
          </span>

          <button
            className="flex items-center justify-center h-10 sm:h-12 px-3 sm:px-5 rounded-xl bg-brand-yellow-500 text-brand-yellow-950 shadow-lg shadow-brand-yellow-500/20 active:scale-90 transition-all gap-2"
            onClick={(e) => {
              e.stopPropagation();
              addItem(product);
            }}
          >
            <Plus className="h-5 w-5 sm:h-6 sm:w-6 stroke-3" />
            <span className="hidden leading-none sm:inline text-[10px] font-black uppercase tracking-widest">
              {lang === "es" ? "Agregar" : "Add"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
