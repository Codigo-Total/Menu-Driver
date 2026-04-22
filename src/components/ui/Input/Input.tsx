import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { InputProps } from "./Input.types";

/**
 * Premium Input component with labels, errors, and icons.
 * Uses consistent focus rings and styling.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="pl-1 text-base font-semibold text-slate-500 dark:text-slate-400"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3 text-slate-400">{leftIcon}</div>}

          <input
            id={id}
            ref={ref}
            disabled={disabled}
            className={cn(
              "flex h-11 w-full rounded-[8px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:border-brand-yellow-500 focus:ring-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-500 focus:border-red-500",
              className,
            )}
            {...props}
          />

          {rightIcon && <div className="absolute right-3 text-slate-400">{rightIcon}</div>}
        </div>

        {error ? (
          <p className="text-xs font-medium text-red-500 mt-1 ml-0.5">{error}</p>
        ) : hint ? (
          <p className="text-xs text-slate-500 mt-1 ml-0.5">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
