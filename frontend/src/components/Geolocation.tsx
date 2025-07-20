import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { ethers } from 'ethers';
import { getAllTrails } from '../utils';
import { Trail } from '../types';

const TrailContract = require('../contracts/Trail.json');

interface GeolocationProps {
  address?: string;
  provider?: any;
}

function Geolocation({ address, provider }: GeolocationProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [nearLatitude, setNearLatitude] = useState<number>();
  const [nearLongitude, setNearLongitude] = useState<number>();
  const [trails, setTrails] = useState<Trail[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const grossLatitude = Math.round(location.coords.latitude * 1e5) / 1e5;
      const grossLongitude = Math.round(location.coords.longitude * 1e5) / 1e5;
      
      setNearLatitude(grossLatitude);
      setNearLongitude(grossLongitude);
    })();
  }, []);

  useEffect(() => {
    if (nearLatitude && nearLongitude) {
      getAllTrails(nearLatitude, nearLongitude).then(trails => {
        setTrails(trails);
      });
    }
  }, [nearLatitude, nearLongitude]);

  const claim = async (trailAddress: string) => {
    if (!provider) {
      Alert.alert("Error", "No provider available");
      return;
    }

    try {
      // generatecall snarkjs, not sure how this should work
      // verify inputs
      const trail = new ethers.Contract(trailAddress, TrailContract.abi, provider.getSigner());
      const tx = await trail.hike();
      await tx.wait();
      
      Alert.alert("Success", "Trail tokens claimed!");
      console.log("claim tokens");
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
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Your Location"
          description="🏞️"
        />
        {trails.map((trail, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(trail.latitude),
              longitude: parseFloat(trail.longitude),
            }}
            title={`Trail ${index + 1}`}
            description="🥾"
          />
        ))}
      </MapView>
      
      <ScrollView style={styles.trailsList}>
        {trails.map((trail, index) => (
          <View key={trail.address} style={styles.trailItem}>
            <Text style={styles.trailText}>{trail.address}</Text>
            <TouchableOpacity 
              style={styles.claimButton} 
              onPress={() => claim(trail.address)}
            >
              <Text style={styles.claimButtonText}>Claim</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 2,
  },
  trailsList: {
    flex: 1,
    padding: 10,
  },
  trailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  trailText: {
    flex: 1,
    fontSize: 14,
  },
  claimButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
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