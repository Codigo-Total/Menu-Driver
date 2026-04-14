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

  return (
    <div
      className={cn(
        "relative flex flex-col min-h-screen",
        !isHomePage && !isAdminRoute && "pb-24", // Only add padding if BottomNav is visible
      )}
    >
      {!isHomePage && !isAdminRoute && <Header />}

      <main
        className={cn("flex-1", !isHomePage && !isAdminRoute && "container mx-auto px-4 sm:px-6")}
      >
        {children}
      </main>

      {!isHomePage && !isAdminRoute && <BottomNav />}
      <CartDrawer />
      <ToastProvider />
      <FlyToCartProvider />
    </div>
  );
}
