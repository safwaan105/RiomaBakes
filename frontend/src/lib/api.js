import axios from "axios";

const DEFAULT_BACKEND_URL = "http://localhost:8000";
const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || DEFAULT_BACKEND_URL).replace(/\/$/, "");
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export const productsApi = {
  list: (params = {}) => api.get("/products", { params }).then((r) => r.data),
  get: (id) => api.get(`/products/${id}`).then((r) => r.data),
};

export const ordersApi = {
  create: (payload) => api.post("/orders", payload).then((r) => r.data),
};

export const customOrdersApi = {
  create: (payload) => api.post("/custom-orders", payload).then((r) => r.data),
};

export const contactApi = {
  send: (payload) => api.post("/contact", payload).then((r) => r.data),
};

export const statsApi = {
  get: () => api.get("/stats").then((r) => r.data),
};

export const chatApi = {
  send: (session_id, message) =>
    api.post("/chat", { session_id, message }).then((r) => r.data),
};
