import { motion } from 'motion/react';

export function CostBreakdownChart({
  segments,
  total,
  unit = '$',
}: {
  segments: { label: string; value: number; color: string }[];
  total: number;
  unit?: string;
}) {
  const filtered = segments.filter((s) => s.value > 0);
  const sum = filtered.reduce((acc, s) => acc + s.value, 0) || total || 1;

  return (
    <div className="space-y-3">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
        {filtered.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ width: 0 }}
            animate={{ width: `${(s.value / sum) * 100}%` }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
            style={{ backgroundColor: s.color }}
            className="h-full"
            aria-label={`${s.label}: ${s.value.toFixed(2)}`}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {filtered.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-[color:var(--color-fg-muted)] truncate">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: s.color }}
                aria-hidden
              />
              <span className="truncate">{s.label}</span>
            </span>
            <span className="font-mono tabular-nums text-[color:var(--color-fg)]">
              {unit}
              {s.value.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
