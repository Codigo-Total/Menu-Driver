"use client";

import { usePathname } from "next/navigation";
import { useLangStore } from "@/store/lang/lang.slice";
import { useCartStore } from "@/store/cart/cart.slice";
import { Home, Gamepad2, ShoppingBag, LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface NavItemProps {
  id?: string;
  href?: string;
  onClick?: void | (() => void);
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  badge?: number;
}

const NavItem = ({
  id,
  href,
  onClick,
  icon: Icon,
  label,
  isActive,
  badge,
}: NavItemProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-1.5 w-full h-full relative transition-all duration-500">
      <div
        className={cn(
          "p-3 rounded-[1.25rem] transition-all duration-500 relative group-active:scale-90",
          isActive
            ? "bg-brand-yellow-500 text-brand-yellow-950 shadow-lg shadow-brand-yellow-500/20"
            : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300",
        )}
      >
        <Icon
          className={cn(
            "h-6 w-6 transition-transform duration-500",
            isActive && "scale-110",
          )}
        />

        {/* Glow effect for active item */}
        {isActive && (
          <div className="absolute inset-0 rounded-[1.25rem] bg-brand-yellow-400/20 animate-ping shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
        )}
      </div>

      <span
        className={cn(
          "text-[10px] font-black uppercase tracking-[0.15em] leading-none transition-colors duration-500",
          isActive
            ? "text-brand-yellow-600 dark:text-brand-yellow-500"
            : "text-slate-400 dark:text-slate-600",
        )}
      >
        {label}
      </span>

      {badge !== undefined && badge > 0 && (
        <span className="absolute top-1 right-1/2 translate-x-5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white ring-4 ring-white dark:ring-slate-950 shadow-lg animate-bounce">
          {badge}
        </span>
      )}
    </div>
  );

  const className =
    "flex-1 h-full group relative outline-none focus:outline-none";

  if (onClick) {
    return (
      <button id={id} onClick={onClick as () => void} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link id={id} href={href || "#"} className={className}>
      {content}
    </Link>
  );
};

/**
 * Mobile-First Premium Bottom Navigation Bar.
 * Optimized for Uber rides.
 * Removed redundant settings, fixed cart functionality.
 */
export const BottomNav = () => {
  const pathname = usePathname();
  const { t, hydrated } = useLangStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const isCartOpen = useCartStore((state) => state.isCartOpen);

  if (!hydrated) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-24 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-900 pb-safe shadow-2xl">
      <div className="container mx-auto h-full flex items-center justify-around px-4">
        <NavItem
          href="/menu"
          icon={Home}
          label={t("menu.home") || "INICIO"}
          isActive={pathname === "/menu"}
        />
        <NavItem
          href="/games"
          icon={Gamepad2}
          label={t("menu.fun_zone") || "Juegos"}
          isActive={pathname === "/games"}
        />
        <NavItem
          id="cart-icon-target"
          onClick={() => setIsCartOpen(true)}
          icon={ShoppingBag}
          label={t("menu.order") || "Carrito"}
          isActive={isCartOpen}
          badge={itemCount}
        />
      </div>
    </nav>
  );
};
