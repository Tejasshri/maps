import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Polygon,
  Marker,
} from "@react-google-maps/api";
import boundaryGeoJSON from "./boundary.js"; // Adjust the path as per your project structure
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";

const getRandomColor = () => {
  // Generate random color in hexadecimal format
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const MapComponent = ({ selectedLocation }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
    libraries: ["places"],
  });
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    // Simulate loading GeoJSON data (replace with actual fetch or import)
    setTimeout(() => {
      setGeoJsonData(boundaryGeoJSON);
    }, 1000);
  }, []);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: selectedLocation.lat || 17.385044, // Default to Hyderabad's center if selectedLocation is not available
    lng: selectedLocation.lng || 78.486671,
  };

  const zoom = 10;

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}>
        {geoJsonData &&
          geoJsonData.features.map((feature, index) => {
            const randomColor = getRandomColor();
            const paths = feature.geometry.coordinates[0].map((coord) => ({
              lat: coord[1],
              lng: coord[0],
            }));

            // Calculate center for pincode label
            const bounds = new window.google.maps.LatLngBounds();
            paths.forEach((path) => {
              bounds.extend(path);
            });
            const center = {
              lat: bounds.getCenter().lat(),
              lng: bounds.getCenter().lng(),
            };

            return (
              <React.Fragment key={index}>
                <Polygon
                  paths={paths}
                  options={{
                    strokeColor: randomColor,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: randomColor,
                    fillOpacity: 0.35,
                  }}
                />
                {/* Display pincode name as Marker */}
                {/* <Marker
                  position={center}
                  label={feature.properties.name} // Adjust according to your GeoJSON structure
                /> */}
              </React.Fragment>
            );
          })}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
