import * as React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CollapsibleSection = ({
  title,
  description,
  defaultOpen = true,
  children,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <CollapsiblePrimitive.Root
      defaultOpen={defaultOpen}
      className={cn(
        'rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 overflow-hidden',
        className,
      )}
    >
      <CollapsiblePrimitive.Trigger
        className={cn(
          'group flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[color:var(--color-surface-2)]/60',
        )}
      >
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[color:var(--color-fg)]">{title}</span>
          {description && (
            <span className="text-xs text-[color:var(--color-fg-subtle)] mt-0.5">{description}</span>
          )}
        </div>
        <ChevronDown
          aria-hidden
          className="h-4 w-4 text-[color:var(--color-fg-muted)] transition-transform group-data-[state=open]:rotate-180"
        />
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
        <div className="px-4 pb-4 pt-1 border-t border-[color:var(--color-border)]/60">{children}</div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
};
