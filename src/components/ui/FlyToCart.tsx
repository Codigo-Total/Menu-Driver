"use client";

import { useFlyToCartStore } from "@/store/ui/flyToCart.slice";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const FlyToCartProvider = () => {
  const { items, removeFlyItem } = useFlyToCartStore();
  const [targetRect, setTargetRect] = useState<{ x: number; y: number } | null>(null);

  // Update target rect continuously in case window resizes, but especially when items length changes
  useEffect(() => {
    if (items.length === 0) return;

    // Find the cart icon in the BottomNav
    const target = document.getElementById("cart-icon-target");
    if (target) {
      const rect = target.getBoundingClientRect();
      setTargetRect({
        // Center the animation target exactly in the middle of the cart button
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, [items.length]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      <AnimatePresence>
        {items.map((item) => {
          // If the DOM wasn't ready or cart is missing, fallback to animating in place
          const targetX = targetRect ? targetRect.x - 20 : item.startX; // -20 is to center a 40x40 image
          const targetY = targetRect ? targetRect.y - 20 : item.startY;

          return (
            <motion.img
              key={item.id}
              src={item.image}
              initial={{
                x: item.startX,
                y: item.startY,
                width: item.startWidth,
                height: item.startWidth,
                opacity: 1,
                borderRadius: item.startWidth > 150 ? 16 : 8, // dynamic initial radius
              }}
              animate={{
                x: targetX,
                y: targetY,
                width: 40,
                height: 40,
                opacity: 0,
                scale: 0.5,
                borderRadius: 20,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.32, 0.72, 0, 1], // Super premium snappy Apple-like ease
              }}
              onAnimationComplete={() => removeFlyItem(item.id)}
              className="absolute object-cover shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[200]"
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};
