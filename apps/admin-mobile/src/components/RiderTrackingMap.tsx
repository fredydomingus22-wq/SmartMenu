import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { supabase } from '../services/supabaseClient';

interface RiderTrackingMapProps {
  riderId?: string;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
}

export default function RiderTrackingMap({ riderId, initialLocation }: RiderTrackingMapProps) {
  const [riderLocation, setRiderLocation] = useState(initialLocation || {
    latitude: -25.9692,
    longitude: 32.5732,
  });

  useEffect(() => {
    if (!riderId) return;

    const channel = supabase.channel(`riders:${riderId}`)
      .on('broadcast', { event: 'RIDER_UPDATE' }, (payload) => {
        const { currentLat, currentLng } = payload.payload;
        if (currentLat && currentLng) {
          setRiderLocation({
            latitude: currentLat,
            longitude: currentLng,
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [riderId]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          ...riderLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={riderLocation}
          title="Rider Position"
          description="Live tracking"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
