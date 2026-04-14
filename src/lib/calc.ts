import type {
  ProInputs,
  ProResults,
  SimpleInputs,
  SimpleResults,
} from '@/types';

const VEHICLE_MULTIPLIER = {
  car: 1.0,
  suv: 0.9,
  truck: 0.8,
  van: 0.95,
  ev: 1.0,
} as const;

const DRIVING_MULTIPLIER = {
  highway: 1.1,
  city: 0.9,
  mixed: 1.0,
} as const;

const AC_MULTIPLIER = 0.9;

// kg CO2 per gallon (EPA)
const CO2_PER_GAL = { gas: 8.89, diesel: 10.18 } as const;
// kg CO2 per kWh (US grid avg, eGRID 2022 ~0.371)
const CO2_PER_KWH = 0.371;

const COLOR_BASE = '#fbbf24';
const COLOR_VEHICLE = '#fb923c';
const COLOR_PAYLOAD = '#a78bfa';
const COLOR_DRIVING = '#60a5fa';
const COLOR_AC = '#34d399';

export function calcSimple(input: SimpleInputs): SimpleResults {
  const effectiveDistance = input.distance * (input.roundTrip ? 2 : 1);

  if (input.vehicleType === 'ev') {
    const energyUsedKwh = (effectiveDistance / 100) * input.kwhPer100mi;
    const totalCost = energyUsedKwh * input.pricePerKwh;
    const costPerMile = effectiveDistance > 0 ? totalCost / effectiveDistance : 0;
    const co2Kg = energyUsedKwh * CO2_PER_KWH;
    const passengers = Math.max(1, input.passengers || 1);
    return {
      adjustedMpg: 0,
      costPerMile,
      totalCost,
      fuelUsed: 0,
      co2Kg,
      costPerPerson: totalCost / passengers,
      effectiveDistance,
      isEv: true,
      energyUsedKwh,
      breakdown: [
        { label: 'Electricity', value: totalCost, color: COLOR_BASE },
      ],
    };
  }

  const baseMpg = input.mpg;

  // Compute each adjustment as a multiplier delta so we can attribute cost to it.
  const vehicleMult = VEHICLE_MULTIPLIER[input.vehicleType];
  const payloadPenalty = Math.min(0.3, Math.max(0, input.payload) / 100 * 0.01);
  const payloadMult = 1 - payloadPenalty;
  const drivingMult = DRIVING_MULTIPLIER[input.drivingCondition];
  const acMult = input.ac ? AC_MULTIPLIER : 1;

  const adjustedMpg = baseMpg * vehicleMult * payloadMult * drivingMult * acMult;

  if (!isFinite(adjustedMpg) || adjustedMpg <= 0) {
    return emptySimple(effectiveDistance);
  }

  const fuelUsed = effectiveDistance / adjustedMpg;
  const totalCost = fuelUsed * input.fuelPrice;
  const costPerMile = effectiveDistance > 0 ? totalCost / effectiveDistance : 0;
  const co2Kg = fuelUsed * CO2_PER_GAL[input.fuelType];
  const passengers = Math.max(1, input.passengers || 1);

  // Breakdown: attribute fuel cost to each penalty multiplicatively.
  // base cost (if no adjustments at all) vs. extra cost added by each penalty.
  const baseCost = baseMpg > 0 ? (effectiveDistance / baseMpg) * input.fuelPrice : 0;
  const afterVehicle = baseMpg > 0 ? (effectiveDistance / (baseMpg * vehicleMult)) * input.fuelPrice : 0;
  const afterPayload = baseMpg > 0 ? (effectiveDistance / (baseMpg * vehicleMult * payloadMult)) * input.fuelPrice : 0;
  const afterDriving = baseMpg > 0 ? (effectiveDistance / (baseMpg * vehicleMult * payloadMult * drivingMult)) * input.fuelPrice : 0;
  const afterAc = totalCost;

  const breakdown = [
    { label: 'Base fuel', value: baseCost, color: COLOR_BASE },
    { label: 'Vehicle type', value: Math.max(0, afterVehicle - baseCost), color: COLOR_VEHICLE },
    { label: 'Payload', value: Math.max(0, afterPayload - afterVehicle), color: COLOR_PAYLOAD },
    { label: 'Driving condition', value: afterDriving - afterPayload, color: COLOR_DRIVING },
    { label: 'A/C', value: Math.max(0, afterAc - afterDriving), color: COLOR_AC },
  ].filter(b => Math.abs(b.value) > 0.005);

  return {
    adjustedMpg,
    costPerMile,
    totalCost,
    fuelUsed,
    co2Kg,
    costPerPerson: totalCost / passengers,
    effectiveDistance,
    isEv: false,
    energyUsedKwh: 0,
    breakdown,
  };
}

function emptySimple(effectiveDistance: number): SimpleResults {
  return {
    adjustedMpg: 0,
    costPerMile: 0,
    totalCost: 0,
    fuelUsed: 0,
    co2Kg: 0,
    costPerPerson: 0,
    effectiveDistance,
    isEv: false,
    energyUsedKwh: 0,
    breakdown: [],
  };
}

export function calcPro(input: ProInputs): ProResults {
  const loadedMiles = Math.max(0, input.loadedMiles);
  const deadheadMiles = loadedMiles * (Math.max(0, input.deadheadPct) / 100);
  const totalMiles = loadedMiles + deadheadMiles;

  // Fuel cost per mile is computed over total miles (driving empty still burns fuel),
  // then attributed back per loaded mile (since revenue is only earned on loaded miles).
  const fuelCostTotal = input.mpg > 0 ? (totalMiles / input.mpg) * input.fuelPrice : 0;
  const fuelCostPerMile = loadedMiles > 0 ? fuelCostTotal / loadedMiles : 0;

  const monthlyFixed =
    input.truckPayment +
    input.trailerPayment +
    input.insurance +
    input.permits +
    input.parking +
    input.software +
    input.office;
  const fixedCostPerMile = input.monthlyMiles > 0 ? monthlyFixed / input.monthlyMiles : 0;

  const variableCostPerMile =
    input.maintenance + input.tires + input.tolls + input.ifta;

  const laborCostPerMile =
    input.driverPayPerMile * (1 + Math.max(0, input.payrollTaxPct) / 100);

  const totalCostPerMile =
    fuelCostPerMile + fixedCostPerMile + variableCostPerMile + laborCostPerMile;

  const profitMult = 1 + Math.max(0, input.profitPct) / 100;
  const suggestedRatePerMile = totalCostPerMile * profitMult;

  const totalCost = totalCostPerMile * loadedMiles;
  const totalRevenueNeeded = suggestedRatePerMile * loadedMiles;
  const totalProfit = totalRevenueNeeded - totalCost;

  const breakdown = [
    { label: 'Fuel', value: fuelCostPerMile, color: COLOR_BASE },
    { label: 'Fixed', value: fixedCostPerMile, color: COLOR_VEHICLE },
    { label: 'Variable', value: variableCostPerMile, color: COLOR_DRIVING },
    { label: 'Labor', value: laborCostPerMile, color: COLOR_PAYLOAD },
  ].filter(b => b.value > 0.0001);

  return {
    fuelCostPerMile,
    fixedCostPerMile,
    variableCostPerMile,
    laborCostPerMile,
    totalCostPerMile,
    suggestedRatePerMile,
    totalMiles,
    totalCost,
    totalRevenueNeeded,
    totalProfit,
    breakdown,
  };
}
