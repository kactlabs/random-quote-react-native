const BASE_URL = 'https://fastapi-login-and-session.vercel.app';

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
}

async function safeJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Server error: ${text.substring(0, 100)}`);
  }
}

export async function registerAPI(username, password) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await safeJson(response);
  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Registration failed');
  }
  return data;
}

export async function loginAPI(username, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await safeJson(response);
  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Login failed');
  }
  authToken = data.token;
  return data;
}

export async function logoutAPI() {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    headers: authHeaders(),
  });
  authToken = null;
  return safeJson(response);
}

export async function getProfileAPI() {
  const response = await fetch(`${BASE_URL}/me`, {
    headers: authHeaders(),
  });
  return safeJson(response);
}

export async function registerPushTokenAPI(token) {
  const response = await fetch(`${BASE_URL}/me/push-token`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ token }),
  });
  return safeJson(response);
}

export async function sendNotificationAPI(title, body, username) {
  const payload = { title, body };
  if (username) payload.username = username;
  const response = await fetch(`${BASE_URL}/notifications/send`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await safeJson(response);
  if (!response.ok) {
    throw new Error(data.detail || 'Failed to send notification');
  }
  return data;
}

export async function broadcastNotificationAPI(title, body) {
  const response = await fetch(`${BASE_URL}/notifications/broadcast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  });
  const data = await safeJson(response);
  if (!response.ok) {
    throw new Error(data.detail || 'Failed to broadcast notification');
  }
  return data;
}
