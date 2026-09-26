const TOKEN_KEY = "ozcar_auth_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("Cannot reach the server. Check that the Express server is running and try again.");
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("The server returned an unexpected response. Please restart the server and try again.");
  }

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong.");
    error.status = response.status;
    throw error;
  }

  return data;
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function hasToken() {
  return Boolean(getToken());
}

export function registerAccount({ name, email, password }) {
  return request("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
}

export function loginAccount({ email, password }) {
  return request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
}

export function getCurrentUser() {
  return request("/api/auth/me", { headers: authHeaders() });
}

export function logoutAccount() {
  return request("/api/auth/logout", {
    method: "POST",
    headers: authHeaders()
  });
}

export function getMyBookings() {
  return request("/api/my-bookings", { headers: authHeaders() });
}

export function getCars() {
  return request("/api/cars");
}

export function getExtras() {
  return request("/api/extras");
}

export function searchAvailability(pickupDate, returnDate) {
  return request("/api/search-availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pickupDate, returnDate })
  });
}

export function getQuote(carId, pickupDate, returnDate, extraIds) {
  return request("/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ carId, pickupDate, returnDate, extraIds })
  });
}

export function createBooking({ carId, pickupDate, returnDate, extraIds }) {
  return request("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    },
    body: JSON.stringify({ carId, pickupDate, returnDate, extraIds })
  });
}
