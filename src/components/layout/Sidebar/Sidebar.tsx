'use client';

import { cn } from '@/lib/cn';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  ChevronRight,
  Package
} from 'lucide-react';

const sidebarItems = [
  {
    name: 'Dashboard',
    href: ROUTES.DASHBOARD.ROOT,
    icon: LayoutDashboard,
  },
  {
    name: 'Products',
    href: ROUTES.DASHBOARD.PRODUCTS,
    icon: Package,
  },
  {
    name: 'Users',
    href: `${ROUTES.DASHBOARD.ROOT}/users`,
    icon: Users,
  },
  {
    name: 'Settings',
    href: ROUTES.DASHBOARD.SETTINGS,
    icon: Settings,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 border-r border-slate-200 bg-white md:block">
      <div className="flex h-full flex-col gap-4 p-4">
        <nav className="flex flex-1 flex-col gap-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-brand-yellow-50 text-brand-yellow-950 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    'h-5 w-5 transition-colors',
                    isActive ? 'text-brand-yellow-600' : 'text-slate-400 group-hover:text-slate-600'
                  )} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-brand-yellow-600" />}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              System Status
            </p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-600">All systems online</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
