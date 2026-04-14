import type { UnitSystem } from '@/types';
import { cn } from '@/lib/utils';

export function UnitToggle({
  value,
  onChange,
}: {
  value: UnitSystem;
  onChange: (v: UnitSystem) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Unit system"
      className="inline-flex items-center rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-0.5 text-xs font-medium"
    >
      {(['imperial', 'metric'] as const).map((u) => (
        <button
          key={u}
          role="radio"
          aria-checked={value === u}
          onClick={() => onChange(u)}
          className={cn(
            'px-3 py-1.5 rounded-md transition-colors',
            value === u
              ? 'bg-[color:var(--color-surface)] text-[color:var(--color-fg)] shadow-sm'
              : 'text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]',
          )}
        >
          {u === 'imperial' ? 'mi · gal' : 'km · L'}
        </button>
      ))}
    </div>
  );
}
