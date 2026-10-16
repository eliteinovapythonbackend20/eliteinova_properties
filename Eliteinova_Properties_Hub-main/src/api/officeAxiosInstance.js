// Dedicated HTTP client for office authentication only (office login / office
// 2FA verify against app/api/office_controller.py). Kept separate from
// adminAxiosInstance.js on purpose, even though the two are nearly identical -
// office is its own role with its own door, not a flavor of admin. This call
// happens before any session exists, so it carries no token interceptor and
// no refresh/retry machinery, same reasoning as the admin instance. Once an
// office login succeeds, the resulting session is handed to the same
// AuthProvider/axiosInstance as everyone else, so the rest of the app
// (ProtectedRoute, etc.) is unaffected by this file.
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://eliteinova-properties-backend.vercel.app' || 'http://localhost:8000';
const VERSION = '/api/v1';

const officeAxiosInstance = axios.create({
  baseURL: `${BASE_URL}${VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default officeAxiosInstance;
