// lib/utils/distance.ts
export interface DistanceResult {
    distanceKm: number
    distanceText: string
    durationMinutes: number
    durationText: string
  }
  
  export async function calculateDistance(
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number
  ): Promise<DistanceResult | null> {
    if (!window.google?.maps) {
      console.error('Google Maps not loaded')
      return null
    }
  
    const service = new google.maps.DistanceMatrixService()
  
    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(
        {
          origins: [{ lat: pickupLat, lng: pickupLng }],
          destinations: [{ lat: dropoffLat, lng: dropoffLng }],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status === 'OK' && response?.rows[0]?.elements[0]) {
            const element = response.rows[0].elements[0]
            
            if (element.status === 'OK') {
              resolve({
                distanceKm: element.distance.value / 1000, // Convert meters to km
                distanceText: element.distance.text,
                durationMinutes: element.duration.value / 60, // Convert seconds to minutes
                durationText: element.duration.text,
              })
            } else {
              reject(new Error('Route not found'))
            }
          } else {
            reject(new Error(`Distance Matrix API error: ${status}`))
          }
        }
      )
    })
  }