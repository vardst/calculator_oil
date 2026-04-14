export type UnitSystem = 'imperial' | 'metric';
export type Currency = 'USD' | 'EUR' | 'GBP';
export type VehicleType = 'car' | 'suv' | 'truck' | 'van' | 'ev';
export type DrivingCondition = 'highway' | 'city' | 'mixed';
export type FuelType = 'gas' | 'diesel';

export interface SimpleInputs {
  distance: number;            // miles (canonical)
  mpg: number;                 // miles per gallon (canonical)
  fuelPrice: number;           // $ per gallon (canonical)
  vehicleType: VehicleType;
  drivingCondition: DrivingCondition;
  payload: number;             // lbs (canonical)
  ac: boolean;
  passengers: number;
  roundTrip: boolean;
  fuelType: FuelType;
  // EV-only
  kwhPer100mi: number;
  pricePerKwh: number;
}

export interface SimpleResults {
  adjustedMpg: number;
  costPerMile: number;
  totalCost: number;
  fuelUsed: number;            // gallons
  co2Kg: number;
  costPerPerson: number;
  effectiveDistance: number;
  breakdown: { label: string; value: number; color: string }[];
  isEv: boolean;
  energyUsedKwh: number;
}

export interface ProInputs {
  loadedMiles: number;
  deadheadPct: number;          // 0-100
  mpg: number;
  fuelPrice: number;            // $/gal diesel
  // Fixed monthly
  truckPayment: number;
  trailerPayment: number;
  insurance: number;
  permits: number;
  parking: number;
  software: number;
  office: number;
  monthlyMiles: number;
  // Variable per-mile
  maintenance: number;
  tires: number;
  tolls: number;
  ifta: number;
  // Labor
  driverPayPerMile: number;
  payrollTaxPct: number;        // 0-100
  // Profit
  profitPct: number;            // 0-100 (margin on top of cost)
}

export interface ProResults {
  fuelCostPerMile: number;
  fixedCostPerMile: number;
  variableCostPerMile: number;
  laborCostPerMile: number;
  totalCostPerMile: number;     // break-even
  suggestedRatePerMile: number;
  totalMiles: number;           // loaded + deadhead
  totalCost: number;
  totalRevenueNeeded: number;
  totalProfit: number;
  breakdown: { label: string; value: number; color: string }[];
}
