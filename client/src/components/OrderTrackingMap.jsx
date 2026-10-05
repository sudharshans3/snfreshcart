import React, { useEffect, useRef, useState } from 'react';

const WAREHOUSE_COORDS = { lat: 11.92786, lng: 78.18288 }; // Salem Warehouse (Kanavaipudur)

// Pre-cached coordinates for typical Indian cities to serve as immediate fallbacks
const CITY_FALLBACKS = {
  nashik: { lat: 20.0084, lng: 73.7898 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  pune: { lat: 18.5204, lng: 73.8567 },
  salem: { lat: 11.6643, lng: 78.1460 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  delhi: { lat: 28.6139, lng: 77.2090 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  nagpur: { lat: 21.1458, lng: 79.0882 },
  aurangabad: { lat: 19.8762, lng: 75.3433 },
  thane: { lat: 19.2183, lng: 72.9781 },
};

const OrderTrackingMap = ({
  order,
  interactive = false,
  onLocationSelect = null,
  onRouteLoaded = null,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routePolylineRef = useRef(null);
  const warehouseMarkerRef = useRef(null);
  const customerMarkerRef = useRef(null);
  const truckMarkerRef = useRef(null);

  const [customerCoords, setCustomerCoords] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Geocode customer shipping address
  useEffect(() => {
    if (!order?.shippingAddress) return;

    const resolveCoordinates = async () => {
      setLoading(true);
      setError(null);
      
      const { street, city, state, zip } = order.shippingAddress;
      const cleanCity = city.trim().toLowerCase();
      
      // Attempt Nominatim geocoding
      try {
        const query = encodeURIComponent(`${street ? street + ', ' : ''}${city}, ${state} ${zip || ''}`);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
          {
            headers: {
              'Accept-Language': 'en',
              'User-Agent': 'FreshOnionMart/1.0',
            },
          }
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
          setCustomerCoords(coords);
          return;
        }
      } catch (err) {
        console.warn('Nominatim geocoding failed, falling back to cache...', err);
      }

      // Pre-cached fallback
      if (CITY_FALLBACKS[cleanCity]) {
        setCustomerCoords(CITY_FALLBACKS[cleanCity]);
        return;
      }

      // Default fallback (Mumbai coordinates)
      setCustomerCoords({ lat: 19.0760, lng: 72.8777 });
    };

    resolveCoordinates();
  }, [order?.shippingAddress]);

  // 2. Fetch OSRM Routing between Warehouse and Customer
  useEffect(() => {
    if (!customerCoords) return;

    const fetchOSRMRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${WAREHOUSE_COORDS.lng},${WAREHOUSE_COORDS.lat};${customerCoords.lng},${customerCoords.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
          setRouteCoordinates(coords);
          if (onRouteLoaded) {
            onRouteLoaded(coords);
          }
        } else {
          throw new Error('No routes returned');
        }
      } catch (err) {
        console.warn('OSRM routing failed, drawing straight line...', err);
        const straightLine = [
          [WAREHOUSE_COORDS.lat, WAREHOUSE_COORDS.lng],
          [customerCoords.lat, customerCoords.lng],
        ];
        setRouteCoordinates(straightLine);
        if (onRouteLoaded) {
          onRouteLoaded(straightLine);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOSRMRoute();
  }, [customerCoords]);

  // 3. Initialize Leaflet Map
  useEffect(() => {
    if (!window.L || !mapContainerRef.current || loading || routeCoordinates.length === 0) return;

    const L = window.L;

    // Create Map Instance if not exists
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Use a premium Dark Mode tile layer (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear previous layers
    if (routePolylineRef.current) map.removeLayer(routePolylineRef.current);
    if (warehouseMarkerRef.current) map.removeLayer(warehouseMarkerRef.current);
    if (customerMarkerRef.current) map.removeLayer(customerMarkerRef.current);

    // Custom HTML Icons (glowing pins via Tailwind classes)
    const warehouseIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-500 shadow-lg animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500">
            <path d="M3 21h18"></path>
            <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 0V3H3v4m6 0v1a3 3 0 0 0 6 0v-1m0 0V3H9v4m6 0v1a3 3 0 0 0 6 0v-1m0 0V3h-6v4m6 0v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"></path>
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const homeIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // Add warehouse & customer markers
    warehouseMarkerRef.current = L.marker([WAREHOUSE_COORDS.lat, WAREHOUSE_COORDS.lng], { icon: warehouseIcon })
      .addTo(map)
      .bindPopup('<strong class="text-slate-800">SN FreshCart Warehouse</strong><br/>Kanavaipudur, Salem');

    customerMarkerRef.current = L.marker([customerCoords.lat, customerCoords.lng], { icon: homeIcon })
      .addTo(map)
      .bindPopup(`<strong class="text-slate-800">Customer Location</strong><br/>${order.shippingAddress.city}`);

    // Draw route polyline (with neon blue styling)
    routePolylineRef.current = L.polyline(routeCoordinates, {
      color: '#3b82f6',
      weight: 4,
      opacity: 0.8,
      lineJoin: 'round',
    }).addTo(map);

    // Fit map bounds to show the entire route
    map.fitBounds(routePolylineRef.current.getBounds(), {
      padding: [40, 40],
    });

    // Add interactive click support for delivery partners to specify coordinates manually
    if (interactive && onLocationSelect) {
      const handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        onLocationSelect({ lat, lng });
      };

      map.on('click', handleMapClick);
      return () => {
        map.off('click', handleMapClick);
      };
    }
  }, [loading, routeCoordinates]);

  // 4. Update Truck Location based on status & coordinates
  useEffect(() => {
    if (!window.L || !mapInstanceRef.current || loading || routeCoordinates.length === 0) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Remove existing truck marker
    if (truckMarkerRef.current) {
      map.removeLayer(truckMarkerRef.current);
      truckMarkerRef.current = null;
    }

    let truckPos = null;
    const status = order?.orderStatus || 'Order Placed';

    if (status === 'Order Placed' || status === 'Packed') {
      // Placed/Packed: Truck is still at the warehouse
      truckPos = [WAREHOUSE_COORDS.lat, WAREHOUSE_COORDS.lng];
    } else if (status === 'Delivered') {
      // Delivered: Truck is at customer location
      truckPos = [customerCoords.lat, customerCoords.lng];
    } else if (status === 'Shipped') {
      // Shipped: Use the database delivery coordinates if present, else default to midroute
      if (order?.deliveryCoordinates?.lat && order?.deliveryCoordinates?.lng) {
        truckPos = [order.deliveryCoordinates.lat, order.deliveryCoordinates.lng];
      } else {
        const midPointIdx = Math.floor(routeCoordinates.length / 2);
        truckPos = routeCoordinates[midPointIdx] || [WAREHOUSE_COORDS.lat, WAREHOUSE_COORDS.lng];
      }
    }

    if (truckPos) {
      const truckIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500 shadow-xl ring-4 ring-blue-500/10">
            <div class="absolute -top-1 -right-1 flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500 animate-bounce">
              <path d="M14 18H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h11v11"></path>
              <path d="M19 18h2a1 1 0 0 0 1-1v-5.5a1 1 0 0 0-.5-.87L18 8.13a1 1 0 0 0-.5-.13H15"></path>
              <circle cx="7" cy="18" r="2"></circle>
              <circle cx="17" cy="18" r="2"></circle>
            </svg>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      truckMarkerRef.current = L.marker(truckPos, { icon: truckIcon })
        .addTo(map)
        .bindPopup(`<strong class="text-slate-800">Delivery Vehicle</strong><br/>Status: ${status}`);

      // Pan to truck if status is Shipped for active visual tracking
      if (status === 'Shipped') {
        map.panTo(truckPos);
      }
    }
  }, [loading, routeCoordinates, order?.deliveryCoordinates, order?.orderStatus]);

  // Clean up map instance on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-inner">
      {loading && (
        <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Geocoding delivery route...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-2">
          <span className="text-red-500 text-3xl">⚠️</span>
          <p className="text-sm font-semibold text-slate-200">Unable to load order tracking map</p>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />
    </div>
  );
};

export default OrderTrackingMap;
