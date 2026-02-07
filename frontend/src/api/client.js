const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || `request failed: ${res.status}`);
  }

  return data;
}

export const api = {
  register: (payload) =>
    request("/api/auth/register", { method: "POST", body: payload }),
  login: (payload) =>
    request("/api/auth/login", { method: "POST", body: payload }),

  listRooms: (query = "") => request(`/api/rooms${query}`),
  getRoom: (id) => request(`/api/rooms/${id}`),

  createBooking: (payload) =>
    request("/api/bookings", { method: "POST", body: payload, auth: true }),
  myBookings: () => request("/api/bookings/my", { auth: true }),
  cancelBooking: (id) =>
    request(`/api/bookings/${id}/cancel`, { method: "PATCH", auth: true }),

  createReview: (payload) =>
    request("/api/reviews", { method: "POST", body: payload, auth: true }),

  createContact: (payload) =>
    request("/api/contact", { method: "POST", body: payload }),

  adminBookings: () => request("/api/admin/bookings", { auth: true }),
  adminCreateBooking: (payload) =>
    request("/api/admin/bookings", { method: "POST", body: payload, auth: true }),
  adminUpdateBooking: (id, payload) =>
    request(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      body: payload,
      auth: true,
    }),
  adminDeleteBooking: (id) =>
    request(`/api/admin/bookings/${id}`, { method: "DELETE", auth: true }),
  adminTopRooms: (from, to) =>
    request(
      `/api/admin/analytics/top-rooms?from=${encodeURIComponent(
        from,
      )}&to=${encodeURIComponent(to)}`,
      {
        auth: true,
      },
    ),
  adminRooms: () => request("/api/admin/rooms", { auth: true }),
  adminCreateRoom: (payload) =>
    request("/api/rooms", { method: "POST", body: payload, auth: true }),
  adminUpdateRoom: (id, payload) =>
    request(`/api/rooms/${id}`, { method: "PUT", body: payload, auth: true }),
  adminDeleteRoom: (id) =>
    request(`/api/rooms/${id}`, { method: "DELETE", auth: true }),
};
