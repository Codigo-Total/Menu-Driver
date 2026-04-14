"use client";

import { useRef, useState, useEffect } from "react";
import { Product } from "@/types/menu.types";
import { useLangStore } from "@/store/lang/lang.slice";
import { useCartStore } from "@/store/cart/cart.slice";
import { useToastStore } from "@/store/ui/toast.slice";
import { useFlyToCartStore } from "@/store/ui/flyToCart.slice";
import { Plus, Star, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

interface FeaturedCarouselProps {
  products: Product[];
}

const CarouselCard = ({ product, lang }: { product: Product; lang: string }) => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const addFlyItem = useFlyToCartStore((state) => state.addFlyItem);
  const [isLoaded, setIsLoaded] = useState(false);

  const name = product.name[lang] || product.name["en"];
  const description = product.description[lang] || product.description["en"];

  return (
    <div
      onClick={() => router.push(`/product/${product.id}`)}
      className="group relative flex-shrink-0 w-[calc(50%-8px)] min-w-[300px] h-[180px] rounded-2xl overflow-hidden cursor-pointer snap-start
        transition-all duration-500
        shadow-[0_10px_40px_rgb(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgb(0,0,0,0.4)]
        border border-slate-200/50 dark:border-white/5
        hover:shadow-[0_15px_50px_rgb(0,0,0,0.15)] dark:hover:shadow-[0_15px_50px_rgb(0,0,0,0.6)]
        active:scale-[0.985] active:shadow-none dark:active:shadow-none"
    >
      {/* Full Background Image */}
      <img
        src={product.image}
        alt={name}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110",
          !isLoaded ? "opacity-0 scale-105" : "opacity-100 scale-100",
        )}
      />

      {/* Skeleton Shimmer */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6">
        {/* Top: Badge */}
        <div className="flex items-center gap-1.5 self-start bg-brand-yellow-500/90 backdrop-blur-sm text-brand-yellow-950 text-[10px] uppercase font-black px-3 py-1.5 rounded-lg tracking-wider shadow-lg">
          <Star className="h-3 w-3 fill-current" />
          {lang === "es" ? "Favorito" : "Favorite"}
        </div>

        {/* Bottom: Name + Price + CTA */}
        <div className="flex items-end justify-between">
          <div className="flex-1 min-w-0 mr-4">
            <h3 className="text-xl font-display font-black text-white leading-[1.1] tracking-tight line-clamp-2">
              {name}
            </h3>
            <p className="text-xs font-semibold text-white/70 mt-1 truncate">
              {description.split(".")[0]}
            </p>
            <span className="text-2xl font-display font-black text-white mt-1.5 inline-block tracking-tight">
              ${product.price.toFixed(2)} <span className="text-xs text-white/40 ml-1">USD</span>
            </span>
          </div>

          <button
            className="flex items-center gap-2 h-12 px-5 rounded-xl transition-all duration-300
              bg-brand-yellow-500 text-brand-yellow-950
              shadow-lg shadow-brand-yellow-500/30
              hover:bg-brand-yellow-400 hover:shadow-xl hover:shadow-brand-yellow-500/40
              active:scale-90 active:shadow-none
              shrink-0"
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
            <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">
              {lang === "es" ? "Agregar" : "Add"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Premium "Más Vendidos" Horizontal Carousel.
 * Hero-sized cards that fill the width. Designed to capture attention
 * in the first 3 seconds of viewing the menu.
 * Touch-optimized with horizontal scroll snap.
 */

export const FeaturedCarousel = ({ products }: FeaturedCarouselProps) => {
  const { lang, hydrated } = useLangStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollMetrics, setScrollMetrics] = useState({ activeIndex: 0, totalPages: 1 });

  const updateScrollMetrics = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;

    const clientWidth = container.clientWidth;
    const scrollWidth = container.scrollWidth;
    const scrollLeft = container.scrollLeft;

    if (clientWidth === 0) return;

    // Get the first item's width
    const firstItem = container.firstElementChild as HTMLElement;
    const cardWidth = firstItem?.clientWidth || clientWidth;

    // Calculate how many items fit in the visible area
    const itemsPerPage = Math.max(1, Math.round(clientWidth / cardWidth));

    // Total pages = total items / items we see per page
    const pages = Math.ceil(products.length / itemsPerPage);

    // Calculate which page we are on based on scroll progress
    const maxScrollLeft = scrollWidth - clientWidth;
    let index = 0;

    if (maxScrollLeft > 0) {
      const scrollProgress = scrollLeft / maxScrollLeft;
      // Map progress to discrete pages
      index = Math.round(scrollProgress * (pages - 1));
    }

    setScrollMetrics({
      activeIndex: Math.max(0, Math.min(index, Math.max(0, pages - 1))),
      totalPages: Math.max(1, pages),
    });
  };

  useEffect(() => {
    // Initial calculation after a short delay to let layout settle
    const timer = setTimeout(updateScrollMetrics, 100);

    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollMetrics, { passive: true });
      window.addEventListener("resize", updateScrollMetrics);
    }

    return () => {
      clearTimeout(timer);
      if (container) {
        container.removeEventListener("scroll", updateScrollMetrics);
        window.removeEventListener("resize", updateScrollMetrics);
      }
    };
  }, [products.length]);

  if (!hydrated || products.length === 0) return null;

  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="flex items-center gap-3 px-2 mb-4">
        <div className="flex items-center gap-2 bg-linear-to-r from-orange-500 to-amber-500 text-white px-3.5 py-1.5 rounded-full shadow-lg shadow-orange-500/25">
          <Flame className="h-4 w-4 fill-current" />
          <span className="text-xs font-black uppercase tracking-wider">
            {lang === "es" ? "Lo Más Pedido" : "Most Popular"}
          </span>
        </div>
        <div className="flex-1 h-px bg-linear-to-r from-orange-500/20 to-transparent" />
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar px-2 snap-x snap-mandatory pb-4"
      >
        {products.map((product) => (
          <CarouselCard key={product.id} product={product} lang={lang} />
        ))}
      </div>

      {/* Pagination Dots */}
      {scrollMetrics.totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-1 mb-2">
          {Array.from({ length: scrollMetrics.totalPages }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 transition-all duration-300 rounded-full",
                i === scrollMetrics.activeIndex
                  ? "w-6 bg-brand-yellow-500"
                  : "w-2 bg-slate-200 dark:bg-white/10",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
};
