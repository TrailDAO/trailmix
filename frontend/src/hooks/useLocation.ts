import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

interface LocationState {
  latitude: number;
  longitude: number;
}

interface UseLocationReturn {
  location: LocationState | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      if (Platform.OS === 'web') {
        // Web geolocation
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by this browser');
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        });

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } else {
        // React Native geolocation (requires expo-location or similar)
        // For now, we'll use a placeholder implementation
        // In a real app, you'd import and use expo-location here
        console.warn('Native geolocation requires expo-location package');
        
        // Placeholder location (San Francisco)
        setLocation({
          latitude: 37.78825,
          longitude: -122.4324,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      console.error('Location error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically request location on mount
    requestLocation();
  }, []);

  return {
    location,
    loading,
    error,
    requestLocation,
  };
} 