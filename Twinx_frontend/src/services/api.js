const BASE_URL = 'http://localhost:8080/api';

async function postFormData(url, formData, token) {
  const response = await fetch(url, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Request failed');
  }
  return response.json();
}

export async function loginUser(payload) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Invalid credentials');
  return response.json();
}

export async function registerUser(payload) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Unable to register');
  return response.json();
}

export async function uploadDocument(file, token) {
  const formData = new FormData();
  formData.append('file', file);
  return postFormData(`${BASE_URL}/documents/upload`, formData, token);
}

export async function predictTrustScore(documentId, token) {
  const response = await fetch(`${BASE_URL}/trust-score/${documentId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
  if (!response.ok) {
    throw new Error('Could not fetch trust score');
  }
  return response.json();
}

