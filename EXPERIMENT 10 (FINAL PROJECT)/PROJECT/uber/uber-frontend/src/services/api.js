const BASE_URL = "http://localhost:8080";

// 🔐 get token
const getToken = () => localStorage.getItem("token");

// 📡 common headers
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + getToken(),
});

// ✅ COMMON FETCH HANDLER (VERY IMPORTANT)
const handleResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return res.text();
};

// 🔑 LOGIN
export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(res);
};

// 🚗 CREATE RIDE
export const createRide = async (ride) => {
  const res = await fetch(`${BASE_URL}/rides`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(ride),
  });

  return handleResponse(res);
};

// 📋 USER RIDES
export const getMyRides = async () => {
  const res = await fetch(`${BASE_URL}/rides`, {
    headers: getHeaders(),
  });

  return handleResponse(res);
};

// 🚕 DRIVER → AVAILABLE RIDES
export const getAvailableRides = async () => {
  const res = await fetch(`${BASE_URL}/rides/available`, {
    headers: getHeaders(),
  });

  return handleResponse(res);
};

// 🚕 DRIVER → MY RIDES
export const getDriverRides = async () => {
  const res = await fetch(`${BASE_URL}/rides/driver`, {
    headers: getHeaders(),
  });

  return handleResponse(res);
};

// ✅ ACCEPT RIDE
export const acceptRide = async (id) => {
  const res = await fetch(`${BASE_URL}/rides/accept/${id}`, {
    method: "PUT",
    headers: getHeaders(),
  });

  return handleResponse(res);
};

// 🏁 COMPLETE RIDE
export const completeRide = async (id) => {
  const res = await fetch(`${BASE_URL}/rides/complete/${id}`, {
    method: "PUT",
    headers: getHeaders(),
  });

  return handleResponse(res);
};

// 💰 PAYMENT
export const payRide = async (id) => {
  const res = await fetch(`${BASE_URL}/payment/${id}`, {
    method: "POST",
    headers: getHeaders(),
  });

  return handleResponse(res);
};

// 👑 ADMIN → GET ALL RIDES
export const getAllRides = async () => {
  const res = await fetch(`${BASE_URL}/rides/all`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch rides");
  }

  return res.json();
};

// 👑 ADMIN → GET ALL USERS
export const getAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};

// 👑 ADMIN → DELETE USER
export const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error("Delete failed");
  }

  return res.text();
};