<!-- Optional banner – save an image as Images/banner.png to use this -->
<p align="center">
  <img src="./Images/banner.png" alt="Store Rating Platform Banner" width="100%" />
</p>

<h1 align="center">⭐ Store Rating Platform</h1>

<p align="center">
  A modern full-stack web application for managing stores and collecting user ratings with role-based dashboards for Admins, Users, and Store Owners.
</p>

<p align="center">

  <!-- Tech stack badges -->
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-000000?style=for-the-badge" />

  <br/>

  <!-- Repo badges -->
  <img src="https://img.shields.io/github/stars/jaymehta9/store-rating-app?style=social" />
  <img src="https://img.shields.io/github/repo-size/jaymehta9/store-rating-app?style=flat-square" />
  <img src="https://img.shields.io/github/last-commit/jaymehta9/store-rating-app?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" />
</p>

---

## 📚 Table of Contents

- [Overview](#overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Screenshots (UI Preview)](#-screenshots-ui-preview)
- [Architecture & Database](#-architecture--database)
- [Features](#-features-role-based)
- [Validation Rules](#-validation-rules)
- [Setup Instructions](#-setup-instructions)
  - [Backend](#-backend-setup)
  - [Frontend](#-frontend-setup)
- [Default Admin Login](#-default-admin-login)
- [Conclusion](#-conclusion)

---

## Overview

A modern full-stack web application where users can browse stores, give ratings, and manage their profiles.  
Admins can manage users & stores, while store owners can view analytics of their assigned stores.

This project features a **clean, minimal, premium UI** and a well-structured backend powered by Supabase.

---

## 🚀 Tech Stack

### Frontend

- React + Vite  
- React Router  
- Modern CSS (premium, minimal UI)  
- Fetch API  

### Backend

- Node.js + Express  
- PostgreSQL (Supabase)  
- JWT Authentication  
- Bcrypt Password Hashing  
- Role-based Authorization  

### Tools

- Supabase Dashboard  
- VSCode  
- Postman / ThunderClient  

---

## 📂 Project Structure

```text
store-rating-app/
├── backend/
├── frontend/
├── Images/
│   ├── Sign in.png
│   ├── Create Account.png
│   ├── Admin panel.png
│   ├── User.png
│   ├── Owner.png
│   ├── Schema visualizer.png
│   ├── Tables .png
│   └── Store Rating Platform Diagrams.png
└── README.md
```

---

## 📸 Screenshots (UI Preview)

### 🔐 Sign In

![Sign In](./Images/Sign%20in.png)

---

### 🆕 Create Account

![Create Account](./Images/Create%20Account.png)

---

### 👑 Admin Dashboard

![Admin Panel](./Images/Admin%20panel.png)

---

### 🙋‍♂️ User Dashboard

![User Dashboard](./Images/User.png)

---

### 🏪 Store Owner Dashboard

![Owner Dashboard](./Images/Owner.png)

---

## 🧩 Architecture & Database

### 🔧 System Architecture + Flow Diagram

![System Architecture](./Images/Store%20Rating%20Platform%20Diagrams.png)

---

### 🗺 Supabase Schema Visualizer

![Schema Visualizer](./Images/Schema%20visualizer.png)

---

### 📊 Supabase Tables View

![Tables](./Images/Tables%20.png)

---

## 🧠 Features (Role Based)

### 👑 Admin

- Create users (Admin, Owner, User)  
- Create stores and optionally assign owners  
- View total users, stores, and ratings  
- Search / filter / sort users  
- Search / sort stores  
- See validation error popups for bad data  

---

### 🙋‍♂️ User

- Browse all stores  
- Search / filter stores  
- Rate stores (1–5)  
- Update rating anytime  
- Update password  

---

### 🏪 Store Owner

- View store assigned to them  
- See average rating of their store  
- View rating details (user + rating)  
- Update password  

---

## 🗄 Database Schema (Text-Based ERD)

### Users

| Field         | Type      | Notes                 |
|--------------|-----------|-----------------------|
| id           | int       | Primary Key           |
| name         | varchar   | 20–60 chars           |
| email        | varchar   | Unique                |
| address      | varchar   | ≤ 400 chars           |
| password_hash| varchar   | Bcrypt hash           |
| role         | varchar   | USER / ADMIN / OWNER |
| created_at   | timestamp |                       |

### Stores

| Field       | Type    |
|------------|---------|
| id         | int     |
| name       | varchar |
| email      | varchar |
| address    | varchar |
| owner_id   | int (FK → users.id) |
| created_at | timestamp |

### Ratings

| Field       | Type      |
|------------|-----------|
| id         | int       |
| user_id    | int (FK)  |
| store_id   | int (FK)  |
| rating     | int (1–5) |
| created_at | timestamp |
| updated_at | timestamp |

---

## ✔ Validation Rules

### User Creation

- **Name:** 20–60 characters  
- **Address:** ≤ 400 characters  
- **Password:** 8–16 characters, at least **1 uppercase** and **1 special character**  
- **Email:** must be a valid email format  

### Store Creation

- **Store name:** 20–60 characters  
- **Store email:** valid email format  
- **Owner ID:** must exist in `users` table (optional)  

If invalid →  
🟥 `Please enter valid data.`

---

## 🛠 Setup Instructions

### 🔧 Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run dev
```

Backend runs at → **http://localhost:4000**

---

### 💻 Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at → **http://localhost:5173**

---

## 🔐 Default Admin Login

```text
Email: jm.jaymehta2222@gmail.com
Password: Jay@1101
```

---

## 🏁 Conclusion

This project demonstrates:

- Clean, modern UI/UX  
- Role-based authentication and authorization  
- Solid relational database design  
- Supabase integration  
- Real-world validation and error handling  
- Complete full-stack architecture (React + Node + PostgreSQL)

If you like this project, ⭐ **star the repo** – feedback and contributions are always welcome 😊
