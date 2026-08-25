import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// Fix default leaflet marker icon issue in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom pin creators
const createCustomIcon = (emoji, bgClass, pulse = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
        ${pulse ? '<div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(255, 82, 0, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' : ''}
        <div style="width: 36px; height: 36px; border-radius: 50%; background: ${bgClass}; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid white; z-index: 10;">
          ${emoji}
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

const LiveDeliveryMap = ({
  status = 'picked_up',
  restaurantName = 'FeastRocket Kitchen',
  customerAddress = '42 Indiranagar, Bengaluru',
  riderName = 'Arjun R.',
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const polylineRef = useRef(null);
  const activePolylineRef = useRef(null);

  // Simulated coordinates (Bengaluru tech hub route)
  const restaurantCoords = [12.9784, 77.6408]; // Indiranagar 100ft Rd
  const customerCoords = [12.9658, 77.6520];   // Domlur / Indiranagar

  // Intermediate route points for smooth pathing
  const routePoints = [
    restaurantCoords,
    [12.9760, 77.6425],
    [12.9730, 77.6450],
    [12.9700, 77.6475],
    [12.9680, 77.6495],
    customerCoords,
  ];

  // Map status to route progress percentage (0.0 to 1.0)
  const getProgress = (st) => {
    switch (st) {
      case 'pending': return 0.0;
      case 'confirmed': return 0.05;
      case 'preparing': return 0.15;
      case 'ready': return 0.25;
      case 'picked_up': return 0.65;
      case 'delivered': return 1.0;
      default: return 0.5;
    }
  };

  const progress = getProgress(status);

  // Interpolate position along route points
  const getInterpolatedPoint = (t) => {
    if (t <= 0) return routePoints[0];
    if (t >= 1) return routePoints[routePoints.length - 1];

    const totalSegments = routePoints.length - 1;
    const scaledT = t * totalSegments;
    const segmentIndex = Math.floor(scaledT);
    const segmentT = scaledT - segmentIndex;

    const p1 = routePoints[segmentIndex];
    const p2 = routePoints[Math.min(segmentIndex + 1, routePoints.length - 1)];

    return [
      p1[0] + (p2[0] - p1[0]) * segmentT,
      p1[1] + (p2[1] - p1[1]) * segmentT,
    ];
  };

  const riderCoords = getInterpolatedPoint(progress);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([12.9721, 77.6464], 14);

    // Modern OpenStreetMap CartoDB Positron tiles for sleek clean look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Add Restaurant Marker
    L.marker(restaurantCoords, {
      icon: createCustomIcon('🏪', '#ff5200'),
    }).addTo(map).bindPopup(`<b>${restaurantName}</b><br/>Pickup Location`);

    // Add Customer Marker
    L.marker(customerCoords, {
      icon: createCustomIcon('🏠', '#10b981'),
    }).addTo(map).bindPopup(`<b>Delivery Address</b><br/>${customerAddress}`);

    // Base dashed route
    const basePolyline = L.polyline(routePoints, {
      color: '#cbd5e1',
      weight: 5,
      dashArray: '6, 8',
      opacity: 0.8,
    }).addTo(map);
    polylineRef.current = basePolyline;

    // Active travelled route
    const activeRoute = L.polyline([restaurantCoords, riderCoords], {
      color: '#ff5200',
      weight: 5,
      opacity: 0.9,
    }).addTo(map);
    activePolylineRef.current = activeRoute;

    // Rider Marker
    const riderMarker = L.marker(riderCoords, {
      icon: createCustomIcon('🛵', '#ff5200', status !== 'delivered'),
      zIndexOffset: 1000,
    }).addTo(map).bindPopup(`<b>${riderName}</b> (Delivery Partner)<br/>Status: ${status.replace('_', ' ')}`);

    riderMarkerRef.current = riderMarker;
    mapInstanceRef.current = map;

    // Fit bounds nicely with padding
    const bounds = L.latLngBounds(routePoints);
    map.fitBounds(bounds, { padding: [40, 40] });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Rider & Route on status change
  useEffect(() => {
    if (!mapInstanceRef.current || !riderMarkerRef.current) return;

    const newCoords = getInterpolatedPoint(progress);
    riderMarkerRef.current.setLatLng(newCoords);

    // Update active path
    const coveredPoints = [restaurantCoords];
    const totalSegments = routePoints.length - 1;
    const currentIndex = Math.floor(progress * totalSegments);
    for (let i = 1; i <= currentIndex; i++) {
      coveredPoints.push(routePoints[i]);
    }
    coveredPoints.push(newCoords);

    if (activePolylineRef.current) {
      activePolylineRef.current.setLatLngs(coveredPoints);
    }
  }, [status, progress]);

  const etaMinutes = Math.max(2, Math.round((1 - progress) * 25));

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-800">
      {/* Map Element */}
      <div ref={mapContainerRef} className="h-64 sm:h-72 w-full z-0" />

      {/* Top Floating Overlay Badge */}
      <div className="absolute top-3 left-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2.5 z-[1000]">
        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Live GPS Tracker</p>
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
            {status === 'delivered' ? '🎉 Arrived & Delivered' : `ETA: ~${etaMinutes} mins (${((1 - progress) * 2.8).toFixed(1)} km away)`}
          </p>
        </div>
      </div>

      {/* Bottom Route Legend */}
      <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-between z-[1000] text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[45%]">
          <span>🏪</span> <span className="truncate">{restaurantName}</span>
        </div>
        <div className="text-gray-400 font-bold">➔</div>
        <div className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[45%]">
          <span>🏠</span> <span className="truncate">Your Location</span>
        </div>
      </div>
    </div>
  );
};

export default LiveDeliveryMap;
