/**
 * Enhanced Pricing Engine - Vehicle-specific tiered pricing with detailed logging
 */

export type VehicleType = 'Mini' | 'Sedan' | 'Van' | 'SUV' | 'Luxury' |'Tuk Tuk'

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
  vehicleId?: number
  vehicleType?: VehicleType
  distanceKm: number
}

export interface TierBreakdown {
  tierNumber: number
  tierName: string
  kmRange: string
  kmInTier: number
  baseRate: number
  multiplier: number
  effectiveRate: number
  tierAmount: number
}

export interface FareBreakdown {
  distanceFare: number
  totalFare: number
  effectiveRatePerKm: number
  tierBreakdowns: TierBreakdown[]
}

export interface FareCalculationResult {
  vehicleId?: number
  vehicleType?: string
  distanceKm: number
  fareBreakdown: FareBreakdown
}

/**
 * Fetch vehicle-specific pricing from database
 */
export async function fetchVehiclePricing(vehicleId: number): Promise<VehiclePricingConfig | null> {
  try {
    const response = await fetch(`/api/vehicles/${vehicleId}/pricing`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch vehicle pricing')
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch vehicle pricing')
    }

    const config = data.data
    
    return {
      baseRate: parseFloat(config.base_rate),
      minimumFare: parseFloat(config.minimum_fare),
      tiers: [
        { upToKm: config.tier_1_upto_km, rateMultiplier: parseFloat(config.tier_1_multiplier) },
        { upToKm: config.tier_2_upto_km, rateMultiplier: parseFloat(config.tier_2_multiplier) },
        { upToKm: config.tier_3_upto_km, rateMultiplier: parseFloat(config.tier_3_multiplier) },
        { upToKm: config.tier_4_upto_km, rateMultiplier: parseFloat(config.tier_4_multiplier) },
        { upToKm: config.tier_5_upto_km, rateMultiplier: parseFloat(config.tier_5_multiplier) },
        { upToKm: config.tier_6_upto_km, rateMultiplier: parseFloat(config.tier_6_multiplier) },
        { upToKm: config.tier_7_upto_km, rateMultiplier: parseFloat(config.tier_7_multiplier) },
        { upToKm: config.tier_8_upto_km, rateMultiplier: parseFloat(config.tier_8_multiplier) },
        { upToKm: config.tier_9_upto_km, rateMultiplier: parseFloat(config.tier_9_multiplier) },
        { upToKm: config.tier_10_upto_km, rateMultiplier: parseFloat(config.tier_10_multiplier) },
        { upToKm: config.tier_11_upto_km, rateMultiplier: parseFloat(config.tier_11_multiplier) },
        { aboveKm: config.tier_11_upto_km, rateMultiplier: parseFloat(config.tier_12_multiplier) }
      ]
    }
  } catch (error) {
    console.error('❌ Error fetching vehicle pricing:', error)
    return null
  }
}

/**
 * Calculate tiered distance fare with detailed breakdown
 */
