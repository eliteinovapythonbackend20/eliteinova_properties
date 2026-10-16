// Dedicated HTTP client for admin authentication only (admin_login / admin
// 2FA verify against app/api/admin_controller.py). These calls happen before
// any session exists, so this instance carries no token interceptor and no
// refresh/retry machinery - it is deliberately not a copy of the shared
// axiosInstance.js, which exists to carry an already-authenticated customer
// or vendor's token on every request. Once an admin successfully logs in,
// the resulting session is handed to the same AuthProvider/axiosInstance as
// everyone else, so the rest of the app (ProtectedRoute, AdminDashboard's own
// API calls) is unaffected by this file.
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://eliteinova-properties-backend.vercel.app' || 'http://localhost:8000';
const VERSION = '/api/v1';

const adminAxiosInstance = axios.create({
  baseURL: `${BASE_URL}${VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default adminAxiosInstance;
