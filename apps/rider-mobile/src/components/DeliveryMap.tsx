import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

// Set access token to null since we use free vector tiles
MapLibreGL.setAccessToken(null);

interface DeliveryMapProps {
  riderLocation: { latitude: number; longitude: number } | null;
  destination: { latitude: number; longitude: number; label?: string } | null;
  pickup?: { latitude: number; longitude: number; label?: string };
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ 
  riderLocation, 
  destination,
  pickup 
}) => {
  const cameraRef = useRef<MapLibreGL.Camera>(null);

  // Auto-fit camera to bounds when locations change
  useEffect(() => {
    if (riderLocation && destination && cameraRef.current) {
      const bounds = {
        ne: [Math.max(riderLocation.longitude, destination.longitude), Math.max(riderLocation.latitude, destination.latitude)],
        sw: [Math.min(riderLocation.longitude, destination.longitude), Math.min(riderLocation.latitude, destination.latitude)],
      };
      
      cameraRef.current.fitBounds(bounds.ne as any, bounds.sw as any, 50, 1000);
    }
  }, [riderLocation, destination]);

  if (!riderLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Waiting for location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        style={styles.map}
        styleURL="https://demotiles.maplibre.org/style.json" // Free demo style
        rotateEnabled={true}
        logoEnabled={false}
      >
        <MapLibreGL.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: [riderLocation.longitude, riderLocation.latitude],
            zoomLevel: 14,
          }}
          followUserLocation={true}
          followUserMode="course"
        />

        {/* Rider Location (User Location Layer is built-in but we can customize) */}
        <MapLibreGL.UserLocation visible={true} showsUserHeadingIndicator={true} />

        {/* Destination Marker */}
        {destination && (
          <MapLibreGL.PointAnnotation
            id="destination"
            coordinate={[destination.longitude, destination.latitude]}
          >
            <View style={styles.destinationMarker}>
              <View style={styles.dot} />
            </View>
            <MapLibreGL.Callout title={destination.label || 'Customer'} />
          </MapLibreGL.PointAnnotation>
        )}

        {/* Pickup Marker */}
        {pickup && (
          <MapLibreGL.PointAnnotation
            id="pickup"
            coordinate={[pickup.longitude, pickup.latitude]}
          >
            <View style={styles.pickupMarker}>
              <View style={styles.square} />
            </View>
            <MapLibreGL.Callout title={pickup.label || 'Restaurant'} />
          </MapLibreGL.PointAnnotation>
        )}

        {/* TODO: Add Route Line using ShapeSource + LineLayer if route geometry is available */}
      </MapLibreGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300, // Default height if not flexed by parent
    width: '100%',
    overflow: 'hidden',
    borderRadius: 15,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
  },
  destinationMarker: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E91E63',
  },
  pickupMarker: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E91E63',
  },
  square: {
    width: 12,
    height: 12,
    backgroundColor: '#2196F3',
  },
});
