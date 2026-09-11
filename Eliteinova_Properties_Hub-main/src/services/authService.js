// services/authService.js
import axiosInstance from '../api/axiosInstance';
import { storage } from '../utils/storage';


export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const oauthLogin = async (provider, code) => {
  try {
    const response = await axiosInstance.post(`/auth/oauth/${provider}`, { code });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const validateToken = async (token) => {
  try {
    const response = await axiosInstance.get('/auth/validate', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const refreshToken = async (refreshToken) => {
  try {
    const response = await axiosInstance.post('/auth/refresh', {
      refresh_token: refreshToken
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const logout = async (token) => {
  try {
    const response = await axiosInstance.post('/auth/logout', null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const updateUserProfile = async (userData, token) => {
  try {
    const response = await axiosInstance.patch('/user/profile', userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const getCurrentUser = async (token) => {
  try {
    const response = await axiosInstance.get('/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const changePassword = async (passwordData, token) => {
  try {
    const response = await axiosInstance.post('/auth/change-password', passwordData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const requestPasswordReset = async (email) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const resetPassword = async (data) => {
  try {
    const response = await axiosInstance.post('/auth/reset-password', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const verifyEmail = async (token) => {
  try {
    const response = await axiosInstance.post('/auth/verify-email', { token });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const resendVerification = async (email) => {
  try {
    const response = await axiosInstance.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};