import React from "react";
import postpropertyimage from "../assets/postpropertyimage.jpg";

const HEADER_HEIGHT = "96px"; // must match Header total height

const PostPropertyPage = ({ onPostPropertyClick }) => {
  const propertyTypes = [
    "Owner",
    "Agent",
    "Builder",
    "Hostel",
    "Property Management",
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* ✅ HERO — NO GAP */}
      <section
         className="w-full h-[250px] px-4 bg-center bg-cover bg-no-repeat"
        style={{
          paddingTop: `calc(${HEADER_HEIGHT} + 16px)`, // ✅ fills background
          paddingBottom: "3rem",
          backgroundImage: `url(${postpropertyimage})`,
        }}
      >
        <div className="max-w-6xl mx-auto rounded-lg py-6 px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
            Post Your Property
          </h1>
          <p className="text-white text-center mt-2 text-sm md:text-base">
            Choose the type of listing you want to create
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-none mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {propertyTypes.map((type) => (
            <button
  key={type}
  onClick={() => {
    if (type === "Builder") {
      onPostPropertyClick?.("Builder");
    } else {
      onPostPropertyClick?.(type);
    }
  }}
  className="h-14 rounded-xl text-white text-lg font-semibold shadow-md hover:scale-105 transition-transform"
  style={{
    background: "linear-gradient(135deg, #00695C, #26A69A)",
  }}
>
  {type}
</button>

          ))}
        </div>

        <div className="mt-10 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Why Post With Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ["No Brokerage", "List your property without any commission fees"],
              ["Wide Reach", "Connect with thousands of potential buyers"],
              ["Quick & Easy", "Simple process to list your property online"],
            ].map((item, index) => (
              <div key={index} className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #00695C, #26A69A)",
                  }}
                >
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{item[0]}</h3>
                  <p className="text-sm text-gray-600">{item[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostPropertyPage;

