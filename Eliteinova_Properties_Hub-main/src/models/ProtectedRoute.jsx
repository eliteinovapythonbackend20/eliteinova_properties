import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';

/**
 * Guards routes that require authentication.
 * - Waits for the auth bootstrap check (isLoading) before deciding.
 * - Redirects to `redirectTo` (home by default; pass the right login page per
 *   route, e.g. /admin/login), preserving the attempted location so you can
 *   send the user back after they log in.
 * - Optionally restricts by role via `allowedRoles`.
 *
 * Usage (wrapping a subtree with <Outlet />):
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/profile/owner" element={<OwnerProfile />} />
 *   </Route>
 *
 * Usage (wrapping a single element directly):
 *   <ProtectedRoute><OwnerProfile /></ProtectedRoute>
 *
 * Usage (role-restricted):
 *   <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
 *     <Route path="/admin" element={<AdminDashboard />} />
 *   </Route>
 */
export default function ProtectedRoute({ children, allowedRoles = null, redirectTo = '/' }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Avoid flashing a redirect before the bootstrap auth check resolves.
    return <AuthLoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
}

/**
 * Restricts a vendor profile route to vendors whose stored vendor_types include
 * `vendorType` (a PostedBy value such as "OWNER"). Admins are unrestricted, and a
 * vendor with no stored types (legacy accounts) is also unrestricted, matching the backend.
 *
 * Usage:
 *   <Route path="/profile/owner" element={<VendorTypeRoute vendorType="OWNER"><OwnerProfile /></VendorTypeRoute>} />
 */
export function VendorTypeRoute({ vendorType, children }) {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <AuthLoadingFallback />;
  }

  const storedTypes = Array.isArray(user?.vendor_types) ? user.vendor_types : [];
  const restricted = user?.role === 'vendor' && storedTypes.length > 0;
  if (restricted && !storedTypes.includes(vendorType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

function AuthLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin h-8 w-8 border-2 border-current border-t-transparent rounded-full" />
    </div>
  );
}