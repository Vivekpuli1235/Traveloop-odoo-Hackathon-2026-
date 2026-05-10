# 🌍 Traveloop - The Ultimate Travel Companion

**Traveloop** is a full-stack, premium web application built for the 2026 Odoo Hackathon. It is designed to revolutionize how travelers plan, manage, and share their journeys. From AI-assisted itinerary building to community-driven destination ratings and real-time interactive maps, Traveloop brings all your travel needs into one beautiful, unified platform.

---

## ✨ Key Features

- **🛡️ Secure Authentication**: Full user signup and login with encrypted passwords (bcrypt) and JWT session management.
- **👤 Personalized Profiles**: Upload custom profile pictures, define travel interests, and track your dream destinations.
- **🗺️ Interactive Map & Discovery**: Search for cities and seamlessly discover nearby attractions, food, and shopping via an integrated Map view. Pin activities directly to your upcoming trips.
- **📅 Smart Itinerary Builder**: Visually plan your days, organize stops, and structure your travel schedule flawlessly.
- **💸 Budget & Expense Tracker**: Keep tabs on your flight, accommodation, food, and transport budgets, displayed in localized currency (₹).
- **🌟 Community Ratings**: Share your travel experiences and read authentic reviews from fellow travelers, categorized globally and locally.
- **📱 Premium Modern UI**: A responsive, dynamic interface featuring glassmorphism, micro-animations, and curated aesthetic design.

---

## 🛠️ Technology Stack

**Frontend:**
- [React](https://reactjs.org/) (Vite)
- [Tailwind CSS](https://tailwindcss.com/) (For responsive, utility-first styling)
- [Lucide React](https://lucide.dev/) (Beautiful SVG icons)
- [Motion/React](https://motion.dev/) (For fluid UI animations)
- React Router DOM (Navigation)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [MySQL 2](https://www.npmjs.com/package/mysql2) (Database connection pool)
- JWT (JSON Web Tokens for Auth)
- Bcrypt (Password Hashing)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- **Node.js** (v18+)
- **MySQL** (Running locally on default port `3306`)

### 1. Database Setup
Create a new MySQL database named `traveloop`. The application will automatically create the necessary tables (`users`, `trips`, `activities`, `community_ratings`, etc.) when the server starts.
```sql
CREATE DATABASE traveloop;
```

### 2. Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=traveloop
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Installation
Install the required dependencies for both the frontend and backend.
```bash
npm install
```

### 4. Run the Application
The project uses `tsx` and `vite` to run both the Express backend and the React frontend concurrently. 
```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 📸 Screenshots & UI

Traveloop was designed with a heavy emphasis on user experience. Expect smooth hover states, intuitive forms, and a deeply integrated map visualization for discovering new activities!

<h2>🏠 Landing Page</h2>
<img src="(https://res.cloudinary.com/dxr9wzza1/image/upload/v1778415041/Screenshot_2026-05-10_at_5.24.01_PM_mjakqn.png)" width="100%" />

<h2>📊 Dashboard</h2>
<img src="https://res.cloudinary.com/dxr9wzza1/image/upload/v1778415044/Screenshot_2026-05-10_at_5.24.18_PM_xgkpqu.png" width="100%" />

<h2>🧳 My Trips</h2>
<img src="https://res.cloudinary.com/dxr9wzza1/image/upload/v1778415040/Screenshot_2026-05-10_at_5.24.27_PM_wipfmo.png" width="100%" />

<h2>🌍 Explore</h2>
<img src="https://res.cloudinary.com/dxr9wzza1/image/upload/v1778415039/Screenshot_2026-05-10_at_5.24.37_PM_rmy31n.png" width="100%" />

<h2>🧳 My Trips</h2>

<img 
  src="https://res.cloudinary.com/dxr9wzza1/image/upload/v1778415036/Screenshot_2026-05-10_at_5.25.00_PM_eynqp5.png" 
  width="100%" 
  alt="My Trips"
/>

<h2>➕ Plan a New Trip</h2>

<img 
  src="https://res.cloudinary.com/dxr9wzza1/image/upload/v1778415038/Screenshot_2026-05-10_at_5.24.30_PM_jbnt3n.png" 
  width="100%" 
  alt="Plan a New Trip"
/>

<h2>🌍 Explore Destinations</h2>

<img 
  src="https://res.cloudinary.com/dxr9wzza1/image/upload/v1778415039/Screenshot_2026-05-10_at_5.24.55_PM_zsoawl.png" 
  width="100%" 
  alt="Explore Destinations"
/>

<h2>👥 Community Ratings</h2>

<img 
  src="https://res.cloudinary.com/dxr9wzza1/image/upload/v1778415041/Screenshot_2026-05-10_at_5.24.40_PM_j82kuo.png" 
  width="100%" 
  alt="Community Ratings"
/>

---

## 👨‍💻 Developed By
Created for the **Odoo Hackathon 2026** by Vivek Puli & Team.
