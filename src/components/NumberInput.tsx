import { useEffect, useState } from 'react';
import { Input, type InputProps } from '@/components/ui/input';

interface NumberInputProps extends Omit<InputProps, 'onChange' | 'value' | 'type'> {
  value: number;
  onValueChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
}

const formatForInput = (n: number, precision?: number) => {
  if (!Number.isFinite(n) || n === 0) return '';
  if (precision != null) return n.toFixed(precision);
  // Strip trailing zeros for nicer display
  return String(Math.round(n * 1e6) / 1e6);
};

export function NumberInput({
  value,
  onValueChange,
  min = 0,
  max,
  step = 1,
  precision,
  ...rest
}: NumberInputProps) {
  const [text, setText] = useState(() => formatForInput(value, precision));
  const [focused, setFocused] = useState(false);

  // When value changes externally (e.g. unit toggle, reset), sync — unless user is mid-edit.
  useEffect(() => {
    if (!focused) setText(formatForInput(value, precision));
  }, [value, precision, focused]);

  return (
    <Input
      type="number"
      inputMode="decimal"
      min={min}
      max={max}
      step={step}
      value={text}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        setFocused(false);
        // Re-format on blur to canonical
        if (e.target.value === '' || e.target.value === '-') {
          setText('');
          onValueChange(0);
          return;
        }
        const parsed = parseFloat(e.target.value);
        if (Number.isFinite(parsed)) {
          onValueChange(parsed);
          setText(formatForInput(parsed, precision));
        }
      }}
      onChange={(e) => {
        const v = e.target.value;
        setText(v);
        if (v === '' || v === '-' || v.endsWith('.')) {
          if (v === '' || v === '-') onValueChange(0);
          return;
        }
        const parsed = parseFloat(v);
        if (Number.isFinite(parsed)) onValueChange(parsed);
      }}
      {...rest}
    />
  );
}
