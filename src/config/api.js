const API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
     throw new Error(
   "REACT_APP_API_URL is not set. Add it to .env for local and to Vercel Environment Variables for production."
  );
}
console.log("API Base URL:", API_BASE_URL);
const apiConfig = {
  API_BASE_URL,
  endpoints: {
    auth: {
      login: `${API_BASE_URL}/api/auth/login`,
      register: `${API_BASE_URL}/api/auth/register`,
      sendCode: `${API_BASE_URL}/api/auth/send-code`,
      verifyCode: `${API_BASE_URL}/api/auth/verify-code`,
    },
    products: {
      list: `${API_BASE_URL}/api/Product`,
      detail: (id) => `${API_BASE_URL}/api/Product/${id}`,
    },
    payments: {
      start: `${API_BASE_URL}/api/payments/start`,
    },
    orders: {
      list: `${API_BASE_URL}/api/orders`,
      get: (id) => `${API_BASE_URL}/api/orders/${id}`,
    },
  },
};

export default apiConfig;
