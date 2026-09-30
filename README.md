# Fresh Onion Mart - Onion Business Management System

A modern, responsive, high-fidelity MERN stack (MongoDB, Express.js, React.js, Node.js) web application designed for a digital agricultural onion enterprise.

---

## 🌟 Key Features

1.  **Variety Showroom:** Catalog featuring Nashik Red Onions, White Onions, and Small Onions (Shallots) with stock availability and live pricing.
2.  **Live Search, Filtering & Sorting:** Customers can instantly query keywords, filter by category tabs, and sort by rate per kg or alphabetically.
3.  **Role-Based Security:** Fully guarded JWT access control (separate flows for Customers and Store Administrators).
4.  **Customer Dashboard:** Track logs, review purchase history, edit shipping coordinates, and monitor order transit states visually.
5.  **Logistics Tracking Stepper:** Visual tracking states: `Order Placed` ➔ `Packed` ➔ `Shipped` ➔ `Delivered`.
6.  **Interactive Admin Analytics:** KPIs and premium Chart.js dashboards charting sales revenues, categoric shares, and stock metrics.
7.  **Inventory CRUD & Rate Logging:** Admin panel allowing adding, editing, removing items, and logging daily price index points.
8.  **Simulation Modes:** Simulated checkout payments using Razorpay mockups and automatic email receipt confirmations (displayed in the Node server console logs).
9.  **Dark & Light Modes:** Global aesthetic theme toggle.
10. **Contact Desk:** Integrated WhatsApp click-to-chat links, feedback forms, and an embedded Google Map of the Nashik Produce Yard.

---

## 🛠️ Tech Stack

*   **Backend:** Node.js, Express.js, Mongoose, MongoDB, JWT (`jsonwebtoken`), and `bcryptjs`.
*   **Frontend:** React.js, React Router, Tailwind CSS, Axios, Lucide React, and Chart.js.

---

## 📁 Repository Structure

```
d:/business 2/
├── package.json         # Workspace root runner (concurrently scripts)
├── server/
│   ├── config/          # DB connections
│   ├── controllers/     # Authentication, products, orders, reviews
│   ├── middleware/      # JWT auth guard, error catching handler
│   ├── models/          # Mongoose Schemas (User, Product, Order, Payment, Review)
│   ├── routes/          # API routing declarations
│   ├── scripts/         # DB seed scripts
│   └── server.js        # Backend entrypoint
└── client/
    ├── src/
    │   ├── context/     # Auth Context, Cart Context, Theme Context
    │   ├── components/  # Navbars, footers, stepper trackers, star raters
    │   ├── pages/       # Home, catalog, dashboards, login, contact
    │   └── utils/       # Axios API wrapper
    ├── index.html
    └── tailwind.config.js
```

---

## 🚀 Setup & Execution

### 1. Install Dependencies
Run from the project root folder:
```bash
npm run install-all
```

### 2. Seed Database
Database is configured with MongoDB Atlas cloud. Run the seed script:
```bash
npm run seed
```

### 3. Run Application
Starts both the Express API server (port 5000) and the Vite client server concurrently:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Demo Access Credentials

*   **Store Admin Account:**
    *   **Email:** `admin@onionmart.com`
    *   **Password:** `admin123`
*   **Test Customer Account:**
    *   **Email:** `john@gmail.com`
    *   **Password:** `password123`
