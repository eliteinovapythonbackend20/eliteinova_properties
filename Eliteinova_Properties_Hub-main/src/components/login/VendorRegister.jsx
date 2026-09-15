// src/components/login/VendorRegister.jsx
import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, ArrowRight, Phone, MapPin, CheckCircle, Building, Globe, Home, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';

const VendorRegister = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    companyName: '',
    password: '',
    confirmPassword: '',
    role:"vendor",
  });
  const {register} = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setError('Please enter your mobile number');
      return;
    }

    if (formData.phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!formData.address.trim()) {
      setError('Please enter your address');
      return;
    }

    if (!formData.city.trim()) {
      setError('Please enter your city');
      return;
    }

    if (!formData.state.trim()) {
      setError('Please enter your state');
      return;
    }

    if (!formData.country.trim()) {
      setError('Please enter your country');
      return;
    }

    if (!formData.companyName.trim()) {
      setError('Please enter your company name');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await register(formData);
      if (!res?.success) {
        const message = res?.error?.message || 'Registration failed. Please try again.';
        setError(message);
        showToast(message, 'error');
        return;
      }
      showToast('Vendor account created successfully!', 'success');
      setSuccess(true);
      setTimeout(() => {
        handleClose();
        navigate('/');
      }, 2000);
    } catch (err) {
      const message = err?.message || 'Registration failed. Please try again.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form data
    setFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      address: '',
      city: '',
      state: '',
      country: '',
      companyName: '',
      password: '',
      confirmPassword: '',
      role:"vendor",
      agreeTerms: false
    });
    setError('');
    setLoading(false);
    setSuccess(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade" 
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-dropdown" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-[#004D40] via-[#00695C] to-[#26A69A] px-6 py-6 sticky top-0 z-10">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${6 + Math.random() * 12}s`,
                }}
              />
            ))}
          </div>
          
          <button 
            onClick={handleClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group z-20"
          >
            <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Vendor Registration</h2>
                <p className="text-white/80 text-sm">Create your vendor account and list properties</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8 animate-scale">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Vendor Registration Successful!</h3>
              <p className="text-gray-600">Welcome to Eliteinova Properties. Redirecting to vendor dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2 animate-shake">
                  <span className="text-lg">⚠️</span>
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3 py-3 bg-[#E8F5E9]/30 border-2 border-[#26A69A]/20 rounded-xl focus:outline-none focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    className="w-full pl-10 pr-3 py-3 bg-[#E8F5E9]/30 border-2 border-[#26A69A]/20 rounded-xl focus:outline-none focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3 py-3 bg-[#E8F5E9]/30 border-2 border-[#26A69A]/20 rounded-xl focus:outline-none focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Email ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vendor@company.com"
                    className="w-full pl-10 pr-3 py-3 bg-[#E8F5E9]/30 border-2 border-[#26A69A]/20 rounded-xl focus:outline-none focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 w-4 h-4 text-[#26A69A]" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your complete address"
                    rows="2"
                    className="w-full pl-10 pr-3 py-3 bg-[#E8F5E9]/30 border-2 border-[#26A69A]/20 rounded-xl focus:outline-none focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]/20 transition-all duration-300 text-gray-800 placeholder-gray-400 resize-none"
                    required
                  />
                </div>
              </div>

              {/* City, State, Country - 3 Column Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      className="w-full pl-8 pr-2 py-3 text-sm bg-[#E8F5E9]/30 border-2 border-[#26A69A]/20 rounded-xl focus:outline-none focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    State <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      className="w-full pl-8 pr-2 py-3 text-sm bg-[#E8F5E9]/30 border-2 border-[#26A69A]/20 rounded-xl focus:outline-none focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="India"
                      className="w-full pl-8 pr-2 py-3 text-sm bg-[#E8F5E9]/30 border-2 border-[#26A69A]/20 rounded-xl focus:outline-none focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    className="w-full pl-10 pr-12 py-3 bg-[#E8F5E9]/30 border-2 border-[#26A69A]/20 rounded-xl focus:outline-none focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#26A69A] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-12 py-3 bg-[#E8F5E9]/30 border-2 border-[#26A69A]/20 rounded-xl focus:outline-none focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#26A69A] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#26A69A]/30 text-[#26A69A] focus:ring-[#26A69A] focus:ring-offset-0 mt-1"
                  required
                />
                <label className="text-sm text-gray-600">
                  I agree to the{' '}
                  <button type="button" className="text-[#26A69A] hover:text-[#00695C] font-medium">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-[#26A69A] hover:text-[#00695C] font-medium">
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#004D40] to-[#00695C] text-white font-semibold rounded-xl hover:from-[#003D33] hover:to-[#004D40] transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-[#00695C]/25 hover:shadow-xl hover:shadow-[#00695C]/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Vendor Account...
                  </div>
                ) : (
                  <>
                    Register as Vendor
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {!success && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have a vendor account?{' '}
                <button
                  onClick={() => {
                    onSwitchToLogin?.();
                  }}
                  className="text-[#26A69A] font-semibold hover:text-[#00695C] transition-colors"
                >
                  Login here
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scale {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale {
          animation: scale 0.5s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.2; }
          25% { transform: translateY(-20px) translateX(15px) rotate(90deg); opacity: 0.5; }
          50% { transform: translateY(-12px) translateX(-12px) rotate(180deg); opacity: 0.7; }
          75% { transform: translateY(12px) translateX(18px) rotate(270deg); opacity: 0.3; }
        }
        .animate-float-particle {
          animation: float-particle 10s ease-in-out infinite;
        }
        @keyframes dropdown {
          from { opacity: 0; transform: translateY(-6px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out forwards;
        }
        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade {
          animation: fade 0.25s ease-out forwards;
        }
      `}</style>
      <Toast toast={toast} />
    </div>
  );
};

export default VendorRegister;