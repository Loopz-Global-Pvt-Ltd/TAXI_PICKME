"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  AlertCircle,
  CheckCircle,
  Loader2,
  Save, 
  RefreshCw ,
   Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Car,
  Users,
  Briefcase,
  Star,
  Check,
  X,
  Fuel,
  Settings, DollarSign} from "lucide-react"
import Link from 'next/link'

interface PricingConfig {
  id: number
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
  is_active: boolean
}

export default function AdminPricingPage() {
  const [configs, setConfigs] = useState<PricingConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/admin/pricing')
      const data = await response.json()
      
      if (data.success) {
        setConfigs(data.data)
      } else {
        setError(data.error)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (category: string, updatedConfig: Partial<PricingConfig>) => {
    setSaving(category)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/admin/pricing/${category}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseRate: updatedConfig.base_rate,
          minimumFare: updatedConfig.minimum_fare,
          tier1UptoKm: updatedConfig.tier_1_upto_km,
          tier1Multiplier: updatedConfig.tier_1_multiplier,
          tier2UptoKm: updatedConfig.tier_2_upto_km,
          tier2Multiplier: updatedConfig.tier_2_multiplier,
          tier3UptoKm: updatedConfig.tier_3_upto_km,
          tier3Multiplier: updatedConfig.tier_3_multiplier,
          tier4Multiplier: updatedConfig.tier_4_multiplier,
          isActive: updatedConfig.is_active
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`${category} pricing updated successfully!`)
        fetchConfigs()
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

  const handleChange = (category: string, field: string, value: any) => {
    setConfigs(prev =>
      prev.map(config =>
        config.vehicle_category === category
          ? { ...config, [field]: value }
          : config
      )
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
    <><header className="bg-white dark:bg-gray-800 shadow-sm border-b">
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pricing Configuration</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{configs.length} pricing configurations</p>
              </div>
            </div>
          </div>
          <Button onClick={fetchConfigs} variant="outline" className="gap-2">
            <RefreshCw size={16} />
            Refresh
          </Button>
        </div>
      </div>
    </header><div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Pricing Configuration</h1>
              <p className="text-muted-foreground mt-2">Manage vehicle category pricing and tier rates</p>
            </div>
            <Button onClick={fetchConfigs} variant="outline" className="gap-2">
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {configs.map((config) => (
              <Card key={config.id} className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground capitalize">{config.vehicle_category}</h2>
                    <p className="text-sm text-muted-foreground">Category ID: {config.id}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${config.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {config.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Base Rate */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">Base Rate (Rs/km)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={config.base_rate}
                        onChange={(e) => handleChange(config.vehicle_category, 'base_rate', e.target.value)}
                        className="mt-2" />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Minimum Fare (Rs)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={config.minimum_fare}
                        onChange={(e) => handleChange(config.vehicle_category, 'minimum_fare', e.target.value)}
                        className="mt-2" />
                    </div>
                  </div>

                  {/* Tier 1 */}
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <Label className="text-xs font-bold text-primary">Tier 1 (0-{config.tier_1_upto_km} km)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        type="number"
                        placeholder="Up to KM"
                        value={config.tier_1_upto_km}
                        onChange={(e) => handleChange(config.vehicle_category, 'tier_1_upto_km', parseInt(e.target.value))} />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Multiplier"
                        value={config.tier_1_multiplier}
                        onChange={(e) => handleChange(config.vehicle_category, 'tier_1_multiplier', e.target.value)} />
                    </div>
                  </div>

                  {/* Tier 2 */}
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <Label className="text-xs font-bold text-primary">Tier 2 ({config.tier_1_upto_km}-{config.tier_2_upto_km} km)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        type="number"
                        placeholder="Up to KM"
                        value={config.tier_2_upto_km}
                        onChange={(e) => handleChange(config.vehicle_category, 'tier_2_upto_km', parseInt(e.target.value))} />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Multiplier"
                        value={config.tier_2_multiplier}
                        onChange={(e) => handleChange(config.vehicle_category, 'tier_2_multiplier', e.target.value)} />
                    </div>
                  </div>

                  {/* Tier 3 */}
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <Label className="text-xs font-bold text-primary">Tier 3 ({config.tier_2_upto_km}-{config.tier_3_upto_km} km)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        type="number"
                        placeholder="Up to KM"
                        value={config.tier_3_upto_km}
                        onChange={(e) => handleChange(config.vehicle_category, 'tier_3_upto_km', parseInt(e.target.value))} />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Multiplier"
                        value={config.tier_3_multiplier}
                        onChange={(e) => handleChange(config.vehicle_category, 'tier_3_multiplier', e.target.value)} />
                    </div>
                  </div>

                  {/* Tier 4 */}
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <Label className="text-xs font-bold text-primary">Tier 4 ({config.tier_3_upto_km}+ km)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Multiplier"
                      value={config.tier_4_multiplier}
                      onChange={(e) => handleChange(config.vehicle_category, 'tier_4_multiplier', e.target.value)}
                      className="mt-2" />
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id={`active-${config.id}`}
                      checked={config.is_active}
                      onChange={(e) => handleChange(config.vehicle_category, 'is_active', e.target.checked)}
                      className="w-4 h-4" />
                    <Label htmlFor={`active-${config.id}`} className="text-sm cursor-pointer">
                      Active Configuration
                    </Label>
                  </div>

                  {/* Save Button */}
                  <Button
                    onClick={() => handleUpdate(config.vehicle_category, config)}
                    disabled={saving === config.vehicle_category}
                    className="w-full mt-4"
                  >
                    {saving === config.vehicle_category ? (
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
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div></>
  )
}
