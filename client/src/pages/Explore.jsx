import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useTheme } from '../context/ThemeContext';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export function Explore() {
  const { isDark } = useTheme();
  const center = [27.986065, 86.922623]; 
  
  const sampleTreks = [
    { id: 1, title: 'EVEREST BASE', position: [28.006, 86.852], difficulty: 'HARD' },
    { id: 2, title: 'ANNAPURNA', position: [28.53, 84.14], difficulty: 'HARD' },
    { id: 3, title: 'POON HILL', position: [28.4, 83.7], difficulty: 'MODERATE' },
  ];

  return (
    <div className="flex-1 flex flex-col pt-8 bg-white dark:bg-[#0a0a0a] transition-colors pb-8">
      <div className="max-w-7xl mx-auto px-4 w-full mb-8 flex justify-between items-end border-b-2 border-black dark:border-white pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-widest uppercase text-black dark:text-white">Coordinate <br/>Map</h1>
        </div>
        <div className="flex gap-4">
           <button className="bg-transparent border-2 border-black dark:border-white text-black dark:text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all">
             Filter
           </button>
           <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 text-xs font-bold uppercase tracking-widest">
             Deploy All
           </button>
        </div>
      </div>
      
      <div className="flex-1 max-w-7xl mx-auto px-4 w-full h-[600px] relative border-2 border-black dark:border-white overflow-hidden p-[2px]">
        <MapContainer center={center} zoom={7} className="h-full w-full bg-neutral-200 dark:bg-transparent" zoomControl={false}>
          {/* Black and white maps are achieved effectively by strong grayscale filters mapping them to neutral */}
          <TileLayer
            attribution='&copy; OSM'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className={isDark ? "map-tiles" : "filter grayscale contrast-125 brightness-110"}
          />
          
          {sampleTreks.map(trek => (
            <Marker key={trek.id} position={trek.position}>
              <Popup className="custom-popup">
                <div className="font-sans px-2 pb-2 pt-1 border border-black text-center min-w-[150px]">
                  <h3 className="font-black text-black uppercase tracking-widest border-b border-black pb-2 mb-2">{trek.title}</h3>
                  <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest mb-4">
                    CLASS: {trek.difficulty}
                  </p>
                  <button className="text-xs font-bold bg-black text-white px-4 py-2 uppercase tracking-widest w-full hover:bg-neutral-800 transition-colors">
                    Load Metric
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        <style dangerouslySetInnerHTML={{__html: `
          /* Brutalist Popup Override */
          .custom-popup .leaflet-popup-content-wrapper {
            border-radius: 0;
            background: white;
            box-shadow: 6px 6px 0px 0px rgba(0,0,0,1);
            border: 2px solid black;
          }
          .custom-popup .leaflet-popup-tip-container { display: none; }
        `}} />
      </div>
    </div>
  );
}
