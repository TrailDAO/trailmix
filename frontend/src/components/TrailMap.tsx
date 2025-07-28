import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Trail } from '../types';

interface TrailMapProps {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  trails: Trail[];
  onTrailPress?: (trail: Trail) => void;
}

const { width, height } = Dimensions.get('window');

export function TrailMap({ userLocation, trails, onTrailPress }: TrailMapProps) {
  const initialRegion = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="terrain"
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You are here"
            pinColor="blue"
          />
        )}

        {/* Trail markers */}
        {trails.map((trail, index) => (
          <Marker
            key={`trail-${index}`}
            coordinate={{
              latitude: parseFloat(trail.latitude),
              longitude: parseFloat(trail.longitude),
            }}
            title={trail.address}
            description="Trail location"
            pinColor="green"
            onPress={() => onTrailPress?.(trail)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    width: width,
    height: height * 0.4,
  },
});
