"use client";

import { useEffect } from "react";
import { useIdle } from "react-use";
import { useRouter, usePathname } from "next/navigation";
import { useCartStore } from "@/store/cart/cart.slice";
import { useAuthStore } from "@/store/auth/auth.slice";

/**
 * 3 minutes of inactivity in milliseconds.
 */
const INACTIVITY_TIMEOUT = 3 * 60 * 1000;

/**
 * InactivityHandler component that monitors user activity.
 * After 3 minutes of inactivity:
 * 1. Clears the shopping cart.
 * 2. Logs out the user if they are in the admin/dashboard area.
 * 3. Redirects to the home page (screensaver).
 */
export function InactivityHandler() {
  const isIdle = useIdle(INACTIVITY_TIMEOUT);
  const router = useRouter();
  const pathname = usePathname();
  const clearCart = useCartStore((state) => state.clearCart);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (isIdle) {
      // Check if we are already on the screensaver to avoid unnecessary logic
      if (pathname === "/") return;

      console.log("Inactivity detected. Resetting application state...");
      
      // 1. Empty and close the cart
      clearCart();
      setIsCartOpen(false);
      
      // 2. Handle admin logout if applicable
      const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");
      if (isAdminRoute) {
        logout();

        // Clear all cookies as specifically requested
        try {
          const cookies = document.cookie.split(";");
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
          }
        } catch (e) {
          console.error("Error clearing cookies:", e);
        }
      }
      
      // 3. Return to the screensaver (Home)
      router.push("/");
    }
  }, [isIdle, pathname, clearCart, logout, router]);

  return null;
}
