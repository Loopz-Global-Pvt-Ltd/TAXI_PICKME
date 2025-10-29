'use client';

import { Copy, MapPin, Globe, Phone, Star, Clock } from 'lucide-react';
import { PlaceDetails } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface ResultsPanelProps {
  place: PlaceDetails | null;
  isLoading: boolean;
}

export default function ResultsPanel({ place, isLoading }: ResultsPanelProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatTypes = (types?: string[]) => {
    if (!types) return [];
    return types
      .filter(type => !type.includes('establishment') && !type.includes('point_of_interest'))
      .slice(0, 3)
      .map(type => type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!place) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Place Selected</h3>
          <p className="text-gray-600 mb-4">
            Search for a location or click on the map to get place details and Place ID.
          </p>
          <div className="text-sm text-gray-500">
            <p>• Use the search box to find specific places</p>
            <p>• Click anywhere on the map to get location info</p>
            <p>• Get Google Maps Place IDs instantly</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-gray-900 leading-tight">
              {place.name}
            </h2>
            {place.rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">{place.rating}</span>
                <span className="text-sm text-gray-500">rating</span>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Place Types */}
        {place.types && place.types.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Type</h4>
            <div className="flex flex-wrap gap-2">
              {formatTypes(place.types).map((type, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Address */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Address</h4>
          <div className="flex items-start gap-2">
            <p className="text-sm text-gray-900 flex-1">{place.formattedAddress}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(place.formattedAddress, 'address')}
              className="h-6 w-6 p-0"
            >
              <Copy className={`h-3 w-3 ${copiedField === 'address' ? 'text-green-600' : 'text-gray-400'}`} />
            </Button>
          </div>
        </div>

        {/* Place ID */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Place ID</h4>
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
            <code className="text-xs text-gray-800 flex-1 font-mono break-all">
              {place.placeId}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(place.placeId, 'placeId')}
              className="h-6 w-6 p-0 flex-shrink-0"
            >
              <Copy className={`h-3 w-3 ${copiedField === 'placeId' ? 'text-green-600' : 'text-gray-400'}`} />
            </Button>
          </div>
          {copiedField === 'placeId' && (
            <p className="text-xs text-green-600 mt-1">Place ID copied to clipboard!</p>
          )}
        </div>

        {/* Coordinates */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Coordinates</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Latitude</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(place.location.lat.toString(), 'lat')}
                  className="h-4 w-4 p-0"
                >
                  <Copy className={`h-2 w-2 ${copiedField === 'lat' ? 'text-green-600' : 'text-gray-400'}`} />
                </Button>
              </div>
              <p className="text-sm font-mono text-gray-900">
                {place.location.lat.toFixed(6)}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Longitude</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(place.location.lng.toString(), 'lng')}
                  className="h-4 w-4 p-0"
                >
                  <Copy className={`h-2 w-2 ${copiedField === 'lng' ? 'text-green-600' : 'text-gray-400'}`} />
                </Button>
              </div>
              <p className="text-sm font-mono text-gray-900">
                {place.location.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {(place.website || place.phoneNumber) && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
            <div className="space-y-2">
              {place.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline truncate"
                  >
                    Website
                  </a>
                </div>
              )}
              {place.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a
                    href={`tel:${place.phoneNumber}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {place.phoneNumber}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(
                `${place.name}\n${place.formattedAddress}\nPlace ID: ${place.placeId}`,
                'all'
              )}
              className="justify-start"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copiedField === 'all' ? 'Copied All Info!' : 'Copy All Information'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}