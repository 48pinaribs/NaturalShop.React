// API Configuration
// Backend API base URL
// Development: Backend localhost'ta çalışıyorsa localhost:5072 kullanın
// Production: Production backend URL'inizi buraya yazın
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5072/api";
console.log("API_BASE_URL --->", API_BASE_URL);
export default {
  API_BASE_URL,
  // API endpoints
  endpoints: {
    auth: {
      login: `${API_BASE_URL}/auth/login`,
      register: `${API_BASE_URL}/auth/register`,
      sendCode: `${API_BASE_URL}/auth/send-code`,
      verifyCode: `${API_BASE_URL}/auth/verify-code`,
    },
    products: {
      list: `${API_BASE_URL}/Product`,
      detail: (id) => `${API_BASE_URL}/Product/${id}`,
    },
    payments: {
      start: `${API_BASE_URL}/payments/start`,
    },
    orders: {
      list: `${API_BASE_URL}/orders`,
      get: (id) => `${API_BASE_URL}/orders/${id}`,
    },
  },
};

