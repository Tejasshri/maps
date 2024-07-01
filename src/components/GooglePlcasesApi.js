import React, { useEffect, useRef, useState } from "react";
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";

const SearchLocationInput = ({ setSelectedLocation }) => {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);
  const [autoComplete, setAutoComplete] = useState(null); // State to hold Autocomplete instance

  const handleScriptLoad = () => {
    const autoCompleteInstance = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      {
        // types: ["(cities)"],
        componentRestrictions: { country: "IN" },
      }
    );

    autoCompleteInstance.addListener("place_changed", handlePlaceSelect);
    setAutoComplete(autoCompleteInstance); // Store Autocomplete instance in state
  };

  const handlePlaceSelect = () => {
    const addressObject = autoComplete.getPlace();
    const query = addressObject.formatted_address;
    setQuery(query);
    const latLng = {
      lat: addressObject?.geometry?.location?.lat(),
      lng: addressObject?.geometry?.location?.lng(),
    };
    setSelectedLocation(latLng);
  };

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_KEY}&libraries=places`;
      script.async = true;
      script.onload = handleScriptLoad;

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else {
      handleScriptLoad();
    }
  }, []);

  return (
    <div className="search-location-input">
      <label>Type in your suburb or postcode</label>
      <input
        ref={autoCompleteRef}
        className="form-control"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search Places ..."
        value={query}
      />
    </div>
  );
};

export default SearchLocationInput;
