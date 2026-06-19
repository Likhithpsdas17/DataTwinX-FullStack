const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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
};

export const getDashboardOverview = async () => {
  const token = localStorage.getItem('dtx_token');
  
  const response = await fetch(`${BASE_URL}/dashboard/overview`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to retrieve dashboard overview.');
  }

  return result.data;
};

export const getDocuments = async () => {
  const token = localStorage.getItem("dtx_token");

  const response = await fetch(
    `${BASE_URL}/documents`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const result = await response.json();

  return result.data;
};

export async function createShareLink(
  documentId,
  payload
) {
  const token = localStorage.getItem(
    "dtx_token"
  );

  const response = await fetch(
    `${BASE_URL}/share/${documentId}`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create share link"
    );
  }

  return response.json();
}

const PUBLIC_URL =
  import.meta.env.VITE_PUBLIC_URL ||
  "http://localhost:8080";

export const getSharedDocument = async (token) => {
  const response = await fetch(
    `${PUBLIC_URL}/public/share/${token}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to load shared document"
    );
  }

  return result.data;
};

export const getDownloadUrl = (token) => {
  return `${PUBLIC_URL}/public/share/${token}/download`;
};

export async function revokeShareLink(
  shareLinkId
) {
  const token =
    localStorage.getItem("dtx_token");

  const response = await fetch(
    `${BASE_URL}/share/${shareLinkId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to revoke share link"
    );
  }

  return response.json();
}

export const getTwinTrust = async (twinId) => {
  const token = localStorage.getItem("dtx_token");

  const response = await fetch(
    `${BASE_URL}/twins/${twinId}/trust`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const result = await response.json();
  return result.data;
};

export const getTwinTimeline = async (twinId) => {
  const token = localStorage.getItem("dtx_token");

  const response = await fetch(
    `${BASE_URL}/twins/${twinId}/timeline`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const result = await response.json();
  return result.data;
};