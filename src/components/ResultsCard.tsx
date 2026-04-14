import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect } from 'react';
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip';
import { Check, Copy, Info, Leaf, Users } from 'lucide-react';
import { CostBreakdownChart } from './CostBreakdownChart';
import {
  currencySymbol,
  formatMoney,
  formatNumber,
  fromGallons,
  fromMpg,
  unitLabels,
} from '@/lib/units';
import type { Currency, SimpleResults, UnitSystem } from '@/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';

function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  fractionDigits = 2,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  fractionDigits?: number;
  className?: string;
}) {
  const mv = useMotionValue(value);
  const display = useTransform(mv, (v) => `${prefix}${v.toFixed(fractionDigits)}${suffix}`);

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.45, ease: 'easeOut' });
    return controls.stop;
  }, [value, mv]);

  return <motion.span className={className}>{display}</motion.span>;
}

interface SimpleResultsCardProps {
  results: SimpleResults;
  currency: Currency;
  units: UnitSystem;
  onCopy: () => void;
}

export function SimpleResultsCard({ results, currency, units, onCopy }: SimpleResultsCardProps) {
  const [copied, setCopied] = useState(false);
  const labels = unitLabels(units);
  const sym = currencySymbol[currency];

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const fuelDisplay = results.isEv
    ? results.energyUsedKwh
    : fromGallons(results.fuelUsed, units);
  const fuelUnit = results.isEv ? 'kWh' : labels.volume;

  const adjMpgDisplay = fromMpg(results.adjustedMpg, units);
  const mpgLabel = labels.mpg;

  const isEmpty = results.totalCost === 0;

  return (
    <TooltipProvider delayDuration={150}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="sticky top-4"
      >
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Trip results
                </CardTitle>
                <CardSubtitle>Updates live as you change inputs</CardSubtitle>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                disabled={isEmpty}
                aria-label="Copy results"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-[color:var(--color-fg-subtle)]">
                Cost per {units === 'imperial' ? 'mile' : 'kilometer'}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <AnimatedNumber
                  value={units === 'imperial' ? results.costPerMile : results.costPerMile / 1.609344}
                  prefix={sym}
                  fractionDigits={3}
                  className="font-mono text-5xl font-bold tracking-tight text-[color:var(--color-fg)]"
                />
                <span className="text-sm text-[color:var(--color-fg-subtle)]">
                  /{labels.distance}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat
                label="Total fuel cost"
                value={
                  <AnimatedNumber
                    value={results.totalCost}
                    prefix={sym}
                    className="font-mono text-xl font-semibold"
                  />
                }
              />
              <Stat
                label={results.isEv ? 'Energy used' : 'Fuel used'}
                value={
                  <span className="font-mono text-xl font-semibold">
                    <AnimatedNumber value={fuelDisplay} fractionDigits={2} />
                    <span className="text-xs ml-1 text-[color:var(--color-fg-subtle)] uppercase">
                      {fuelUnit}
                    </span>
                  </span>
                }
              />
              {!results.isEv && (
                <Stat
                  label={
                    <span className="inline-flex items-center gap-1">
                      Adjusted {mpgLabel}
                      <Tooltip content="Your base efficiency adjusted for vehicle type, payload, driving conditions, and A/C use.">
                        <Info className="h-3 w-3 text-[color:var(--color-fg-subtle)] cursor-help" />
                      </Tooltip>
                    </span>
                  }
                  value={
                    <span className="font-mono text-xl font-semibold">
                      <AnimatedNumber value={adjMpgDisplay} fractionDigits={1} />
                    </span>
                  }
                />
              )}
              <Stat
                label={
                  <span className="inline-flex items-center gap-1">
                    <Leaf className="h-3 w-3" /> CO₂ emissions
                  </span>
                }
                value={
                  <span className="font-mono text-xl font-semibold">
                    <AnimatedNumber value={results.co2Kg} fractionDigits={1} />
                    <span className="text-xs ml-1 text-[color:var(--color-fg-subtle)] uppercase">kg</span>
                  </span>
                }
              />
            </div>

            {results.costPerPerson !== results.totalCost && (
              <div className="flex items-center justify-between rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/50 px-3 py-2.5">
                <span className="inline-flex items-center gap-2 text-xs text-[color:var(--color-fg-muted)]">
                  <Users className="h-3.5 w-3.5" /> Cost per person
                </span>
                <span className="font-mono text-sm font-semibold">
                  <AnimatedNumber value={results.costPerPerson} prefix={sym} />
                </span>
              </div>
            )}

            {results.breakdown.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider text-[color:var(--color-fg-subtle)]">
                  Cost breakdown
                </div>
                <CostBreakdownChart
                  segments={results.breakdown}
                  total={results.totalCost}
                  unit={sym}
                />
              </div>
            )}

            {isEmpty && (
              <div className="rounded-lg border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/30 px-4 py-6 text-center">
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  Enter your trip details to see live results
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 px-3 py-2.5',
        className,
      )}
    >
      <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-fg-subtle)]">
        {label}
      </div>
      <div className="mt-1 text-[color:var(--color-fg)]">{value}</div>
    </div>
  );
}

