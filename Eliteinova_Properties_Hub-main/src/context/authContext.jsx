import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { storage } from '../utils/storage';
import { USER_ROLES, User, AuthError, LoginRequest, RegisterRequest, AuthResponse } from '../models/authModel';
import * as authService from '../services/authService';
import * as adminAuthService from '../services/adminAuthService';
import * as officeAuthService from '../services/officeAuthService';
import axiosInstance, { AUTH_EVENTS } from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => storage.get('accessToken'));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const resetAuthState = useCallback(() => {
    if (!isMounted.current) return;
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  useEffect(() => {
    const handleRefreshed = (e) => {
      if (!isMounted.current) return;
      setToken(e.detail.accessToken);
    };
    const handleLoggedOut = () => resetAuthState();

    window.addEventListener(AUTH_EVENTS.TOKEN_REFRESHED, handleRefreshed);
    window.addEventListener(AUTH_EVENTS.LOGGED_OUT, handleLoggedOut);
    return () => {
      window.removeEventListener(AUTH_EVENTS.TOKEN_REFRESHED, handleRefreshed);
      window.removeEventListener(AUTH_EVENTS.LOGGED_OUT, handleLoggedOut);
    };
  }, [resetAuthState]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const storedToken = storage.get('accessToken');
      const storedUser = storage.get('user');

      if (!storedToken || !storedUser) {
        setIsLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(new User(parsedUser));
        setIsAuthenticated(true);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${storedToken}`;

        const response = await authService.validateToken(storedToken);
        const freshUser = response?.user || response?.data?.user;
        if (!cancelled && freshUser) {
          setUser(new User(freshUser));
          storage.set('user', JSON.stringify(freshUser));
        }
      } catch (err) {
        if (import.meta.env.DEV) console.warn('Auth bootstrap validation failed:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistSession = useCallback((authResponse) => {
    storage.set('accessToken', authResponse.accessToken);
    storage.set('refreshToken', authResponse.refreshToken);
    storage.set('user', JSON.stringify(authResponse.user));
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${authResponse.accessToken}`;

    setToken(authResponse.accessToken);
    setUser(new User(authResponse.user));
    setIsAuthenticated(true);
  }, []);

  // `allowedRoles`, when given, restricts which account type this particular login
  // form may authenticate as (e.g. the Vendor Login form passes ['vendor'] so a
  // customer's or admin's correct credentials still get turned away at the door).
  // The backend itself has no notion of "which form" a request came from - it only
  // knows credentials and the account's role - so this check happens here, before
  // the session is persisted, rather than relying on the server to reject it.
  const roleMismatchError = () =>
    new AuthError({
      message: 'This login is not valid for this account type. Please use the correct login page.',
      code: 'ROLE_NOT_ALLOWED',
      status: 403,
    });

  const login = useCallback(
    async (credentials, allowedRoles = null) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.login(new LoginRequest(credentials));
        if (response?.requires_2fa) {
          return { success: false, requires2fa: true, pendingToken: response.pending_token };
        }
        const authResponse = new AuthResponse(response);
        if (allowedRoles && !allowedRoles.includes(authResponse.user?.role)) {
          const authError = roleMismatchError();
          setError(authError.message);
          return { success: false, error: authError };
        }
        persistSession(authResponse);
        return { success: true, user: new User(authResponse.user) };
      } catch (err) {
        const authError = AuthError.fromResponse({ response: { data: err } });
        setError(authError.message);
        return { success: false, error: authError };
      } finally {
        setIsLoading(false);
      }
    },
    [persistSession]
  );

  const completeTwoFactorLogin = useCallback(
    async (pendingToken, code, allowedRoles = null) => {
      try {
        const response = await authService.verifyTwoFactorLogin(pendingToken, code);
        const authResponse = new AuthResponse(response);
        if (allowedRoles && !allowedRoles.includes(authResponse.user?.role)) {
          return { success: false, error: roleMismatchError() };
        }
        persistSession(authResponse);
        return { success: true, user: new User(authResponse.user) };
      } catch (err) {
        const authError = AuthError.fromResponse({ response: { data: err } });
        return { success: false, error: authError };
      }
    },
    [persistSession]
  );

  // Admin-only counterparts: these call admin_login / admin 2FA verify
  // (app/api/admin_controller.py) via adminAuthService's own axios instance,
  // which rejects any non-admin account server-side. Once that succeeds, the
  // session is persisted the exact same way as the customer/vendor path, so
  // the rest of the app (ProtectedRoute, AdminDashboard's own API calls
  // through the shared axiosInstance) doesn't need to know the login came
  // through a different door. The role check below is just a client-side
  // backstop - the backend is the actual boundary.
  const adminLogin = useCallback(
    async (credentials) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await adminAuthService.adminLogin(credentials);
        if (response?.requires_2fa) {
          return { success: false, requires2fa: true, pendingToken: response.pending_token };
        }
        const authResponse = new AuthResponse(response);
        if (authResponse.user?.role !== 'admin') {
          const authError = roleMismatchError();
          setError(authError.message);
          return { success: false, error: authError };
        }
        persistSession(authResponse);
        return { success: true, user: new User(authResponse.user) };
      } catch (err) {
        const authError = AuthError.fromResponse({ response: { data: err } });
        setError(authError.message);
        return { success: false, error: authError };
      } finally {
        setIsLoading(false);
      }
    },
    [persistSession]
  );

  const adminCompleteTwoFactorLogin = useCallback(
    async (pendingToken, code) => {
      try {
        const response = await adminAuthService.verifyAdminTwoFactorLogin(pendingToken, code);
        const authResponse = new AuthResponse(response);
        if (authResponse.user?.role !== 'admin') {
          return { success: false, error: roleMismatchError() };
        }
        persistSession(authResponse);
        return { success: true, user: new User(authResponse.user) };
      } catch (err) {
        const authError = AuthError.fromResponse({ response: { data: err } });
        return { success: false, error: authError };
      }
    },
    [persistSession]
  );

  // Office-only counterparts: same shape as the admin pair above, but through
  // office_controller.py's own router/axios instance, which rejects any
  // non-office account server-side. Session persistence is identical once
  // login succeeds - the rest of the app never needs to know which door the
  // session came through.
  const officeLogin = useCallback(
    async (credentials) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await officeAuthService.officeLogin(credentials);
        if (response?.requires_2fa) {
          return { success: false, requires2fa: true, pendingToken: response.pending_token };
        }
        const authResponse = new AuthResponse(response);
        if (authResponse.user?.role !== 'office') {
          const authError = roleMismatchError();
          setError(authError.message);
          return { success: false, error: authError };
        }
        persistSession(authResponse);
        return { success: true, user: new User(authResponse.user) };
      } catch (err) {
        const authError = AuthError.fromResponse({ response: { data: err } });
        setError(authError.message);
        return { success: false, error: authError };
      } finally {
        setIsLoading(false);
      }
    },
    [persistSession]
  );

  const officeCompleteTwoFactorLogin = useCallback(
    async (pendingToken, code) => {
      try {
        const response = await officeAuthService.verifyOfficeTwoFactorLogin(pendingToken, code);
        const authResponse = new AuthResponse(response);
        if (authResponse.user?.role !== 'office') {
          return { success: false, error: roleMismatchError() };
        }
        persistSession(authResponse);
        return { success: true, user: new User(authResponse.user) };
      } catch (err) {
        const authError = AuthError.fromResponse({ response: { data: err } });
        return { success: false, error: authError };
      }
    },
    [persistSession]
  );

  const register = useCallback(
    async (userData) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.register(new RegisterRequest(userData));
        const authResponse = new AuthResponse(response);
        persistSession(authResponse);
        return { success: true, user: new User(authResponse.user) };
      } catch (err) {
        const authError = AuthError.fromResponse({ response: { data: err } });
        setError(authError.message);
        return { success: false, error: authError };
      } finally {
        setIsLoading(false);
      }
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Logout API call failed:', err);
    } finally {
      storage.remove('accessToken');
      storage.remove('refreshToken');
      storage.remove('user');
      delete axiosInstance.defaults.headers.common.Authorization;
      resetAuthState();
    }
  }, [token, resetAuthState]);

  const updateUser = useCallback(
    async (userData) => {
      try {
        const response = await authService.updateUserProfile(userData, token);
        const updatedUser = new User(response);
        setUser(updatedUser);
        storage.set('user', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      } catch (err) {
        const authError = AuthError.fromResponse({ response: { data: err } });
        return { success: false, error: authError };
      }
    },
    [token]
  );

  const refreshUser = useCallback(async () => {
    const response = await authService.validateToken(token);
    const freshUser = response?.user;
    if (freshUser) {
      const refreshed = new User(freshUser);
      setUser(refreshed);
      storage.set('user', JSON.stringify(freshUser));
    }
    return freshUser;
  }, [token]);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    error,

    login,
    register,
    logout,
    updateUser,
    refreshUser,
    completeTwoFactorLogin,
    adminLogin,
    adminCompleteTwoFactorLogin,
    officeLogin,
    officeCompleteTwoFactorLogin,

    isUser: user?.isUser?.() ?? false,
    isVendor: user?.isVendor?.() ?? false,
    isAdmin: user?.isAdmin?.() ?? false,
    canPostProperty: user?.canPostProperty?.() ?? false,
    userDisplayName: user?.getDisplayName?.() ?? '',
    userRoleDisplay: user?.getRoleDisplay?.() ?? '',

    USER_ROLES,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
};