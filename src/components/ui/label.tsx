import * as React from 'react';
import { cn } from '@/lib/utils';

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-xs font-medium text-[color:var(--color-fg-muted)] tracking-wide uppercase', className)}
      {...props}
    />
  ),
);
Label.displayName = 'Label';

export const Field = ({
  label,
  hint,
  children,
  className,
  htmlFor,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <div className="flex items-baseline justify-between">
      <Label htmlFor={htmlFor}>{label}</Label>
      {hint && <span className="text-[10px] text-[color:var(--color-fg-subtle)]">{hint}</span>}
    </div>
    {children}
  </div>
);
