import { useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select } from '@/components/ui/select';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UnitToggle } from '@/components/UnitToggle';
import { SimpleCalculator } from '@/components/SimpleCalculator';
import { ProCalculator } from '@/components/ProCalculator';
import { useLocalStorage, useLocalStorageRaw } from '@/lib/storage';
import type { Currency, ProInputs, SimpleInputs, UnitSystem } from '@/types';
import { Fuel, Github } from 'lucide-react';

const DEFAULT_SIMPLE: SimpleInputs = {
  distance: 100,
  mpg: 25,
  fuelPrice: 3.5,
  vehicleType: 'car',
  drivingCondition: 'mixed',
  payload: 0,
  ac: false,
  passengers: 1,
  roundTrip: false,
  fuelType: 'gas',
  kwhPer100mi: 30,
  pricePerKwh: 0.16,
};

const DEFAULT_PRO: ProInputs = {
  loadedMiles: 500,
  deadheadPct: 15,
  mpg: 6.8,
  fuelPrice: 3.4,
  truckPayment: 2200,
  trailerPayment: 600,
  insurance: 1200,
  permits: 200,
  parking: 150,
  software: 100,
  office: 250,
  monthlyMiles: 10000,
  maintenance: 0.18,
  tires: 0.04,
  tolls: 0.03,
  ifta: 0.02,
  driverPayPerMile: 0.6,
  payrollTaxPct: 8,
  profitPct: 15,
};

export default function App() {
  const [simple, setSimple] = useLocalStorage<SimpleInputs>('cpm.simple', DEFAULT_SIMPLE);
  const [pro, setPro] = useLocalStorage<ProInputs>('cpm.pro', DEFAULT_PRO);
  const [units, setUnits] = useLocalStorageRaw<UnitSystem>('cpm.units', 'imperial');
  const [currency, setCurrency] = useLocalStorageRaw<Currency>('cpm.currency', 'USD');
  const [mode, setMode] = useLocalStorageRaw<'simple' | 'pro'>('cpm.mode', 'simple');

  const resetSimple = useCallback(() => setSimple(DEFAULT_SIMPLE), [setSimple]);
  const resetPro = useCallback(() => setPro(DEFAULT_PRO), [setPro]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[color:var(--color-border)]/60 backdrop-blur-xl bg-[color:var(--color-bg)]/70 sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--color-accent)] text-[color:var(--color-accent-fg)]">
              <Fuel className="h-4 w-4" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold tracking-tight">Cost Per Mile</div>
              <div className="text-[10px] text-[color:var(--color-fg-subtle)] -mt-0.5">
                Trip & trucking calculator
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              aria-label="Currency"
              className="h-9 w-auto min-w-[72px]"
            >
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
              <option value="GBP">GBP £</option>
            </Select>
            <UnitToggle value={units} onChange={setUnits} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6 sm:mb-8 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Know your true cost per mile.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[color:var(--color-fg-muted)]">
            A fast, beautiful calculator for road-trippers and owner-operators. Live results,
            unit conversion, and a clean breakdown of where your money goes.
          </p>
        </div>

        <Tabs value={mode} onValueChange={(v) => setMode(v as 'simple' | 'pro')}>
          <TabsList>
            <TabsTrigger value="simple">Trip · Simple</TabsTrigger>
            <TabsTrigger value="pro">Trucking · Pro</TabsTrigger>
          </TabsList>

          <TabsContent value="simple">
            <SimpleCalculator
              value={simple}
              onChange={setSimple}
              onReset={resetSimple}
              units={units}
              currency={currency}
            />
          </TabsContent>
          <TabsContent value="pro">
            <ProCalculator
              value={pro}
              onChange={setPro}
              onReset={resetPro}
              units={units}
              currency={currency}
            />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-[color:var(--color-border)]/60 mt-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-12 flex items-center justify-between text-xs text-[color:var(--color-fg-subtle)]">
          <span>All calculations run locally — no data leaves your device.</span>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[color:var(--color-fg)] transition-colors"
          >
            <Github className="h-3.5 w-3.5" /> Source
          </a>
        </div>
      </footer>
    </div>
  );
}
