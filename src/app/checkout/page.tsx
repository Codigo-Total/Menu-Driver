"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/cart/cart.slice";
import { useLangStore } from "@/store/lang/lang.slice";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  CreditCard,
  QrCode,
  Banknote,
  Building2,
  ShieldCheck,
  Loader2,
  Trash2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

/**
 * Premium Checkout Flow.
 * Features: Payment simulation, order summary, and celebration on success.
 */
export default function CheckoutPage() {
  const { items, getTotal, clearCart, removeItem, updateQuantity } =
    useCartStore();
  const { lang, t, hydrated } = useLangStore();
  const { width, height } = useWindowSize();

  const [step, setStep] = useState<"summary" | "payment" | "success">(
    "summary",
  );
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setShowScrollHint(false);
    } else {
      setShowScrollHint(true);
    }
  };

  if (!hydrated) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate API delay
    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
      clearCart();
    }, 2500);
  };

  if (step === "success") {
    return (
      <div className="min-h-[calc(100vh-178px)] flex flex-col items-center justify-center bg-white dark:bg-slate-950 p-6 overflow-hidden">
        <ReactConfetti
          width={width}
          height={height}
          numberOfPieces={200}
          recycle={false}
          colors={["#eab308", "#facc15", "#fbbf24", "#ffffff"]}
        />

        <div className="z-10 flex flex-col items-center text-center animate-zoom-in">
          <div className="h-24 w-24 rounded-full bg-green-500 flex items-center justify-center shadow-2xl mb-8">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white uppercase mb-4 tracking-tighter">
            {t("checkout.success")}
          </h1>
          <p className="text-xl text-slate-400 font-bold max-w-md uppercase tracking-wider mb-12">
            {t("checkout.success_desc")}
          </p>

          <Link href="/">
            <Button
              size="lg"
              className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest bg-slate-900 dark:bg-white text-white dark:text-slate-950"
            >
              {t("checkout.finish")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="transition-colors duration-500">
      <main className="container mx-auto py-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Summary */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="h-10 w-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-black text-sm">
                1
              </span>
              <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {t("checkout.summary")}
              </h2>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100 dark:shadow-none border border-slate-50 dark:border-slate-800 relative overflow-hidden">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="space-y-6 max-h-[250px] overflow-y-auto pr-4 no-scrollbar relative z-10"
              >
                {items.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                      Tu bolsa está vacía
                    </p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-800 overflow-hidden ring-1 ring-slate-100 dark:ring-slate-700 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name[lang]}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="font-black text-slate-900 dark:text-white text-sm tracking-tight truncate">
                            {item.name[lang] || item.name["en"]}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl p-1 gap-1 border border-slate-100 dark:border-slate-700 shadow-sm">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="h-11 w-11 flex items-center justify-center rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <span className="font-black text-xl">-</span>
                          </button>
                          <span className="w-8 text-center font-black text-slate-900 dark:text-white text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="h-11 w-11 flex items-center justify-center rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-brand-yellow-600 transition-colors"
                          >
                            <span className="font-black text-xl">+</span>
                          </button>
                        </div>
                        <span className="font-black text-slate-900 dark:text-white text-sm min-w-[70px] text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Scroll Indicator Overlay */}
              {items.length > 3 && showScrollHint && (
                <div className="absolute bottom-[90px] left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none z-20 flex items-end justify-center pb-2">
                  <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-full animate-bounce shadow-sm border border-slate-200 dark:border-slate-700">
                    <span className="text-[8px] font-black uppercase text-slate-500">
                      Desliza para ver más
                    </span>
                    <ChevronDown className="h-3 w-3 text-slate-500" />
                  </div>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center pt-4">
                  <span className="text-slate-900 dark:text-white font-black uppercase tracking-[0.2em] text-xs">
                    Total
                  </span>
                  <span className="text-3xl font-display font-black text-slate-900 dark:text-white">
                    ${getTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="h-10 w-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-black text-sm">
                2
              </span>
              <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {t("checkout.payment_method")}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("qr")}
                className={`flex flex-col items-center justify-center gap-4 p-6 rounded-[2rem] border-2 transition-all text-center group ${paymentMethod === "qr" ? "bg-brand-yellow-500 border-brand-yellow-500 shadow-lg shadow-brand-yellow-200" : "bg-slate-100 dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-800"}`}
              >
                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${paymentMethod === "qr" ? "bg-white text-brand-yellow-900" : "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"}`}
                >
                  <QrCode className="h-7 w-7" />
                </div>
                <div>
                  <h3
                    className={`font-black uppercase tracking-widest text-[10px] ${paymentMethod === "qr" ? "text-brand-yellow-950" : "text-slate-900 dark:text-white"}`}
                  >
                    {t("checkout.qr")}
                  </h3>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("transfer")}
                className={`flex flex-col items-center justify-center gap-4 p-6 rounded-[2rem] border-2 transition-all text-center group ${paymentMethod === "transfer" ? "bg-brand-yellow-500 border-brand-yellow-500 shadow-lg shadow-brand-yellow-200" : "bg-slate-100 dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-800"}`}
              >
                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${paymentMethod === "transfer" ? "bg-white text-brand-yellow-900" : "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"}`}
                >
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <h3
                    className={`font-black uppercase tracking-widest text-[10px] ${paymentMethod === "transfer" ? "text-brand-yellow-950" : "text-slate-900 dark:text-white"}`}
                  >
                    {t("checkout.transfer")}
                  </h3>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("cash")}
                className={`col-span-2 flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all text-left group ${paymentMethod === "cash" ? "bg-brand-yellow-500 border-brand-yellow-500 shadow-lg shadow-brand-yellow-200" : "bg-slate-100 dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-800"}`}
              >
                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${paymentMethod === "cash" ? "bg-white text-brand-yellow-900" : "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"}`}
                >
                  <Banknote className="h-7 w-7" />
                </div>
                <div>
                  <h3
                    className={`font-black uppercase tracking-widest text-sm ${paymentMethod === "cash" ? "text-brand-yellow-950" : "text-slate-900 dark:text-white"}`}
                  >
                    {t("checkout.cash")}
                  </h3>
                  <p
                    className={`text-[10px] font-bold ${paymentMethod === "cash" ? "text-brand-yellow-800" : "text-slate-400"}`}
                  >
                    {t("checkout.cash_desc")}
                  </p>
                </div>
              </button>
            </div>

            <Button
              size="lg"
              className={`w-full h-20 rounded-[2.5rem] font-black text-lg uppercase tracking-widest transition-all ${!paymentMethod ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60" : "shadow-2xl"}`}
              disabled={!paymentMethod || isProcessing}
              onClick={handlePayment}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  {t("checkout.processing")}
                </>
              ) : !paymentMethod ? (
                <span className="text-lg tracking-normal normal-case opacity-80">
                  Selecciona un método de pago para continuar
                </span>
              ) : (
                t("checkout.confirm")
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
