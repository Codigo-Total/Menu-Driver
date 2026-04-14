'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ModalProps } from './Modal.types';

/**
 * Accessible Modal component powered by Radix UI.
 * Provides a focus trap, aria-labels, and keyboard navigation out of the box.
 * Updated with full support for Dark Mode and Premium styling.
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  headerAction,
  size = 'md',
  showCloseButton = true,
}: ModalProps) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]',
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay 
          className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" 
        />
        <Dialog.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-24px)] sm:w-full translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-2xl transition-all duration-300 animate-in zoom-in-95 rounded-[2rem] sm:rounded-[2.5rem] outline-none',
            sizes[size]
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4 pr-10">
              {title && (
                <Dialog.Title className={cn(
                  "text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter",
                  !headerAction && "flex-1"
                )}>
                  {title}
                </Dialog.Title>
              )}
              {headerAction}
            </div>
            {description && (
              <Dialog.Description className="text-sm text-slate-500 dark:text-slate-400">
                {description}
              </Dialog.Description>
            )}
          </div>
          
          <div className="flex-1 py-4 px-2 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent pr-4">
            {children}
          </div>
          
          {footer && (
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-4">
              {footer}
            </div>
          )}
          
          {showCloseButton && (
            <Dialog.Close 
              className="absolute right-6 top-6 rounded-full p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow-400"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
