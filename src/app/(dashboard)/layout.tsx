"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <main className="flex-1 p-4 md:p-8 animate-in fade-in duration-500">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
