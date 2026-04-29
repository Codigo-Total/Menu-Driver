"use client";

import { usePathname } from "next/navigation";
import { Header, BottomNav } from "@/components/layout";
import { CartDrawer } from "@/components/features/Cart/CartDrawer";
import { ToastProvider } from "@/components/ui/Toast";
import { FlyToCartProvider } from "@/components/ui/FlyToCart";
import { cn } from "@/lib/cn";
import { useLangStore } from "@/store/lang/lang.slice";
import { useEffect } from "react";
import { InactivityHandler } from "@/components/layout/InactivityHandler";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const { lang } = useLangStore();
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const isSetupPage = pathname.startsWith("/setup");
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  const showNav = !isHomePage && !isAdminRoute && !isSetupPage;

  useEffect(() => {
    const isSetupComplete = localStorage.getItem("kiosk_setup_complete") === "true";
    if (!isSetupComplete && pathname !== "/setup") {
      window.location.href = "/setup"; // Use window.location for a hard reset/redir if needed, or router
    }
  }, [pathname]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div
      className={cn(
        "relative flex flex-col min-h-screen",
        showNav && "pb-20", // Padding for BottomNav on all sizes
      )}
    >
      {showNav && <Header />}

      <main className={cn("flex-1", showNav && "w-full px-6 sm:px-8 lg:px-12")}>{children}</main>

      {showNav && <BottomNav />}
      <CartDrawer />
      <ToastProvider />
      <FlyToCartProvider />
      <InactivityHandler />
    </div>
  );
}
