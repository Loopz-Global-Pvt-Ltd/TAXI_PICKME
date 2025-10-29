export interface PlaceDetails {
  placeId: string;
  name: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  types?: string[];
  rating?: number;
  website?: string;
  phoneNumber?: string;
}

export const getPlaceDetails = async (
  location: { lat: number; lng: number }
): Promise<PlaceDetails | null> => {
  return new Promise((resolve) => {
    if (!window.google) {
      resolve(null);
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode(
      { location: { lat: location.lat, lng: location.lng } },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const result = results[0];
          
          const placeDetails: PlaceDetails = {
            placeId: result.place_id,
            name: result.formatted_address.split(',')[0] || 'Unknown Location',
            formattedAddress: result.formatted_address,
            location,
            types: result.types
          };

          // Try to get more detailed information using PlacesService
          const map = new window.google.maps.Map(document.createElement('div'));
          const service = new window.google.maps.places.PlacesService(map);
          
          service.getDetails(
            { placeId: result.place_id },
            (place, detailStatus) => {
              if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK && place) {
                placeDetails.name = place.name || placeDetails.name;
                placeDetails.rating = place.rating;
                placeDetails.website = place.website;
                placeDetails.phoneNumber = place.formatted_phone_number;
              }
              resolve(placeDetails);
            }
          );
        } else {
          resolve(null);
        }
      }
    );
  });
};

export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    
    document.head.appendChild(script);
  });
};