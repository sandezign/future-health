import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none gap-1',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-slate-900 text-slate-50',
        secondary: 'border-transparent bg-slate-100 text-slate-900',
        outline: 'text-slate-950 border border-slate-200',
        // KDIGO & Clinical Risk Tiers
        green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        yellow: 'bg-amber-50 text-amber-700 border border-amber-200',
        orange: 'bg-orange-50 text-orange-700 border border-orange-200',
        red: 'bg-rose-50 text-rose-700 border border-rose-200',
        rapid: 'bg-rose-100 text-rose-800 border border-rose-300 font-bold animate-pulse',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
