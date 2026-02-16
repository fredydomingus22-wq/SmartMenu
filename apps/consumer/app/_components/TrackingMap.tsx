"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createClient } from "@/utils/supabase/client";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Rider Icon
const RiderIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png", // Delivery motorbike icon
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

export interface TrackingMapProps {
  riderId?: string;
  initialLat?: number;
  initialLng?: number;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function TrackingMap({ riderId, initialLat = -25.9692, initialLng = 32.5732 }: TrackingMapProps) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  useEffect(() => {
    if (!riderId) return;

    const supabase = createClient();
    const channel = supabase.channel(`riders:${riderId}`)
      .on('broadcast', { event: 'RIDER_UPDATE' }, (payload: { payload: { currentLat: number; currentLng: number } }) => {
        const { currentLat, currentLng } = payload.payload;
        if (currentLat && currentLng) {
          setPosition([currentLat, currentLng]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [riderId]);

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden border-2 border-primary/20 relative">
      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={RiderIcon}>
          <Popup>Rider is here</Popup>
        </Marker>
        <MapUpdater center={position} />
      </MapContainer>
    </div>
  );
}
