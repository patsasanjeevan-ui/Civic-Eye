import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, AlertCircle, Clock, ShieldAlert, Sparkles } from 'lucide-react';

/**
 * Animated Pulsing Red SVG Pin Generator for Leaflet
 */
function createPulsingRedPin(label = 'CRITICAL') {
  const html = `
    <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
      <!-- Outer Beacon Ring 1 -->
      <div style="position: absolute; width: 42px; height: 42px; border-radius: 50%; background: rgba(239, 68, 68, 0.35); animation: pulse-emerald 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
      <!-- Outer Beacon Ring 2 -->
      <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: rgba(239, 68, 68, 0.6); animation: pulse-emerald 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
      <!-- Center Red Pin -->
      <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background: #EF4444; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.8); display: flex; align-items: center; justify-content: center;">
        <div style="width: 7px; height: 7px; border-radius: 50%; background: #ffffff;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-pulsing-red-pin',
    html,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
}

function createSecondaryPin(severity = 'HIGH') {
  const color = severity === 'HIGH' ? '#F59E0B' : '#10B981';
  const html = `
    <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
      <div style="width: 16px; height: 16px; border-radius: 50%; background: ${color}; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.5);"></div>
    </div>
  `;
  return L.divIcon({
    className: 'custom-secondary-pin',
    html,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
}

// Map center controller when active geo-pin updates
function MapCenterController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 13, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function CivicHeatmap({ grievances = [], activeGeoPin }) {
  const [mapLayer, setMapLayer] = useState('googleRoad'); // 'googleRoad' | 'googleSatellite' | 'carto'

  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';

  // Tile layer URLs based on selected map style
  const tileConfig = {
    googleRoad: {
      url: googleApiKey
        ? `https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i420120488!3m9!2sen-US!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0&key=${googleApiKey}`
        : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps'
    },
    googleSatellite: {
      url: googleApiKey
        ? `https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e1!2sm!3i420120488!3m9!2sen-US!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0&key=${googleApiKey}`
        : 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Satellite Imagery'
    },
    carto: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }
  };

  const currentTile = tileConfig[mapLayer] || tileConfig.googleRoad;

  // Default to Output 4 coordinates or Bhongiri center
  const targetPin = activeGeoPin || {
    latitude: 17.5150,
    longitude: 78.8910,
    location_name: 'Survey No. 412/A, Ward 14, Bhongiri',
    severity: 'CRITICAL',
    category: 'LAND_ENCROACHMENT'
  };

  const centerCoords = [Number(targetPin.latitude) || 17.5150, Number(targetPin.longitude) || 78.8910];

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              OUTPUT 4
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500 animate-bounce" />
              Live Red Pin on Municipal City Map
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Geospatial PostGIS Coordinate Tracking • Centered on Active Violation Location
          </p>
        </div>

        {/* Map Layer Switcher & Live Status Tag */}
        <div className="flex items-center space-x-2">
          {/* Map Layer Selector */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setMapLayer('googleRoad')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                mapLayer === 'googleRoad' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Google Maps
            </button>
            <button
              onClick={() => setMapLayer('googleSatellite')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                mapLayer === 'googleSatellite' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapLayer('carto')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                mapLayer === 'carto' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              OSM
            </button>
          </div>

          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-red-950/40 border border-red-800/60 text-red-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Active Incident Pinned</span>
          </span>
        </div>
      </div>

      {/* Leaflet Map Box */}
      <div className="w-full h-[450px] rounded-xl overflow-hidden border border-slate-800 shadow-inner relative z-10">
        <MapContainer
          center={centerCoords}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <MapCenterController center={centerCoords} />

          {/* Dynamic Google Maps & OpenStreetMap Tile Layer */}
          <TileLayer
            key={mapLayer}
            attribution={currentTile.attribution}
            url={currentTile.url}
          />

          {/* OUTPUT 4: Primary Pulsing Red Pin */}
          <Marker
            position={centerCoords}
            icon={createPulsingRedPin(targetPin.severity)}
          >
            <Popup autoPan={true}>
              <div className="text-slate-100 min-w-[240px] space-y-2 p-1">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    OUTPUT 4 INCIDENT
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-extrabold uppercase bg-red-900/80 text-red-300 border border-red-700">
                    {targetPin.severity || 'CRITICAL'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    <span>Violation Category: {targetPin.category || 'LAND_ENCROACHMENT'}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-sans">
                    <strong>Location:</strong> {targetPin.location_name || 'Survey No. 412/A, Ward 14, Bhongiri'}
                  </div>
                </div>

                {/* Explicit SLA Callout */}
                <div className="p-2 rounded bg-red-950/40 border border-red-800/60 text-[11px] font-bold text-red-300 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <span>Statutory Notice Pending (48h SLA)</span>
                </div>

                <div className="text-[9px] text-slate-400 font-mono text-right pt-1">
                  Coordinates: {centerCoords[0].toFixed(5)}, {centerCoords[1].toFixed(5)}
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Secondary Grievances in Area */}
          {grievances.map((item, idx) => {
            const lat = Number(item.latitude);
            const lng = Number(item.longitude);
            // Skip if identical to centerCoords to avoid overlapping
            if (Math.abs(lat - centerCoords[0]) < 0.0001 && Math.abs(lng - centerCoords[1]) < 0.0001) {
              return null;
            }

            return (
              <Marker
                key={item.id || item.ticket_number || idx}
                position={[lat, lng]}
                icon={createSecondaryPin(item.severity)}
              >
                <Popup>
                  <div className="text-slate-100 text-xs space-y-1 p-1">
                    <div className="font-bold text-emerald-400 font-mono">{item.ticket_number}</div>
                    <div className="text-slate-200">{item.issue_type}</div>
                    <div className="text-[11px] text-slate-400">{item.ward_number}</div>
                    <div className="text-[10px] text-amber-300">SLA: {item.sla_hours || 48} Hours</div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping inline-block"></span>
            <span className="text-red-400 font-semibold">Output 4: Active Encroachment Pin</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>High Severity (Municipal Watch)</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          PostGIS EPSG:4326 • Real-Time Spatial Pinning Engine
        </div>
      </div>

    </div>
  );
}
