import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useWriteContract } from 'wagmi';
import { getAllTrails } from '../utils';
import { Trail } from '../types';

const TrailContract = require('../contracts/Trail.json');

interface GeolocationProps {
  address?: string;
}

function Geolocation({ address }: GeolocationProps) {
  const { writeContract: executeHike } = useWriteContract();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    // Use browser geolocation API for web
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          const grossLatitude = Math.round(latitude * 1e5) / 1e5;
          const grossLongitude = Math.round(longitude * 1e5) / 1e5;
          
          getAllTrails(grossLatitude, grossLongitude).then(trails => {
            setTrails(trails);
          });
        },
        (error) => {
          setErrorMsg('Permission to access location was denied');
        }
      );
    } else {
      setErrorMsg('Geolocation is not supported by this browser');
    }
  }, []);

  const claim = async (trailAddress: string) => {
    if (!address) {
      Alert.alert("Error", "No wallet connected");
      return;
    }

    try {
      executeHike({
        address: trailAddress as `0x${string}`,
        abi: TrailContract.abi,
        functionName: 'hike',
        args: [],
      });
      
      Alert.alert("Success", "Trail tokens claimed!");
    } catch (error) {
      console.error("Error claiming tokens:", error);
      Alert.alert("Error", "Failed to claim tokens");
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️ Map View</Text>
        <Text style={styles.locationText}>
          Your Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </Text>
        <Text style={styles.mapText}>🏞️ You are here</Text>
      </View>
      
      <ScrollView style={styles.trailsList}>
        <Text style={styles.trailsHeader}>Nearby Trails:</Text>
        {trails.length === 0 ? (
          <Text style={styles.noTrailsText}>No trails found nearby</Text>
        ) : (
          trails.map((trail, index) => (
            <View key={trail.address} style={styles.trailItem}>
              <Text style={styles.trailText}>🥾 Trail {index + 1}</Text>
              <Text style={styles.trailAddress}>{trail.address}</Text>
              <TouchableOpacity 
                style={styles.claimButton} 
                onPress={() => claim(trail.address)}
              >
                <Text style={styles.claimButtonText}>Claim</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  mapPlaceholder: {
    flex: 2,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 10,
    padding: 20,
  },
  mapText: {
    fontSize: 24,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  trailsList: {
    flex: 1,
    padding: 10,
  },
  trailsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  noTrailsText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  trailItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  trailText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  trailAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  claimButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  claimButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    margin: 20,
  },
});

export default Geolocation; 