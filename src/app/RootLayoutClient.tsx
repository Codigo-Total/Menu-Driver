"use client";

import { usePathname } from "next/navigation";
import { Header, BottomNav } from "@/components/layout";
import { CartDrawer } from "@/components/features/Cart/CartDrawer";
import { ToastProvider } from "@/components/ui/Toast";
import { FlyToCartProvider } from "@/components/ui/FlyToCart";
import { cn } from "@/lib/cn";
import { useLangStore } from "@/store/lang/lang.slice";
import { useEffect } from "react";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const { lang } = useLangStore();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const isHomePage = pathname === "/";
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  const showNav = !isHomePage && !isAdminRoute;

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
    </div>
  );
}
