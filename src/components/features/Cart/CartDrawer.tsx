'use client';

import { useCartStore } from '@/store/cart/cart.slice';
import { useLangStore } from '@/store/lang/lang.slice';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { Trash2, Plus, Minus, ShoppingBag, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const CartDrawer = () => {
  const { items, updateQuantity, removeItem, getTotal, clearCart, isCartOpen, setIsCartOpen } = useCartStore();
  const { lang, t, hydrated } = useLangStore();

  const onClose = () => setIsCartOpen(false);

  if (!hydrated) return null; // Avoid flashing English before loading ESP

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300",
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside 
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white/95 dark:bg-slate-950/95 backdrop-blur-3xl shadow-2xl transition-transform duration-500 ease-in-out border-l border-white/20 dark:border-slate-800",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-6 sm:p-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white flex items-center gap-3">
              <ShoppingBag className="h-7 w-7 text-brand-yellow-600" />
              {t('menu.cart_title')}
            </h2>
            <Button variant="ghost" className="rounded-full h-12 w-12 p-0 bg-slate-100 dark:bg-slate-900" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar -mx-4 px-4 space-y-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                <ShoppingBag className="h-20 w-20 mb-6" />
                <p className="text-xl font-bold uppercase tracking-widest">{t('menu.empty_cart')}</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="group relative flex gap-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[2.5rem] transition-all border border-transparent hover:border-brand-yellow-200">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-slate-100 dark:ring-slate-800">
                    <img src={item.image} alt={item.name[lang]} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight">
                        {item.name[lang] || item.name['en']}
                      </h4>
                      <p className="text-brand-yellow-600 font-black text-sm mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 p-1 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-300 hover:text-red-500 rounded-full h-10 w-10 p-0"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <span className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
                  {t('menu.total')}
                </span>
                <span className="text-4xl font-display font-black text-slate-900 dark:text-white">
                  ${getTotal().toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Link href="/checkout" onClick={onClose} className="w-full">
                  <Button size="lg" className="w-full h-20 rounded-[2.5rem] font-black text-lg uppercase tracking-widest shadow-xl shadow-brand-yellow-200 dark:shadow-brand-yellow-900/20" rightIcon={<ArrowRight className="h-6 w-6 ml-2" />}>
                    {t('menu.checkout')}
                  </Button>
                </Link>
                <Button variant="ghost" onClick={clearCart} className="text-slate-400 hover:text-red-500 uppercase tracking-widest text-[10px] font-black">
                  {t('menu.clear_all')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
