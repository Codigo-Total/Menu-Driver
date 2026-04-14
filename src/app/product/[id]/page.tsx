"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/types/menu.types";
import { menuService } from "@/services/api/menu.service";
import { useLangStore } from "@/store/lang/lang.slice";
import { useCartStore } from "@/store/cart/cart.slice";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, Plus, Minus, ShoppingBag } from "lucide-react";

/**
 * Premium Product Detail Page.
 * Specialized for Uber riders: Split layout, large touch targets, and high contrast.
 * High-performance, with smooth transitions and responsive design.
 */
export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { lang, hydrated } = useLangStore();
  const addItem = useCartStore((state) => state.addItem);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (typeof id !== "string") return;
      const data = await menuService.getProductById(id);
      if (data) {
        setProduct(data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (!hydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="h-12 w-12 border-4 border-brand-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-slate-950">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
          Producto no encontrado
        </h1>
        <Button onClick={() => router.push("/")}>Volver al menú</Button>
      </div>
    );
  }

  const name = product.name[lang] || product.name["en"];
  const handleAddToCart = () => {
    // Add item multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setIsCartOpen(true);
    router.push("/menu"); 
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in-95 duration-700 lg:h-[calc(100vh-183px)]">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-950 rounded-3xl lg:rounded-[2.5rem] border border-slate-100 dark:border-slate-900 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative ring-1 ring-slate-100 dark:ring-slate-800 h-full">
        {/* Back Button - Minimal */}
        <button
          onClick={() => router.back()}
          className="absolute top-3 left-3 z-30 h-9 w-9 rounded-lg bg-slate-950/20 backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-center text-white transition-all active:scale-90 hover:bg-slate-900/40"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Left Pane: Image Hero (Very Compact) */}
        <section className="relative h-full w-full overflow-hidden flex-none">
          <img
            src={product.image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 to-transparent lg:hidden" />
        </section>

        {/* Right Pane: Content & Actions */}
        <section className="flex flex-col h-full bg-white dark:bg-slate-950">
          <div className="flex-1 p-5 sm:p-7 lg:p-8 space-y-4">
            {/* Header Info */}
            <div className="space-y-1.5 pt-4">
              <h1 className="text-xl lg:text-3xl font-display font-black text-slate-950 dark:text-white uppercase tracking-tighter leading-tight">
                {name}
              </h1>
            </div>

            {/* Price & Status */}
            <div className="flex flex-col gap-1">
              <div className="text-2xl lg:text-4xl font-display font-black text-brand-yellow-500 tracking-tighter">
                ${product.price.toFixed(2)}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-green-500" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                  {lang === "es" ? "Disponible" : "Available"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions - Compact & Refined */}
          <div className="p-5 sm:p-7 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-900 mt-auto">
            <div className="max-w-[280px] mx-auto flex flex-col items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between w-full bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-slate-950 dark:text-white active:scale-90 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600"
                >
                  <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <span className="text-lg sm:text-2xl font-display font-black text-slate-950 dark:text-white tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-slate-950 dark:text-white active:scale-90 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full h-14 sm:h-16 rounded-xl text-[11px] sm:text-[13px] font-black uppercase tracking-[0.2em] bg-brand-yellow-500 text-brand-yellow-950 shadow-lg shadow-brand-yellow-500/20 hover:bg-brand-yellow-400 transition-all"
                leftIcon={
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                }
              >
                {lang === "es" ? "Comprar ya" : "Buy Now"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
