"use client";

import { useCartStore } from "@/store/cart/cart.slice";
import { useLangStore } from "@/store/lang/lang.slice";
import { formatPriceARS } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { Trash2, Plus, Minus, ShoppingBag, X, ArrowRight, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export const CartDrawer = () => {
  const { items, updateQuantity, removeItem, getTotal, clearCart, isCartOpen, setIsCartOpen } =
    useCartStore();
  const { lang, t, hydrated } = useLangStore();

  const onClose = () => setIsCartOpen(false);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!hydrated) return null;

  const itemCountLabel =
    lang === "es"
      ? `${items.length} ${items.length === 1 ? "producto" : "productos"} seleccionados`
      : `${items.length} ${items.length === 1 ? "item" : "items"} selected`;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm transition-opacity duration-500",
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
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
          <div className="flex items-center justify-between p-6 sm:p-8 pb-5 border-b border-slate-100 dark:border-slate-900">
            <div className="flex flex-col">
              <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tighter">
                <ShoppingBag className="h-6 w-6 text-brand-yellow-500" />
                {t("menu.cart_title")}
              </h2>
              <span className="text-xs uppercase font-bold tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-1.5">
                {itemCountLabel}
              </span>
            </div>
            <button
              onClick={onClose}
              className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 transition-all active:scale-95 active:bg-slate-200 dark:active:bg-slate-800"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="h-28 w-28 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6">
                  <ShoppingBag className="h-10 w-10 text-slate-200 dark:text-slate-800" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">
                  {t("menu.empty_cart")}
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 text-brand-yellow-600 font-black text-xs uppercase tracking-widest active:scale-95 transition-transform"
                >
                  {lang === "es" ? "Volver al menú" : "Back to menu"}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex items-center gap-4 bg-white dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5 transition-all duration-200 active:scale-[0.98]"
                >
                  {/* Thumbnail */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.image}
                      alt={item.name[lang]}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight tracking-tight line-clamp-2">
                      {item.name[lang] || item.name["en"]}
                    </h4>
                    <p className="text-base font-black text-slate-900 dark:text-white mt-1">
                      ${formatPriceARS(item.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-xl p-0.5 gap-0.5 border border-slate-100 dark:border-white/10">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-10 w-10 flex items-center justify-center rounded-lg text-slate-400 active:bg-white dark:active:bg-slate-700 active:text-red-500 transition-colors"
                      >
                        <Minus className="h-4 w-4 stroke-[2.5]" />
                      </button>
                      <span className="w-8 text-center text-sm font-black text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-10 w-10 flex items-center justify-center rounded-lg text-slate-400 active:bg-white dark:active:bg-slate-700 active:text-brand-yellow-600 transition-colors"
                      >
                        <Plus className="h-4 w-4 stroke-[2.5]" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-300 dark:text-slate-600 active:text-red-500 transition-colors active:scale-110"
                    >
                      <Trash2 className="h-4 w-4 stroke-[2]" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 sm:p-8 pt-5 border-t border-slate-100 dark:border-slate-900 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
              <div className="flex items-end justify-between mb-6">
                <span className="text-xs uppercase font-black tracking-[0.15em] text-slate-500 dark:text-slate-400">
                  {t("menu.total")}
                </span>
                <span className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                  ${formatPriceARS(getTotal())}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/checkout" onClick={onClose} className="w-full">
                  <Button
                    size="lg"
                    className="w-full h-16 rounded-2xl font-black text-lg uppercase tracking-[0.08em] shadow-xl shadow-brand-yellow-500/20 bg-brand-yellow-500 hover:bg-brand-yellow-600 text-brand-yellow-950 group"
                  >
                    <span>{t("menu.checkout")}</span>
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <button
                  onClick={clearCart}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.12em] text-red-400 dark:text-red-400/80 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 transition-all active:scale-[0.97] active:bg-red-100 dark:active:bg-red-950/40"
                >
                  <XCircle className="h-3.5 w-3.5" />
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
