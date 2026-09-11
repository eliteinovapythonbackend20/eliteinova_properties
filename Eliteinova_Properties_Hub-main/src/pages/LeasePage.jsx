import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import leaseBanner from "../assets/leaseBanner.jpg";

const LeasePage = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("Lease");
  const [openDropdown, setOpenDropdown] = useState(null);

  const propertyTypes = {
    Individual: ["Individual House", "Individual Villa"],
    Apartment: ["Independent Apartment", "Builder Apartment", "Services", "Studio"],
    Commercial: [
      "Ready to move Office space",
      "Co Working Office space",
      "Shop",
      "Factory",
      "Farmhouse",
      "Showrooms",
    ],
    "Land & Plots": ["Industrial Land", "Agricultural Land"],
    Hostel: ["PG", "Hostel", "Co Living Space"],
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Banner Section */}
      <section
  className="w-full min-h-[260px] md:min-h-[340px] px-4 bg-cover bg-center relative flex items-center"
  style={{
    backgroundImage: `url(${leaseBanner})`,
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Content */}
  <div className="max-w-6xl mx-auto relative z-10 text-center">
    <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
      Lease Properties for Your Business
    </h1>
    <p className="text-white text-sm md:text-lg drop-shadow-md">
      Find the perfect commercial space on lease
    </p>
  </div>
</section>


      {/* Filter Section */}
      <section className="max-w-6xl mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Buy/Rent/Lease Toggle Dropdown */}
          <div className="relative order-1">
            <button
              onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
              className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-white font-medium text-xs md:text-sm flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all"
              style={{
                background: "linear-gradient(135deg, #00695C, #26A69A)",
              }}
            >
              {activeButton}
              <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
            </button>

            {openDropdown === "toggle" && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg overflow-hidden z-50 min-w-[120px] md:min-w-[140px] border border-gray-100">
                <button
                  onClick={() => {
                    navigate("/buy");
                    setActiveButton("Buy");
                    setOpenDropdown(null);
                  }}
                  className="w-full px-3 md:px-4 py-2 text-left text-xs md:text-sm hover:bg-teal-50 transition-colors text-gray-700"
                >
                  Buy
                </button>
                <div className="h-px bg-gray-100"></div>
                <button
                  onClick={() => {
                    navigate("/rent");
                    setActiveButton("Rent");
                    setOpenDropdown(null);
                  }}
                  className="w-full px-3 md:px-4 py-2 text-left text-xs md:text-sm hover:bg-teal-50 transition-colors text-gray-700"
                >
                  Rent
                </button>
                <div className="h-px bg-gray-100"></div>
                <button
                  onClick={() => {
                    navigate("/lease");
                    setActiveButton("Lease");
                    setOpenDropdown(null);
                  }}
                  className="w-full px-3 md:px-4 py-2 text-left text-xs md:text-sm font-semibold transition-colors"
                  style={{ color: "#00695C", backgroundColor: "#e0f2f1" }}
                >
                  Lease
                </button>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 md:flex-initial md:w-72 min-w-0 order-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Enter city, localities"
              className="w-full px-3 md:px-4 py-1.5 md:py-2 rounded-full border-0 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#00695C] shadow-sm text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Property Type Dropdowns */}
          {Object.entries(propertyTypes).map(([type, subtypes]) => (
            <div key={type} className="relative order-3">
              <button
                onClick={() => setOpenDropdown(openDropdown === type ? null : type)}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-white font-medium text-xs md:text-sm flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, #00695C, #26A69A)",
                }}
              >
                {type}
                <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
              </button>

              {openDropdown === type && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg overflow-hidden z-50 min-w-[180px] md:min-w-[220px] border border-gray-100">
                  {subtypes.map((subtype, index) => (
                    <React.Fragment key={subtype}>
                      <button
                        className="w-full px-3 md:px-4 py-2 text-left text-xs md:text-sm hover:bg-teal-50 transition-colors text-gray-700"
                      >
                        {subtype}
                      </button>
                      {index < subtypes.length - 1 && <div className="h-px bg-gray-100"></div>}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Properties Listing Section */}
      <section className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 text-center border border-gray-100">
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #00695C, #26A69A)",
            }}
          >
            <span className="text-white text-2xl md:text-3xl">🏢</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Properties Coming Soon
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            We're currently adding lease properties to our database. Check back soon!
          </p>
        </div>
      </section>
    </div>
  );
};

export default LeasePage;