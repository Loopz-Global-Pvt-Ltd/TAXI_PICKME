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
  Package,
  Users,
  Clock,
  DollarSign,
  Check,
  X
} from 'lucide-react'
import Link from 'next/link'
import CreatePackageModal from '@/components/admin/CreatePackageModal'

interface TaxiPackage {
  id: number
  package_name: string
  package_code: string
  description: string
  category: string
  base_price: number
  price_per_km: number
  included_km: number
  max_passengers: number
  duration_hours: number
  features: string[]
  popular: boolean
  is_active: boolean
  image: string
  created_at: string
}

export default function PackagesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAdmin()
  const [packages, setPackages] = useState<TaxiPackage[]>([])
  const [isLoadingPackages, setIsLoadingPackages] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<TaxiPackage | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/taxipickme-admin')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchPackages()
    }
  }, [isAuthenticated])

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/packages')
      const data = await response.json()
      if (data.success) {
        setPackages(data.data)
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setIsLoadingPackages(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this package?')) return

    try {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        fetchPackages()
      } else {
        alert('Failed to delete package')
      }
    } catch (error) {
      console.error('Error deleting package:', error)
      alert('Error deleting package')
    }
  }

  const handleToggleActive = async (pkg: TaxiPackage) => {
    try {
      const response = await fetch(`/api/admin/packages/${pkg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !pkg.is_active }),
      })
      const data = await response.json()
      if (data.success) {
        fetchPackages()
      }
    } catch (error) {
      console.error('Error updating package:', error)
    }
  }

  if (isLoading || isLoadingPackages) {
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
                <Package className="h-8 w-8 text-yellow-500" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Taxi Packages</h1>
                  <p className="text-sm text-gray-600">{packages.length} packages total</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                setSelectedPackage(null)
                setShowCreateModal(true)
              }}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Package
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {packages.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first taxi package</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Package
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Package Header */}
                <div className="p-4 bg-gradient-to-r from-yellow-500 to-yellow-600">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {pkg.package_name}
                      </h3>
                      <p className="text-xs text-yellow-100">{pkg.package_code}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        pkg.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Package Body */}
                <div className="p-4 space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-2xl font-bold text-gray-900">
                        LKR {Number(pkg.base_price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{pkg.max_passengers} passengers</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{pkg.duration_hours} hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{pkg.included_km} km</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-2">Category</p>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded capitalize">
                      {pkg.category}
                    </span>
                  </div>
                </div>

                {/* Package Actions */}
                <div className="p-4 bg-gray-50 border-t flex items-center justify-between gap-2">
                  <Button
                    onClick={() => handleToggleActive(pkg)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    {pkg.is_active ? (
                      <>
                        <X className="h-3 w-3 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedPackage(pkg)
                      setShowCreateModal(true)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(pkg.id)}
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

      {/* Create/Edit Package Modal */}
      {showCreateModal && (
        <CreatePackageModal
          package={selectedPackage}
          onClose={() => {
            setShowCreateModal(false)
            setSelectedPackage(null)
          }}
          onSuccess={() => {
            fetchPackages()
            setShowCreateModal(false)
            setSelectedPackage(null)
          }}
        />
      )}
    </div>
  )
}
