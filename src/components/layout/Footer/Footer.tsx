import { cn } from '@/lib/cn';
import { APP_CONFIG } from '@/constants/config';
import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-brand-yellow-500 flex items-center justify-center font-bold text-brand-yellow-950 text-xs">
                M
              </div>
              <span className="font-bold text-slate-900">
                {APP_CONFIG.NAME}
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              Optimizing operations with professional menu driving solutions.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Product</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-slate-500 hover:text-brand-yellow-600 transition-colors">Features</Link>
              <Link href="#" className="text-sm text-slate-500 hover:text-brand-yellow-600 transition-colors">Pricing</Link>
              <Link href="#" className="text-sm text-slate-500 hover:text-brand-yellow-600 transition-colors">Security</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Resources</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-slate-500 hover:text-brand-yellow-600 transition-colors">Documentation</Link>
              <Link href="#" className="text-sm text-slate-500 hover:text-brand-yellow-600 transition-colors">Help Center</Link>
              <Link href="#" className="text-sm text-slate-500 hover:text-brand-yellow-600 transition-colors">Community</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Legal</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-slate-500 hover:text-brand-yellow-600 transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-sm text-slate-500 hover:text-brand-yellow-600 transition-colors">Terms of Service</Link>
              <Link href="#" className="text-sm text-slate-500 hover:text-brand-yellow-600 transition-colors">Cookies</Link>
            </nav>
          </div>
        </div>
        
        <div className="mt-12 border-t border-slate-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © {currentYear} {APP_CONFIG.NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">v{APP_CONFIG.VERSION}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
