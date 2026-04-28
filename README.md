# Book-E-Pedia 📚✨

[![Live Website](https://img.shields.io/badge/Live-Website-blue?style=for-the-badge&logo=vercel)](https://book-e-pedia.vercel.app/)

**Book-E-Pedia** is a premium, full-stack digital ecosystem designed to bridge the gap between traditional physical reading and modern digital media consumption. Built with a sophisticated **Glassmorphism** aesthetic, it serves as an all-in-one platform for book lovers, offering seamless access to Physical Books, Audio Books, Video Books, and E-Books.

---

## 🚀 Experience it Live
The application is deployed and ready for exploration:
👉 **[book-e-pedia.vercel.app](https://book-e-pedia.vercel.app/)**

---

## 🎯 What is Book-E-Pedia?
In an era where content is fragmented across multiple platforms, **Book-E-Pedia** serves to solve the problem of media silos. It provides a unified platform where users don't just buy a book; they choose their preferred way to experience it. 

### What it solves:
- **Media Fragmentation**: No need for separate apps for audiobooks, PDFs, and video courses.
- **Operational Complexity**: Provides a robust backend for staff to manage a diverse inventory of physical and digital assets.
- **User Engagement**: Combines luxury design with high-performance media players to keep readers immersed.

---

## 🏛️ System Modules & Entity Features

### 🛍️ Customer Module (The Shop)
- **Immersive Catalog**: Browse a high-end storefront with dynamic filtering (Category, Format, Search).
- **Integrated Media Suite**: Custom Audio/Video players and a secure E-Book reader.
- **Personalized Commerce**: Smart cart with persistence, recommendations, and PDF invoicing.
- **Account Hub**: Manage profile details, track orders, and access "Help & Support".

### 🧑‍💼 Employee Module (Operational Tools)
- **Analytics Dashboard**: Real-time insights into sales performance and fulfillment rates.
- **Inventory Control**: Manage inventory and add new book titles across all media types.
- **Order Fulfillment**: Track and process customer purchases from pending to completed.

### 👑 Admin Module (Executive Control)
- **Workforce Management**: Hire and manage platform employees.
- **Risk Mitigation**: Automated **Low-Stock Alerts** with visual indicators.
- **Platform Analytics**: Generate reports and track trending books for business decisions.
- **System Configuration**: Global control over categories, booktypes, and settings.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, React Router v7, Context API |
| **Styling** | Vanilla CSS (Glassmorphism), Bootstrap 5, FontAwesome 6 |
| **Backend** | Django (Python), Django REST Framework |
| **Database** | PostgreSQL (Production), SQLite (Local) |
| **Storage** | Cloudinary (Scalable Media Hosting) |

---

## 📂 Project Structure

```text
Book-E-Pedia/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── HomeScreen/
│       │   ├── ProductScreen/
│       │   ├── CategoryScreen/
│       │   ├── AdminPanel/
│       │   └── ...
│       ├── App.js
│       └── Context.js
│
└── backend/
    └── bookepedia_backend/
        ├── api/
        │   ├── models.py
        │   ├── views.py
        │   ├── urls.py
        │   └── migrations/
        └── bookepedia_backend/
            ├── settings.py
            └── urls.py
```

---

## 📡 API Structure

All APIs are routed through the `/api/` prefix.

### Core Endpoints:
- `/api/category/` — Manage book categories.
- `/api/products/` — Fetch and manage book inventory.
- `/api/book-types/` — Manage different media formats.
- `/api/employees/` — Admin tool for staff management.
- `/api/cart/<id>/` — Fetch user-specific shopping cart data.
- `/api/admin/low-stock/` — Inventory monitoring and alerts.
- `/api/admin/trending-books/` — Sales analytics for trending titles.

---

## ⚙️ Local Installation

### 1. Backend Setup
```bash
cd backend/bookepedia_backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 📄 License
This project is for **educational purposes only**. All rights reserved.
