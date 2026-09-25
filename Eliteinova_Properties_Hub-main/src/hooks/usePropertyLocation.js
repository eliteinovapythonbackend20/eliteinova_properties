import { useCallback, useEffect, useRef, useState } from "react";

let googleMapsPromise = null;

/**
 * Loads Google Maps JavaScript API only once.
 */
const loadGoogleMaps = () => {
  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return Promise.reject(
      new Error("VITE_GOOGLE_MAPS_API_KEY is not configured.")
    );
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[data-google-maps="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        resolve(window.google.maps);
      });

      existingScript.addEventListener("error", () => {
        reject(new Error("Failed to load Google Maps."));
      });

      return;
    }

    const script = document.createElement("script");

    script.src =
      `https://maps.googleapis.com/maps/api/js` +
      `?key=${encodeURIComponent(apiKey)}` +
      `&loading=async`;

    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";

    script.onload = () => {
      if (window.google?.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error("Google Maps loaded but is unavailable."));
      }
    };

    script.onerror = () => {
      reject(new Error("Failed to load Google Maps."));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};


/**
 * Reusable property-location hook.
 *
 * Responsibilities:
 * - Load Google Maps
 * - Create/manage map
 * - Handle map clicks
 * - Place/move marker
 * - Reverse geocode coordinates
 * - Return address/city/area/state/country/pincode
 * - Return latitude/longitude
 *
 * The hook does NOT know anything about a particular form.
 */
