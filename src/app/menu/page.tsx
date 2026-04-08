'use client';

import { MenuGrid } from '@/components/features/Menu/MenuGrid';
import { useLangStore } from '@/store/lang/lang.slice';

/**
 * Main Interactive Menu Page for Uber Riders.
 * Simplified structure that relies on global layout for navigation.
 */
export default function MenuPage() {
  const { hydrated } = useLangStore();

  if (!hydrated) return null;

  return (
    <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <MenuGrid />
    </div>
  );
}
