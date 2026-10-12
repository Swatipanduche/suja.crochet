// Thin wrapper around the backend REST API.
// Every call fails gracefully — if the backend isn't running, the storefront
// keeps working off its built-in mock data (see app.js), so you can develop
// the frontend and backend independently.

const BASE = '/api';

function authHeader(token) {
  return token ? { Authorization: 'Bearer ' + token } : {};
}

async function request(path, options = {}) {
  const { headers, ...rest } = options;
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    ...rest,
  });
  if (!res.ok) {
    let message = `API ${path} failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body && body.error) message = body.error;
    } catch (e) { /* response wasn't JSON — keep the generic message */ }
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  // Products & categories
  getProducts: (query = '') => request(`/products${query}`),
  getProduct: (id) => request(`/products/${id}`),
  getCategories: () => request('/categories'),

  // Orders
  createOrder: (payload) => request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getOrder: (id) => request(`/orders/${id}`),
  getMyOrders: () => request('/orders'),

  // Payments (Razorpay flow — see backend/src/routes/payments.js)
  createPaymentOrder: (payload) =>
    request('/payments/create-order', { method: 'POST', body: JSON.stringify(payload) }),
  verifyPayment: (payload) =>
    request('/payments/verify', { method: 'POST', body: JSON.stringify(payload) }),

  // Custom orders
  submitCustomOrder: (payload) =>
    request('/custom-orders', { method: 'POST', body: JSON.stringify(payload) }),

  // Contact Us
  submitContactMessage: (payload) =>
    request('/contact', { method: 'POST', body: JSON.stringify(payload) }),

  // Return / defect requests
  submitReturnRequest: (payload) =>
    request('/return-requests', { method: 'POST', body: JSON.stringify(payload) }),

  // Reviews
  submitReview: (payload) => request('/reviews', { method: 'POST', body: JSON.stringify(payload) }),

  // Wishlist
  getWishlist: () => request('/wishlist'),
  addWishlist: (productId) =>
    request('/wishlist', { method: 'POST', body: JSON.stringify({ productId }) }),
  removeWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' }),

  // Auth (customer + admin)
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  signup: (payload) => request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),

  // File Upload
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(BASE + '/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      let msg = 'Upload failed';
      try { const b = await res.json(); if (b && b.error) msg = b.error; } catch(e){}
      throw new Error(msg);
    }
    return res.json();
  },

  // Admin Portal (all require a Bearer token for a user with role "admin")
  adminDashboard: (token) => request('/admin/dashboard', { headers: authHeader(token) }),
  adminGetProducts: (token) => request('/admin/products', { headers: authHeader(token) }),
  adminCreateProduct: (token, payload) =>
    request('/admin/products', { method: 'POST', headers: authHeader(token), body: JSON.stringify(payload) }),
  adminUpdateProduct: (token, id, payload) =>
    request(`/admin/products/${id}`, { method: 'PUT', headers: authHeader(token), body: JSON.stringify(payload) }),
  adminDeleteProduct: (token, id) =>
    request(`/admin/products/${id}`, { method: 'DELETE', headers: authHeader(token) }),
  adminGetOrders: (token) => request('/admin/orders', { headers: authHeader(token) }),
  adminUpdateOrder: (token, id, payload) =>
    request(`/admin/orders/${id}`, { method: 'PATCH', headers: authHeader(token), body: JSON.stringify(payload) }),
  adminGetCustomOrders: (token) => request('/admin/custom-orders', { headers: authHeader(token) }),
  adminUpdateCustomOrder: (token, id, payload) =>
    request(`/admin/custom-orders/${id}`, { method: 'PATCH', headers: authHeader(token), body: JSON.stringify(payload) }),
  adminGetContactMessages: (token) => request('/admin/contact-messages', { headers: authHeader(token) }),
  adminUpdateContactMessage: (token, id, payload) =>
    request(`/admin/contact-messages/${id}`, { method: 'PATCH', headers: authHeader(token), body: JSON.stringify(payload) }),
  adminGetReturnRequests: (token) => request('/admin/return-requests', { headers: authHeader(token) }),
  adminUpdateReturnRequest: (token, id, payload) =>
    request(`/admin/return-requests/${id}`, { method: 'PATCH', headers: authHeader(token), body: JSON.stringify(payload) }),
  adminGetReviews: (token) => request('/admin/reviews', { headers: authHeader(token) }),
  adminUpdateReview: (token, id, payload) =>
    request(`/admin/reviews/${id}`, { method: 'PATCH', headers: authHeader(token), body: JSON.stringify(payload) }),
  adminDeleteReview: (token, id) =>
    request(`/admin/reviews/${id}`, { method: 'DELETE', headers: authHeader(token) }),
};
