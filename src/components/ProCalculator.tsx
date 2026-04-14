import { useMemo } from 'react';
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/label';
import { NumberInput } from './NumberInput';
import { CollapsibleSection } from './ui/collapsible';
import { ProResultsCard } from './ResultsCard';
import { Button } from './ui/button';
import { RotateCcw } from 'lucide-react';
import {
  currencySymbol,
  fromMiles,
  fromMpg,
  fromPricePerGal,
  toMiles,
  toMpg,
  toPricePerGal,
  unitLabels,
} from '@/lib/units';
import type { Currency, ProInputs, UnitSystem } from '@/types';
import { calcPro } from '@/lib/calc';

interface Props {
  value: ProInputs;
  onChange: (next: ProInputs) => void;
  onReset: () => void;
  units: UnitSystem;
  currency: Currency;
}

export function ProCalculator({ value, onChange, onReset, units, currency }: Props) {
  const labels = unitLabels(units);
  const sym = currencySymbol[currency];
  const results = useMemo(() => calcPro(value), [value]);

  const set = <K extends keyof ProInputs>(k: K, v: ProInputs[K]) =>
    onChange({ ...value, [k]: v });

  const onCopy = () => {
    const lines = [
      `Trucking cost-per-mile`,
      `Loaded miles: ${fromMiles(value.loadedMiles, units).toFixed(0)} ${labels.distance} (+${value.deadheadPct}% deadhead)`,
      `Fuel: ${sym}${results.fuelCostPerMile.toFixed(3)}/${labels.distance}`,
      `Fixed: ${sym}${results.fixedCostPerMile.toFixed(3)}/${labels.distance}`,
      `Variable: ${sym}${results.variableCostPerMile.toFixed(3)}/${labels.distance}`,
      `Labor: ${sym}${results.laborCostPerMile.toFixed(3)}/${labels.distance}`,
      `Break-even: ${sym}${results.totalCostPerMile.toFixed(3)}/${labels.distance}`,
      `Suggested rate: ${sym}${results.suggestedRatePerMile.toFixed(3)}/${labels.distance}`,
      `Trip revenue needed: ${sym}${results.totalRevenueNeeded.toFixed(2)}`,
      `Trip profit: ${sym}${results.totalProfit.toFixed(2)}`,
    ];
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_minmax(320px,420px)]">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Owner-operator inputs</CardTitle>
              <CardSubtitle>True cost per mile · break-even rate · suggested rate</CardSubtitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onReset} aria-label="Reset inputs">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardBody className="space-y-3">
          <CollapsibleSection title="Fuel & route" description="Diesel cost is computed across loaded + deadhead miles">
            <div className="grid gap-4 sm:grid-cols-2 pt-3">
              <Field label="Loaded miles" htmlFor="loadedMiles">
                <NumberInput
                  id="loadedMiles"
                  value={fromMiles(value.loadedMiles, units)}
                  onValueChange={(v) => set('loadedMiles', toMiles(v, units))}
                  min={0}
                  step={10}
                  suffix={labels.distance}
                />
              </Field>
              <Field label="Deadhead %" hint="Empty miles" htmlFor="deadhead">
                <NumberInput
                  id="deadhead"
                  value={value.deadheadPct}
                  onValueChange={(v) => set('deadheadPct', v)}
                  min={0}
                  max={100}
                  step={1}
                  suffix="%"
                />
              </Field>
              <Field label={`Fuel efficiency`} htmlFor="proMpg">
                <NumberInput
                  id="proMpg"
                  value={fromMpg(value.mpg, units)}
                  onValueChange={(v) => set('mpg', toMpg(v, units))}
                  min={0}
                  step={0.1}
                  suffix={labels.mpg}
                />
              </Field>
              <Field label={`Diesel price`} htmlFor="proFuelPrice">
                <NumberInput
                  id="proFuelPrice"
                  value={fromPricePerGal(value.fuelPrice, units)}
                  onValueChange={(v) => set('fuelPrice', toPricePerGal(v, units))}
                  min={0}
                  step={0.01}
                  prefix={sym}
                  suffix={labels.pricePerVolume}
                />
              </Field>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Fixed monthly costs"
            description="Divided by your monthly miles to get a per-mile share"
            defaultOpen={false}
          >
            <div className="grid gap-4 sm:grid-cols-2 pt-3">
              <MoneyField label="Truck payment" sym={sym} value={value.truckPayment} onChange={(v) => set('truckPayment', v)} />
              <MoneyField label="Trailer payment" sym={sym} value={value.trailerPayment} onChange={(v) => set('trailerPayment', v)} />
              <MoneyField label="Insurance" sym={sym} value={value.insurance} onChange={(v) => set('insurance', v)} />
              <MoneyField label="Permits & licenses" sym={sym} value={value.permits} onChange={(v) => set('permits', v)} />
              <MoneyField label="Parking" sym={sym} value={value.parking} onChange={(v) => set('parking', v)} />
              <MoneyField label="Software / ELD" sym={sym} value={value.software} onChange={(v) => set('software', v)} />
              <MoneyField label="Office / admin" sym={sym} value={value.office} onChange={(v) => set('office', v)} />
              <Field label="Monthly miles" hint="for fixed-cost amortization" htmlFor="monthlyMiles">
                <NumberInput
                  id="monthlyMiles"
                  value={fromMiles(value.monthlyMiles, units)}
                  onValueChange={(v) => set('monthlyMiles', toMiles(v, units))}
                  min={0}
                  step={100}
                  suffix={labels.distance}
                />
              </Field>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Variable per-mile costs"
            defaultOpen={false}
          >
            <div className="grid gap-4 sm:grid-cols-2 pt-3">
              <PerMileField label="Maintenance" sym={sym} unit={`/${labels.distance}`} value={value.maintenance} onChange={(v) => set('maintenance', v)} />
              <PerMileField label="Tires" sym={sym} unit={`/${labels.distance}`} value={value.tires} onChange={(v) => set('tires', v)} />
              <PerMileField label="Tolls" sym={sym} unit={`/${labels.distance}`} value={value.tolls} onChange={(v) => set('tolls', v)} />
              <PerMileField label="IFTA / fees" sym={sym} unit={`/${labels.distance}`} value={value.ifta} onChange={(v) => set('ifta', v)} />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Labor" defaultOpen={false}>
            <div className="grid gap-4 sm:grid-cols-2 pt-3">
              <PerMileField label="Driver pay" sym={sym} unit={`/${labels.distance}`} value={value.driverPayPerMile} onChange={(v) => set('driverPayPerMile', v)} />
              <Field label="Payroll tax %" htmlFor="payroll">
                <NumberInput
                  id="payroll"
                  value={value.payrollTaxPct}
                  onValueChange={(v) => set('payrollTaxPct', v)}
                  min={0}
                  max={100}
                  step={0.5}
                  suffix="%"
                />
              </Field>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Profit target" defaultOpen={false}>
            <div className="grid gap-4 sm:grid-cols-2 pt-3">
              <Field label="Target profit margin" hint="markup over cost" htmlFor="profit">
                <NumberInput
                  id="profit"
                  value={value.profitPct}
                  onValueChange={(v) => set('profitPct', v)}
                  min={0}
                  step={1}
                  suffix="%"
                />
              </Field>
            </div>
          </CollapsibleSection>
        </CardBody>
      </Card>

      <ProResultsCard
        results={results}
        currency={currency}
        units={units}
        onCopy={onCopy}
      />
    </div>
  );
}

function MoneyField({
  label,
  sym,
  value,
  onChange,
}: {
  label: string;
  sym: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <Field label={label}>
      <NumberInput
        value={value}
        onValueChange={onChange}
        min={0}
        step={10}
        prefix={sym}
        suffix="/mo"
      />
    </Field>
  );
}

function PerMileField({
  label,
  sym,
  unit,
  value,
  onChange,
}: {
  label: string;
  sym: string;
  unit: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <Field label={label}>
      <NumberInput
        value={value}
        onValueChange={onChange}
        min={0}
        step={0.01}
        prefix={sym}
        suffix={unit}
      />
    </Field>
  );
}
