/**
 * Pricing Engine for Taxi Sri Lanka - Database-driven tiered pricing system
 */

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

// Cache for pricing configs
let pricingConfigCache: Record<string, VehiclePricingConfig> | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch pricing configurations from database
 */
export async function fetchPricingConfigs(): Promise<Record<string, VehiclePricingConfig>> {
  try {
    const response = await fetch('/api/admin/pricing', {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch pricing configurations')
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch pricing configurations')
    }

    const configs: Record<string, VehiclePricingConfig> = {}

    data.data.forEach((config: any) => {
      configs[config.vehicle_category] = {
        baseRate: parseFloat(config.base_rate),
        minimumFare: parseFloat(config.minimum_fare),
        tiers: [
          { upToKm: config.tier_1_upto_km, rateMultiplier: parseFloat(config.tier_1_multiplier) },
          { upToKm: config.tier_2_upto_km, rateMultiplier: parseFloat(config.tier_2_multiplier) },
          { upToKm: config.tier_3_upto_km, rateMultiplier: parseFloat(config.tier_3_multiplier) },
          { aboveKm: config.tier_3_upto_km, rateMultiplier: parseFloat(config.tier_4_multiplier) }
        ]
      }
    })

    return configs
  } catch (error) {
    console.error('Error fetching pricing configs:', error)
    // Return default fallback configs
    return getDefaultPricingConfigs()
  }
}

/**
 * Get pricing configuration with caching
 */
export async function getPricingConfig(vehicleType: VehicleType): Promise<VehiclePricingConfig> {
  const now = Date.now()
  
  // Check if cache is valid
  if (pricingConfigCache && (now - cacheTimestamp) < CACHE_DURATION) {
    const config = pricingConfigCache[vehicleType]
    if (config) return config
  }

  // Fetch fresh configs
  pricingConfigCache = await fetchPricingConfigs()
  cacheTimestamp = now

  const config = pricingConfigCache[vehicleType]
  if (!config) {
    throw new Error(`Pricing configuration not found for ${vehicleType}`)
  }

  return config
}

/**
 * Default pricing configurations (fallback)
 */
function getDefaultPricingConfigs(): Record<string, VehiclePricingConfig> {
  return {
    Mini: {
      baseRate: 95,
      minimumFare: 500,
      tiers: [
        { upToKm: 10, rateMultiplier: 1.0 },
        { upToKm: 25, rateMultiplier: 0.9 },
        { upToKm: 60, rateMultiplier: 0.8 },
        { aboveKm: 60, rateMultiplier: 0.75 }
      ]
    },
    Sedan: {
      baseRate: 120,
      minimumFare: 650,
      tiers: [
        { upToKm: 10, rateMultiplier: 1.0 },
        { upToKm: 25, rateMultiplier: 0.9 },
        { upToKm: 60, rateMultiplier: 0.8 },
        { aboveKm: 60, rateMultiplier: 0.7 }
      ]
    },
    Van: {
      baseRate: 150,
      minimumFare: 850,
      tiers: [
        { upToKm: 10, rateMultiplier: 1.0 },
        { upToKm: 25, rateMultiplier: 0.88 },
        { upToKm: 60, rateMultiplier: 0.78 },
        { aboveKm: 60, rateMultiplier: 0.68 }
      ]
    },
    SUV: {
      baseRate: 200,
      minimumFare: 1200,
      tiers: [
        { upToKm: 10, rateMultiplier: 1.0 },
        { upToKm: 25, rateMultiplier: 0.85 },
        { upToKm: 60, rateMultiplier: 0.75 },
        { aboveKm: 60, rateMultiplier: 0.65 }
      ]
    },
    Luxury: {
      baseRate: 300,
      minimumFare: 2000,
      tiers: [
        { upToKm: 10, rateMultiplier: 1.0 },
        { upToKm: 25, rateMultiplier: 0.88 },
        { upToKm: 60, rateMultiplier: 0.78 },
        { aboveKm: 60, rateMultiplier: 0.68 }
      ]
    }
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
 * Main pricing engine function (async to support database fetching)
 */
export async function calculateFare(input: FareCalculationInput): Promise<FareCalculationResult> {
  const { vehicleType, distanceKm } = input

  if (distanceKm <= 0) {
    throw new Error('Distance must be greater than 0')
  }

  // Get pricing configuration from database
  const config = await getPricingConfig(vehicleType)

  // Calculate distance fare with tiered pricing
  const { fare: distanceFare, tiersApplied } = calculateTieredDistanceFare(
    distanceKm,
    config
  )

  let totalFare = distanceFare

  // Apply minimum fare
  if (config.minimumFare && totalFare < config.minimumFare) {
    totalFare = config.minimumFare
  }

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
 * Clear pricing cache (call after admin updates)
 */
export function clearPricingCache() {
  pricingConfigCache = null
  cacheTimestamp = 0
}

/**
 * Get base rate for a vehicle type
 */
export async function getBaseRate(vehicleType: VehicleType): Promise<number> {
  const config = await getPricingConfig(vehicleType)
  return config.baseRate
}
