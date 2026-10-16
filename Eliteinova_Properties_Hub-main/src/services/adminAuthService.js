// Admin-only auth calls, kept out of services/authService.js on purpose - these
// hit app/api/admin_controller.py's /login and /2fa/verify, which reject any
// account that isn't role=admin server-side (unlike /auth/login, which has no
// notion of which login form a request came from).
import adminAxiosInstance from '../api/adminAxiosInstance';

export const adminLogin = async (credentials) => {
  try {
    const response = await adminAxiosInstance.post('/admin/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyAdminTwoFactorLogin = async (pendingToken, code) => {
  try {
    const response = await adminAxiosInstance.post('/admin/2fa/verify', { pending_token: pendingToken, code });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
