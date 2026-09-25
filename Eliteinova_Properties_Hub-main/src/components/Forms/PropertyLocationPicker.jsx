import React, { useEffect, useState } from "react";
import { MapPin, X, Check } from "lucide-react";
import usePropertyLocation from "../../hooks/usePropertyLocation";

const PropertyLocationPicker = ({
  initialLocation = {},
  onLocationChange,
  onLocationError,
  label = "Pick location",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState("");

  const {
    mapContainerRef,
    location,
    loading,
    mapLoading,
    error,
  } = usePropertyLocation({
    initialLocation,
    onLocationChange,
  });

  /*
   * Show toast when Google Maps or reverse geocoding fails.
   */
  useEffect(() => {
    if (!error) return;

    const message =
      "Unable to get the location. Please enter the location manually.";

    setToast(message);

    if (typeof onLocationError === "function") {
      onLocationError(error);
    }

    const timer = setTimeout(() => {
      setToast("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [error, onLocationError]);

  /*
   * Open the map.
   */
  const openPicker = () => {
    setIsOpen(true);
  };

  /*
   * Close without applying anything.
   */
  const closePicker = () => {
    setIsOpen(false);
  };

  /*
   * Confirm selected location.
   *
   * The hook has already sent the location through
   * onLocationChange, so this only closes the picker.
   */
  const useSelectedLocation = () => {
    if (
      location.latitude === null ||
      location.longitude === null
    ) {
      setToast(
        "Please select a location on the map first."
      );

      setTimeout(() => {
        setToast("");
      }, 3000);

      return;
    }

    setIsOpen(false);
  };

  return (
    <>
      {/* Location button */}
      <button
        type="button"
        onClick={openPicker}
        title={label}
        aria-label={label}
        className="
          inline-flex items-center justify-center
          w-7 h-7
          rounded-md
          border border-[#00695C]/20
          text-[#00695C]
          bg-[#00695C]/5
          hover:bg-[#00695C]/10
          transition-colors
        "
      >
        <MapPin className="w-4 h-4" />
      </button>

      {/* Map modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div>
                <h3 className="text-sm font-semibold text-[#00695C]">
                  Select Location
                </h3>

                <p className="text-[10px] text-gray-500 mt-0.5">
                  Click on the map to select the location.
                </p>
              </div>

              <button
                type="button"
                onClick={closePicker}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Map */}
            <div className="p-3">
              <div
                ref={mapContainerRef}
                className="w-full h-[350px] rounded-lg overflow-hidden border border-gray-200"
              />

              {mapLoading && (
                <p className="text-[10px] text-gray-500 mt-2">
                  Loading map...
                </p>
              )}

              {loading && (
                <p className="text-[10px] text-gray-500 mt-2">
                  Finding address...
                </p>
              )}

              {/* Selected location */}
              {location.latitude !== null &&
                location.longitude !== null && (
                  <div className="mt-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-medium text-gray-700">
                      {location.address ||
                        "Location selected"}
                    </p>

                    {location.city && (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {location.area
                          ? `${location.area}, `
                          : ""}
                        {location.city}
                        {location.pinCode
                          ? ` - ${location.pinCode}`
                          : ""}
                      </p>
                    )}

                    <p className="text-[9px] text-gray-400 mt-1">
                      {location.latitude.toFixed(6)},{" "}
                      {location.longitude.toFixed(6)}
                    </p>
                  </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-4 py-3 border-t bg-gray-50">
              <button
                type="button"
                onClick={closePicker}
                className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={useSelectedLocation}
                disabled={
                  loading ||
                  location.latitude === null ||
                  location.longitude === null
                }
                className="
                  px-3 py-1.5
                  text-xs
                  rounded-md
                  bg-[#00695C]
                  text-white
                  flex items-center gap-1
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <Check className="w-3.5 h-3.5" />
                Use Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[200] max-w-sm px-4 py-3 rounded-lg bg-gray-900 text-white shadow-xl">
          <p className="text-xs">
            {toast}
          </p>
        </div>
      )}
    </>
  );
};

export default PropertyLocationPicker;