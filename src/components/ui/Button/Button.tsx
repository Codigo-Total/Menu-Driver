import { forwardRef } from 'react';
import { cn } from '@/lib/cn';
import { ButtonProps } from './Button.types';
import { Loader2 } from 'lucide-react';

/**
 * Premium Button component with multiple variants and sizes.
 * Uses the custom brand-yellow palette for the primary variant.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-brand-yellow-500 text-brand-yellow-950 hover:bg-brand-yellow-600 shadow-sm active:scale-95 transition-all duration-200',
      secondary: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm transition-all',
      outline: 'border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors',
      ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors',
      danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm transition-colors',
      default: 'bg-brand-yellow-500 text-brand-yellow-950 hover:bg-brand-yellow-600 shadow-sm active:scale-95 transition-all duration-200',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-md',
      md: 'h-10 px-4 text-sm rounded-lg',
      lg: 'h-12 px-6 text-base rounded-xl',
      icon: 'h-14 w-14 p-0 rounded-2xl',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
