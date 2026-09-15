export const USER_ROLES = {
  USER: 'USER',
  VENDOR: 'VENDOR',
  ADMIN: 'ADMIN'
};

export const AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null
};

export class LoginRequest {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }
}

export class RegisterRequest {
  constructor({ email, password, fullName, phoneNumber, address, city, state, country, role, companyName }) {
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.companyName = companyName || 'NA';
    this.address = address;
    this.city = city;
    this.state = state;
    this.country = country;
    this.role = role;
  }
}

export class AuthResponse {
  constructor({ accessToken, refreshToken, user }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
  }
}

export class User {
  constructor({ id, email, name, phone, role, createdAt, updatedAt }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Role check helpers
  isUser() {
    return this.role === USER_ROLES.USER;
  }

  isVendor() {
    return this.role === USER_ROLES.VENDOR;
  }

  isAdmin() {
    return this.role === USER_ROLES.ADMIN;
  }

  canPostProperty() {
    return this.role === USER_ROLES.VENDOR;
  }

  // Get display name
  getDisplayName() {
    return this.name || this.email;
  }

  // Get role display
  getRoleDisplay() {
    const roleMap = {
      [USER_ROLES.USER]: 'User',
      [USER_ROLES.VENDOR]: 'Vendor',
      [USER_ROLES.ADMIN]: 'Admin'
    };
    return roleMap[this.role] || 'Unknown';
  }
}

export class Token {
  constructor({ accessToken, refreshToken }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  isValid() {
    return !!(this.accessToken && this.refreshToken);
  }
}

// ============================================
// ERROR MODEL
// ============================================
export class AuthError {
  constructor({ message, code, status }) {
    this.message = message;
    this.code = code;
    this.status = status;
  }

  static fromResponse(error) {
    // FastAPI's HTTPException body is {"detail": "..."}, not {"message": "..."} -
    // check both so real backend errors (e.g. "Email already registered") reach
    // the UI instead of always falling back to a generic message.
    const data = error.response?.data;
    return new AuthError({
      message: data?.detail || data?.message || error.message || 'Authentication failed',
      code: data?.code || 'AUTH_ERROR',
      status: error.response?.status || 500
    });
  }
}