"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart/cart.slice";
import { useLangStore } from "@/store/lang/lang.slice";
import { formatPriceARS } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  QrCode,
  Banknote,
  Building2,
  ShieldCheck,
  Loader2,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

/**
 * Premium Checkout Flow — Optimized for Tablet in Vehicle.
 * Single-view layout: no scroll required on 1280×800.
 */
export default function CheckoutPage() {
  const { items, getTotal, clearCart, updateQuantity } = useCartStore();
  const { lang, t, hydrated } = useLangStore();
  const { width, height } = useWindowSize();

  const [step, setStep] = useState<"checkout" | "success">("checkout");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!hydrated) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
      clearCart();
    }, 2500);
  };

  // ─── Success Screen ───
  if (step === "success") {
    return (
      <div className="min-h-[calc(100vh-178px)] flex flex-col items-center justify-center p-6 overflow-hidden">
        <ReactConfetti
          width={width}
          height={height}
          numberOfPieces={100}
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
          <p className="text-lg text-slate-400 font-bold max-w-md mb-12">
            {t("checkout.success_desc")}
          </p>

          <Link href="/menu">
            <Button
              size="lg"
              className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest bg-slate-900 dark:bg-white text-white dark:text-slate-950"
            >
              {t("checkout.back_to_menu")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Checkout Layout ───
  return (
    <div className="transition-colors duration-500">
      <main className="w-full py-4 sm:py-6">
        {/* Back link */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 active:text-slate-600 dark:active:text-white transition-colors mb-4 uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("checkout.back_to_menu")}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {/* ═══ Left: Order Summary ═══ */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-black text-sm">
                1
              </span>
              <h2 className="text-xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {t("checkout.summary")}
              </h2>
            </div>

            <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-100/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
              {items.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                    {t("checkout.empty_bag")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[280px] overflow-y-auto no-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-14 w-14 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden ring-1 ring-slate-100 dark:ring-slate-700 shrink-0">
                          <img
                            src={item.image}
                            alt={item.name[lang]}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="font-black text-slate-900 dark:text-white text-base tracking-tight line-clamp-2 leading-tight">
                          {item.name[lang] || item.name["en"]}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-xl p-0.5 gap-0.5 border border-slate-100 dark:border-white/10">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-400 active:bg-white dark:active:bg-slate-700 active:text-red-500 transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                          <span className="w-7 text-center font-black text-slate-900 dark:text-white text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-400 active:bg-white dark:active:bg-slate-700 active:text-brand-yellow-600 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                        <span className="font-black text-slate-900 dark:text-white text-sm min-w-[80px] text-right tabular-nums">
                          ${formatPriceARS(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              {items.length > 0 && (
                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                  <span className="text-xs uppercase font-black tracking-[0.15em] text-slate-500 dark:text-slate-400">
                    {t("menu.total")}
                  </span>
                  <span className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                    ${formatPriceARS(getTotal())}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ═══ Right: Payment Method ═══ */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-black text-sm">
                2
              </span>
              <h2 className="text-xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {t("checkout.payment_method")}
              </h2>
            </div>

            {/* Payment Options — Uniform 3-column grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* QR */}
              <button
                onClick={() => setPaymentMethod("qr")}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all text-center group ${paymentMethod === "qr" ? "bg-brand-yellow-500 border-brand-yellow-500 shadow-lg shadow-brand-yellow-200/50 dark:shadow-brand-yellow-500/20" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 active:border-slate-300 dark:active:border-slate-600"}`}
              >
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center transition-transform active:scale-95 ${paymentMethod === "qr" ? "bg-white text-brand-yellow-900" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-white"}`}
                >
                  <QrCode className="h-6 w-6" />
                </div>
                <div>
                  <h3
                    className={`font-black uppercase tracking-wider text-xs ${paymentMethod === "qr" ? "text-brand-yellow-950" : "text-slate-900 dark:text-white"}`}
                  >
                    {t("checkout.qr")}
                  </h3>
                  <p
                    className={`text-[10px] font-bold mt-0.5 ${paymentMethod === "qr" ? "text-brand-yellow-800" : "text-slate-400"}`}
                  >
                    {t("checkout.qr_desc")}
                  </p>
                </div>
              </button>

              {/* Transfer */}
              <button
                onClick={() => setPaymentMethod("transfer")}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all text-center group ${paymentMethod === "transfer" ? "bg-brand-yellow-500 border-brand-yellow-500 shadow-lg shadow-brand-yellow-200/50 dark:shadow-brand-yellow-500/20" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 active:border-slate-300 dark:active:border-slate-600"}`}
              >
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center transition-transform active:scale-95 ${paymentMethod === "transfer" ? "bg-white text-brand-yellow-900" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-white"}`}
                >
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3
                    className={`font-black uppercase tracking-wider text-xs ${paymentMethod === "transfer" ? "text-brand-yellow-950" : "text-slate-900 dark:text-white"}`}
                  >
                    {t("checkout.transfer")}
                  </h3>
                  <p
                    className={`text-[10px] font-bold mt-0.5 ${paymentMethod === "transfer" ? "text-brand-yellow-800" : "text-slate-400"}`}
                  >
                    {t("checkout.transfer_desc")}
                  </p>
                </div>
              </button>

              {/* Cash */}
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all text-center group ${paymentMethod === "cash" ? "bg-brand-yellow-500 border-brand-yellow-500 shadow-lg shadow-brand-yellow-200/50 dark:shadow-brand-yellow-500/20" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 active:border-slate-300 dark:active:border-slate-600"}`}
              >
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center transition-transform active:scale-95 ${paymentMethod === "cash" ? "bg-white text-brand-yellow-900" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-white"}`}
                >
                  <Banknote className="h-6 w-6" />
                </div>
                <div>
                  <h3
                    className={`font-black uppercase tracking-wider text-xs ${paymentMethod === "cash" ? "text-brand-yellow-950" : "text-slate-900 dark:text-white"}`}
                  >
                    {t("checkout.cash")}
                  </h3>
                  <p
                    className={`text-[10px] font-bold mt-0.5 ${paymentMethod === "cash" ? "text-brand-yellow-800" : "text-slate-400"}`}
                  >
                    {t("checkout.cash_desc")}
                  </p>
                </div>
              </button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {t("checkout.secure")}
              </span>
            </div>

            {/* Confirm Button — with total embedded */}
            <Button
              size="lg"
              className={`w-full h-16 rounded-2xl font-black text-lg uppercase tracking-wider transition-all ${!paymentMethod ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60" : "shadow-xl shadow-brand-yellow-500/20"}`}
              disabled={!paymentMethod || isProcessing || items.length === 0}
              onClick={handlePayment}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {t("checkout.processing")}
                </>
              ) : !paymentMethod ? (
                <span className="text-sm tracking-wider">{t("checkout.select_method")}</span>
              ) : (
                <span>
                  {t("checkout.confirm")} · ${formatPriceARS(getTotal())}
                </span>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
