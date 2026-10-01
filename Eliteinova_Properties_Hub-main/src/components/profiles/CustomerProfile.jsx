// src/components/profiles/CustomerProfile.jsx
//
// Customer-facing account page. This is deliberately styled as a
// customer-focused twin of the Vendor Profile pages (OwnerProfile.jsx /
// AgentProfile.jsx) in this same folder: same page background, header,
// profile card, tab navigation, section-header/animated-card language,
// modal chrome, and Toast usage - only the content/functionality changes
// to fit a buyer/tenant/customer account instead of a property-listing
// vendor account.
//
// Data sources:
//  - Identity (name/email/phone/role/createdAt) + edit-profile save come
//    from the REAL, already-wired useAuth()/authContext (GET/PATCH
//    /user/profile via authService.getCurrentUser/updateUserProfile).
//    This endpoint is role-agnostic, so it works for the "user" role
//    exactly like it already does for vendors.
//  - Address/Bio/KYC come from the self-service customerService.getMyProfile()
//    (GET /customer/profile, app/api/customer_controller.py) - the Customer-
//    domain fields that don't live on the generic User row.
//  - Change Password reuses the real authService.changePassword
//    (/auth/change-password).
//  - Saved Properties / Wishlist / Requested Properties are wired to the
//    real self-service endpoints (customerService.listMySavedProperties/
//    listMyWishlist/listMyPropertyRequests), each returning full property
//    cards in the same shape PropertyCard.jsx already renders everywhere
//    else. "Requested Properties" covers purchase + rental requests (the
//    backend's property_requests table) - the actual "Request this
//    property" button/modal on the property card that lets a customer
//    create one is a separate, later task; this tab already renders
//    whatever requests exist once that button is wired up.

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Edit2, Save, X, Camera, Sparkles,
  ArrowLeft, CheckCircle, Calendar, Shield, LogOut, Heart, Bookmark,
  Send, Settings, Lock, Trash2, Clock, Info, Eye, EyeOff,
  ChevronRight,
} from 'lucide-react';

import { useAuth } from '../../context/authContext';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import * as authService from '../../services/authService';
import customerService from '../../services/customerService';
import PropertyCard from '../propertycard/propertyCard';

// ============ EMPTY STATE (same visual language as PropertyList.jsx's
// own empty state, reused rather than reinvented) ============
const EmptyState = ({ icon = '🔍', title, message }) => (
  <div className="w-full bg-white rounded-2xl shadow-sm border border-teal-100 p-6 sm:p-10 text-center">
    <div className="text-4xl sm:text-5xl mb-3">{icon}</div>
    <h3 className="text-sm sm:text-lg font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm mx-auto">{message}</p>
  </div>
);

// ============ SECTION HEADER (matches OwnerProfile/AgentProfile) ============
const SectionHeader = ({ title, subtitle }) => (
  <div className="flex items-center mb-4 sm:mb-5">
    <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-[#00695C] to-[#26A69A] mr-2 sm:mr-3 rounded-full animate-pulse-slow" />
    <div>
      <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="text-[10px] sm:text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

// ============ ANIMATED INFO CARD (matches OwnerProfile/AgentProfile) ============
const AnimatedCard = ({ label, value, icon, delay = 0, children, muted = false }) => (
  <div
    className="group/acard relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00695C]/[0.06] to-[#26A69A]/[0.06] border border-[#00695C]/10 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-up"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#00695C]/0 via-[#26A69A]/40 to-[#00695C]/0 opacity-0 group-hover/acard:opacity-100 blur-sm transition-opacity duration-500 -z-10" />
    <div className="relative p-2.5 sm:p-3.5 flex items-start gap-2 sm:gap-3">
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] blur-md opacity-0 group-hover/acard:opacity-60 transition-opacity duration-500" />
        <div className="relative p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-lg transform group-hover/acard:scale-110 group-hover/acard:rotate-6 transition-all duration-300">
          <div className="text-white">{icon}</div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <label className="block text-[9px] sm:text-[10px] font-bold text-gray-500 mb-0.5 sm:mb-1 uppercase tracking-wider group-hover/acard:text-[#00695C] transition-colors duration-300">
          {label}
        </label>
        {children ? (
          children
        ) : (
          <div className={`text-xs sm:text-[13px] font-semibold break-words ${muted ? 'text-gray-400 italic font-medium' : 'text-gray-800'}`}>
            {value || <span className="text-gray-400 font-medium italic">Not specified</span>}
          </div>
        )}
      </div>
      {value && !children && !muted && (
        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00695C]/30 group-hover/acard:text-[#00695C] flex-shrink-0 transition-colors duration-300" />
      )}
    </div>
    <div className="h-[2px] w-full bg-gray-100 overflow-hidden">
      <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] w-0 group-hover/acard:w-full transition-all duration-700 ease-out" />
    </div>
  </div>
);

