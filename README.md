# NaturalShop - React E-Commerce Platform

<div align="center">

![NaturalShop](https://img.shields.io/badge/version-0.1.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Status](https://img.shields.io/badge/status-Active-success)
![License](https://img.shields.io/badge/license-MIT-green)

**A modern, high-performance React e-commerce platform for natural products with seamless payment integration**

[View Live](#deployment) • [Architecture](#architecture) • [Getting Started](#getting-started) • [Performance](#performance-optimization)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Core Architecture](#architecture)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Data Flow](#data-flow-architecture)
- [Cart & State Management](#cart--state-management)
- [Product Logic](#product-logic)
- [Authentication System](#authentication-system)
- [Performance Optimization](#performance-optimization)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Environment Configuration](#environment-configuration)
- [API Integration](#api-integration)

---

## 📱 Overview

**NaturalShop** is a robust, production-ready e-commerce platform built with React 19, designed specifically for selling natural products. The application features a modern, responsive interface with advanced state management, real-time cart synchronization, and integrated payment processing via Iyzico.

### Key Highlights

- **⚡ Performance-Focused**: Implements skeleton loading, image optimization, and memoization
- **🛒 Smart Cart System**: Persistent cart with localStorage synchronization
- **💳 Integrated Payments**: Seamless Iyzico payment gateway integration
- **📱 Mobile-First**: Fully responsive design for all devices
- **🔐 Secure Authentication**: Phone-based and email/password authentication
- **🎨 Modern UI**: Beautiful animations with Framer Motion and Material-UI
- **📊 Order Management**: Complete order tracking and history

---

## 🏗️ Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application (SPA)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────────────────┐ │
│  │   Router Setup   │      │   Global State (React)       │ │
│  │ (React Router v7)│      │   - CartContext              │ │
│  │ - 14+ Routes     │      │   - localStorage             │ │
│  │ - SPA Navigation │      │   - User Auth State          │ │
│  └──────────────────┘      └──────────────────────────────┘ │
│         │                               │                     │
│         └───────────────┬───────────────┘                     │
│                         │                                     │
│  ┌──────────────────────▼──────────────────────────────────┐ │
│  │           UI Layer (Components/Pages)                   │ │
│  │ ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │ │
│  │ │  Header     │  │  Products   │  │  Cart & Payment │ │ │
│  │ │  Footer     │  │  Details    │  │  Order History  │ │ │
│  │ │  Modals     │  │  Categories │  │  Auth Pages     │ │ │
│  │ └─────────────┘  └─────────────┘  └─────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
│                         │                                     │
│  ┌──────────────────────▼──────────────────────────────────┐ │
│  │        HTTP Client Layer (Axios/Fetch)                 │ │
│  │         - API Configuration (api.js)                   │ │
│  │         - Error Handling & Interceptors                │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                             │
                  ┌──────────▼───────────┐
                  │   Backend API        │
                  │  (Node.js/.NET)      │
                  │                      │
                  │ - Authentication     │
                  │ - Product Data       │
                  │ - Payment Processing │
                  │ - Order Management   │
                  └──────────────────────┘
```

### Core Architecture Pattern: Context API + Router

The application follows a **component-driven architecture** with React's Context API for global state management:

1. **Entry Point**: `index.js` initializes React with BrowserRouter
2. **Root Component**: `App.jsx` wraps the application with CartProvider
3. **Global State**: CartContext provides cart operations to all components
4. **Routing**: React Router v7 handles SPA navigation
5. **API Layer**: Centralized API configuration with environment-based URLs

---

## 📁 Project Structure

```
src/
├── App.jsx                          # Root application component with routing
├── App.css                          # Global application styles
├── index.js                         # React DOM entry point
├── index.css                        # Global CSS variables & styles
├── reportWebVitals.js               # Performance monitoring
├── setupTests.js                    # Jest configuration
│
├── config/
│   └── api.js                       # Centralized API endpoints & configuration
│
├── context/
│   └── CartContext.jsx              # Global Cart State Management
│       ├── addToCart()              # Add/increment product to cart
│       ├── increaseQty()            # Increment product quantity
│       ├── decreaseQty()            # Decrement product quantity
│       ├── removeFromCart()         # Remove item from cart
│       ├── clearCart()              # Clear entire cart
│       └── localStorage persist      # Auto-save to browser storage
│
├── components/
│   ├── Header.jsx                   # Navigation & User Menu
│   │   ├── Mobile menu handling
│   │   ├── Auth state checking
│   │   └── Cart badge
│   ├── Header.css
│   ├── Footer.jsx                   # Footer component
│   ├── Footer.css
│   ├── ProductCard.jsx              # Product listing card component
│   │   ├── Image optimization
│   │   ├── Add to cart functionality
│   │   └── Journey modal trigger
│   ├── ProductCard.css
│   ├── ProductCardSkeleton.jsx      # Loading skeleton (MUI)
│   ├── ProductDetailSkeleton.jsx    # Detail page skeleton
│   ├── ProductJourneyModal.jsx      # Product journey/story modal
│   ├── ProductJourneyModal.css
│   ├── JourneySlider.jsx            # Homepage carousel (Swiper)
│   ├── JourneySlider.css
│   ├── LeafLogo.jsx                 # Logo component
│   ├── ScrollToTop.jsx              # Auto-scroll on route change
│   ├── SupportContactWidget.jsx     # Contact widget
│   └── SupportContactWidget.css
│
├── pages/
│   ├── ProductsPage.jsx             # Products listing with filtering
│   ├── ProductDetails.jsx           # Individual product detail page
│   ├── CartPage.jsx                 # Shopping cart management
│   ├── CheckoutPage.jsx             # Payment initiation
│   ├── PaymentResultPage.jsx        # Payment callback handler
│   ├── OrderSuccess.jsx             # Order confirmation
│   ├── OrdersPage.jsx               # User's order history
│   ├── OrderDetailsPage.jsx         # Single order details
│   ├── Login.jsx                    # Email/password authentication
│   ├── PhoneLogin.jsx               # OTP-based phone login
│   ├── Register.jsx                 # User registration
│   ├── About.jsx                    # About page
│   └── [CSS files for each page]
│
└── assets/
    ├── logo2.png                    # Application logo
    └── [Other brand assets]
```

---

## 🚀 Key Features

### 1. **Product Catalog**

- Browse natural products across multiple categories
- Category filtering (zeytinyagi, incir, bal-pekmez, etc.)
- Product detail pages with comprehensive information
- Product journey/story visualization with modal

### 2. **Shopping Cart**

- Add/remove products from cart
- Adjust product quantities (increase/decrease)
- Real-time cart total calculation
- Persistent cart storage (localStorage)
- Cart synchronization across browser tabs

### 3. **Payment Processing**

- Iyzico payment gateway integration
- Secure payment page redirection
- Transaction result handling
- Order confirmation workflow

### 4. **Authentication**

- Email/password login
- Phone-based OTP authentication
- User registration
- Token-based session management
- Persistent user state

### 5. **Order Management**

- Order history viewing
- Individual order details
- Order status tracking
- Receipt information

### 6. **User Experience**

- Responsive mobile-first design
- Real-time toast notifications
- Loading skeletons for better UX
- Image lazy loading & fallbacks
- Smooth animations & transitions

---

## 🛠️ Technology Stack

### Core Framework

| Technology           | Version | Purpose             |
| -------------------- | ------- | ------------------- |
| **React**            | 19.2.0  | UI framework        |
| **React Router DOM** | 7.9.5   | Client-side routing |
| **React DOM**        | 19.2.0  | DOM rendering       |

### State & Data Management

| Technology       | Version  | Purpose                          |
| ---------------- | -------- | -------------------------------- |
| **Context API**  | built-in | Global state (cart)              |
| **localStorage** | native   | Persistent cart storage          |
| **Axios**        | 1.13.0   | HTTP client alternative to fetch |

### UI/Styling

| Technology                      | Version | Purpose                       |
| ------------------------------- | ------- | ----------------------------- |
| **Material-UI (@mui/material)** | 7.3.4   | Component library & skeletons |
| **Material-UI Icons**           | 7.3.4   | Icon set                      |
| **Emotion (@emotion/react)**    | 11.14.0 | CSS-in-JS for MUI             |
| **Emotion Styled**              | 11.14.1 | Styled components             |
| **SASS**                        | 1.93.2  | Advanced CSS preprocessing    |
| **Swiper**                      | 11.2.10 | Touch slider/carousel         |

### Icons & Animations

| Technology          | Version  | Purpose                      |
| ------------------- | -------- | ---------------------------- |
| **React Icons**     | 5.5.0    | Icon library (FiIcons, etc.) |
| **Lucide React**    | 0.548.0  | Modern minimal icon set      |
| **Framer Motion**   | 12.23.24 | Animation library            |
| **Canvas Confetti** | 1.9.4    | Celebration animations       |

### Notifications & UX

| Technology         | Version | Purpose             |
| ------------------ | ------- | ------------------- |
| **React Toastify** | 11.0.5  | Toast notifications |

### Testing & Development

| Technology                      | Version | Purpose                    |
| ------------------------------- | ------- | -------------------------- |
| **@testing-library/react**      | 16.3.0  | Component testing          |
| **@testing-library/jest-dom**   | 6.9.1   | DOM assertions             |
| **@testing-library/user-event** | 13.5.0  | User interactions          |
| **TypeScript**                  | 4.9.5   | Type safety (optional)     |
| **react-scripts**               | 5.0.1   | CRA build tooling          |
| **web-vitals**                  | 2.1.4   | Core Web Vitals monitoring |

---

## 🔄 Data Flow Architecture

### 1. **Product Fetching Flow**

```
ProductsPage Component (Mounts)
        ↓
    useEffect Hook Triggers
        ↓
    Fetch from API_BASE_URL/Product
        ↓
API Response (Products Array)
        ↓
Filter by Category (if specified)
        ↓
setProducts State
        ↓
Render ProductCard Components
```

**Code Example:**

```jsx
// src/pages/ProductsPage.jsx
useEffect(() => {
  const fetchProducts = async () => {
    const res = await fetch(apiConfig.endpoints.products.list);
    const data = await res.json();

    // Filter by category if specified
    let filteredProducts = data;
    if (category) {
      filteredProducts = filterByCategory(data, category);
    }

    setProducts(filteredProducts);
  };

  fetchProducts();
}, [category]);
```

### 2. **Product Purchase Flow**

```
User Views Product
        ↓
  Click "Add to Cart"
        ↓
ProductCard.handleAdd()
        ↓
useCart().addToCart(product)
        ↓
UPDATE CartContext State
        ↓
Save to localStorage
        ↓
Trigger Toast Notification
        ↓
User Navigates to /cart
        ↓
CartPage Renders Cart Items
        ↓
User Clicks "Checkout"
        ↓
Navigate to /checkout
```

### 3. **Payment Flow**

```
CheckoutPage Component
        ↓
  User Submits Form
        ↓
Validate User Authentication
        ↓
Format Order Data (Product IDs + Quantities)
        ↓
POST to /payments/start (Backend)
        ↓
Backend Generates Iyzico Payment URL
        ↓
    Response with paymentPageUrl
        ↓
window.location.href = PaymentURL
        ↓
User Completes Payment on Iyzico
        ↓
Redirect to /payment-result
        ↓
PaymentResultPage Handles Callback
```

**Checkout Code Snippet:**

```jsx
// src/pages/CheckoutPage.jsx
const handleSubmit = async (e) => {
  const response = await axios.post(
    apiConfig.endpoints.payments.start,
    {
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  // Redirect to Iyzico payment page
  window.location.href = response.data.paymentPageUrl;
};
```

### 4. **Authentication Flow**

```
Login/PhoneLogin Page
        ↓
User Enters Credentials
        ↓
    POST to /auth/login or /auth/send-code
        ↓
Backend Validates & Returns Token
        ↓
localStorage.setItem("token", token)
        ↓
localStorage.setItem("user", userData)
        ↓
Header Component Detects Auth
        ↓
Display User Menu & Authenticated Routes
        ↓
Logout Clears Storage & Auth State
```

---

## 🛒 Cart & State Management

### CartContext Architecture

**Location:** `src/context/CartContext.jsx`

The Cart Context provides a centralized shopping cart state management system using React Context API:

```jsx
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize from localStorage on mount
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Core Operations
  const addToCart = (product) => { /* ... */ };
  const increaseQty = (id) => { /* ... */ };
  const decreaseQty = (id) => { /* ... */ };
  const removeFromCart = (id) => { /* ... */ };
  const clearCart = () => { /* ... */ };
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ ... }}>
      {children}
    </CartContext.Provider>
  );
}
```

### Key Methods

| Method               | Parameters     | Description                                   |
| -------------------- | -------------- | --------------------------------------------- |
| `addToCart(product)` | Product object | Adds product or increments quantity if exists |
| `increaseQty(id)`    | Product ID     | Increments product quantity by 1              |
| `decreaseQty(id)`    | Product ID     | Decrements quantity; removes if 0             |
| `removeFromCart(id)` | Product ID     | Removes product completely                    |
| `clearCart()`        | None           | Clears entire cart & localStorage             |

### Usage in Components

```jsx
import { useCart } from "../context/CartContext";

function MyComponent() {
  const { cartItems, addToCart, cartTotal, removeFromCart } = useCart();

  // Use cart functions
  return (
    <div>
      {cartItems.length} items - ${cartTotal}
    </div>
  );
}
```

### localStorage Synchronization

- **Auto-Save**: Every cart modification triggers `localStorage.setItem("cart", ...)`
- **Cross-Tab Sync**: Uses storage events for tab synchronization
- **Persistence**: Cart survives page refreshes and browser closures
- **Performance**: Minimal re-renders via React.Context optimization

---

## 📦 Product Logic

### ProductCard Component

**Location:** `src/components/ProductCard.jsx`

Handles product display with advanced image optimization:

```jsx
function ProductCard({
  id, name, price, imageUrl, storyImages, ...props
}) {
  const { addToCart } = useCart();
  const [showStory, setShowStory] = useState(false);

  // Multi-source image URL support (handles API variations)
  const productImageUrl = imageUrl || ImageUrl || image || Images?.[0];

  // Image URL normalization
  const imageSrc = ensureFullUrl(productImageUrl);

  // Journey steps for product story modal
  const journeySteps = useMemo(() => {
    return storyImages?.map((img) => ({
      img: ensureFullUrl(img),
      text: storyText
    })) || [];
  }, [storyImages, storyText]);

  const handleAdd = (e) => {
    addToCart({ ...product, quantity: 1 });
    toast.success("Ürün sepete eklendi 🛒");
  };

  return (
    // Product card JSX
  );
}
```

### Image Optimization Strategy

1. **API Response Flexibility:**

   ```javascript
   const imageUrl = imageUrl || ImageUrl || image || Images[0];
   // Handles multiple API response formats
   ```

2. **URL Normalization:**

   ```javascript
   const ensureFullUrl = (url) => {
     if (!url) return "";
     if (url.startsWith("http")) return url;
     return `${baseUrl}/${url.replace(/^\//, "")}`; // Add base URL
   };
   ```

3. **Image Error Handling:**

   ```jsx
   <img
     src={imageSrc || placeholder}
     onError={(e) => (e.target.src = fallbackPlaceholder)}
   />
   ```

4. **Lazy Loading:** Images load only when needed via Swiper

### ProductDetails Page

**Location:** `src/pages/ProductDetails.jsx`

- Fetches single product via API
- Shows detailed product information
- Large product image display
- Add to cart with redirect to cart page
- Product category badges

---

## 🔐 Authentication System

### Auth Methods

#### 1. Email/Password Login

- **Route:** `/login`
- **Endpoint:** `/auth/login`
- **Features:**
  - Email validation
  - Password strength checking
  - Remember me checkbox
  - Error messages

#### 2. Phone-Based OTP Login

- **Route:** `/phone-login`
- **Endpoints:**
  - `/auth/send-code` (send OTP)
  - `/auth/verify-code` (verify OTP)
- **Features:**
  - Phone number validation
  - Code resend functionality

#### 3. Registration

- **Route:** `/register`
- **Endpoint:** `/auth/register`
- **Features:**
  - Form validation
  - Password confirmation

### Auth State Management

```javascript
// Load auth status on app start
const checkAuthStatus = () => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (token && userData) {
    // User is authenticated
    setUser(JSON.parse(userData));
  }
};

// Listen for cross-tab auth changes
window.addEventListener("storage", checkAuthStatus);
```

### Protected Routes

Routes that require authentication:

- `/checkout` - Requires user login
- `/orders` - View order history
- `/orders/:id` - View specific order

---

## ⚡ Performance Optimization

### 1. **Skeleton Loading (Loading States)**

Material-UI Skeleton components prevent layout shift and improve perceived performance:

```jsx
// src/components/ProductCardSkeleton.jsx
import { Skeleton, Card } from "@mui/material";

const ProductCardSkeleton = () => (
  <Card>
    <Skeleton variant="rectangular" width="100%" height={250} />
    <Skeleton variant="text" width="70%" height={30} />
    <Skeleton variant="rectangular" width="100%" height={48} />
  </Card>
);
```

**Benefit:** Displays 8 skeleton cards while products load, fixing layout shift (CLS).

### 2. **Image Optimization**

```javascript
// Fallback placeholder SVG
const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg><!-- small SVG --></svg>",
)}`;

<img
  src={imageSrc || placeholder}
  onError={(e) => (e.target.src = placeholder)}
/>;
```

**Benefits:**

- Fast inline placeholders (data URIs)
- Graceful degradation on failed images
- Prevents broken image layouts

### 3. **Memoization**

Product journey steps memoized to prevent unnecessary recalculations:

```jsx
const journeySteps = useMemo(() => {
  if (!productStoryImages?.length) return [];

  return productStoryImages.map((img, index) => ({
    img: ensureFullUrl(img),
    text: storyText,
  }));
}, [productStoryImages, storyText]);
```

**Benefit:** Only recalculates when dependencies change.

### 4. **Component Memoization**

Prevent unnecessary re-renders:

```jsx
// ProductCard should be memoized to prevent parent re-renders
export default React.memo(ProductCard);
```

### 5. **Category Filtering Optimization**

Smart lazy evaluation of category filters:

```jsx
const categoryMap = {
  /* ... */
};
const searchTerms = categoryMap[category] || [category];

const filteredProducts = products.filter((p) =>
  searchTerms.some(
    (term) => p.name.includes(term) || p.description.includes(term),
  ),
);
```

### 6. **Carousel Performance (Swiper)**

```jsx
<Swiper
  modules={[Autoplay, EffectFade, Pagination]}
  effect="fade"
  autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
  speed={1000}
>
  {/* Only loaded modules used */}
</Swiper>
```

**Benefit:** Only import needed Swiper modules = smaller bundle.

### 7. **Bundle Size Optimization**

- **Tree-shaking enabled:** Unused code removed during build
- **Code splitting:** React Router enables automatic code splitting
- **Lazy imports:** Only load modules when needed
- **MUI tree-shaking:** Only used components bundled

### 8. **State Updates Optimization**

Batch state updates and avoid unnecessary re-renders:

```jsx
const increaseQty = (id) => {
  setCartItems((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
    ),
  );
};
```

### 9. **API Response Caching**

Products fetched once per route change (no duplicate requests):

```jsx
useEffect(() => {
  fetchProducts();
}, [category]); // Only re-fetch on category change
```

### 10. **Web Vitals Monitoring**

```javascript
// src/reportWebVitals.js
reportWebVitals((metric) => {
  // Can send to analytics endpoint
  console.log(metric);
});
```

Tracks:

- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)
- **FCP** (First Contentful Paint)
- **TTFB** (Time to First Byte)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16.x or higher
- **npm** 8.x or higher (or yarn)
- **Git** for version control

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/48pinaribs/NaturalShop.React.git
   cd naturalshop.react
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env.local` file in the project root:**

   ```bash
   REACT_APP_API_URL=http://localhost:5072
   # or for production:
   # REACT_APP_API_URL=https://naturalshop-api.onrender.com
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

The app opens at `http://localhost:3000`

---

## 💻 Development

### Available Scripts

```bash
# Start development server (port 3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (not reversible!)
npm run eject
```

### Development Workflow

1. **Create feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test locally:**

   ```bash
   npm start
   ```

3. **Run tests before committing:**

   ```bash
   npm test
   ```

4. **Build for production to check for errors:**

   ```bash
   npm run build
   ```

5. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   git push origin feature/your-feature-name
   ```

### Debugging Tips

1. **Browser DevTools:**
   - React Developer Tools extension
   - Redux DevTools (for future MobX/Redux)
   - Network tab for API calls

2. **Console Logging:**
   - Extensive console.logs throughout code
   - Check browser console for errors

3. **localStorage Inspection:**
   ```javascript
   // In browser console
   JSON.parse(localStorage.getItem("cart")); // View cart
   localStorage.getItem("token"); // View auth token
   ```

---

## 🌐 Deployment

### Vercel Deployment (Recommended)

NaturalShop is optimized for **Vercel** with automatic deployments.

**Configuration:** `vercel.json`

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

This enables SPA routing by redirecting all routes to index.html.

### Deployment Steps

1. **Connect to Vercel:**

   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - Go to Settings → Environment Variables
   - Add: `REACT_APP_API_URL=https://your-api-domain.com`

3. **Deploy:**
   ```bash
   vercel --prod
   ```

Or use **Git integration** for automatic deployments:

- Push to your Git repository
- Vercel auto-deploys on push

### Production Build

```bash
npm run build
```

Creates optimized static files in `build/` directory:

- HTML, CSS, JS minified
- Images optimized
- Source maps generated
- Ready for any hosting platform

### Other Hosting Options

- **Netlify:** Similar to Vercel, drag-and-drop deploy
- **AWS S3 + CloudFront:** For cost-effective static hosting
- **Traditional VPS:** Copy `build/` to web server

---

## ⚙️ Environment Configuration

### Environment Variables

Create `.env.local` file in project root:

```bash
# Local Development
REACT_APP_API_URL=http://localhost:5072

# Production (Vercel)
REACT_APP_API_URL=https://naturalshop-api.onrender.com

# Optional: Analytics Endpoint
# REACT_APP_ANALYTICS_URL=https://analytics.example.com
```

### Configuration Hierarchy

1. **Local Development:** `.env.local` (git-ignored)
2. **Staging:** `.env.staging`
3. **Production:** Vercel Environment Variables

**Important:** Never commit `.env.local` with sensitive data! Add to `.gitignore`.

---

## 🔌 API Integration

### API Configuration

**Location:** `src/config/api.js`

```javascript
const apiConfig = {
  API_BASE_URL: process.env.REACT_APP_API_URL,

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
```

### HTTP Client

- **Primary:** Fetch API (native)
- **Secondary:** Axios (for checkout with headers)

```jsx
// Using Fetch
fetch(apiConfig.endpoints.products.list)
  .then((res) => res.json())
  .then((data) => setProducts(data));

// Using Axios with auth headers
axios.post(apiConfig.endpoints.payments.start, orderData, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

### Key Endpoints

| Endpoint            | Method | Purpose              |
| ------------------- | ------ | -------------------- |
| `/auth/login`       | POST   | Email/password login |
| `/auth/register`    | POST   | User registration    |
| `/auth/send-code`   | POST   | Send OTP to phone    |
| `/auth/verify-code` | POST   | Verify OTP           |
| `/Product`          | GET    | List all products    |
| `/Product/{id}`     | GET    | Get product details  |
| `/payments/start`   | POST   | Initiate payment     |
| `/orders`           | GET    | Get user's orders    |
| `/orders/{id}`      | GET    | Get order details    |

### Error Handling

```jsx
try {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  return await response.json();
} catch (error) {
  console.error("API Error:", error);
  toast.error("An error occurred. Please try again.");
}
```

---

## 📊 Performance Metrics

Expected performance benchmarks:

| Metric                  | Target  | Method                       |
| ----------------------- | ------- | ---------------------------- |
| **LCP**                 | < 2.5s  | Skeleton loading, images     |
| **FID**                 | < 100ms | Event delegation, debouncing |
| **CLS**                 | < 0.1   | Component skeletons          |
| **Bundle Size**         | < 250KB | Tree-shaking, code-split     |
| **Time to Interactive** | < 3.5s  | Lazy loading images          |

Monitor with:

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

getCLS(console.log); // Layout shifts
getFID(console.log); // Input response
getLCP(console.log); // Paint timing
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is private and belongs to NaturalShop. All rights reserved.

---

## 📞 Support

For issues or questions:

- **API Issues:** Check backend repository
- **Frontend Bugs:** Open an issue on GitHub
- **Deployment:** Check Vercel Dashboard logs

---

## 🎯 Future Enhancements

- [ ] Product search functionality
- [ ] User wishlist/favorites
- [ ] Product reviews and ratings
- [ ] Advanced filtering (price range, ratings)
- [ ] Multi-language support (Turkish/English)
- [ ] PWA capabilities (offline support)
- [ ] Analytics dashboard
- [ ] Subscription/recurring orders
- [ ] Social sharing features
- [ ] Advanced image gallery

---

<div align="center">

**Built with ❤️ for NaturalShop**

[Back to Top](#naturalshop---react-e-commerce-platform)

</div>
