"use client";

import { useState, useCallback } from "react";
import { formatPriceARS } from "@/lib/formatters";

import { Product } from "@/types/menu.types";
import { useLangStore } from "@/store/lang/lang.slice";
import { useCartStore } from "@/store/cart/cart.slice";
import { useFlyToCartStore } from "@/store/ui/flyToCart.slice";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface ProductCardProps {
  product: Product;
}

/**
 * Premium Horizontal Product Card — Tablet Optimized.
 * Typography scaled for arm's-length reading (60-80cm).
 * Touch targets ≥ 56px (automotive standard).
 */
export const ProductCard = ({ product }: ProductCardProps) => {
  const { lang, hydrated } = useLangStore();
  const addItem = useCartStore((state) => state.addItem);

  const addFlyItem = useFlyToCartStore((state) => state.addFlyItem);
  const [isLoaded, setIsLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
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

      // Micro-feedback: show checkmark for 800ms
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 800);
    },
    [addItem, addFlyItem, product],
  );

  if (!hydrated) return null;

  const name = product.name[lang] || product.name["en"];

  return (
    <div
      role="article"
      aria-label={`${name} — $${formatPriceARS(product.price)}`}
      className={cn(
        "group relative flex flex-row rounded-2xl overflow-hidden h-[170px]",
        "bg-white dark:bg-slate-900/60 backdrop-blur-xl",
        "border border-slate-100 dark:border-white/4",
        "shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]",
        "transition-all duration-200 ease-out",
        "active:scale-[0.985] active:shadow-none dark:active:shadow-none",
        justAdded && "ring-2 ring-emerald-500/50 dark:ring-emerald-400/40",
      )}
    >
      {/* Image — fixed width, fills card height */}
      <div className="relative w-[170px] min-w-[170px] h-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.image}
          alt={name}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "object-cover w-full h-full transform transition-all duration-700",
            "group-active:scale-105",
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
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent via-60% to-white/40 dark:to-slate-950/60" />
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
          <span className="text-[28px] font-display font-black text-slate-900 dark:text-white tracking-tight leading-none">
            ${formatPriceARS(product.price)}
          </span>

          <button
            className={cn(
              "flex items-center justify-center h-14 w-14 rounded-xl transition-all duration-200",
              "shadow-lg active:scale-90 active:shadow-none",
              justAdded
                ? "bg-emerald-500 text-white shadow-emerald-500/25"
                : "bg-brand-yellow-500 text-brand-yellow-950 shadow-brand-yellow-500/25",
            )}
            onClick={handleAddToCart}
            aria-label={lang === "es" ? "Agregar al carrito" : "Add to cart"}
          >
            {justAdded ? (
              <Check className="h-6 w-6 stroke-[2.5] animate-in zoom-in duration-200" />
            ) : (
              <Plus className="h-6 w-6 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
