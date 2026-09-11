
// components/propertycard/PropertyList.jsx
import React, { useState } from 'react';
import PropertyCard from './propertyCard';

const PropertyList = ({ 
  properties = [], 
  emptyMessage = 'No properties available at the moment.',
  emptyIcon = '🔍',
  emptyTitle = 'No Properties Found',
  onContactClick // Optional custom handler
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const handleContactClick = (property) => {
    setSelectedProperty(property);
    setShowLoginModal(true);
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    setShowContactInfo(true);
    setTimeout(() => setShowContactInfo(false), 5000);
  };

  // If custom handler is provided, use it
  const handleContact = onContactClick || handleContactClick;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-teal-100/50 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="w-full">
          <div className="flex flex-col gap-5">
            {properties.length > 0 ? (
              properties.map((item) => (
                <PropertyCard 
                  key={item.id} 
                  property={item} 
                  onContactClick={() => handleContact(item)} 
                />
              ))
            ) : (
              <div className="w-full bg-white rounded-2xl shadow-2xl border border-teal-100 p-8 text-center">
                <div className="text-5xl mb-3">{emptyIcon}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{emptyTitle}</h3>
                <p className="text-xs text-slate-500">{emptyMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-start justify-center pt-[140px] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <div className="w-14 h-14 bg-gradient-to-br from-[#00695C] to-[#26A69A] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-xl text-white">🔒</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 text-center mb-1">Unlock Contact</h3>
            <p className="text-gray-500 text-xs text-center mb-4">Login to view contact details</p>
            <button onClick={handleLogin} className="w-full bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white py-2 rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition">
              Continue to Login
            </button>
            <button onClick={() => setShowLoginModal(false)} className="w-full mt-2 text-gray-500 text-xs py-1.5">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CONTACT TOAST - real contact reveal (with lead capture + vendor notification)
          is a separate, not-yet-built backend flow. This is a placeholder so we never
          show a fake phone/email. */}
      {showContactInfo && selectedProperty && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl shadow-2xl p-2.5 z-[9999] animate-slideIn max-w-[260px] sm:max-w-sm">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded-full text-xs">📞</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[10px]">Contact reveal coming soon</p>
              <p className="text-[9px]">We're setting up a way to connect you with the {selectedProperty.postedBy?.role || 'lister'} directly.</p>
            </div>
            <button onClick={() => setShowContactInfo(false)} className="text-white/70 text-sm shrink-0">
              ✕
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes pulse-green { 0%, 100% { box-shadow: 0 0 5px rgba(34,197,94,0.5); transform: rotate(0deg); } 50% { box-shadow: 0 0 20px rgba(34,197,94,0.8); transform: rotate(5deg); } }
        @keyframes rotate-slow { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } }
        @keyframes blinkText { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.97); } }
        .blink-text { animation: blinkText 0.8s ease-in-out infinite; display: inline-block; }
        @keyframes tagJump {
          0%, 100% { transform: translateY(0px) scale(1); box-shadow: 0 0 20px rgba(0,0,0,0.4), 0 0 10px rgba(0,105,92,0.8); }
          50% { transform: translateY(-7px) scale(1.05); box-shadow: 0 0 30px rgba(0,0,0,0.6), 0 0 20px rgba(0,105,92,1), 0 5px 15px rgba(0,0,0,0.5); }
        }
        @keyframes contactPulse {
          0%, 100% { box-shadow: 0 8px 20px rgba(0,105,92,0.3); }
          50% { box-shadow: 0 8px 25px rgba(0,105,92,0.5), 0 0 0 3px rgba(38,166,154,0.2); }
        }
        .tag-animation { animation: tagJump 1.5s ease-in-out infinite; }
        .contact-button { animation: contactPulse 2s ease-in-out infinite; position: relative; overflow: hidden; }
        .contact-button::before { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; border-radius: 50%; background: rgba(255,255,255,0.3); transform: translate(-50%,-50%); transition: width 0.6s, height 0.6s; }
        .contact-button:hover::before { width: 300px; height: 300px; }
        .contact-button:hover { animation: none; }
        .pulse-green { animation: pulse-green 2s infinite; }
        .rotate-slow { animation: rotate-slow 3s infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default PropertyList;