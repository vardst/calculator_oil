import { useMemo } from 'react';
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { NumberInput } from './NumberInput';
import { SimpleResultsCard } from './ResultsCard';
import {
  currencySymbol,
  fromGallons,
  fromLbs,
  fromMiles,
  fromMpg,
  fromPricePerGal,
  toLbs,
  toMiles,
  toMpg,
  toPricePerGal,
  unitLabels,
} from '@/lib/units';
import type { Currency, SimpleInputs, UnitSystem } from '@/types';
import { calcSimple } from '@/lib/calc';
import { Repeat, RotateCcw, Snowflake } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  value: SimpleInputs;
  onChange: (next: SimpleInputs) => void;
  onReset: () => void;
  units: UnitSystem;
  currency: Currency;
}

export function SimpleCalculator({ value, onChange, onReset, units, currency }: Props) {
  const labels = unitLabels(units);
  const sym = currencySymbol[currency];
  const results = useMemo(() => calcSimple(value), [value]);
  const isEv = value.vehicleType === 'ev';

  const set = <K extends keyof SimpleInputs>(k: K, v: SimpleInputs[K]) =>
    onChange({ ...value, [k]: v });

  const onCopy = () => {
    const lines = isEv
      ? [
          `Trip cost (EV)`,
          `Distance: ${fromMiles(value.distance, units).toFixed(1)} ${labels.distance}${value.roundTrip ? ' round-trip' : ''}`,
          `Energy used: ${results.energyUsedKwh.toFixed(2)} kWh`,
          `Total cost: ${sym}${results.totalCost.toFixed(2)}`,
          `Cost per ${units === 'imperial' ? 'mi' : 'km'}: ${sym}${(units === 'imperial' ? results.costPerMile : results.costPerMile / 1.609344).toFixed(3)}`,
          `CO₂: ${results.co2Kg.toFixed(1)} kg`,
        ]
      : [
          `Trip cost`,
          `Distance: ${fromMiles(value.distance, units).toFixed(1)} ${labels.distance}${value.roundTrip ? ' round-trip' : ''}`,
          `Adjusted ${labels.mpg}: ${fromMpg(results.adjustedMpg, units).toFixed(1)}`,
          `Fuel used: ${fromGallons(results.fuelUsed, units).toFixed(2)} ${labels.volume}`,
          `Total cost: ${sym}${results.totalCost.toFixed(2)}`,
          `Cost per ${units === 'imperial' ? 'mi' : 'km'}: ${sym}${(units === 'imperial' ? results.costPerMile : results.costPerMile / 1.609344).toFixed(3)}`,
          `CO₂: ${results.co2Kg.toFixed(1)} kg`,
        ];
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_minmax(320px,420px)]">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Trip details</CardTitle>
              <CardSubtitle>For everyday drivers — road-trip cost & efficiency</CardSubtitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onReset} aria-label="Reset inputs">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardBody className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Distance" htmlFor="distance">
              <NumberInput
                id="distance"
                value={fromMiles(value.distance, units)}
                onValueChange={(v) => set('distance', toMiles(v, units))}
                min={0}
                step={1}
                suffix={labels.distance}
                placeholder="0"
              />
            </Field>

            <Field label="Vehicle type" htmlFor="vehicleType">
              <Select
                id="vehicleType"
                value={value.vehicleType}
                onChange={(e) => set('vehicleType', e.target.value as SimpleInputs['vehicleType'])}
              >
                <option value="car">Car / Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="ev">Electric (EV)</option>
              </Select>
            </Field>

            {!isEv ? (
              <>
                <Field label={`Fuel efficiency (${labels.mpg})`} htmlFor="mpg">
                  <NumberInput
                    id="mpg"
                    value={fromMpg(value.mpg, units)}
                    onValueChange={(v) => set('mpg', toMpg(v, units))}
                    min={0}
                    step={0.1}
                    suffix={labels.mpg}
                    placeholder={units === 'imperial' ? '25' : '9.4'}
                  />
                </Field>

                <Field label={`Fuel price`} htmlFor="fuelPrice">
                  <NumberInput
                    id="fuelPrice"
                    value={fromPricePerGal(value.fuelPrice, units)}
                    onValueChange={(v) => set('fuelPrice', toPricePerGal(v, units))}
                    min={0}
                    step={0.01}
                    prefix={sym}
                    suffix={labels.pricePerVolume}
                    placeholder="3.50"
                  />
                </Field>

                <Field label="Fuel type" htmlFor="fuelType">
                  <Select
                    id="fuelType"
                    value={value.fuelType}
                    onChange={(e) => set('fuelType', e.target.value as SimpleInputs['fuelType'])}
                  >
                    <option value="gas">Gasoline</option>
                    <option value="diesel">Diesel</option>
                  </Select>
                </Field>

                <Field label="Driving condition" htmlFor="driving">
                  <Select
                    id="driving"
                    value={value.drivingCondition}
                    onChange={(e) =>
                      set('drivingCondition', e.target.value as SimpleInputs['drivingCondition'])
                    }
                  >
                    <option value="highway">Highway (+10% MPG)</option>
                    <option value="city">City (-10% MPG)</option>
                    <option value="mixed">Mixed</option>
                  </Select>
                </Field>

                <Field label={`Payload`} hint="lower MPG with more weight" htmlFor="payload">
                  <NumberInput
                    id="payload"
                    value={fromLbs(value.payload, units)}
                    onValueChange={(v) => set('payload', toLbs(v, units))}
                    min={0}
                    step={10}
                    suffix={labels.weight}
                    placeholder="0"
                  />
                </Field>
              </>
            ) : (
              <>
                <Field label="Energy use" htmlFor="kwh100">
                  <NumberInput
                    id="kwh100"
                    value={value.kwhPer100mi}
                    onValueChange={(v) => set('kwhPer100mi', v)}
                    min={0}
                    step={0.5}
                    suffix={`kWh / 100${labels.distance}`}
                    placeholder="30"
                  />
                </Field>
                <Field label="Electricity price" htmlFor="kwhPrice">
                  <NumberInput
                    id="kwhPrice"
                    value={value.pricePerKwh}
                    onValueChange={(v) => set('pricePerKwh', v)}
                    min={0}
                    step={0.01}
                    prefix={sym}
                    suffix="/kWh"
                    placeholder="0.16"
                  />
                </Field>
              </>
            )}

            <Field label="Passengers" hint="for split cost" htmlFor="passengers">
              <NumberInput
                id="passengers"
                value={value.passengers}
                onValueChange={(v) => set('passengers', Math.max(1, Math.round(v)))}
                min={1}
                step={1}
                placeholder="1"
              />
            </Field>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 p-4">
            <ToggleRow
              icon={<Repeat className="h-4 w-4" />}
              label="Round trip"
              description="Doubles the distance for return journey"
              checked={value.roundTrip}
              onCheckedChange={(v) => set('roundTrip', v)}
            />
            {!isEv && (
              <ToggleRow
                icon={<Snowflake className="h-4 w-4" />}
                label="Air conditioning on"
                description="Roughly -10% efficiency"
                checked={value.ac}
                onCheckedChange={(v) => set('ac', v)}
              />
            )}
          </div>
        </CardBody>
      </Card>

      <SimpleResultsCard
        results={results}
        currency={currency}
        units={units}
        onCopy={onCopy}
      />
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--color-surface)] text-[color:var(--color-fg-muted)]">
          {icon}
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-medium text-[color:var(--color-fg)]">{label}</span>
          <span className="text-xs text-[color:var(--color-fg-subtle)]">{description}</span>
        </span>
      </span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}