const usePropertyLocation = ({
  initialLocation = {},
  onLocationChange,
  defaultCenter = {
    lat: 20.5937,
    lng: 78.9629,
  },
  defaultZoom = 5,
} = {}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);

  const [location, setLocationState] = useState({
    address: initialLocation.address || "",
    city: initialLocation.city || "",
    area: initialLocation.area || "",
    landmark: initialLocation.landmark || "",
    pinCode:
      initialLocation.pinCode ||
      initialLocation.pincode ||
      "",
    state: initialLocation.state || "",
    country: initialLocation.country || "",
    latitude:
      typeof initialLocation.latitude === "number"
        ? initialLocation.latitude
        : null,
    longitude:
      typeof initialLocation.longitude === "number"
        ? initialLocation.longitude
        : null,
  });

  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Updates both local hook state and parent form.
   */
  const updateLocation = useCallback(
    (newLocation) => {
      setLocationState(newLocation);

      if (typeof onLocationChange === "function") {
        onLocationChange(newLocation);
      }
    },
    [onLocationChange]
  );


  /**
   * Extract useful address components from Google Geocoder result.
   */
  const extractAddressComponents = useCallback((result) => {
    const components = result?.address_components || [];

    const getComponent = (types) => {
      const component = components.find((item) =>
        types.some((type) => item.types.includes(type))
      );

      return component?.long_name || "";
    };

    const city =
      getComponent(["locality"]) ||
      getComponent(["administrative_area_level_2"]);

    const area =
      getComponent(["sublocality_level_1"]) ||
      getComponent(["sublocality"]) ||
      getComponent(["neighborhood"]) ||
      getComponent(["administrative_area_level_3"]);

    const state = getComponent(["administrative_area_level_1"]);

    const country = getComponent(["country"]);

    const pinCode = getComponent(["postal_code"]);

    return {
      address: result?.formatted_address || "",
      city,
      area,
      state,
      country,
      pinCode,
    };
  }, []);


  /**
   * Reverse geocode selected coordinates.
   */
  const reverseGeocode = useCallback(
    async (latLng) => {
      if (!geocoderRef.current) {
        throw new Error("Google Geocoder is not initialized.");
      }

      const response = await geocoderRef.current.geocode({
        location: latLng,
      });

      if (!response.results || response.results.length === 0) {
        throw new Error("No address found for this location.");
      }

      return response.results[0];
    },
    []
  );


  /**
   * Update marker position.
   */
  const updateMarker = useCallback(
    async (position) => {
      if (!mapRef.current) {
        return;
      }

      const { AdvancedMarkerElement } =
        await window.google.maps.importLibrary("marker");

      if (!markerRef.current) {
        markerRef.current = new AdvancedMarkerElement({
          map: mapRef.current,
          position,
          title: "Selected property location",
        });
      } else {
        markerRef.current.position = position;
        markerRef.current.map = mapRef.current;
      }
    },
    []
  );


  /**
   * Select a location from the map.
   */
  const selectLocation = useCallback(
    async (latitude, longitude) => {
      if (
        typeof latitude !== "number" ||
        typeof longitude !== "number"
      ) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const position = {
          lat: latitude,
          lng: longitude,
        };

        await updateMarker(position);

        if (mapRef.current) {
          mapRef.current.panTo(position);
          mapRef.current.setZoom(16);
        }

        const result = await reverseGeocode(position);

        const addressData = extractAddressComponents(result);

        const newLocation = {
          address: addressData.address,
          city: addressData.city,
          area: addressData.area,
          landmark: location.landmark || "",
          pinCode: addressData.pinCode,
          state: addressData.state,
          country: addressData.country,
          latitude,
          longitude,
        };

        updateLocation(newLocation);
      } catch (err) {
        console.error("Location selection failed:", err);

        setError(
          err?.message ||
            "Unable to determine the address for this location."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      extractAddressComponents,
      location.landmark,
      reverseGeocode,
      updateLocation,
      updateMarker,
    ]
  );


  /**
   * Handle user clicking the map.
   */
  const handleMapClick = useCallback(
    (event) => {
      if (!event.latLng) {
        return;
      }

      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();

      selectLocation(latitude, longitude);
    },
    [selectLocation]
  );


  /**
   * Initialize Google Map.
   */
  const initializeMap = useCallback(async () => {
    if (!mapContainerRef.current) {
      return;
    }

    if (mapRef.current) {
      return;
    }

    setMapLoading(true);
    setError("");

    try {
      await loadGoogleMaps();

      const [{ Map }, { AdvancedMarkerElement }, { Geocoder }] =
        await Promise.all([
          window.google.maps.importLibrary("maps"),
          window.google.maps.importLibrary("marker"),
          window.google.maps.importLibrary("geocoding"),
        ]);

      geocoderRef.current = new Geocoder();

      const hasInitialCoordinates =
        typeof location.latitude === "number" &&
        typeof location.longitude === "number";

      const center = hasInitialCoordinates
        ? {
            lat: location.latitude,
            lng: location.longitude,
          }
        : defaultCenter;

      const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

      if (!mapId) {
        throw new Error(
          "VITE_GOOGLE_MAPS_MAP_ID is not configured."
        );
      }

      mapRef.current = new Map(mapContainerRef.current, {
        center,
        zoom: hasInitialCoordinates ? 16 : defaultZoom,
        mapId,

        // Keep the map focused on selecting a property location.
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        clickableIcons: false,
      });

      mapRef.current.addListener("click", handleMapClick);

      // Restore existing marker when editing an existing property.
      if (hasInitialCoordinates) {
        markerRef.current = new AdvancedMarkerElement({
          map: mapRef.current,
          position: center,
          title: "Selected property location",
        });
      }
    } catch (err) {
      console.error("Google Maps initialization failed:", err);

      setError(
        err?.message ||
          "Unable to load Google Maps."
      );
    } finally {
      setMapLoading(false);
    }
  }, [
    defaultCenter,
    defaultZoom,
    handleMapClick,
    location.latitude,
    location.longitude,
  ]);


  /**
   * Clear selected location.
   */
  const clearLocation = useCallback(() => {
    if (markerRef.current) {
      markerRef.current.map = null;
      markerRef.current = null;
    }

    const emptyLocation = {
      address: "",
      city: "",
      area: "",
      landmark: "",
      pinCode: "",
      state: "",
      country: "",
      latitude: null,
      longitude: null,
    };

    updateLocation(emptyLocation);
    setError("");
  }, [updateLocation]);


  /**
   * Manually update location data.
   *
   * Useful when existing form fields are edited manually.
   */
  const setLocation = useCallback(
    (updates) => {
      setLocationState((previous) => {
        const updated = {
          ...previous,
          ...updates,
        };

        if (typeof onLocationChange === "function") {
          onLocationChange(updated);
        }

        return updated;
      });
    },
    [onLocationChange]
  );


  /**
   * Initialize map when the map container exists.
   */
  useEffect(() => {
    initializeMap();

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }

      mapRef.current = null;
      geocoderRef.current = null;
    };
  }, [initializeMap]);


  return {
    // Map
    mapContainerRef,

    // Location data
    location,

    // Location actions
    selectLocation,
    setLocation,
    clearLocation,

    // Status
    loading,
    mapLoading,
    error,
  };
};

export default usePropertyLocation;