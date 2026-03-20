import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  type: "attraction" | "restaurant" | "hotel";
}

interface DestinationMapProps {
  center: [number, number];
  markers: MapMarker[];
}

const MARKER_COLORS: Record<string, string> = {
  attraction: "#e67e22",
  restaurant: "#e74c3c",
  hotel: "#3498db",
};

const MARKER_EMOJI: Record<string, string> = {
  attraction: "📍",
  restaurant: "🍽️",
  hotel: "🏨",
};

const DestinationMap = ({ center, markers }: DestinationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Destroy existing map
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
    }).setView(center, 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add markers
    const validMarkers = markers.filter((m) => m.lat && m.lng && !isNaN(m.lat) && !isNaN(m.lng));
    
    validMarkers.forEach((marker) => {
      const color = MARKER_COLORS[marker.type] || "#e67e22";
      const emoji = MARKER_EMOJI[marker.type] || "📍";
      
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background:${color};color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;">${emoji}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker([marker.lat, marker.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${marker.label}</strong><br/><span style="text-transform:capitalize">${marker.type}</span>`);
    });

    // Fit bounds if markers exist
    if (validMarkers.length > 1) {
      const bounds = L.latLngBounds(validMarkers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [center, markers]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-card)]"
    />
  );
};

export default DestinationMap;
