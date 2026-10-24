import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center transition-colors focus:outline-none gap-1',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-slate-900 text-slate-50',
        secondary: 'border-transparent bg-slate-100 text-slate-800',
        subtle: 'border-transparent bg-slate-100 text-slate-700',
        outline: 'text-slate-700 border border-slate-200 bg-white',
        // Mediora Status & Accent Tiers
        indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        cyan: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
        purple: 'bg-purple-50 text-purple-700 border border-purple-200',
        // Semantic aliases
        success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
        warning: 'bg-amber-50 text-amber-800 border border-amber-200/80',
        danger: 'bg-rose-50 text-rose-800 border border-rose-200/80',
        // KDIGO & Clinical Risk Tiers
        green: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
        yellow: 'bg-amber-50 text-amber-800 border border-amber-200/80',
        orange: 'bg-orange-50 text-orange-800 border border-orange-200/80',
        red: 'bg-rose-50 text-rose-800 border border-rose-200/80',
        rapid: 'bg-rose-100/80 text-rose-800 border border-rose-300 font-semibold',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px] font-medium',
        md: 'px-2.5 py-0.5 text-xs font-semibold',
        lg: 'px-3 py-1 text-sm font-semibold',
      },
      shape: {
        pill: 'rounded-full',
        rounded: 'rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shape: 'pill',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, shape, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size, shape }), className)} {...props} />;
}
