"use client";

import { useCartStore } from "@/store/cart/cart.slice";
import { useLangStore } from "@/store/lang/lang.slice";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  X,
  ArrowRight,
  XCircle,
} from "lucide-react";
import Link from "next/link";

export const CartDrawer = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    getTotal,
    clearCart,
    isCartOpen,
    setIsCartOpen,
  } = useCartStore();
  const { lang, t, hydrated } = useLangStore();

  const onClose = () => setIsCartOpen(false);

  if (!hydrated) return null;

  return (
    <>
      {/* Backdrop with enhanced blur */}
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm transition-opacity duration-500",
          isCartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Premium Glass Drawer */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-[101] h-full w-full max-w-[440px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl shadow-[-20px_0_50px_-15px_rgba(0,0,0,0.3)] transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) border-l border-white/10 dark:border-slate-800",
          isCartOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-8 pb-6 border-b border-slate-50 dark:border-slate-900">
            <div className="flex flex-col">
              <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tighter">
                <ShoppingBag className="h-6 w-6 text-brand-yellow-500" />
                {t("menu.cart_title")}
              </h2>
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mt-1">
                {items.length} {items.length === 1 ? "Producto" : "Productos"}{" "}
                seleccionados
              </span>
            </div>
            <button
              onClick={onClose}
              className="group h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 transition-all hover:rotate-90 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="h-32 w-32 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-8 animate-pulse">
                  <ShoppingBag className="h-12 w-12 text-slate-200 dark:text-slate-800" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                  {t("menu.empty_cart")}
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 text-brand-yellow-600 font-black text-xs uppercase tracking-widest hover:underline"
                >
                  Volver al menú
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex items-center gap-4 bg-white dark:bg-white/5 p-3 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-brand-yellow-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none"
                >
                  {/* Thumbnail */}
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-inner">
                    <img
                      src={item.image}
                      alt={item.name[lang]}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 dark:text-white text-sm truncate tracking-tight">
                      {item.name[lang] || item.name["en"]}
                    </h4>
                    <p className="text-brand-yellow-600 font-bold text-xs mt-0.5">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Controls Container */}
                  <div className="flex items-center gap-3 translate-y-1">
                    <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-2xl p-1 gap-1 border border-slate-100 dark:border-white/10 shadow-sm">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="h-11 w-11 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-black text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="h-11 w-11 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-brand-yellow-600 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-all hover:scale-110"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Footer */}
          {items.length > 0 && (
            <div className="p-8 pt-6 border-t border-slate-50 dark:border-slate-900 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
              <div className="flex items-end justify-between mb-8">
                <div className="flex flex-col">
                  <span className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-1">
                    {t("menu.total")}
                  </span>
                </div>
                <span className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                  ${getTotal().toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <Link href="/checkout" onClick={onClose} className="w-full">
                  <Button
                    size="lg"
                    className="w-full h-20 rounded-[2.5rem] font-black text-xl uppercase tracking-[0.1em] shadow-2xl shadow-brand-yellow-500/20 bg-brand-yellow-500 hover:bg-brand-yellow-600 text-brand-yellow-950 group"
                  >
                    <span>{t("menu.checkout")}</span>
                    <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <button
                  onClick={clearCart}
                  className="flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 transition-colors py-2 uppercase tracking-[0.2em] text-[9px] font-black"
                >
                  <XCircle className="h-3 w-3" />
                  {t("menu.clear_all")}
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
