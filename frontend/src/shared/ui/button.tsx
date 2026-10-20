import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 shadow-sm shadow-indigo-600/20',
        secondary:
          'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900 shadow-sm',
        subtle:
          'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 focus-visible:ring-indigo-400',
        outline:
          'border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-400 text-slate-700 shadow-xs',
        success:
          'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500 shadow-sm shadow-emerald-600/20',
        danger:
          'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 shadow-sm shadow-rose-600/20',
        ghost:
          'hover:bg-slate-100 hover:text-slate-900 text-slate-600',
        link:
          'text-indigo-600 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-8 px-3 text-xs gap-1.5',
        md: 'h-10 px-4 py-2 gap-2',
        lg: 'h-11 px-6 text-base gap-2.5',
        icon: 'h-10 w-10 p-0',
      },
      shape: {
        pill: 'rounded-full',
        rounded: 'rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shape: 'pill',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, shape, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
