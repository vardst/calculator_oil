import type { Currency, UnitSystem } from '@/types';

export const MI_PER_KM = 0.621371;
export const KM_PER_MI = 1.609344;
export const GAL_PER_L = 0.264172;
export const L_PER_GAL = 3.785412;
export const LB_PER_KG = 2.204623;
export const KG_PER_LB = 0.453592;

export const currencySymbol: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export interface UnitLabels {
  distance: string;
  volume: string;
  mpg: string;
  pricePerVolume: string;
  weight: string;
}

export function unitLabels(system: UnitSystem): UnitLabels {
  return system === 'imperial'
    ? { distance: 'mi', volume: 'gal', mpg: 'MPG', pricePerVolume: '/gal', weight: 'lbs' }
    : { distance: 'km', volume: 'L', mpg: 'L/100km', pricePerVolume: '/L', weight: 'kg' };
}

// Display conversions: canonical (imperial) -> view
export const fromMiles = (mi: number, sys: UnitSystem) => sys === 'imperial' ? mi : mi * KM_PER_MI;
export const toMiles = (v: number, sys: UnitSystem) => sys === 'imperial' ? v : v * MI_PER_KM;

export const fromGallons = (gal: number, sys: UnitSystem) => sys === 'imperial' ? gal : gal * L_PER_GAL;
export const toGallons = (v: number, sys: UnitSystem) => sys === 'imperial' ? v : v * GAL_PER_L;

export const fromLbs = (lb: number, sys: UnitSystem) => sys === 'imperial' ? lb : lb * KG_PER_LB;
export const toLbs = (v: number, sys: UnitSystem) => sys === 'imperial' ? v : v * LB_PER_KG;

// MPG ↔ L/100km (when displaying efficiency)
export const fromMpg = (mpg: number, sys: UnitSystem) =>
  sys === 'imperial' ? mpg : (mpg > 0 ? 235.215 / mpg : 0);
export const toMpg = (v: number, sys: UnitSystem) =>
  sys === 'imperial' ? v : (v > 0 ? 235.215 / v : 0);

// Price per gallon (canonical) ↔ price per liter
export const fromPricePerGal = (p: number, sys: UnitSystem) => sys === 'imperial' ? p : p / L_PER_GAL;
export const toPricePerGal = (v: number, sys: UnitSystem) => sys === 'imperial' ? v : v * L_PER_GAL;

export function formatMoney(n: number, currency: Currency, fractionDigits = 2) {
  if (!Number.isFinite(n)) return `${currencySymbol[currency]}0.00`;
  return `${currencySymbol[currency]}${n.toFixed(fractionDigits)}`;
}

export function formatNumber(n: number, fractionDigits = 2) {
  if (!Number.isFinite(n)) return '0';
  return n.toFixed(fractionDigits);
}
