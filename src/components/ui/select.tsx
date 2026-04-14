import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div
      className={cn(
        'relative flex h-11 items-center rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 text-sm transition-colors',
        'focus-within:border-[color:var(--color-accent)] focus-within:ring-2 focus-within:ring-[color:var(--color-accent-soft)]',
        className,
      )}
    >
      <select
        ref={ref}
        className="flex-1 appearance-none bg-transparent pr-6 outline-none text-[color:var(--color-fg)]"
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 h-4 w-4 text-[color:var(--color-fg-subtle)]"
      />
    </div>
  ),
);
Select.displayName = 'Select';
