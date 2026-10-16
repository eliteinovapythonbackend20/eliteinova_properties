// src/hooks/useReusableResources.js
//
// Discovers the caller's own reusable USER_DOCUMENT / USER_MEDIA items so a
// property form can ask "use your existing verified details?" instead of
// uploading the same Aadhaar/profile photo/logo again on every listing.
//
// Also, when a `role` is passed, loads the vendor's own VendorProfile (the
// same data the profile page already shows, via the existing getMyProfile -
// no new endpoint) so a form can prefill plain contact-detail text fields
// (name/mobile/email/designation/company/RERA/GST/experience/office address)
// the same way it already offers to reuse documents/media. `role` is
// optional and backward-compatible: a caller that doesn't pass it gets
// exactly today's behaviour (profile stays null, nothing else changes).
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { getMyProfile } from '../services/profileService';

const ELIGIBLE_STATUSES = ['verified', 'legacy'];

// getMyProfile expects the API's own vendor_type route value
// ("property-management", hyphenated) - everywhere else in this codebase
// (forms, the prefill map) uses the camelCase 'propertyManagement' instead,
// so this is the one place that needs to know both spellings.
const VENDOR_TYPE_PARAM = {
  owner: 'owner',
  agent: 'agent',
  builder: 'builder',
  propertyManagement: 'property-management',
};

export default function useReusableResources(role) {
  const [documents, setDocuments] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(Boolean(role));

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [docsRes, mediaRes] = await Promise.all([
          axiosInstance.get('/users/me/documents'),
          axiosInstance.get('/users/me/media'),
        ]);
        if (!active) return;
        setDocuments(docsRes.data?.data || []);
        setMedia(mediaRes.data?.data || []);
      } catch (error) {
        console.error('Failed to load reusable resources:', error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!role) return;
    const vendorType = VENDOR_TYPE_PARAM[role];
    if (!vendorType) {
      console.error(`useReusableResources: unknown role "${role}"`);
      setProfileLoading(false);
      return;
    }
    let active = true;
    setProfileLoading(true);
    (async () => {
      try {
        const data = await getMyProfile(vendorType);
        if (!active) return;
        setProfile(data?.profile || null);
      } catch (error) {
        console.error('Failed to load vendor profile for prefill:', error);
        if (active) setProfile(null);
      } finally {
        if (active) setProfileLoading(false);
      }
    })();
    return () => { active = false; };
  }, [role]);

  const isDocumentVerified = (documentKey) =>
    documents.some((d) => d.documentKey === documentKey && ELIGIBLE_STATUSES.includes(d.status));

  const isMediaVerified = (mediaType) =>
    media.some((m) => m.mediaType === mediaType && ELIGIBLE_STATUSES.includes(m.status));

  // True once the profile has loaded and actually has at least one usable
  // contact-ish value - lets a form offer the "it's me" prefill prompt even
  // when the vendor has no verified documents/media yet.
  const hasUsableProfile = Boolean(profile && Object.values(profile).some((v) => v !== null && v !== undefined && v !== ''));

  return {
    documents, media, loading, isDocumentVerified, isMediaVerified,
    profile, profileLoading, hasUsableProfile,
  };
}
