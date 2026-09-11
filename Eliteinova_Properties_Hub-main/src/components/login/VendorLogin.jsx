// src/components/login/VendorLogin.jsx
import React, { useState, useEffect } from 'react';
import { X, Building, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const VendorLogin = ({ isOpen, onClose, onSwitchToRegister }) => {

  const {login} = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    setLoading(true);
    setError('');

    try {
      const res = await login(formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Vendor Login:', formData);
      handleClose();
      navigate('/profile/owner')
      // navigate('/vendor-dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form data
    setFormData({
      email: '',
      password: '',
    });
    setError('');
    setLoading(false);
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
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-dropdown" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-[#004D40] via-[#00695C] to-[#26A69A] px-6 py-6">
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
                <h2 className="text-2xl font-bold text-white">Vendor Login</h2>
                <p className="text-white/80 text-sm">Access your vendor dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2 animate-shake">
              <span className="text-lg">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#26A69A]/30 text-[#26A69A] focus:ring-[#26A69A] focus:ring-offset-0"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#26A69A] hover:text-[#00695C] font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#004D40] to-[#00695C] text-white font-semibold rounded-xl hover:from-[#003D33] hover:to-[#004D40] transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-[#00695C]/25 hover:shadow-xl hover:shadow-[#00695C]/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <>
                  Sign In as Vendor
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have a vendor account?{' '}
              <button
                onClick={() => {
                  onSwitchToRegister?.();
                }}
                className="text-[#26A69A] font-semibold hover:text-[#00695C] transition-colors"
              >
                Register as Vendor
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
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
    </div>
  );
};

export default VendorLogin;