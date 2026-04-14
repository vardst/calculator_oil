import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, suffix, prefix, ...props }, ref) => (
    <div
      className={cn(
        'group flex h-11 items-center rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 text-sm transition-colors',
        'focus-within:border-[color:var(--color-accent)] focus-within:bg-[color:var(--color-surface)] focus-within:ring-2 focus-within:ring-[color:var(--color-accent-soft)]',
        className,
      )}
    >
      {prefix && (
        <span className="mr-2 text-[color:var(--color-fg-subtle)] text-sm">{prefix}</span>
      )}
      <input
        ref={ref}
        className="flex-1 bg-transparent outline-none text-[color:var(--color-fg)] placeholder:text-[color:var(--color-fg-subtle)] font-mono tabular-nums"
        {...props}
      />
      {suffix && (
        <span className="ml-2 text-[color:var(--color-fg-subtle)] text-xs uppercase tracking-wide">
          {suffix}
        </span>
      )}
    </div>
  ),
);
Input.displayName = 'Input';
