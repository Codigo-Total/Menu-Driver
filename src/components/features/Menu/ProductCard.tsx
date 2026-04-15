"use client";

import { useState } from "react";
import { formatPriceARS } from "@/lib/formatters";

import { Product } from "@/types/menu.types";
import { useLangStore } from "@/store/lang/lang.slice";
import { useCartStore } from "@/store/cart/cart.slice";
import { useFlyToCartStore } from "@/store/ui/flyToCart.slice";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

interface ProductCardProps {
  product: Product;
}

/**
 * Premium Horizontal Product Card — Tablet Optimized.
 * Typography scaled for arm's-length reading (60-80cm).
 * Glassmorphism + depth. Touch targets ≥ 48px.
 */
export const ProductCard = ({ product }: ProductCardProps) => {
  const { lang, hydrated } = useLangStore();
  const addItem = useCartStore((state) => state.addItem);

  const addFlyItem = useFlyToCartStore((state) => state.addFlyItem);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!hydrated) return null;

  const name = product.name[lang] || product.name["en"];

  return (
    <div
      className="group relative flex flex-row rounded-2xl overflow-hidden transition-all duration-500 h-[170px]
        bg-white dark:bg-slate-900/60 backdrop-blur-xl
        border border-slate-100 dark:border-white/4
        shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]
        hover:bg-slate-50 dark:hover:bg-white/4
        hover:border-slate-200 dark:hover:border-white/8
        hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.5)]
        active:scale-[0.985] active:shadow-none dark:active:shadow-none"
    >
      {/* Image — fixed width, fills card height */}
      <div className="relative w-[170px] min-w-[170px] h-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.image}
          alt={name}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "object-cover w-full h-full transform transition-all duration-700 group-hover:scale-110",
            !isLoaded ? "opacity-0 scale-105" : "opacity-100 scale-100",
          )}
        />

        {/* Skeleton Shimmer */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
            <div className="w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        )}

        {/* Right-edge gradient blend */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-white/40 dark:to-slate-950/60" />
      </div>

      {/* Content — scaled for tablet reading distance */}
      <div className="flex flex-col justify-between flex-1 p-5 min-w-0">
        {/* Top: Name */}
        <div className="min-w-0">
          <h3
            className="text-xl sm:text-[22px] font-display font-black text-slate-900 dark:text-white/95 leading-tight tracking-tight line-clamp-2"
            title={name}
          >
            {name}
          </h3>
        </div>

        {/* Bottom: Price + CTA */}
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
              {lang === "es" ? "Precio" : "Price"}
            </span>
            <span className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-none">
              ${formatPriceARS(product.price)}
            </span>
          </div>

          <button
            className="flex items-center justify-center h-12 w-12 rounded-xl transition-all duration-300
              bg-brand-yellow-500 text-brand-yellow-950
              shadow-lg shadow-brand-yellow-500/25
              hover:shadow-xl hover:shadow-brand-yellow-500/40
              hover:bg-brand-yellow-400
              active:scale-90 active:shadow-none"
            onClick={(e) => {
              e.stopPropagation();

              const cardElement = e.currentTarget.closest(".group");
              const imgElement = cardElement?.querySelector("img");
              if (imgElement) {
                const rect = imgElement.getBoundingClientRect();
                addFlyItem({
                  image: product.image,
                  startX: rect.left,
                  startY: rect.top,
                  startWidth: rect.width,
                });
              }

              addItem(product);
            }}
            aria-label={lang === "es" ? "Agregar al carrito" : "Add to cart"}
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