function calculateTieredDistanceFare(
  distanceKm: number,
  config: VehiclePricingConfig,
  vehicleName?: string
): { fare: number; tierBreakdowns: TierBreakdown[] } {
  console.log('\n' + '='.repeat(80))
  console.log(`🚖 CALCULATING FARE FOR: ${vehicleName || 'Unknown Vehicle'}`)
  console.log('='.repeat(80))
  console.log(`📍 Total Distance: ${distanceKm.toFixed(2)} km`)
  console.log(`💰 Base Rate: Rs. ${config.baseRate.toFixed(2)}/km`)
  console.log(`🎯 Minimum Fare: Rs. ${config.minimumFare?.toFixed(2) || 0}`)
  console.log('─'.repeat(80))

  let totalFare = 0
  let remainingKm = distanceKm
  const tierBreakdowns: TierBreakdown[] = []
  let previousLimit = 0
  let tierNumber = 1

  console.log('\n📊 TIER BREAKDOWN:')
  console.log('─'.repeat(80))

  for (const tier of config.tiers) {
    if (remainingKm <= 0) break

    const currentLimit = tier.upToKm || Infinity
    const kmInThisTier = Math.min(remainingKm, currentLimit - previousLimit)
    
    if (kmInThisTier > 0) {
      const effectiveRate = config.baseRate * tier.rateMultiplier
      const tierAmount = kmInThisTier * effectiveRate

      const tierName = tier.aboveKm 
        ? `Tier ${tierNumber} (${tier.aboveKm}+ km)`
        : `Tier ${tierNumber} (${previousLimit}-${currentLimit} km)`

      const kmRange = tier.aboveKm 
        ? `${tier.aboveKm}+ km`
        : `${previousLimit}-${currentLimit} km`

      // Detailed console output
      console.log(`\n🔷 ${tierName}`)
      console.log(`   ├─ Distance Range: ${kmRange}`)
      console.log(`   ├─ KM in this tier: ${kmInThisTier.toFixed(2)} km`)
      console.log(`   ├─ Base Rate: Rs. ${config.baseRate.toFixed(2)}/km`)
      console.log(`   ├─ Multiplier: ${tier.rateMultiplier} (${((1 - tier.rateMultiplier) * 100).toFixed(0)}% discount)`)
      console.log(`   ├─ Effective Rate: Rs. ${effectiveRate.toFixed(2)}/km`)
      console.log(`   ├─ Calculation: ${kmInThisTier.toFixed(2)} km × Rs. ${effectiveRate.toFixed(2)}/km`)
      console.log(`   └─ Tier Amount: Rs. ${tierAmount.toFixed(2)}`)

      tierBreakdowns.push({
        tierNumber,
        tierName,
        kmRange,
        kmInTier: parseFloat(kmInThisTier.toFixed(2)),
        baseRate: parseFloat(config.baseRate.toFixed(2)),
        multiplier: tier.rateMultiplier,
        effectiveRate: parseFloat(effectiveRate.toFixed(2)),
        tierAmount: parseFloat(tierAmount.toFixed(2))
      })

      totalFare += tierAmount
      remainingKm -= kmInThisTier
      tierNumber++
    }

    previousLimit = currentLimit
  }

  console.log('\n' + '─'.repeat(80))
  console.log(`💵 SUBTOTAL (Distance-based): Rs. ${totalFare.toFixed(2)}`)
  console.log('=' .repeat(80) + '\n')

  return { fare: totalFare, tierBreakdowns }
}

/**
 * Main pricing calculation function
 */
export async function calculateFare(input: FareCalculationInput): Promise<FareCalculationResult> {
  const { vehicleId, vehicleType, distanceKm } = input

  console.log('\n🚀 STARTING FARE CALCULATION')
  console.log(`   Vehicle ID: ${vehicleId || 'N/A'}`)
  console.log(`   Vehicle Type: ${vehicleType || 'N/A'}`)
  console.log(`   Distance: ${distanceKm} km`)

  if (distanceKm <= 0) {
    throw new Error('Distance must be greater than 0')
  }

  // Fetch vehicle-specific pricing
  let config: VehiclePricingConfig | null = null
  
  if (vehicleId) {
    config = await fetchVehiclePricing(vehicleId)
  }

  if (!config) {
    throw new Error('Pricing configuration not found')
  }

  // Calculate distance fare with tiered pricing
  const { fare: distanceFare, tierBreakdowns } = calculateTieredDistanceFare(
    distanceKm,
    config,
    `Vehicle #${vehicleId}`
  )

  let totalFare = distanceFare

  // Apply minimum fare
  if (config.minimumFare && totalFare < config.minimumFare) {
    console.log(`⚠️  Applying Minimum Fare: Rs. ${config.minimumFare.toFixed(2)}`)
    console.log(`   (Calculated fare Rs. ${totalFare.toFixed(2)} < Minimum Rs. ${config.minimumFare.toFixed(2)})`)
    totalFare = config.minimumFare
  }

  const effectiveRatePerKm = distanceFare / distanceKm

  console.log('\n' + '='.repeat(80))
  console.log('✅ FINAL CALCULATION')
  console.log('='.repeat(80))
  console.log(`💰 Total Fare: Rs. ${totalFare.toFixed(2)}`)
  console.log(`📊 Effective Rate: Rs. ${effectiveRatePerKm.toFixed(2)}/km`)
  console.log(`🎯 Savings vs Flat Rate: Rs. ${((config.baseRate * distanceKm) - totalFare).toFixed(2)}`)
  console.log(`📈 Discount: ${(((config.baseRate * distanceKm - totalFare) / (config.baseRate * distanceKm)) * 100).toFixed(1)}%`)
  console.log('='.repeat(80) + '\n')

  return {
    vehicleId,
    vehicleType: vehicleType || 'Unknown',
    distanceKm,
    fareBreakdown: {
      distanceFare: Math.round(distanceFare),
      totalFare: Math.round(totalFare),
      effectiveRatePerKm: Math.round(effectiveRatePerKm * 100) / 100,
      tierBreakdowns
    }
  }
}

/**
 * Get vehicle base rate
 */
export async function getVehicleBaseRate(vehicleId: number): Promise<number> {
  const config = await fetchVehiclePricing(vehicleId)
  return config?.baseRate || 0
}
