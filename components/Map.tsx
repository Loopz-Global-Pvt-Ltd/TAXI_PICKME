'use client';

import { useEffect, useRef, useState } from 'react';
import { PlaceDetails } from '@/app/page';
import { getPlaceDetails } from '@/lib/mapsUtils';

interface MapProps {
  center: { lat: number; lng: number };
  onPlaceSelect: (place: PlaceDetails) => void;
  searchQuery: string;
  selectedPlace: PlaceDetails | null;
}

export default function Map({ center, onPlaceSelect, searchQuery, selectedPlace }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 12,
      styles: [
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    mapInstanceRef.current = map;
    infoWindowRef.current = new window.google.maps.InfoWindow();

    // Add click listener to map
    map.addListener('click', async (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        try {
          const place = await getPlaceDetails({ lat, lng });
          if (place) {
            onPlaceSelect(place);
            addMarker({ lat, lng }, place);
          }
        } catch (error) {
          console.error('Error getting place details:', error);
        }
      }
    });

    setIsMapLoaded(true);
  }, [center, onPlaceSelect]);

  // Handle search query changes
  useEffect(() => {
    if (!searchQuery || !mapInstanceRef.current || !window.google) return;

    const placesService = new window.google.maps.places.PlacesService(mapInstanceRef.current);
    
    // Check if searchQuery is a place_id or a text query
    if (searchQuery.startsWith('ChIJ') || searchQuery.startsWith('Ei') || searchQuery.startsWith('Gs')) {
      // It's likely a place_id
      placesService.getDetails(
        { placeId: searchQuery },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            handlePlaceResult(place);
          }
        }
      );
    } else {
      // It's a text search
      placesService.textSearch(
        { query: searchQuery },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
            handlePlaceResult(results[0]);
          }
        }
      );
    }
  }, [searchQuery, onPlaceSelect]);

  const handlePlaceResult = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location || !place.place_id) return;

    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };

    const placeDetails: PlaceDetails = {
      placeId: place.place_id,
      name: place.name || 'Unknown Place',
      formattedAddress: place.formatted_address || 'Address not available',
      location,
      types: place.types,
      rating: place.rating,
      website: place.website,
      phoneNumber: place.formatted_phone_number
    };

    onPlaceSelect(placeDetails);
    addMarker(location, placeDetails);
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(location);
      mapInstanceRef.current.setZoom(16);
    }
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  const addMarker = (position: { lat: number; lng: number }, place: PlaceDetails) => {
    if (!mapInstanceRef.current) return;

    clearMarkers();

    const marker = new window.google.maps.Marker({
      position,
      map: mapInstanceRef.current,
      title: place.name,
      animation: window.google.maps.Animation.DROP,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4C11.6 4 8 7.6 8 12C8 18 16 28 16 28S24 18 24 12C24 7.6 20.4 4 16 4ZM16 15C14.3 15 13 13.7 13 12S14.3 9 16 9S19 10.3 19 12S17.7 15 16 15Z" fill="#3B82F6"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32),
        anchor: new window.google.maps.Point(16, 32)
      }
    });

    markersRef.current.push(marker);

    // Add click listener to marker
    marker.addListener('click', () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.setContent(`
          <div class="p-3 max-w-xs">
            <h3 class="font-semibold text-gray-900 mb-1">${place.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${place.formattedAddress}</p>
            <p class="text-xs text-gray-500">Place ID: ${place.placeId}</p>
          </div>
        `);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      }
    });
  };

  // Update marker when selected place changes
  useEffect(() => {
    if (selectedPlace && mapInstanceRef.current) {
      addMarker(selectedPlace.location, selectedPlace);
      mapInstanceRef.current.setCenter(selectedPlace.location);
    }
  }, [selectedPlace]);

  if (!isMapLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
}