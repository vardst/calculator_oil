import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-[color:var(--color-accent)] text-[color:var(--color-accent-fg)] hover:brightness-110 shadow-[0_8px_24px_-12px_color-mix(in_oklab,var(--color-accent)_60%,transparent)]',
        secondary:
          'bg-[color:var(--color-surface-2)] text-[color:var(--color-fg)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface)]',
        ghost:
          'text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] hover:bg-[color:var(--color-surface-2)]',
        outline:
          'border border-[color:var(--color-border-strong)] text-[color:var(--color-fg)] hover:bg-[color:var(--color-surface-2)]',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';
