# ⭐ Store Rating Platform

A modern full-stack web application where users can browse stores, give ratings, and manage their profiles.  
Admins can manage users & stores, while store owners can view analytics of their assigned stores.

This project features a **clean, minimal, premium UI** and a well-structured backend powered by Supabase.

---

# 🚀 Tech Stack

### **Frontend**
- React + Vite  
- React Router  
- Modern CSS (premium UI)  
- Fetch API  

### **Backend**
- Node.js + Express  
- PostgreSQL (Supabase)  
- JWT Authentication  
- Bcrypt Password Hashing  
- Role-based Authorization  

### **Tools**
- Supabase Dashboard  
- VSCode  
- Postman / ThunderClient  

---

# 📂 Project Structure

store-rating-app/
 ├── backend/
 ├── frontend/
 ├── Images/
 │    ├── Sign in.png
 │    ├── Create Account.png
 │    ├── Admin panel.png
 │    ├── User.png
 │    ├── Owner.png
 │    ├── Schema visualizer.png
 │    ├── Tables .png
 │    ├── Store Rating Platform Diagrams.png
 ├── README.md

---

# 📸 Screenshots (UI Preview)

### 🔐 **Sign In**
![Sign In](./Images/Sign%20in.png)

---

### 🆕 **Create Account**
![Create Account](./Images/Create%20Account.png)

---

### 👑 **Admin Dashboard**
![Admin Panel](./Images/Admin%20panel.png)

---

### 🙋‍♂️ **User Dashboard**
![User Dashboard](./Images/User.png)

---

### 🏪 **Store Owner Dashboard**
![Owner Dashboard](./Images/Owner.png)

---

# 🧩 System Architecture + Flow Diagram
![System Architecture](./Images/Store%20Rating%20Platform%20Diagrams.png)

---

# 🗄 Database – Supabase Views

## 📌 **1. Database Schema Visualizer (Relation Map)**
![Schema Visualizer](./Images/Schema%20visualizer.png)

---

## 📌 **2. Supabase Tables View**
![Tables](./Images/Tables%20.png)

---

# 🧠 Features (Role Based)

### 👑 **Admin**
- Create users (Admin, Owner, User)  
- Create stores + assign owners  
- View total users, stores, ratings  
- Search / filter / sort users  
- Search / sort stores  
- Validation error popups  

---

### 🙋‍♂️ **User**
- Browse stores  
- Search / filter  
- Rate stores (1–5 stars)  
- Update rating anytime  
- Update password  

---

### 🏪 **Store Owner**
- View assigned store  
- See average rating  
- View rating details (users + ratings)  
- Update password  

---

# 🗄 Database Schema (Text-Based ERD)

### **Users**
| Field | Type | Notes |
|-------|------|-------|
| id | int | Primary Key |
| name | varchar | 20–60 chars |
| email | varchar | Unique |
| address | varchar | ≤ 400 chars |
| password_hash | varchar | Bcrypt |
| role | USER / ADMIN / OWNER |
| created_at | timestamp |

### **Stores**
| Field | Type |
|-------|------|
| id | int |
| name | varchar |
| email | varchar |
| address | varchar |
| owner_id | FK → users.id |
| created_at | timestamp |

### **Ratings**
| Field | Type |
|-------|------|
| id | int |
| user_id | FK |
| store_id | FK |
| rating | 1–5 |
| created_at | timestamp |
| updated_at | timestamp |

---

# ✔ Validation Rules

### User Creation
- **Name:** 20–60 characters  
- **Address:** ≤ 400 characters  
- **Password:** 8–16 characters, 1 uppercase, 1 special character  
- **Email:** valid format  

### Store Creation
- **Store name:** 20–60 characters  
- **Store email:** valid  
- **Owner ID:** must exist (optional)  

If invalid →  
🟥 **“Please enter valid data.”**

---

# 🛠 Setup Instructions

## 🔧 Backend Setup

```
cd backend
cp .env.example .env
npm install
npm run migrate
npm run dev
```

Backend runs at → **http://localhost:4000**

---

## 💻 Frontend Setup

```
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at → **http://localhost:5173**

---

# 🔐 Default Admin Login

```
Email: jm.jaymehta2222@gmail.com
Password: Jay@1101
```

---

# 🏁 Conclusion

This project demonstrates:

- Clean UI/UX  
- Role-based authentication  
- Database design  
- Supabase integration  
- Admin + User + Store Owner flows  
- Real-world validation rules  
- A solid full-stack structure  

If you like this project, ⭐ star the repo!  
Feedback and contributions are welcome 😊
