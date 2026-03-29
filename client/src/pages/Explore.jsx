import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import toGeoJSON from 'togeojson';
import { Users, Mountain, Info } from 'lucide-react';

const TREK_ICON = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const PARTNER_ICON = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

function parseGPX(str) {
  if (!str) return null;
  try {
    const xml = new DOMParser().parseFromString(str, 'text/xml');
    const geo = toGeoJSON.gpx(xml);
    const coords = geo.features
      .filter(f => f.geometry?.type === 'LineString')
      .flatMap(f => f.geometry.coordinates.map(c => [c[1], c[0]]));
    return coords.length ? coords : null;
  } catch { return null; }
}

export function Explore() {
  const [posts, setPosts] = useState([]);
  const [partners, setPartners] = useState([]);
  const [show, setShow] = useState({ treks: true, partners: true, routes: true });

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5500/api/posts').then(r => r.json()),
      fetch('http://localhost:5500/api/partners').then(r => r.json()),
    ]).then(([p, pt]) => {
      setPosts(Array.isArray(p) ? p : []);
      setPartners(Array.isArray(pt) ? pt : []);
    }).catch(() => {});
  }, []);

  const trekPins   = posts.filter(p => p.coordinates?.lat);
  const gpxPosts   = posts.filter(p => p.gpxData);
  const partnerPins= partners.filter(p => p.coordinates?.lat);

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 64px)' }}>

      {/* Sidebar overlay */}
      <div style={{
        position: 'absolute', top: 16, left: 16, zIndex: 1000,
        width: 260, background: 'white', borderRadius: 16,
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9', overflow: 'hidden'
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Mountain size={18} color="#16a34a" /> Trek Map
          </h3>
        </div>

        {/* Layer toggles */}
        <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { key: 'treks', label: 'Trek locations', count: trekPins.length, color: '#3b82f6' },
            { key: 'partners', label: 'Partner groups', count: partnerPins.length, color: '#16a34a' },
            { key: 'routes', label: 'GPX routes', count: gpxPosts.length, color: '#8b5cf6' },
          ].map(layer => (
            <label key={layer.key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
              <div
                onClick={() => setShow(s => ({ ...s, [layer.key]: !s[layer.key] }))}
                style={{
                  width: 20, height: 20, borderRadius: 5, border: `2px solid ${layer.color}`,
                  background: show[layer.key] ? layer.color : 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}
              >
                {show[layer.key] && <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>✓</span>}
              </div>
              <span style={{ flex: 1, fontWeight: 600, color: '#374151' }}>{layer.label}</span>
              <span style={{ fontSize: 12, background: '#f8fafc', padding: '2px 8px', borderRadius: 10, fontWeight: 700, color: '#64748b' }}>{layer.count}</span>
            </label>
          ))}
        </div>

        <div style={{ padding: '10px 20px 14px', borderTop: '1px solid #f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
            <Info size={13} /> Click markers for details
          </div>
        </div>
      </div>

      {/* Map */}
      <MapContainer center={[28.3949, 84.1240]} zoom={7} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
        />

        {show.treks && trekPins.map(post => (
          <Marker key={post._id} position={[post.coordinates.lat, post.coordinates.lng]} icon={TREK_ICON}>
            <Popup>
              <div style={{ padding: 8, minWidth: 180 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trek</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{post.location}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>by {post.user?.name}</div>
                <span style={{ fontSize: 11, background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>{post.difficulty}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {show.routes && gpxPosts.map(post => {
          const coords = parseGPX(post.gpxData);
          return coords ? (
            <Polyline key={post._id} positions={coords} pathOptions={{ color: '#8b5cf6', weight: 3, opacity: 0.7 }} />
          ) : null;
        })}

        {show.partners && partnerPins.map(req => (
          <Marker key={req._id} position={[req.coordinates.lat, req.coordinates.lng]} icon={PARTNER_ICON}>
            <Popup>
              <div style={{ padding: 8, minWidth: 180 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Group Trek</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{req.location}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                  {req.joinedPartners?.length || 0}/{req.partnersNeeded} joined · {new Date(req.date).toLocaleDateString()}
                </div>
                <a href="/partners" style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>View details →</a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
