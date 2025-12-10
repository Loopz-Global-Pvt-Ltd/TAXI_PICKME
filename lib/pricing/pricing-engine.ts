/**
 * Pricing Engine for Taxi Sri Lanka - Tourism-focused tiered pricing system
 * Implements decreasing cost per km for longer distances (similar to Uber/PickMe)
 */

// Type definitions
export type VehicleType = 'Mini' | 'Sedan' | 'Van' | 'SUV' | 'Luxury'

export interface PricingTier {
  upToKm?: number
  aboveKm?: number
  rateMultiplier: number
}

export interface VehiclePricingConfig {
  baseRate: number
  tiers: PricingTier[]
  minimumFare?: number
}

export interface FareCalculationInput {
  vehicleType: VehicleType
  distanceKm: number
}

export interface FareBreakdown {
  distanceFare: number
  totalFare: number
  effectiveRatePerKm: number
  tiersApplied: {
    kmRange: string
    km: number
    rate: number
    amount: number
  }[]
}

export interface FareCalculationResult {
  vehicleType: VehicleType
  distanceKm: number
  fareBreakdown: FareBreakdown
}

// Pricing configuration for all vehicle types
export const PRICING_CONFIG: Record<VehicleType, VehiclePricingConfig> = {
  Mini: {
    baseRate: 95,
    minimumFare: 500,
    tiers: [
      { upToKm: 10, rateMultiplier: 1.0 },      // 0-10 km: 95 LKR/km
      { upToKm: 25, rateMultiplier: 0.9 },      // 10-25 km: 85.5 LKR/km
      { upToKm: 60, rateMultiplier: 0.8 },      // 25-60 km: 76 LKR/km
      { aboveKm: 60, rateMultiplier: 0.75 }     // 60+ km: 71.25 LKR/km
    ]
  },
  Sedan: {
    baseRate: 120,
    minimumFare: 650,
    tiers: [
      { upToKm: 10, rateMultiplier: 1.0 },      // 0-10 km: 120 LKR/km
      { upToKm: 25, rateMultiplier: 0.9 },      // 10-25 km: 108 LKR/km
      { upToKm: 60, rateMultiplier: 0.8 },      // 25-60 km: 96 LKR/km
      { aboveKm: 60, rateMultiplier: 0.7 }      // 60+ km: 84 LKR/km
    ]
  },
  Van: {
    baseRate: 150,
    minimumFare: 850,
    tiers: [
      { upToKm: 10, rateMultiplier: 1.0 },      // 0-10 km: 150 LKR/km
      { upToKm: 25, rateMultiplier: 0.88 },     // 10-25 km: 132 LKR/km
      { upToKm: 60, rateMultiplier: 0.78 },     // 25-60 km: 117 LKR/km
      { aboveKm: 60, rateMultiplier: 0.68 }     // 60+ km: 102 LKR/km
    ]
  },
  SUV: {
    baseRate: 200,
    minimumFare: 1200,
    tiers: [
      { upToKm: 10, rateMultiplier: 1.0 },      // 0-10 km: 200 LKR/km
      { upToKm: 25, rateMultiplier: 0.85 },     // 10-25 km: 170 LKR/km
      { upToKm: 60, rateMultiplier: 0.75 },     // 25-60 km: 150 LKR/km
      { aboveKm: 60, rateMultiplier: 0.65 }     // 60+ km: 130 LKR/km
    ]
  },
  Luxury: {
    baseRate: 300,
    minimumFare: 2000,
    tiers: [
      { upToKm: 10, rateMultiplier: 1.0 },      // 0-10 km: 300 LKR/km
      { upToKm: 25, rateMultiplier: 0.88 },     // 10-25 km: 264 LKR/km
      { upToKm: 60, rateMultiplier: 0.78 },     // 25-60 km: 234 LKR/km
      { aboveKm: 60, rateMultiplier: 0.68 }     // 60+ km: 204 LKR/km
    ]
  }
}

/**
 * Calculate tiered distance fare
 */
function calculateTieredDistanceFare(
  distanceKm: number,
  config: VehiclePricingConfig
): { fare: number; tiersApplied: FareBreakdown['tiersApplied'] } {
  let totalFare = 0
  let remainingKm = distanceKm
  const tiersApplied: FareBreakdown['tiersApplied'] = []
  let previousLimit = 0

  for (const tier of config.tiers) {
    if (remainingKm <= 0) break

    const currentLimit = tier.upToKm || Infinity
    const kmInThisTier = Math.min(remainingKm, currentLimit - previousLimit)
    
    if (kmInThisTier > 0) {
      const rate = config.baseRate * tier.rateMultiplier
      const amount = kmInThisTier * rate

      tiersApplied.push({
        kmRange: tier.aboveKm 
          ? `${tier.aboveKm}+ km`
          : `${previousLimit}-${currentLimit} km`,
        km: kmInThisTier,
        rate: rate,
        amount: amount
      })

      totalFare += amount
      remainingKm -= kmInThisTier
    }

    previousLimit = currentLimit
  }

  return { fare: totalFare, tiersApplied }
}

/**
 * Main pricing engine function
 */
export function calculateFare(input: FareCalculationInput): FareCalculationResult {
  const { vehicleType, distanceKm } = input
  const config = PRICING_CONFIG[vehicleType]

  if (!config) {
    throw new Error(`Invalid vehicle type: ${vehicleType}`)
  }

  if (distanceKm <= 0) {
    throw new Error('Distance must be greater than 0')
  }

  // Calculate distance fare with tiered pricing
  const { fare: distanceFare, tiersApplied } = calculateTieredDistanceFare(
    distanceKm,
    config
  )

  // Calculate total (only distance-based)
  let totalFare = distanceFare

  // Apply minimum fare
  if (config.minimumFare && totalFare < config.minimumFare) {
    totalFare = config.minimumFare
  }

  // Calculate effective rate per km
  const effectiveRatePerKm = distanceFare / distanceKm

  return {
    vehicleType,
    distanceKm,
    fareBreakdown: {
      distanceFare: Math.round(distanceFare),
      totalFare: Math.round(totalFare),
      effectiveRatePerKm: Math.round(effectiveRatePerKm * 100) / 100,
      tiersApplied
    }
  }
}

/**
 * Get base rate for a vehicle type (for backward compatibility)
 */
export function getBaseRate(vehicleType: VehicleType): number {
  return PRICING_CONFIG[vehicleType]?.baseRate || 0
}
