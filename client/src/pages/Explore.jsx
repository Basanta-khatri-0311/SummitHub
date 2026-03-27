import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Users, Compass, Shield, Activity, Navigation as NavIcon } from 'lucide-react';
import L from 'leaflet';
import toast from 'react-hot-toast';
import toGeoJSON from 'togeojson';

const postIcon = new L.Icon({
  iconUrl: 'https://cdn0.iconfinder.com/data/icons/basic-11/100/Map_Marker-512.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [1, -34],
  className: 'grayscale invert contrast-200'
});

const partnerIcon = new L.Icon({
  iconUrl: 'https://cdn0.iconfinder.com/data/icons/map-location-solid-style/91/Map_Location_30-512.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [1, -34],
  className: 'grayscale'
});

export function Explore() {
  const [posts, setPosts] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [postsRes, partnersRes] = await Promise.all([
        fetch('http://localhost:5500/api/posts'),
        fetch('http://localhost:5500/api/partners')
      ]);
      const postsData = await postsRes.json();
      const partnersData = await partnersRes.json();
      setPosts(postsData);
      setPartners(partnersData);
    } catch (err) {
      toast.error("Sector scan failed.");
    } finally {
      setLoading(false);
    }
  };

  const parseGPXtoCoords = (gpxString) => {
    if (!gpxString) return null;
    try {
      const parser = new DOMParser();
      const gpxXml = parser.parseFromString(gpxString, "text/xml");
      const geoJson = toGeoJSON.gpx(gpxXml);
      
      // Extract coordinates from LineString
      const coords = geoJson.features
        .filter(f => f.geometry.type === 'LineString')
        .flatMap(f => f.geometry.coordinates.map(c => [c[1], c[0]])); // Swap to [lat, lng]
      
      return coords.length > 0 ? coords : null;
    } catch (e) {
      console.error("GPX Parsing Failed", e);
      return null;
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full relative group font-sans">
      <div className="absolute top-8 left-8 z-[1000] space-y-4">
        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl shadow-xl transition-all">
           <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
             <Compass className="h-5 w-5 animate-pulse" /> Explorer Interface
           </h2>
           <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                 <div className="h-3 w-3 bg-black dark:bg-white rounded-full"></div>
                 Expedition Logs ({posts.filter(p => p.coordinates?.lat).length})
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                 <div className="h-3 w-3 border-2 border-black dark:border-white rounded-full"></div>
                 Partner Requests ({partners.filter(p => p.coordinates?.lat).length})
              </div>
           </div>
        </div>
      </div>

      <MapContainer 
        center={[28.3949, 84.1240]} 
        zoom={7} 
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <style>
          {`
            .leaflet-container { filter: grayscale(1) invert(0.9) contrast(1.2) brightness(0.9); transition: filter 0.5s; }
            .dark .leaflet-container { filter: grayscale(1) invert(1) contrast(1.5) brightness(0.7); }
            .leaflet-popup-content-wrapper { background: #000 !important; color: #fff !important; border-radius: 20px !important; border: 1px solid #333 !important; padding: 10px !important; }
            .leaflet-popup-tip { background: #000 !important; }
          `}
        </style>

        {posts.map(post => {
          const coords = parseGPXtoCoords(post.gpxData);
          const hasPin = post.coordinates?.lat;

          return (
            <React.Fragment key={post._id}>
              {coords && (
                <Polyline 
                  positions={coords} 
                  pathOptions={{ 
                    color: 'white', 
                    weight: 3, 
                    dashArray: '5, 10',
                    className: 'animate-pulse transition-opacity duration-300'
                  }} 
                />
              )}
              {hasPin && (
                <Marker position={[post.coordinates.lat, post.coordinates.lng]} icon={postIcon}>
                  <Popup>
                    <div className="min-w-[220px] text-white p-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400 block mb-1">Expedition Log</span>
                      <h4 className="font-black text-xl uppercase mb-2 leading-tight tracking-tighter">{post.location}</h4>
                      <p className="text-[10px] text-neutral-300 line-clamp-3 mb-5 leading-relaxed italic">"{post.content}"</p>
                      {coords && (
                         <div className="flex items-center gap-2 mb-4 text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 uppercase tracking-widest">
                           <NavIcon className="h-3 w-3" /> Mission Trail Visualized
                         </div>
                      )}
                      <div className="flex justify-between items-center text-[10px] font-black border-t border-neutral-800 pt-4 mt-2">
                         <span className="uppercase tracking-widest">{post.user?.name}</span>
                         <Activity className="h-4 w-4" />
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </React.Fragment>
          );
        })}

        {partners.map(req => req.coordinates?.lat && (
          <Marker 
            key={req._id} 
            position={[req.coordinates.lat, req.coordinates.lng]} 
            icon={partnerIcon}
          >
            <Popup>
              <div className="min-w-[200px] text-white p-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 block mb-1">Squad Request</span>
                <h4 className="font-black text-lg uppercase mb-2 leading-tight tracking-tighter">{req.location}</h4>
                <div className="flex flex-col gap-3 mb-5">
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase text-neutral-400 tracking-widest">
                      <Users className="h-3.5 w-3.5" /> {req.joinedPartners.length}/{req.partnersNeeded} Operatives Joined
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase text-neutral-400 tracking-widest">
                      MISSION_DATE: {new Date(req.date).toLocaleDateString()}
                   </div>
                </div>
                <button className="w-full text-[8px] font-black bg-white text-black py-2.5 rounded-xl uppercase tracking-[0.2em] shadow-lg hover:invert transition-all">
                   Authenticate to Join
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
