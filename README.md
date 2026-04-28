# Book‑E‑Pedia 📚✨

[![Live Website](https://img.shields.io/badge/Live-Website-blue?style=for-the-badge&logo=vercel)](https://book-e-pedia.vercel.app/)

**Book‑E‑Pedia** is a premium full‑stack digital ecosystem that unifies physical books, audiobooks, video books, and e‑books under a single, glassmorphic UI. Built with React 19, Django 4, and a sleek vanilla‑CSS design, it offers a luxurious reading experience for both customers and staff.

---

## 🚀 Live Demo
Explore the live application here: **[book‑e‑pedia.vercel.app](https://book-e-pedia.vercel.app/)**

---

## 🎯 Project Vision
In a world of fragmented media platforms, **Book‑E‑Pedia** eliminates silos by providing a single portal where users can choose *how* they consume a book—physically, as audio, video, or e‑text. It also equips staff with powerful tools to manage inventory, monitor sales, and streamline order fulfillment.

---

## 🏛️ Core Modules
### 🛍️ Customer (Shop) Module
- **Immersive Catalog** – Dynamic filtering by category, format, and search.
- **Integrated Media Suite** – Custom audio/video players and a secure e‑book reader.
- **Smart Cart** – Persistent cart, recommendations, and PDF invoicing.
- **Account Hub** – Profile management, order history, and help‑center.

### 🧑‍💼 Employee (Operations) Module
- **Analytics Dashboard** – Real‑time sales and fulfillment metrics.
- **Inventory Control** – Add and edit titles across all media types.
- **Order Processing** – Track orders from pending to completed.

### 👑 Admin (Executive) Module
- **Workforce Management** – Hire and manage platform employees.
- **Risk Mitigation** – Automated low‑stock alerts with visual cues.
- **Platform Analytics** – Trend reports for data‑driven decisions.
- **Global Settings** – Manage categories, book types, and system configuration.

---

## 🛠️ Tech Stack
| Layer      | Technologies |
|------------|--------------|
| **Frontend** | React 19, React Router v7, Context API |
| **Styling**  | Vanilla CSS (Glassmorphism), Bootstrap 5, FontAwesome 6 |
| **Backend**  | Django 4, Django REST Framework |
| **Database** | PostgreSQL (prod), SQLite (dev) |
| **Storage**  | Cloudinary (media hosting) |

---

## 📂 Project Structure
```
Book‑E‑Pedia/
├─ frontend/
│   └─ src/
│       ├─ components/
│       │   ├─ HomeScreen/
│       │   ├─ ProductScreen/
│       │   ├─ CategoryScreen/
│       │   ├─ AdminPanel/
│       │   └─ …
│       ├─ App.js
│       └─ Context.js
└─ backend/
    └─ bookepedia_backend/
        ├─ api/
        │   ├─ models.py
        │   ├─ views.py
        │   ├─ urls.py
        │   └─ migrations/
        └─ bookepedia_backend/
            ├─ settings.py
            └─ urls.py
```

---

## 📡 API Overview
All endpoints are prefixed with `/api/`.

**Core Endpoints**
- `GET /api/category/` – Manage book categories.
- `GET /api/products/` – Retrieve and manage inventory.
- `GET /api/book-types/` – Media format management.
- `GET /api/employees/` – Staff CRUD operations.
- `GET /api/cart/<id>/` – User‑specific cart data.
- `GET /api/admin/low-stock/` – Low‑stock monitoring.
- `GET /api/admin/trending-books/` – Sales analytics.

---

## ⚙️ Local Setup
### Prerequisites
- **Node.js** ≥ 20
- **Python** ≥ 3.10
- **Git**

### Backend
```bash
cd backend/bookepedia_backend
python -m venv venv
# Activate virtualenv
# Windows
venv\\Scripts\\activate
# macOS / Linux
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
The API will be available at `http://127.0.0.1:8000/api/`.

### Frontend
```bash
cd frontend
npm install
npm run dev   # Starts Vite dev server on http://localhost:5173
```
The frontend will proxy API calls to the Django backend.

---

## 📸 Screenshots
![Home Screen Mockup](file:///C:/Users/kbs38/.gemini/antigravity/brain/5e2dfc54-4d9f-4930-85da-41a4975068af/home_screen_mockup_1777358651593.png)

---

## 🤝 Contributing
Contributions are welcome! Fork the repo, create a feature branch, and submit a pull request. Follow the existing code style and run the test suite before pushing.

---

## 📄 License
Educational use only. All rights reserved.
