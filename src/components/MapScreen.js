import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  LoadScript,
  GoogleMap,
  StandaloneSearchBox,
  Marker,
} from "@react-google-maps/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLocation, setAddress } from "../features/locationSlice";
import Button from "react-bootstrap/Button";
import toast from "react-hot-toast";

const defaultLocation = { lat: 45.516, lng: -73.56 };
const libs = ["places"];

export default function MapScreen(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [center, setCenter] = useState(defaultLocation);
  const [currentLoc, setCurrentLoc] = useState(defaultLocation);
  const { search } = useLocation();

  const mapRef = useRef(null);
  const placeRef = useRef(null);
  const markerRef = useRef(null);

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by this browser");
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const newLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("User current location:", newLoc);
        setCenter(newLoc);
        setCurrentLoc(newLoc);
        dispatch(setLocation(newLoc));
      });
    }
  };

  useEffect(() => {
    getUserCurrentLocation();
  }, [dispatch]);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const onIdle = () => {
    if (mapRef.current) {
      const newLoc = {
        lat: mapRef.current.center.lat(),
        lng: mapRef.current.center.lng(),
      };
      console.log("Map idle, new location:", newLoc);
      setCurrentLoc(newLoc);
      dispatch(setLocation(newLoc));
    }
  };

  const onLoadPlaces = (ref) => {
    placeRef.current = ref;
  };

  const onPlacesChanged = () => {
    const places = placeRef.current.getPlaces();
    if (!places || places.length === 0) {
      console.log("No place selected.");
      return;
    }
    const place = places[0].geometry.location;
    const newCenter = { lat: place.lat(), lng: place.lng() };
    console.log("Place selected:", newCenter);
    setCenter(newCenter);
    setCurrentLoc(newCenter);
    dispatch(setLocation(newCenter));
  };

  const onMarkerLoad = (marker) => {
    markerRef.current = marker;
  };

  const onConfirm = () => {
    console.log("Confirm clicked. Current location:", currentLoc);
    if (props.setLat) props.setLat(currentLoc.lat);
    if (props.setLong) props.setLong(currentLoc.lng);

    const getAddress = (lat, lng, apiKey) => {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const addressComponents = data.results[0].address_components;
            let city = "",
              state = "",
              country = "";
            addressComponents.forEach((component) => {
              if (component.types.includes("locality")) {
                city = component.long_name;
              }
              if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
              }
              if (component.types.includes("country")) {
                country = component.long_name;
              }
            });
            const locationObj = { city, state, country };
            console.log("Location object:", locationObj);
            if (props.setAddr) props.setAddr(locationObj);
            dispatch(setAddress(locationObj));
          } else {
            console.log("No address found");
            if (props.setAddr)
              props.setAddr({ city: "", state: "", country: "" });
          }
        })
        .catch((error) => {
          console.error("Error fetching address:", error);
          if (props.setAddr) props.setAddr("Error fetching address");
        });
    };

    getAddress(
      currentLoc.lat,
      currentLoc.lng,
      "AIzaSyBSZZvJRvcyx0KWNbGIMhDbN1STwJWHZcs"
    );
    toast.success("Location selected successfully.");
  };

  return (
    <div className="full-box" style={{ height: "100%", width: "100%" }}>
      <LoadScript
        libraries={libs}
        googleMapsApiKey="AIzaSyBSZZvJRvcyx0KWNbGIMhDbN1STwJWHZcs"
      >
        <GoogleMap
          id="sample-map"
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onIdle={onIdle}
        >
          <StandaloneSearchBox
            onLoad={onLoadPlaces}
            onPlacesChanged={onPlacesChanged}
          >
            <div
              className="map-input-box"
              style={{
                margin: "10px",
                display: "flex",
                gap: "10px",
                pointerEvents: "auto",
              }}
            >
              <input
                type="text"
                placeholder="Enter your address"
                className="form-control"
                style={{ pointerEvents: "auto" }}
              />
            </div>
          </StandaloneSearchBox>
          <Marker position={currentLoc} onLoad={onMarkerLoad} />
        </GoogleMap>
      </LoadScript>
      <div style={{ margin: "10px", display: "flex", gap: "10px" }}>
        <Button type="button" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  );
}
