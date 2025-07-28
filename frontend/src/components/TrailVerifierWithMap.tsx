import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTrailNFCVerifier } from '../hooks';
import { TrailNFCVerifierUI } from './TrailNFCVerifierUI';
import { TrailMap } from './TrailMap';
import { useLocation } from '../hooks/useLocation';
import getAllTrails from '../utils/getAllTrails';
import { Trail } from '../types';

function TrailVerifierWithMap() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loadingTrails, setLoadingTrails] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [showMap, setShowMap] = useState(true);

  const { location, loading: locationLoading, error: locationError, requestLocation } = useLocation();

  // Custom NFC scan handler for React Native
  const customNFCScanHandler = async () => {
    Alert.alert(
      "NFC Scan",
      "NFC scanning would be implemented with react-native-nfc-manager. For now, please enter the trail code manually."
    );
  };

  const {
    nfcInput,
    setNfcInput,
    isScanning,
    isPending,
    errorMsg,
    successMsg,
    handleNFCScan,
    claimTrailReward,
  } = useTrailNFCVerifier(customNFCScanHandler);

  // Fetch trails when location is available
  useEffect(() => {
    if (location && !loadingTrails) {
      fetchNearbyTrails();
    }
  }, [location]);

  const fetchNearbyTrails = async () => {
    if (!location) return;

    setLoadingTrails(true);
    try {
      const nearbyTrails = await getAllTrails(location.latitude, location.longitude);
      setTrails(nearbyTrails);
    } catch (error) {
      console.error('Error fetching trails:', error);
      Alert.alert('Error', 'Failed to fetch nearby trails');
    } finally {
      setLoadingTrails(false);
    }
  };

  const handleTrailPress = (trail: Trail) => {
    setSelectedTrail(trail);
    setNfcInput(trail.address);
    Alert.alert(
      'Trail Selected',
      `Selected: ${trail.address}\nYou can now claim rewards for this trail.`,
      [{ text: 'OK' }]
    );
  };

  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>🏞️ Trail Explorer</Text>
        <Text style={styles.subtitle}>Find nearby trails and claim rewards</Text>
      </View>

      {/* Map Toggle Button */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleMapView}>
        <Text style={styles.toggleButtonText}>
          {showMap ? '📋 Hide Map' : '🗺️ Show Map'}
        </Text>
      </TouchableOpacity>

      {/* Location Status */}
      <View style={styles.locationStatus}>
        {locationLoading && <Text style={styles.statusText}>📍 Getting your location...</Text>}
        {locationError && (
          <View>
            <Text style={styles.errorText}>❌ {locationError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={requestLocation}>
              <Text style={styles.retryButtonText}>🔄 Retry Location</Text>
            </TouchableOpacity>
          </View>
        )}
        {location && (
          <Text style={styles.statusText}>
            📍 Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        )}
      </View>

      {/* Map Section */}
      {showMap && (
        <View style={styles.mapSection}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>🗺️ Nearby Trails</Text>
            {loadingTrails && <Text style={styles.loadingText}>Loading trails...</Text>}
            {!loadingTrails && (
              <Text style={styles.trailCount}>
                {trails.length} trail{trails.length !== 1 ? 's' : ''} found
              </Text>
            )}
          </View>
          
          {location ? (
            <TrailMap
              userLocation={location}
              trails={trails}
              onTrailPress={handleTrailPress}
            />
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text style={styles.placeholderText}>
                📍 Enable location to see nearby trails
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Selected Trail Info */}
      {selectedTrail && (
        <View style={styles.selectedTrailSection}>
          <Text style={styles.selectedTrailTitle}>🎯 Selected Trail</Text>
          <Text style={styles.selectedTrailInfo}>
            {selectedTrail.address}
          </Text>
          <Text style={styles.selectedTrailCoords}>
            📍 {parseFloat(selectedTrail.latitude).toFixed(4)}, {parseFloat(selectedTrail.longitude).toFixed(4)}
          </Text>
        </View>
      )}

      {/* Trail List */}
      {!showMap && trails.length > 0 && (
        <View style={styles.trailListSection}>
          <Text style={styles.sectionTitle}>📋 Nearby Trails</Text>
          {trails.slice(0, 5).map((trail, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.trailItem,
                selectedTrail?.address === trail.address && styles.selectedTrailItem
              ]}
              onPress={() => handleTrailPress(trail)}
            >
              <Text style={styles.trailName}>{trail.address}</Text>
              <Text style={styles.trailCoords}>
                📍 {parseFloat(trail.latitude).toFixed(4)}, {parseFloat(trail.longitude).toFixed(4)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* NFC Verifier Section */}
      <View style={styles.verifierSection}>
        <TrailNFCVerifierUI
          nfcInput={nfcInput}
          setNfcInput={setNfcInput}
          isScanning={isScanning}
          isPending={isPending}
          errorMsg={errorMsg}
          successMsg={successMsg}
          onNFCScan={handleNFCScan}
          onClaimReward={claimTrailReward}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#28342e',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
  },
  toggleButton: {
    backgroundColor: '#3498db',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  locationStatus: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#3a4a44',
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  mapSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingText: {
    color: '#a0a0a0',
    fontSize: 14,
  },
  trailCount: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#3a4a44',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#a0a0a0',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedTrailSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#22c55e',
    borderRadius: 8,
  },
  selectedTrailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  selectedTrailInfo: {
    fontSize: 14,
    color: 'white',
    marginBottom: 3,
  },
  selectedTrailCoords: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  trailListSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  trailItem: {
    backgroundColor: '#3a4a44',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedTrailItem: {
    backgroundColor: '#22c55e',
  },
  trailName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  trailCoords: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  verifierSection: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default TrailVerifierWithMap; 