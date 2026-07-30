import api from './api';

/**
 * POST /auth/register
 * Body: { fullName, email, password, role }
 * Response: User entity (201)
 */
export async function register(data) {
  const response = await api.post('/auth/register', {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    role: data.role,
  });
  return response.data;
}

/**
 * POST /auth/login
 * Body: { email, password }
 * Response: { token, email, role }
 */
export async function login(data) {
  const response = await api.post('/auth/login', {
    email: data.email,
    password: data.password,
  });
  return response.data;
}

export function extractAuthError(error) {
  const message = error.response?.data?.message
    || error.response?.data?.error
    || error.message;

  if (typeof message === 'string') {
    if (message.includes('User not found')) return 'No account found with this email address.';
    if (message.includes('Invalid Password')) return 'Incorrect password. Please try again.';
    if (message.includes('Email already exists')) return 'An account with this email already exists.';
  }

  if (error.response?.status === 500) {
    const raw = error.response?.data;
    if (typeof raw === 'string') {
      if (raw.includes('Email already exists')) return 'An account with this email already exists.';
    }
  }

  return 'Authentication failed. Please check your credentials and try again.';
}
