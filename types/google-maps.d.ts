declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps {
  interface MapMouseEvent {
    latLng: LatLng | null;
  }
}

export {};