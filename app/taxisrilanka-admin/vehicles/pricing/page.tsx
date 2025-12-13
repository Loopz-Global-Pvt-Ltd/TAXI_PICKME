"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { 
  AlertCircle,
  CheckCircle,
  Loader2,
  Save, 
  RefreshCw,
  ArrowLeft,
  Car,
  DollarSign,
  TrendingDown,
  Search,
  Edit,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import Link from 'next/link'

interface Vehicle {
  id: number
  name: string
  category: string
  base_rate: string
  minimum_fare: string
  tier_1_upto_km: number
  tier_1_multiplier: string
  tier_2_upto_km: number
  tier_2_multiplier: string
  tier_3_upto_km: number
  tier_3_multiplier: string
  tier_4_upto_km: number
  tier_4_multiplier: string
  tier_5_upto_km: number
  tier_5_multiplier: string
  tier_6_upto_km: number
  tier_6_multiplier: string
  tier_7_upto_km: number
  tier_7_multiplier: string
  tier_8_upto_km: number
  tier_8_multiplier: string
  tier_9_upto_km: number
  tier_9_multiplier: string
  tier_10_upto_km: number
  tier_10_multiplier: string
  tier_11_upto_km: number
  tier_11_multiplier: string
  tier_12_multiplier: string
  price_per_km: string
}

const TIER_CONFIGS = [
  { number: 1, color: 'green', from: 0, label: 'First Tier' },
  { number: 2, color: 'yellow', label: 'Short Distance' },
  { number: 3, color: 'orange', label: 'Medium Distance' },
  { number: 4, color: 'red', label: 'Long Distance' },
  { number: 5, color: 'purple', label: 'Extended Distance' },
  { number: 6, color: 'blue', label: 'Regional Travel' },
  { number: 7, color: 'indigo', label: 'Inter-City' },
  { number: 8, color: 'pink', label: 'Long Journey' },
  { number: 9, color: 'cyan', label: 'Cross-Country' },
  { number: 10, color: 'teal', label: 'Extended Journey' },
  { number: 11, color: 'amber', label: 'Ultra Distance' },
  { number: 12, color: 'rose', label: 'Maximum Distance', isLast: true },
]

