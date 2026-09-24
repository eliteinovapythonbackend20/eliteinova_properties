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

  const login = useCallback(
    async (credentials) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.login(new LoginRequest(credentials));
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

  const oauthLogin = useCallback(
    async (provider, code) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.oauthLogin(provider, code);
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

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    error,

    login,
    register,
    oauthLogin,
    logout,
    updateUser,

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