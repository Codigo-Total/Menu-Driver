"use client";

import { MenuGrid } from "@/components/features/Menu/MenuGrid";
import { useLangStore } from "@/store/lang/lang.slice";

/**
 * Main Interactive Menu Page for Uber Riders.
 * Simplified structure that relies on global layout for navigation.
 */
export default function MenuPage() {
  const { hydrated } = useLangStore();

  if (!hydrated) return null;

  return (
    <div className="py-3 animate-in fade-in duration-500">
      <MenuGrid />
    </div>
  );
}
