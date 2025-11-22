'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useGameStore } from '@/store/useGameStore';

const TARGET_LAT = 49.89807685939328;
const TARGET_LON = -97.13486238510536;

type LocationData = {
  latitude: number;
  longitude: number;
  distance: number;
  direction: string;
  compassDegrees: number;
};

export default function Locator() {
  const router = useRouter();
  const { isAuthenticated, allChallengesComplete } = useGameStore();

  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Redirect to login if not authenticated or challenges not complete
  useEffect(() => {
    if (!isAuthenticated || !allChallengesComplete()) {
      router.push('/');
    }
  }, [isAuthenticated, allChallengesComplete, router]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your device');
      return;
    }

    setLoading(true);
    setError('');
    setPermissionDenied(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const data = calculateLocationData(latitude, longitude);
        setLocationData(data);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          setPermissionDenied(true);
          setError('Location permission denied. Please enable location access.');
        } else if (err.code === 2) {
          setError('Location unavailable. Please check your device settings.');
        } else if (err.code === 3) {
          setError('Location request timed out. Please try again.');
        } else {
          setError('Unable to retrieve location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const calculateLocationData = (lat: number, lon: number): LocationData => {
    // Calculate distance using Haversine formula
    const distance = calculateDistance(lat, lon, TARGET_LAT, TARGET_LON);

    // Calculate bearing/direction
    const bearing = calculateBearing(lat, lon, TARGET_LAT, TARGET_LON);
    const direction = getDirectionFromBearing(bearing);

    return {
      latitude: lat,
      longitude: lon,
      distance,
      direction,
      compassDegrees: bearing
    };
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLon = toRadians(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(toRadians(lat2));
    const x =
      Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
      Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);

    let bearing = toDegrees(Math.atan2(y, x));
    bearing = (bearing + 360) % 360; // Normalize to 0-360

    return bearing;
  };

  const getDirectionFromBearing = (bearing: number): string => {
    const directions = [
      'N', 'NNE', 'NE', 'ENE',
      'E', 'ESE', 'SE', 'SSE',
      'S', 'SSW', 'SW', 'WSW',
      'W', 'WNW', 'NW', 'NNW'
    ];

    const index = Math.round(bearing / 22.5) % 16;
    return directions[index];
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const toDegrees = (radians: number): number => {
    return radians * (180 / Math.PI);
  };

  const formatDistance = (km: number): string => {
    if (km < 1) {
      return `${Math.round(km * 1000)} meters`;
    } else if (km < 10) {
      return `${km.toFixed(2)} km`;
    } else {
      return `${km.toFixed(1)} km`;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Target Locator</h1>
        <p className={styles.instructions}>
          Determine your distance and direction from the target coordinates.
        </p>


        {!locationData && !loading && (
          <button className={styles.locateButton} onClick={requestLocation}>
            {permissionDenied ? 'Retry Location Request' : 'Get My Location'}
          </button>
        )}

        {loading && (
          <div className={styles.loading}>
            <div className={styles.loadingText}>Acquiring coordinates...</div>
            <div className={styles.spinner}>
              <div className={styles.spinnerBar}></div>
            </div>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <div className={styles.errorIcon}>⚠</div>
            <div className={styles.errorText}>{error}</div>
            <button className={styles.retryButton} onClick={requestLocation}>
              Try Again
            </button>
          </div>
        )}

        {locationData && !loading && (
          <div className={styles.results}>
            <div className={styles.resultsHeader}>Location Acquired</div>

            <div className={styles.currentLocation}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Your Latitude:</span>
                <span className={styles.value}>{locationData.latitude.toFixed(6)}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Your Longitude:</span>
                <span className={styles.value}>{locationData.longitude.toFixed(6)}</span>
              </div>
            </div>

            <div className={styles.divider}>{'═'.repeat(30)}</div>

            <div className={styles.distanceDisplay}>
              <div className={styles.distanceLabel}>Distance to Target</div>
              <div className={styles.distanceValue}>
                {formatDistance(locationData.distance)}
              </div>
            </div>

            <div className={styles.directionDisplay}>
              <div className={styles.directionLabel}>Direction</div>
              <div className={styles.compass}>
                <div
                  className={styles.compassArrow}
                  style={{ transform: `rotate(${locationData.compassDegrees}deg)` }}
                >
                  ↑
                </div>
              </div>
              <div className={styles.directionValue}>
                {locationData.direction}
              </div>
            </div>

            <button className={styles.updateButton} onClick={requestLocation}>
              Update Location
            </button>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.footerText}>
            Location services must be enabled
          </div>
        </div>
      </div>
    </div>
  );
}