export default function VehiclePricingManagementPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [editingVehicle, setEditingVehicle] = useState<number | null>(null)
  const [expandedVehicles, setExpandedVehicles] = useState<Set<number>>(new Set())
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  const { isAuthenticated, isLoading } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/taxisrilanka-admin')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    try {
      const vehiclesResponse = await fetch('/api/admin/vehicles')
      const vehiclesData = await vehiclesResponse.json()
      
      if (vehiclesData.success) {
        const normalizedVehicles = vehiclesData.data.map((v: any) => ({
          ...v,
          base_rate: v.base_rate || '0',
          minimum_fare: v.minimum_fare || '0',
          tier_1_upto_km: v.tier_1_upto_km || 10,
          tier_1_multiplier: v.tier_1_multiplier || '1.0',
          tier_2_upto_km: v.tier_2_upto_km || 25,
          tier_2_multiplier: v.tier_2_multiplier || '0.9',
          tier_3_upto_km: v.tier_3_upto_km || 60,
          tier_3_multiplier: v.tier_3_multiplier || '0.8',
          tier_4_upto_km: v.tier_4_upto_km || 100,
          tier_4_multiplier: v.tier_4_multiplier || '0.75',
          tier_5_upto_km: v.tier_5_upto_km || 150,
          tier_5_multiplier: v.tier_5_multiplier || '0.7',
          tier_6_upto_km: v.tier_6_upto_km || 200,
          tier_6_multiplier: v.tier_6_multiplier || '0.65',
          tier_7_upto_km: v.tier_7_upto_km || 250,
          tier_7_multiplier: v.tier_7_multiplier || '0.6',
          tier_8_upto_km: v.tier_8_upto_km || 300,
          tier_8_multiplier: v.tier_8_multiplier || '0.55',
          tier_9_upto_km: v.tier_9_upto_km || 350,
          tier_9_multiplier: v.tier_9_multiplier || '0.5',
          tier_10_upto_km: v.tier_10_upto_km || 400,
          tier_10_multiplier: v.tier_10_multiplier || '0.48',
          tier_11_upto_km: v.tier_11_upto_km || 450,
          tier_11_multiplier: v.tier_11_multiplier || '0.45',
          tier_12_multiplier: v.tier_12_multiplier || '0.42',
        }))
        setVehicles(normalizedVehicles)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (vehicleId: number, updatedVehicle: Partial<Vehicle>) => {
    setSaving(vehicleId)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/pricing`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseRate: updatedVehicle.base_rate,
          minimumFare: updatedVehicle.minimum_fare,
          tier1UptoKm: updatedVehicle.tier_1_upto_km,
          tier1Multiplier: updatedVehicle.tier_1_multiplier,
          tier2UptoKm: updatedVehicle.tier_2_upto_km,
          tier2Multiplier: updatedVehicle.tier_2_multiplier,
          tier3UptoKm: updatedVehicle.tier_3_upto_km,
          tier3Multiplier: updatedVehicle.tier_3_multiplier,
          tier4UptoKm: updatedVehicle.tier_4_upto_km,
          tier4Multiplier: updatedVehicle.tier_4_multiplier,
          tier5UptoKm: updatedVehicle.tier_5_upto_km,
          tier5Multiplier: updatedVehicle.tier_5_multiplier,
          tier6UptoKm: updatedVehicle.tier_6_upto_km,
          tier6Multiplier: updatedVehicle.tier_6_multiplier,
          tier7UptoKm: updatedVehicle.tier_7_upto_km,
          tier7Multiplier: updatedVehicle.tier_7_multiplier,
          tier8UptoKm: updatedVehicle.tier_8_upto_km,
          tier8Multiplier: updatedVehicle.tier_8_multiplier,
          tier9UptoKm: updatedVehicle.tier_9_upto_km,
          tier9Multiplier: updatedVehicle.tier_9_multiplier,
          tier10UptoKm: updatedVehicle.tier_10_upto_km,
          tier10Multiplier: updatedVehicle.tier_10_multiplier,
          tier11UptoKm: updatedVehicle.tier_11_upto_km,
          tier11Multiplier: updatedVehicle.tier_11_multiplier,
          tier12Multiplier: updatedVehicle.tier_12_multiplier,
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`${vehicles.find(v => v.id === vehicleId)?.name} pricing updated successfully!`)
        setEditingVehicle(null)
        fetchData()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(data.error)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(null)
    }
  }

  const handleChange = (vehicleId: number, field: string, value: any) => {
    setVehicles(prev =>
      prev.map(vehicle =>
        vehicle.id === vehicleId
          ? { ...vehicle, [field]: value }
          : vehicle
      )
    )
  }

  const handleEdit = (vehicleId: number) => {
    setEditingVehicle(vehicleId)
    setExpandedVehicles(new Set([vehicleId]))
    setError(null)
    setSuccess(null)
  }

  const handleCancelEdit = (vehicleId: number) => {
    setEditingVehicle(null)
    fetchData()
  }

  const toggleExpand = (vehicleId: number) => {
    setExpandedVehicles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(vehicleId)) {
        newSet.delete(vehicleId)
      } else {
        newSet.add(vehicleId)
      }
      return newSet
    })
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || vehicle.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(vehicles.map(v => v.category)))

  const renderTierInput = (vehicle: Vehicle, tierConfig: typeof TIER_CONFIGS[0], isDisabled: boolean) => {
    const tierNum = tierConfig.number
    const prevTier = tierNum > 1 ? (vehicle as any)[`tier_${tierNum - 1}_upto_km`] : 0
    const currentLimit = tierConfig.isLast ? '' : String((vehicle as any)[`tier_${tierNum}_upto_km`] || '')
    const multiplier = String((vehicle as any)[`tier_${tierNum}_multiplier`] || '0')
    
    const bgColor = {
      green: 'bg-green-50 dark:bg-green-950/20 border-green-200',
      yellow: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200',
      orange: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200',
      red: 'bg-red-50 dark:bg-red-950/20 border-red-200',
      purple: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200',
      blue: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200',
      indigo: 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200',
      pink: 'bg-pink-50 dark:bg-pink-950/20 border-pink-200',
      cyan: 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200',
      teal: 'bg-teal-50 dark:bg-teal-950/20 border-teal-200',
      amber: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200',
      rose: 'bg-rose-50 dark:bg-rose-950/20 border-rose-200',
    }[tierConfig.color]

    const textColor = {
      green: 'text-green-900 dark:text-green-100',
      yellow: 'text-yellow-900 dark:text-yellow-100',
      orange: 'text-orange-900 dark:text-orange-100',
      red: 'text-red-900 dark:text-red-100',
      purple: 'text-purple-900 dark:text-purple-100',
      blue: 'text-blue-900 dark:text-blue-100',
      indigo: 'text-indigo-900 dark:text-indigo-100',
      pink: 'text-pink-900 dark:text-pink-100',
      cyan: 'text-cyan-900 dark:text-cyan-100',
      teal: 'text-teal-900 dark:text-teal-100',
      amber: 'text-amber-900 dark:text-amber-100',
      rose: 'text-rose-900 dark:text-rose-100',
    }[tierConfig.color]

    const iconColor = {
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      purple: 'text-purple-600',
      blue: 'text-blue-600',
      indigo: 'text-indigo-600',
      pink: 'text-pink-600',
      cyan: 'text-cyan-600',
      teal: 'text-teal-600',
      amber: 'text-amber-600',
      rose: 'text-rose-600',
    }[tierConfig.color]

    const effectiveRate = parseFloat(vehicle.base_rate || '0') * parseFloat(multiplier || '0')

    return (
      <div key={tierNum} className={`p-3 ${bgColor} border rounded-lg`}>
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown className={`h-4 w-4 ${iconColor}`} />
          <Label className={`text-xs font-bold ${textColor}`}>
            Tier {tierNum} ({prevTier}-{currentLimit || '∞'} km) - {tierConfig.label}
          </Label>
        </div>
        <div className={`grid ${tierConfig.isLast ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
          {!tierConfig.isLast && (
            <Input
              type="number"
              placeholder="Up to KM"
              value={currentLimit}
              onChange={(e) => handleChange(vehicle.id, `tier_${tierNum}_upto_km`, parseInt(e.target.value) || 0)}
              disabled={isDisabled}
            />
          )}
          <Input
            type="number"
            step="0.01"
            placeholder="Multiplier"
            value={multiplier}
            onChange={(e) => handleChange(vehicle.id, `tier_${tierNum}_multiplier`, e.target.value || '0')}
            disabled={isDisabled}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Rate: Rs. {effectiveRate.toFixed(2)}/km
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/taxisrilanka-admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-yellow-500" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Vehicle Pricing Configuration
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredVehicles.length} vehicles • 12-Tier System • Vehicle-Specific Pricing
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={fetchData} variant="outline" className="gap-2">
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label className="text-sm font-semibold mb-2">Search Vehicle</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by vehicle name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-64">
                <Label className="text-sm font-semibold mb-2">Filter by Category</Label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-green-900 dark:text-green-100">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-900 dark:text-red-100">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {filteredVehicles.map((vehicle) => {
              const isEditing = editingVehicle === vehicle.id
              const isDisabled = !isEditing
              const isExpanded = expandedVehicles.has(vehicle.id)

              return (
                <Card key={vehicle.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Car className="h-8 w-8 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-bold text-foreground">{vehicle.name}</h2>
                          <button
                            onClick={() => toggleExpand(vehicle.id)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          >
                            {isExpanded ? (
                              <ChevronUp size={20} className="text-gray-500" />
                            ) : (
                              <ChevronDown size={20} className="text-gray-500" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">
                          {vehicle.category} • ID: {vehicle.id}
                        </p>
                      </div>
                    </div>
                    
                    {!isEditing ? (
                      <Button
                        onClick={() => handleEdit(vehicle.id)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Edit size={14} />
                        Edit
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleCancelEdit(vehicle.id)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <X size={14} />
                        Cancel
                      </Button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                        <div>
                          <Label className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                            Base Rate (Rs/km)
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={vehicle.base_rate || '0'}
                            onChange={(e) => handleChange(vehicle.id, 'base_rate', e.target.value || '0')}
                            className="mt-2"
                            disabled={isDisabled}
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                            Minimum Fare (Rs)
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={vehicle.minimum_fare || '0'}
                            onChange={(e) => handleChange(vehicle.id, 'minimum_fare', e.target.value || '0')}
                            className="mt-2"
                            disabled={isDisabled}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {TIER_CONFIGS.map(tierConfig => 
                          renderTierInput(vehicle, tierConfig, isDisabled)
                        )}
                      </div>

                      {isEditing && (
                        <Button
                          onClick={() => handleUpdate(vehicle.id, vehicle)}
                          disabled={saving === vehicle.id}
                          className="w-full mt-4"
                        >
                          {saving === vehicle.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

          {filteredVehicles.length === 0 && (
            <Card className="p-12 text-center">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-600">No vehicles found</p>
              <p className="text-sm text-gray-500 mt-2">
                Try adjusting your search or filter criteria
              </p>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
