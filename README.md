# ⭐ Store Rating Platform

A modern full-stack web application where users can browse stores, give ratings, and manage their profile.  
Admins can manage users & stores, while store owners can view analytics of their assigned stores.

This project is built with a clean, minimal, and premium UI to provide an intuitive experience across all roles.

---

# 🚀 Tech Stack

### **Frontend**
- React + Vite  
- React Router  
- Modern CSS (minimal + premium look)  
- Fetch API  

### **Backend**
- Node.js + Express  
- PostgreSQL (Supabase)  
- JWT Authentication  
- Bcrypt Password Hashing  
- Role-based Access  

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
 │    ├── Store Rating Platform Diagrams.png
 ├── README.md

---

# 📸 Screenshots

### 🔐 **Sign In**
![Sign In](./Images/Sign%20in.png)

### 🆕 **Create Account**
![Create Account](./Images/Create%20Account.png)

### 👑 **Admin Dashboard**
![Admin Panel](./Images/Admin%20panel.png)

### 🙋‍♂️ **User Dashboard**
![User Dashboard](./Images/User.png)

### 🏪 **Store Owner Dashboard**
![Owner Dashboard](./Images/Owner.png)

### 🧩 **System Architecture + Flow Diagram**
![System Architecture](./Images/Store%20Rating%20Platform%20Diagrams.png)

---

# 🧠 Features (Role Based)

### 👑 **Admin**
- Create users (Admin, Owner, User)  
- Create stores + assign owners  
- View total users, stores, ratings  
- Search + filter + sort users  
- Search + sort stores  
- Validation error popups  

### 🙋‍♂️ **User**
- Browse stores  
- Search + filter  
- Rate stores (1–5 stars)  
- Update rating anytime  
- Update password  

### 🏪 **Store Owner**
- View store assigned to them  
- See average rating  
- View ratings + users who rated  
- Update password  

---

# 🗄 Database Schema

### **Users**
| Field | Type | Notes |
|-------|------|-------|
| id | int | PK |
| name | varchar | 20–60 chars |
| email | varchar | unique |
| address | varchar | max 400 chars |
| password_hash | varchar | bcrypt hash |
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
| rating | int (1–5) |
| created_at | timestamp |
| updated_at | timestamp |

---

# ✔ Validation Rules

### User Creation
- **Name:** 20–60 characters  
- **Address:** max 400 characters  
- **Password:** 8–16 chars, 1 uppercase, 1 special char  
- **Email:** valid format  

### Store Creation
- **Name:** 20–60 characters  
- **Email:** valid  
- **Owner ID:** must exist (optional)  

If invalid →  
🟥 “Please enter valid data.”

---

# 🛠 Setup Instructions

---

# 🔧 Backend Setup

cd backend  
cp .env.example .env

### Edit `.env` with:
- `DATABASE_URL`  
- `JWT_SECRET`  
- `ADMIN_EMAIL`  
- `ADMIN_PASSWORD_HASH`  

### Install packages:
npm install

### Run migrations:
npm run migrate

### Start backend:
npm run dev

Backend runs at: **http://localhost:4000**

---

# 💻 Frontend Setup

cd frontend  
cp .env.example .env  
npm install  
npm run dev

Frontend runs at: **http://localhost:5173**

---

# 🔐 Default Admin Login

Email: jm.jaymehta2222@gmail.com  
Password: Jay@1101

---

# 🏁 Conclusion

The Store Rating Platform demonstrates:

- Clean UI/UX  
- Solid backend architecture  
- Role-based permissions  
- Database design  
- Supabase integration  
- Real-world form validations  
- A complete full-stack solution  

If you like this project, ⭐ star the repo!  
Feedback and contributions are welcome 😊
