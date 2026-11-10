const baseUrl = "/api";
const tokenKey = "lms_token";

export const tokenStorage = {
  get: () => localStorage.getItem(tokenKey),
  set: (token) => localStorage.setItem(tokenKey, token),
  clear: () => localStorage.removeItem(tokenKey),
};

export async function request(path, { method = "GET", body } = {}) {
  const token = tokenStorage.get();
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Make sure the API is running.");
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    throw error;
  }
  return data;
}
