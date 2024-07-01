import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Polyline,
  Polygon,
} from "@react-google-maps/api";
import getData from "./mondal.js"; // Adjust the path as per your project structure
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";

const getRandomColor = () => {
  // Generate random color in hexadecimal format
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
  ``;
};

const MapComponent = ({ selectedLocation }) => {
  let [boundaryGeoJson, setBoundaryGeoJson] = useState([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
    libraries: ["places"],
  });
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    // Simulate loading GeoJSON data (replace with actual fetch or import)
    setTimeout(() => {
      (async () => {
        let a = getData();
        setBoundaryGeoJson(a);
        setGeoJsonData(boundaryGeoJson);
      })();
    }, 10000);
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

            if (feature.geometry.type === "LineString") {
              const paths = feature.geometry.coordinates.map((coord) => ({
                lat: coord[1],
                lng: coord[0],
              }));

              return (
                <React.Fragment key={index}>
                  <Polyline
                    path={paths}
                    options={{
                      strokeColor: randomColor,
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                    }}
                  />
                </React.Fragment>
              );
            }

            if (feature.geometry.type === "Polygon") {
              const paths = feature.geometry.coordinates[0].map((coord) => ({
                lat: coord[1],
                lng: coord[0],
              }));

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
                </React.Fragment>
              );
            }

            return null;
          })}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
