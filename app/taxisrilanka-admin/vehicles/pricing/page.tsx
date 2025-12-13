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
  X
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
  tier_4_multiplier: string
  use_category_pricing: boolean
  price_per_km: string
}

interface CategoryPricing {
  vehicle_category: string
  base_rate: string
  minimum_fare: string
  tier_1_upto_km: number
  tier_1_multiplier: string
  tier_2_upto_km: number
  tier_2_multiplier: string
  tier_3_upto_km: number
  tier_3_multiplier: string
  tier_4_multiplier: string
}

export default function VehiclePricingManagementPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [categoryPricing, setCategoryPricing] = useState<Record<string, CategoryPricing>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [editingVehicle, setEditingVehicle] = useState<number | null>(null)
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
      
      const pricingResponse = await fetch('/api/admin/pricing')
      const pricingData = await pricingResponse.json()
      
      if (vehiclesData.success) {
        setVehicles(vehiclesData.data)
      }
      
      if (pricingData.success) {
        const pricingMap: Record<string, CategoryPricing> = {}
        pricingData.data.forEach((config: any) => {
          pricingMap[config.vehicle_category] = config
        })
        setCategoryPricing(pricingMap)
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
          tier4Multiplier: updatedVehicle.tier_4_multiplier,
          useCategoryPricing: updatedVehicle.use_category_pricing
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
    setError(null)
    setSuccess(null)
  }

  const handleCancelEdit = (vehicleId: number) => {
    setEditingVehicle(null)
    fetchData() // Reset to original values
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || vehicle.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(vehicles.map(v => v.category)))

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
                    {filteredVehicles.length} vehicles
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
          
          {/* Filters */}
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

          {/* Vehicle Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredVehicles.map((vehicle) => {
              const isEditing = editingVehicle === vehicle.id
              const isDisabled = !isEditing

              return (
                <Card key={vehicle.id} className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-start gap-3">
                      <Car className="h-8 w-8 text-primary mt-1" />
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{vehicle.name}</h2>
                        <p className="text-sm text-muted-foreground capitalize">
                          {vehicle.category} • ID: {vehicle.id}
                        </p>
                      </div>
                    </div>
                    
                    {/* Edit/Cancel Button */}
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

                  <div className="space-y-4">
                    {/* Use Category Pricing Toggle - Only editable when editing */}
                    {/* <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <input
                        type="checkbox"
                        id={`category-${vehicle.id}`}
                        checked={vehicle.use_category_pricing}
                        onChange={(e) => handleChange(vehicle.id, 'use_category_pricing', e.target.checked)}
                        className="w-4 h-4"
                        disabled={isDisabled}
                      />
                      <Label 
                        htmlFor={`category-${vehicle.id}`} 
                        className={`text-sm ${isDisabled ? 'cursor-default text-muted-foreground' : 'cursor-pointer'}`}
                      >
                        Use category default pricing
                      </Label>
                    </div> */}

                    {/* Base Settings */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div>
                        <Label className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                          Base Rate (Rs/km)
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={vehicle.base_rate}
                          onChange={(e) => handleChange(vehicle.id, 'base_rate', e.target.value)}
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
                          value={vehicle.minimum_fare}
                          onChange={(e) => handleChange(vehicle.id, 'minimum_fare', e.target.value)}
                          className="mt-2"
                          disabled={isDisabled}
                        />
                      </div>
                    </div>

                    {/* Tier 1 */}
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <Label className="text-xs font-bold text-green-900 dark:text-green-100">
                          Tier 1 (0-{vehicle.tier_1_upto_km} km)
                        </Label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Up to KM"
                          value={vehicle.tier_1_upto_km}
                          onChange={(e) => handleChange(vehicle.id, 'tier_1_upto_km', parseInt(e.target.value))}
                          disabled={isDisabled}
                        />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Multiplier"
                          value={vehicle.tier_1_multiplier}
                          onChange={(e) => handleChange(vehicle.id, 'tier_1_multiplier', e.target.value)}
                          disabled={isDisabled}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rate: Rs. {(parseFloat(vehicle.base_rate) * parseFloat(vehicle.tier_1_multiplier)).toFixed(2)}/km
                      </p>
                    </div>

                    {/* Tier 2 */}
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-yellow-600" />
                        <Label className="text-xs font-bold text-yellow-900 dark:text-yellow-100">
                          Tier 2 ({vehicle.tier_1_upto_km}-{vehicle.tier_2_upto_km} km)
                        </Label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Up to KM"
                          value={vehicle.tier_2_upto_km}
                          onChange={(e) => handleChange(vehicle.id, 'tier_2_upto_km', parseInt(e.target.value))}
                          disabled={isDisabled}
                        />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Multiplier"
                          value={vehicle.tier_2_multiplier}
                          onChange={(e) => handleChange(vehicle.id, 'tier_2_multiplier', e.target.value)}
                          disabled={isDisabled}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rate: Rs. {(parseFloat(vehicle.base_rate) * parseFloat(vehicle.tier_2_multiplier)).toFixed(2)}/km
                        {' '}({((1 - parseFloat(vehicle.tier_2_multiplier)) * 100).toFixed(0)}% discount)
                      </p>
                    </div>

                    {/* Tier 3 */}
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-orange-600" />
                        <Label className="text-xs font-bold text-orange-900 dark:text-orange-100">
                          Tier 3 ({vehicle.tier_2_upto_km}-{vehicle.tier_3_upto_km} km)
                        </Label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Up to KM"
                          value={vehicle.tier_3_upto_km}
                          onChange={(e) => handleChange(vehicle.id, 'tier_3_upto_km', parseInt(e.target.value))}
                          disabled={isDisabled}
                        />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Multiplier"
                          value={vehicle.tier_3_multiplier}
                          onChange={(e) => handleChange(vehicle.id, 'tier_3_multiplier', e.target.value)}
                          disabled={isDisabled}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rate: Rs. {(parseFloat(vehicle.base_rate) * parseFloat(vehicle.tier_3_multiplier)).toFixed(2)}/km
                        {' '}({((1 - parseFloat(vehicle.tier_3_multiplier)) * 100).toFixed(0)}% discount)
                      </p>
                    </div>

                    {/* Tier 4 */}
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <Label className="text-xs font-bold text-red-900 dark:text-red-100">
                          Tier 4 ({vehicle.tier_3_upto_km}+ km)
                        </Label>
                      </div>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Multiplier"
                        value={vehicle.tier_4_multiplier}
                        onChange={(e) => handleChange(vehicle.id, 'tier_4_multiplier', e.target.value)}
                        disabled={isDisabled}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Rate: Rs. {(parseFloat(vehicle.base_rate) * parseFloat(vehicle.tier_4_multiplier)).toFixed(2)}/km
                        {' '}({((1 - parseFloat(vehicle.tier_4_multiplier)) * 100).toFixed(0)}% discount)
                      </p>
                    </div>

                    {/* Save Button - Only show when editing */}
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