// --- Pro results ---

import type { ProResults } from '@/types';

export function ProResultsCard({
  results,
  currency,
  units,
  onCopy,
}: {
  results: ProResults;
  currency: Currency;
  units: UnitSystem;
  onCopy: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const labels = unitLabels(units);
  const sym = currencySymbol[currency];

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const isEmpty = results.totalCostPerMile === 0;

  return (
    <TooltipProvider delayDuration={150}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="sticky top-4 space-y-4"
      >
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Cost & rate</CardTitle>
                <CardSubtitle>Your true cost per loaded mile</CardSubtitle>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                disabled={isEmpty}
                aria-label="Copy results"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-fg-subtle)]">
                  Break-even
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <AnimatedNumber
                    value={results.totalCostPerMile}
                    prefix={sym}
                    fractionDigits={3}
                    className="font-mono text-3xl font-bold tracking-tight"
                  />
                  <span className="text-xs text-[color:var(--color-fg-subtle)]">/{labels.distance}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-fg-subtle)]">
                  Suggested rate
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <AnimatedNumber
                    value={results.suggestedRatePerMile}
                    prefix={sym}
                    fractionDigits={3}
                    className="font-mono text-3xl font-bold tracking-tight text-[color:var(--color-accent)]"
                  />
                  <span className="text-xs text-[color:var(--color-fg-subtle)]">/{labels.distance}</span>
                </div>
              </div>
            </div>

            {results.breakdown.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider text-[color:var(--color-fg-subtle)]">
                  Cost per mile breakdown
                </div>
                <CostBreakdownChart
                  segments={results.breakdown}
                  total={results.totalCostPerMile}
                  unit={sym}
                />
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-[color:var(--color-border)]">
              <Row label="Total miles (loaded + deadhead)" value={`${formatNumber(results.totalMiles, 0)} ${labels.distance}`} />
              <Row label="Total trip cost" value={formatMoney(results.totalCost, currency)} />
              <Row label="Revenue needed" value={formatMoney(results.totalRevenueNeeded, currency)} highlight />
              <Row label="Trip profit" value={formatMoney(results.totalProfit, currency)} highlight />
            </div>

            {isEmpty && (
              <div className="rounded-lg border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/30 px-4 py-6 text-center">
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  Fill in your costs to see your true cost per mile
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[color:var(--color-fg-muted)]">{label}</span>
      <span
        className={cn(
          'font-mono tabular-nums',
          highlight ? 'text-[color:var(--color-fg)] font-semibold' : 'text-[color:var(--color-fg)]',
        )}
      >
        {value}
      </span>
    </div>
  );
}