// ============ PROPERTY GRID (reuses the project's real PropertyCard -
// no new card design; falls back to the shared empty state) ============
const PropertyCollection = ({ properties, onRemove, removeLabel, emptyIcon, emptyTitle, emptyMessage, loading }) => {
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-[#00695C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!properties || properties.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} />;
  }
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {properties.map((property) => (
        <div key={property.id} className="relative">
          {onRemove && (
            <button
              onClick={() => onRemove(property.id)}
              title={removeLabel || 'Remove'}
              className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-red-500/90 hover:bg-red-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Trash2 className="w-3 h-3" />
              {removeLabel || 'Remove'}
            </button>
          )}
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  );
};

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { user, token, isLoading, isAuthenticated, updateUser, logout, userRoleDisplay } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const showSuccessToast = (message) => showToast(message, 'success');
  const showErrorToast = (message) => showToast(message, 'error');

  const [activeSection, setActiveSection] = useState('personal');

  // ---- Edit profile modal (wired to the real /user/profile endpoint) ----
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '' });

  useEffect(() => {
    if (user) {
      setEditForm({
        fullName: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // ---- Change password modal (wired to the real authService.changePassword) ----
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // ---- Customer-domain profile fields (address/bio/kyc - not on the
  // generic User row useAuth() exposes) ----
  const [customerProfile, setCustomerProfile] = useState(null);

  // ---- Saved Properties / Wishlist / Requested Properties ----
  const [savedProperties, setSavedProperties] = useState([]);
  const [wishlistProperties, setWishlistProperties] = useState([]);
  const [requestedProperties, setRequestedProperties] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);

  const loadCustomerData = useCallback(async () => {
    setSectionsLoading(true);
    const [profileRes, savedRes, wishlistRes, requestedRes] = await Promise.allSettled([
      customerService.getMyProfile(),
      customerService.listMySavedProperties(),
      customerService.listMyWishlist(),
      customerService.listMyPropertyRequests(),
    ]);
    if (profileRes.status === 'fulfilled') setCustomerProfile(profileRes.value?.data || null);
    if (savedRes.status === 'fulfilled') setSavedProperties(savedRes.value?.data || []);
    if (wishlistRes.status === 'fulfilled') setWishlistProperties(wishlistRes.value?.data || []);
    if (requestedRes.status === 'fulfilled') {
      // Each row is a property-request card ({ id, requestType, status,
      // statusHistory, requestedAmount, ..., property }) - the tab shows the
      // requested PROPERTY itself (not the request metadata), tagged with
      // its own request's id/type/status so the card can carry a status badge.
      const requests = (requestedRes.value?.data || [])
        .filter((req) => req.property)
        .map((req) => ({ ...req.property, _requestId: req.id, _requestType: req.requestType, _requestStatus: req.status }));
      setRequestedProperties(requests);
    }
    setSectionsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadCustomerData();
    }
  }, [isAuthenticated, loadCustomerData]);

  const handleNavigateBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!editForm.fullName.trim()) {
      showErrorToast('Full name is required');
      return;
    }
    setIsSaving(true);
    const result = await updateUser({ name: editForm.fullName.trim(), phone: editForm.phone.trim() });
    setIsSaving(false);
    if (result.success) {
      showSuccessToast('Profile updated successfully!');
      setShowEditModal(false);
    } else {
      showErrorToast(result.error?.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showErrorToast('Please fill in all password fields');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showErrorToast('New password and confirmation do not match');
      return;
    }
    setIsChangingPassword(true);
    try {
      await authService.changePassword(
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        token
      );
      showSuccessToast('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showErrorToast(err?.detail || err?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRemoveSaved = async (id) => {
    const previous = savedProperties;
    setSavedProperties((prev) => prev.filter((p) => p.id !== id));
    try {
      await customerService.unsaveProperty(id);
      showSuccessToast('Removed from saved properties');
    } catch (err) {
      setSavedProperties(previous);
      showErrorToast(err?.response?.data?.detail || 'Failed to remove saved property');
    }
  };

  const handleRemoveWishlist = async (id) => {
    const previous = wishlistProperties;
    setWishlistProperties((prev) => prev.filter((p) => p.id !== id));
    try {
      await customerService.removeFromWishlist(id);
      showSuccessToast('Removed from wishlist');
    } catch (err) {
      setWishlistProperties(previous);
      showErrorToast(err?.response?.data?.detail || 'Failed to remove from wishlist');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formatDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const sections = [
    { id: 'personal', title: 'Personal Info', icon: User },
    { id: 'saved', title: 'Saved Properties', icon: Bookmark },
    { id: 'wishlist', title: 'Wishlist', icon: Heart },
    { id: 'requested', title: 'Requested Properties', icon: Send },
    { id: 'account', title: 'Account & Activity', icon: Settings },
  ];

  // ---- Guard: this page needs a logged-in session ----
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00695C]/5 via-teal-50/50 to-[#26A69A]/5 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 max-w-md w-full text-center border border-[#00695C]/10">
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Please Log In</h2>
          <p className="text-sm text-gray-500 mb-6">Log in to your account to view your customer profile.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white font-bold hover:shadow-xl transition-all duration-300"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const initial = (user?.name || user?.email || 'U').trim().charAt(0).toUpperCase();
  // Defensive - the backend doesn't expose an avatar field on the generic
  // /user/profile response today, but if/when it does this renders it
  // automatically instead of always falling back to the initial.
  const avatarUrl = user?.avatarUrl || user?.profilePicture || user?.photoUrl || null;

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="w-full animate-slideUp">
            <SectionHeader title="Personal Information" subtitle="Your account details on file" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Full Name" value={user?.name} icon={<User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
                <AnimatedCard label="Email Address" value={user?.email} icon={<Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
                <AnimatedCard label="Phone Number" value={user?.phone} icon={<Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard
                  label="Address / Location"
                  icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  delay={0.26}
                  muted={!customerProfile?.address && !customerProfile?.city}
                  value={[customerProfile?.address, customerProfile?.city, customerProfile?.state].filter(Boolean).join(', ') || 'Not added yet'}
                />
                <AnimatedCard
                  label="About / Bio"
                  icon={<Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  delay={0.33}
                  muted={!customerProfile?.bio}
                  value={customerProfile?.bio || 'Not added yet'}
                />
                <AnimatedCard label="Customer Since" value={formatDate(user?.createdAt) || 'Not available'} icon={<Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4} muted={!formatDate(user?.createdAt)} />
              </div>
            </div>
          </div>
        );

      case 'saved':
        return (
          <div className="w-full animate-slideUp">
            <SectionHeader title="Saved Properties" subtitle="Properties you've bookmarked to review later" />
            <PropertyCollection
              properties={savedProperties}
              onRemove={handleRemoveSaved}
              removeLabel="Remove"
              emptyIcon="🏠"
              emptyTitle="No Saved Properties Yet"
              emptyMessage="Properties you save while browsing will show up here."
              loading={sectionsLoading}
            />
          </div>
        );

      case 'wishlist':
        return (
          <div className="w-full animate-slideUp">
            <SectionHeader title="Wishlist" subtitle="Your favourite properties, all in one place" />
            <PropertyCollection
              properties={wishlistProperties}
              onRemove={handleRemoveWishlist}
              removeLabel="Remove"
              emptyIcon="💚"
              emptyTitle="Your Wishlist Is Empty"
              emptyMessage="Add properties to your wishlist to keep track of the ones you love."
              loading={sectionsLoading}
            />
          </div>
        );

      case 'requested':
        return (
          <div className="w-full animate-slideUp">
            <SectionHeader title="Requested Properties" subtitle="Properties you've requested to buy or rent" />
            <PropertyCollection
              properties={requestedProperties}
              emptyIcon="📩"
              emptyTitle="No Requests Yet"
              emptyMessage="Properties you request to purchase or rent will be tracked here, along with their status."
              loading={sectionsLoading}
            />
          </div>
        );

      case 'account':
        return (
          <div className="w-full animate-slideUp">
            <SectionHeader title="Account & Activity" subtitle="Manage your account settings and security" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-4">
              <AnimatedCard label="Account Role" value={userRoleDisplay || 'Customer'} icon={<Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
              <AnimatedCard label="Member Since" value={formatDate(user?.createdAt) || 'Not available'} icon={<Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} muted={!formatDate(user?.createdAt)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="group flex items-center gap-3 p-3.5 sm:p-4 bg-white rounded-2xl border border-[#00695C]/10 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-left"
              >
                <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-gray-800">Change Password</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Update your login password</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#00695C] transition-colors duration-300 flex-shrink-0" />
              </button>

              <button
                onClick={handleLogout}
                className="group flex items-center gap-3 p-3.5 sm:p-4 bg-white rounded-2xl border border-red-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-left"
              >
                <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <LogOut className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-gray-800">Logout</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Sign out of your account</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 transition-colors duration-300 flex-shrink-0" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {[
                { id: 'saved', label: 'Saved Properties', icon: Bookmark, count: savedProperties.length },
                { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistProperties.length },
                { id: 'requested', label: 'Requested Properties', icon: Send, count: requestedProperties.length },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="flex items-center gap-2.5 p-3 bg-gradient-to-br from-[#00695C]/[0.06] to-[#26A69A]/[0.06] rounded-2xl border border-[#00695C]/10 hover:border-[#00695C]/30 transition-all duration-300 hover:-translate-y-0.5 text-left"
                >
                  <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-md flex-shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-bold text-gray-700 truncate">{item.label}</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-400">{item.count} item{item.count === 1 ? '' : 's'}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00695C]/5 via-teal-50/50 to-[#26A69A]/5 pt-16 sm:pt-20 pb-8 sm:pb-12 w-full relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <Toast toast={toast} onClose={hideToast} />

      {/* ============ EDIT PROFILE MODAL ============ */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn w-full p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[95%] sm:max-w-[90%] md:max-w-lg mx-auto overflow-hidden max-h-[85vh] flex flex-col animate-scaleIn">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 flex items-center justify-between flex-shrink-0">
              <h2 className="text-white text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3">
                <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl">
                  <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                Edit Profile
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4 overflow-y-auto flex-1 w-full bg-gray-50">
              <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Personal Details
                </h3>
                <div className="space-y-1 sm:space-y-1.5 w-full">
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleEditChange}
                    className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-1 sm:space-y-1.5 w-full">
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
                    placeholder="Your phone number"
                  />
                </div>
                <div className="space-y-1 sm:space-y-1.5 w-full">
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full border-2 border-gray-200 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500 bg-gray-100 outline-none cursor-not-allowed"
                  />
                  <p className="text-[9px] sm:text-[10px] text-gray-400">Email address cannot be changed here.</p>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-white border-t-2 border-gray-100 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-2xl border-2 border-gray-300 text-gray-700 text-xs sm:text-sm font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs sm:text-sm font-bold hover:from-[#005A4F] hover:to-[#1B9E8E] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-1.5 sm:gap-2 justify-center w-full sm:w-auto hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ CHANGE PASSWORD MODAL ============ */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn w-full p-2 sm:p-4">
          <form
            onSubmit={handleChangePassword}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-[95%] sm:max-w-[90%] md:max-w-md mx-auto overflow-hidden max-h-[85vh] flex flex-col animate-scaleIn"
          >
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-4 sm:px-6 py-3 sm:py-4 md:py-5 flex items-center justify-between flex-shrink-0">
              <h2 className="text-white text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3">
                <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                Change Password
              </h2>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1 w-full bg-gray-50">
              {[
                { name: 'currentPassword', label: 'Current Password' },
                { name: 'newPassword', label: 'New Password' },
                { name: 'confirmPassword', label: 'Confirm New Password' },
              ].map((field) => (
                <div key={field.name} className="space-y-1 sm:space-y-1.5 w-full">
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      name={field.name}
                      value={passwordForm[field.name]}
                      onChange={handlePasswordChange}
                      className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 pr-10 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
                      placeholder={field.label}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00695C] transition-colors"
                    >
                      {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 sm:px-6 py-3 sm:py-4 md:py-5 bg-white border-t-2 border-gray-100 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-gray-300 text-gray-700 text-xs sm:text-sm font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs sm:text-sm font-bold hover:from-[#005A4F] hover:to-[#1B9E8E] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-1.5 sm:gap-2 justify-center w-full sm:w-auto hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-full w-full relative z-10 -mt-12 sm:-mt-15">

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 w-full animate-fade-up">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00695C]/[0.04] via-[#26A69A]/[0.06] to-[#00695C]/[0.04] rounded-2xl sm:rounded-3xl" />
          <div className="absolute -top-16 -left-10 w-40 h-40 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
          <div className="absolute -bottom-16 -right-10 w-40 h-40 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-0 left-[-100%] w-full h-[1px] bg-gradient-to-r from-transparent via-[#26A69A]/50 to-transparent animate-shimmer pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full p-3 sm:p-4 md:p-5">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
              <button
                onClick={handleNavigateBack}
                className="relative p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-rotate-12 group border border-[#00695C]/10 overflow-hidden"
                aria-label="Go back"
              >
                <span className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00695C]/0 to-[#26A69A]/0 group-hover:from-[#00695C]/10 group-hover:to-[#26A69A]/10 transition-all duration-300" />
                <ArrowLeft className="relative w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-[#00695C] group-hover:-translate-x-0.5 transition-all duration-300" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent flex items-center gap-2 sm:gap-3 relative">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] blur-lg opacity-40 animate-pulse-slow" />
                    <div className="absolute -inset-0.5 sm:-inset-1 rounded-xl sm:rounded-2xl border-2 border-[#26A69A]/30 animate-spin-slow" />
                    <div className="relative bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl shadow-lg">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                  <span className="relative text-base sm:text-xl md:text-2xl lg:text-3xl">
                    Customer Profile
                    <span className="absolute -bottom-0.5 sm:-bottom-1 left-0 h-[2px] sm:h-[3px] w-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full scale-x-0 origin-left animate-underline-grow" />
                  </span>
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1.5 ml-0.5 sm:ml-1 flex items-center gap-1 sm:gap-1.5">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#26A69A] animate-pulse" />
                  <span className="hidden lg:inline">Manage your account, saved properties and requests</span>
                  <span className="inline lg:hidden">Manage your account</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-[#00695C] to-[#26A69A] hover:from-[#005A4F] hover:to-[#1B9E8E] text-white rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl w-full sm:w-auto justify-center transform hover:scale-105 hover:-translate-y-1 group text-xs sm:text-sm overflow-hidden"
            >
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:left-full transition-all duration-700 ease-out" />
              <Edit2 className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative">Edit Profile</span>
            </button>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="relative bg-[#00695C]/5 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 w-full hover:shadow-2xl transition-all duration-500 border border-[#00695C]/20 overflow-hidden group">
          <div className="absolute top-0 left-[-100%] w-full h-[2px] bg-gradient-to-r from-transparent via-[#26A69A] to-transparent group-hover:left-full transition-all duration-[900ms] ease-out" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-5 md:gap-6 w-full relative z-10">
            <div className="relative flex-shrink-0">
              <div
                className="absolute -inset-0.5 sm:-inset-1 rounded-[20px] sm:rounded-[24px] animate-spin-slow"
                style={{ background: 'conic-gradient(from 0deg, #00695C, #26A69A, #7fd6c9, #26A69A, #00695C)' }}
              />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#00695C]/20 to-[#26A69A]/20 flex items-center justify-center ring-3 sm:ring-4 ring-white/60">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.name || 'Customer'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                    {initial}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowEditModal(true)}
                className="absolute bottom-0 right-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12 z-20"
                aria-label="Edit profile"
                title="Edit Profile"
              >
                <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{user?.name || 'Customer'}</h2>
                <span className="relative overflow-hidden bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white px-2 sm:px-3 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold">
                  {userRoleDisplay || 'Customer'}
                  <span className="absolute inset-y-0 left-[-60%] w-[40%] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer" />
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                {user?.phone && (
                  <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.05s' }}>
                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {user.phone}
                  </span>
                )}
                {user?.email && (
                  <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.15s' }}>
                    <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {user.email}
                  </span>
                )}
                {formatDate(user?.createdAt) && (
                  <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.25s' }}>
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> Since {formatDate(user.createdAt)}
                  </span>
                )}
              </div>

              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20"
              >
                <Edit2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                Edit basic account information
              </button>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-1.5 sm:p-2 mb-4 sm:mb-6 border border-[#00695C]/20 w-full overflow-x-auto">
          <div className="flex gap-1 sm:gap-1.5 min-w-max">
            {sections.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl font-bold text-[9px] sm:text-xs transition-all duration-500 whitespace-nowrap relative group ${
                    isActive ? 'text-white shadow-lg transform scale-105' : 'text-gray-600 hover:text-[#00695C]'
                  }`}
                  style={{ background: isActive ? 'linear-gradient(135deg, #00695C, #26A69A)' : 'transparent' }}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] shadow-lg animate-pulse-slow" />
                  )}
                  <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                    <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${isActive ? 'text-white' : 'group-hover:text-[#00695C]'}`} />
                    <span className="hidden lg:inline">{tab.title}</span>
                    <span className="inline lg:hidden">{tab.title.split(' ')[0]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 border border-[#00695C]/20 w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-[#26A69A]/5 to-[#00695C]/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
