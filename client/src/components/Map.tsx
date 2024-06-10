import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

interface Location {
  latitude: number;
  longitude: number;
}

function Map() {
  const [location, setLocation] = useState<Location | null>(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  useEffect(() => {
    getLocation();
    console.log(location?.latitude, location?.longitude);
  }, [location?.latitude, location?.longitude]);

  return (
    <div className="h-full" id="map">
      <MapContainer
        style={{ height: "400px", zIndex: "0" }}
        center={[27.041, 88.2663]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[27.041, 88.2663]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
            <span>kkkkk</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
