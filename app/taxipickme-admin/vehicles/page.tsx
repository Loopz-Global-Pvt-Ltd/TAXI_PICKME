"use client" 

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Loader2,
  Car,
  Users,
  Briefcase,
  Star,
  Check,
  X,
  Fuel,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import CreateVehicleModal from '@/components/admin/CreateVehicleModal'

interface Vehicle {
    id: number
    name: string
    category: string
    base_price: number
    price_per_km: number
    seats: number
    luggage: number
    image: string
    features: string[]
    description: string
    rating: number
    reviews: number
    is_available: boolean
    fuel_type: string
    transmission: string
  }

export default function VehiclesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAdmin()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/taxipickme-admin')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchVehicles()
    }
  }, [isAuthenticated, filterCategory])

  const fetchVehicles = async () => {
    try {
      const url = filterCategory === 'all' 
        ? '/api/admin/vehicles'
        : `/api/admin/vehicles?category=${filterCategory}`
      
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        // Convert string values to numbers
        const vehicles = data.data.map((v: any) => ({
          ...v,
          base_price: Number(v.base_price),
          price_per_km: Number(v.price_per_km),
          rating: Number(v.rating)
        }))
        setVehicles(vehicles)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setIsLoadingVehicles(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return

    try {
      const response = await fetch(`/api/admin/vehicles/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        fetchVehicles()
      } else {
        alert('Failed to delete vehicle')
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      alert('Error deleting vehicle')
    }
  }

  const handleToggleAvailable = async (vehicle: Vehicle) => {
    try {
      const response = await fetch(`/api/admin/vehicles/${vehicle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !vehicle.is_available }),
      })
      const data = await response.json()
      if (data.success) {
        fetchVehicles()
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
    }
  }

  if (isLoading || isLoadingVehicles) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/taxipickme-admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Car className="h-8 w-8 text-yellow-500" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
                  <p className="text-sm text-gray-600">{vehicles.length} vehicles total</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                setSelectedVehicle(null)
                setShowCreateModal(true)
              }}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2">
          {['all', 'economy', 'standard', 'luxury', 'van'].map((category) => (
            <Button
              key={category}
              onClick={() => setFilterCategory(category)}
              variant={filterCategory === category ? 'default' : 'outline'}
              size="sm"
              className={filterCategory === category ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {vehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first vehicle</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Vehicle
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Vehicle Image */}
                <div className="h-48 bg-gray-200 relative">
                  {vehicle.image ? (
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Car className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded ${
                      vehicle.is_available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {vehicle.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {/* Vehicle Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{vehicle.name}</h3>
                    <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded capitalize">
                      {vehicle.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{vehicle.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{vehicle.seats} seats</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span>{vehicle.luggage} bags</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="h-4 w-4 text-gray-400" />
                      <span className="capitalize">{vehicle.fuel_type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Settings className="h-4 w-4 text-gray-400" />
                      <span className="capitalize">{vehicle.transmission}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{Number(vehicle.rating).toFixed(1)}</span>
                    <span className="text-sm text-gray-600">({vehicle.reviews} reviews)</span>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        LKR {vehicle.price_per_km.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-600">/km</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 bg-blue-50 border border-blue-200 rounded px-2 py-1">
                      Total = {vehicle.price_per_km.toFixed(2)} × Distance (km)
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-gray-50 border-t flex items-center gap-2">
                  <Button
                    onClick={() => handleToggleAvailable(vehicle)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    {vehicle.is_available ? (
                      <>
                        <X className="h-3 w-3 mr-1" />
                        Disable
                      </>
                    ) : (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Enable
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedVehicle(vehicle)
                      setShowCreateModal(true)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(vehicle.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Vehicle Modal */}
      {showCreateModal && (
        <CreateVehicleModal
          vehicle={selectedVehicle}
          onClose={() => {
            setShowCreateModal(false)
            setSelectedVehicle(null)
          }}
          onSuccess={() => {
            fetchVehicles()
            setShowCreateModal(false)
            setSelectedVehicle(null)
          }}
        />
      )}
    </div>
  )
}
