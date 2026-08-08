const API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
     throw new Error(
   "REACT_APP_API_URL is not set. Add it to .env for local and to Vercel Environment Variables for production."
  );
}
console.log("API Base URL:", API_BASE_URL);

// Statik dosyalar (ürün resimleri vb.) backend'in kök adresinden servis edilir (/api altında değil).
// REACT_APP_API_URL sonundaki "/api"yi kırparak sunucu kök adresini türetiyoruz.
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const apiConfig = {
  API_BASE_URL,
  SERVER_BASE_URL,
  endpoints: {
    auth: {
      login: `${API_BASE_URL}/auth/login`,
      register: `${API_BASE_URL}/auth/register`,
      sendCode: `${API_BASE_URL}/auth/send-code`,
      verifyCode: `${API_BASE_URL}/auth/verify-code`,
    },
    products: {
      list: `${API_BASE_URL}/Product`.trim(),
      detail: (id) => `${API_BASE_URL}/Product/${id}`,
    },
    payments: {
      start: `${API_BASE_URL}/payments/start`,
    },
    orders: {
      list: `${API_BASE_URL}/orders`,
      get: (id) => `${API_BASE_URL}/orders/${id}`,
      create: `${API_BASE_URL}/orders`,
    },
  },
};

export default apiConfig;
