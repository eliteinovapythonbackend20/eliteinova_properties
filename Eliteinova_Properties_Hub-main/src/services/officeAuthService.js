// Office-only auth calls, kept out of services/authService.js and
// services/adminAuthService.js on purpose - these hit app/api/office_controller.py's
// /login and /2fa/verify, which reject any account that isn't role=office
// server-side (unlike /auth/login, which has no notion of which login form a
// request came from).
import officeAxiosInstance from '../api/officeAxiosInstance';

export const officeLogin = async (credentials) => {
  try {
    const response = await officeAxiosInstance.post('/office/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyOfficeTwoFactorLogin = async (pendingToken, code) => {
  try {
    const response = await officeAxiosInstance.post('/office/2fa/verify', { pending_token: pendingToken, code });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
