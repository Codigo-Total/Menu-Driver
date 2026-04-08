"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

/**
 * Premium Checkout Flow.
 * Features: Payment simulation, order summary, and celebration on success.
 */
export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { lang, t, hydrated } = useLangStore();
  const { width, height } = useWindowSize();

  const [step, setStep] = useState<"summary" | "payment" | "success">(
    "summary",
  );
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-redirect if cart is empty (unless it was a successful order)
  useEffect(() => {
    if (items.length === 0 && step !== "success") {
      // Could redirect to menu here
    }
  }, [items, step]);

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 p-6 overflow-hidden">
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">

      <main className="container mx-auto py-12 max-w-5xl">
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

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100 dark:shadow-none border border-slate-50 dark:border-slate-800">
              <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-4 no-scrollbar">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-800 overflow-hidden ring-1 ring-slate-100 dark:ring-slate-700">
                        <img
                          src={item.image}
                          alt={item.name[lang]}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-sm tracking-tight">
                          {item.name[lang] || item.name["en"]}
                        </p>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          {lang === "es" ? "Cant." : "Qty"}: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    Subtotal
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    ${getTotal().toFixed(2)}
                  </span>
                </div>
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

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setPaymentMethod("qr")}
                className={`flex items-center gap-6 p-8 rounded-[2rem] border-2 transition-all text-left group ${paymentMethod === "qr" ? "bg-brand-yellow-500 border-brand-yellow-500 shadow-lg shadow-brand-yellow-200" : "bg-white dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-800"}`}
              >
                <div
                  className={`h-16 w-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${paymentMethod === "qr" ? "bg-white text-brand-yellow-900" : "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"}`}
                >
                  <QrCode className="h-8 w-8" />
                </div>
                <div>
                  <h3
                    className={`font-black uppercase tracking-widest text-sm ${paymentMethod === "qr" ? "text-brand-yellow-950" : "text-slate-900 dark:text-white"}`}
                  >
                    {t("checkout.qr")}
                  </h3>
                  <p
                    className={`text-[10px] font-bold ${paymentMethod === "qr" ? "text-brand-yellow-800" : "text-slate-400"}`}
                  >
                    Instant scan & pay via bank app
                  </p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("transfer")}
                className={`flex items-center gap-6 p-8 rounded-[2rem] border-2 transition-all text-left group ${paymentMethod === "transfer" ? "bg-brand-yellow-500 border-brand-yellow-500 shadow-lg shadow-brand-yellow-200" : "bg-white dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-800"}`}
              >
                <div
                  className={`h-16 w-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${paymentMethod === "transfer" ? "bg-white text-brand-yellow-900" : "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"}`}
                >
                  <Building2 className="h-8 w-8" />
                </div>
                <div>
                  <h3
                    className={`font-black uppercase tracking-widest text-sm ${paymentMethod === "transfer" ? "text-brand-yellow-950" : "text-slate-900 dark:text-white"}`}
                  >
                    {t("checkout.transfer")}
                  </h3>
                  <p
                    className={`text-[10px] font-bold ${paymentMethod === "transfer" ? "text-brand-yellow-800" : "text-slate-400"}`}
                  >
                    {t("checkout.transfer_desc")}
                  </p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex items-center gap-6 p-8 rounded-[2rem] border-2 transition-all text-left group ${paymentMethod === "cash" ? "bg-brand-yellow-500 border-brand-yellow-500 shadow-lg shadow-brand-yellow-200" : "bg-white dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-800"}`}
              >
                <div
                  className={`h-16 w-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${paymentMethod === "cash" ? "bg-white text-brand-yellow-900" : "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"}`}
                >
                  <Banknote className="h-8 w-8" />
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
              className="w-full h-20 rounded-[2.5rem] font-black text-lg uppercase tracking-widest shadow-2xl"
              disabled={!paymentMethod || isProcessing}
              onClick={handlePayment}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  {t("checkout.processing")}
                </>
              ) : (
                t("checkout.confirm")
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <ShieldCheck className="h-4 w-4" />
              {t("checkout.secure")}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
