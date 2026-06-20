# 🌙 Sleepless - Food E-Commerce Platform

Sleepless is a modern, full-stack food delivery and e-commerce web application featuring a sleek React + Vite frontend and a secure Spring Boot REST API backend with Spring Security and JWT authentication.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite-powered for rapid development)
- **Routing**: React Router DOM v6 (Private & Admin route guards)
- **Styling**: Modern Vanilla CSS
- **Icons**: Lucide React Icons

### Backend
- **Framework**: Spring Boot 3.2 (Java 17)
- **Security**: Spring Security & Stateless JWT Authentication
- **Data Persistence**: Spring Data JPA (Hibernate)
- **Database**: H2 Database (File-based for local execution) / MySQL Ready
- **Validation**: Jakarta Bean Validation

---

## 🏗️ Architecture & Project Structure

The project is split into two main modules:

```text
sleepless/
├── frontend/             # React + Vite client application
│   ├── src/
│   │   ├── components/   # Reusable components (Header, Footer, Route Guards)
│   │   ├── context/      # Global state providers (Auth, Cart)
│   │   ├── pages/        # Main application views (Home, Shop, Admin, Cart, etc.)
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   └── vite.config.js
└── backend/              # Spring Boot REST API application
    ├── src/main/java/com/sleepless/
    │   ├── config/       # Security and CORS configurations
    │   ├── controller/   # REST API controllers
    │   ├── dto/          # Data Transfer Objects (Requests/Responses)
    │   ├── model/        # JPA Entities (User, Product, Order, etc.)
    │   ├── repository/   # JPA Repositories
    │   └── security/     # JWT Token filters, Providers, and custom UserDetails
    ├── src/main/resources/
    │   └── application.properties # Server, database & security configuration
    └── pom.xml
```

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- **Java JDK 17** or higher
- **Node.js** (v18 or higher) and **npm**
- **Maven** (for managing backend dependencies and running)

---

### 1. Database Setup
By default, the application runs on a local, file-based **H2 Database** for ease of development. 
- H2 Console is enabled at [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL**: `jdbc:h2:file:./db/sleepless`
- **Username**: `sa`
- **Password**: `password`

*To switch to MySQL, update the spring datasource properties in `backend/src/main/resources/application.properties`.*

---

### 2. Backend Installation & Run
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build and run the project using Maven:
   ```bash
   mvn spring-boot:run
   ```
   The backend REST API will start on **`http://localhost:8080`**.

---

### 3. Frontend Installation & Run
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will start and be accessible at **`http://localhost:5173`**.

---

## 🔒 Security & Admin Registration
- All user-sensitive endpoints (Cart, Orders, Admin endpoints) are protected using stateless **JWT Tokens** sent via the `Authorization: Bearer <token>` header.
- **Admin Registration**: To register an administrator account, check the "Register as Administrator" option in the signup view and provide the secret registration code:
  - **Secret Code**: `123ABC`

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user or administrator | None |
| `POST` | `/api/auth/login` | Authenticate credentials and return JWT token | None |
| `GET` | `/api/auth/me` | Retrieve the authenticated user's profile | User/Admin |

### 🍕 Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Get list of products (supports `search` and `limit` query parameters) | None |
| `GET` | `/api/products/{id}` | Get product details by ID | None |

### 🛒 Shopping Cart (`/api/cart`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Get current user's cart items | User |
| `POST` | `/api/cart` | Add a product to the cart | User |
| `PUT` | `/api/cart/{id}` | Update quantity of a cart item | User |
| `DELETE` | `/api/cart/{id}` | Remove a product from the cart | User |
| `DELETE` | `/api/cart` | Clear all items in the user's cart | User |

### 📦 Orders (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/orders` | Get list of orders placed by the current user | User |
| `POST` | `/api/orders` | Place a new order with cart items and clear the cart | User |

### ✉️ Contact Messages (`/api/messages`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/messages` | Send a contact/feedback message to administrators | User |

### 👑 Admin Management (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Fetch dashboard metrics (total earnings, pending/completed order counts, etc.) | Admin |
| `POST` | `/api/admin/products` | Create a new product (handles multipart image uploads) | Admin |
| `PUT` | `/api/admin/products/{id}` | Update product details and/or product image | Admin |
| `DELETE` | `/api/admin/products/{id}` | Delete a product | Admin |
| `GET` | `/api/admin/orders` | Get all orders in the system | Admin |
| `PUT` | `/api/admin/orders/{id}/payment` | Update payment status of an order (`pending` / `completed`) | Admin |
| `DELETE` | `/api/admin/orders/{id}` | Delete an order | Admin |
| `GET` | `/api/admin/users` | Retrieve all registered users | Admin |
| `DELETE` | `/api/admin/users/{id}` | Delete a user account | Admin |
| `GET` | `/api/admin/messages` | View all submitted contact/feedback messages | Admin |
| `DELETE` | `/api/admin/messages/{id}` | Delete a contact message | Admin |
