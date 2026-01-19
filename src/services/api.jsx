// src/services/api.js
const API_BASE = "http://127.0.0.1:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Authentication
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (username, email, password) => {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    return response.json();
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// Products
export const productAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/products`);
    return response.json();
  },

  create: async (product) => {
    const response = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });
    return response.json();
  },

  update: async (id, product) => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// Dashboard
export const dashboardAPI = {
  getData: async () => {
    const response = await fetch(`${API_BASE}/dashboard`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// Sales
export const salesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/sales`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  create: async (sale) => {
    const response = await fetch(`${API_BASE}/sales`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(sale),
    });
    return response.json();
  },
};

// Purchases
export const purchasesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/purchases`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  create: async (purchase) => {
    const response = await fetch(`${API_BASE}/purchases`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(purchase),
    });
    return response.json();
  },
};