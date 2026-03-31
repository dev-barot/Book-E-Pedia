<!-- # Book-E-Pedia 📚

A full-stack online bookstore built as a Software Engineering project. You can browse books, add them to cart, place orders, and manage everything through separate panels for customers, employees, and admins.

---

## What is this?

Book-E-Pedia is basically an e-commerce platform but specifically for books. We built this as part of our SE course. The idea was to cover the full software development lifecycle — from planning to a working product.

It has three types of users:
- **Customer** — browse, search, buy books
- **Employee** — manage products, orders, categories
- **Admin** — full control over everything (employees, customers, reports, feedback)

---

## Features

**For Customers**
- Browse books by category or search by name
- View detailed product pages with book info, formats available, and description
- Add books to cart, update quantities, remove items
- "You Might Also Like" recommendations in the cart
- Multiple book formats — Physical Book, Audio Book, Video Book, E-Book
- Checkout with order summary
- View past orders and download invoice as PDF
- Customer profile management
- Forgot password with OTP flow
- Help & Support page

**For Employees**
- Dashboard overview
- Manage book types and products
- View and manage orders

**For Admins**
- Full employee management (add, view)
- Full product and category management
- View all customers
- Manage feedback
- Generate reports

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router v7 |
| UI Library | Bootstrap 5, React Bootstrap, Reactstrap |
| PDF Generation | jsPDF, jsPDF-AutoTable |
| Styling | Vanilla CSS (custom design system) |
| Backend | Django (Python) |
| Version Control | Git + GitHub |

---

## Project Structure

```
Book-E-Pedia/
├── frontend/               # React app
│   └── src/
│       ├── components/
│       │   ├── HomeScreen/
│       │   ├── ProductScreen/      # Books, detail, audio, video, e-book
│       │   ├── CategoryScreen/     # Categories + filtered views
│       │   ├── CustomerPanel/      # Cart, orders, profile, dashboard
│       │   ├── EmployeePanel/      # Employee dashboard and tools
│       │   ├── AdminPanel/         # Admin dashboard and tools
│       │   ├── PaymentScreen/
│       │   ├── LoginScreen/
│       │   └── ...
│       ├── App.js          # All routes defined here
│       └── Context.js      # Cart + User context (global state)
│
└── backend/                # Django backend
    └── bookepedia_backend/
```

---

## Setup Guide

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v18 or above)
- [Python](https://www.python.org/) (v3.10 or above)
- Git

---

### Frontend Setup

```bash
# 1. Clone the repo
git clone https://github.com/dev-barot/Book-E-Pedia.git
cd Book-E-Pedia/frontend

# 2. Install dependencies
npm install

# 3. Run the dev server
npm start
```

App will open at `http://localhost:3000`

---

### Backend Setup

```bash
# Go to backend folder
cd Book-E-Pedia/backend/bookepedia_backend

# Create a virtual environment (recommended)
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install requirements
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
```

Backend runs at `http://localhost:8000`

---

## How to Use

1. Open `http://localhost:3000` in your browser
2. Register as a customer or log in
3. Browse books from the Shop or Category pages
4. Add books to your cart and proceed to checkout
5. Check your orders from the Customer Dashboard

For admin access, log in with admin credentials and go to `/admin/dashboard`.

For employee access, go to `/employee/dashboard`.

---

## Pages / Routes

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/products` | All books |
| `/categories` | Browse by category |
| `/cart` | Shopping cart |
| `/payment` | Checkout |
| `/audio-book` | Audio books |
| `/video-book` | Video books |
| `/e-book` | E-Books |
| `/register` | Customer registration |
| `/customer/dashboard` | Customer panel |
| `/employee/dashboard` | Employee panel |
| `/admin/dashboard` | Admin panel |

---

## Team

This is a group Software Engineering project. Built with a lot of debugging, chai breaks, and last-minute commits. 😅

---

## License

This project is for educational purposes only. -->

# Book-E-Pedia 📚

A full-stack online bookstore built using React and Django. This project focuses on implementing a complete CRUD-based system with role-based management and a dynamic frontend powered by backend APIs.

---

## What is this?

Book-E-Pedia is an e-commerce-style web application for managing and browsing books. The system is built to demonstrate real-world software engineering concepts including:

* Backend API design (Django)
* Frontend integration (React)
* Database modeling and relationships
* Role-based data management
* CRUD operations with soft delete logic

---

## Current System Status 🚀

The project has a **working core system** with dynamic data flow between frontend and backend.

### ✅ Implemented Modules

* Category Management
* Book Type Management
* Employee Management
* Product Management
* Dynamic Product Listing (Customer Side)
* Product Detail Page
* Cart Functionality (LocalStorage-based)

---

## Features

### 🛍️ Customer Side

* View categories dynamically from backend
* Browse products (books) fetched via API
* View detailed product page
* Add to cart (stored in local storage)
* Clean UI with modern card-based layout

---

### 🧑‍💼 Admin Panel

* Manage Categories (Add / Edit / Soft Delete)
* Manage Book Types (formats like Physical, Audio, etc.)
* Manage Employees
* Manage Products with:

  * Category relation
  * Book Type relation
  * Employee relation
  * Image upload (cover + back)
* Soft Delete system (`IsActive` flag)

---

### ⚙️ Backend (Django APIs)

* REST-style endpoints for:

  * `/api/category/`
  * `/api/book-types/`
  * `/api/employees/`
  * `/api/products/`
* Image upload handling (MEDIA folder)
* Relational database structure
* Clean separation via `api/urls.py`

---

## Important Notes ⚠️

* Media files (images) are **not committed** to GitHub
* Some image paths may return 404 if not re-uploaded locally
* Some legacy endpoints (dashboard, orders, feedback) are **not implemented yet**
* Soft delete is used instead of hard delete

---

## Tech Stack

| Layer           | Technology       |
| --------------- | ---------------- |
| Frontend        | React            |
| Routing         | React Router     |
| Styling         | Custom CSS       |
| Backend         | Django           |
| Database        | SQLite (default) |
| Version Control | Git + GitHub     |

---

## Project Structure

```
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

## Setup Guide

### Prerequisites

* Node.js (v18+)
* Python (v3.10+)
* Git

---

### Frontend Setup

```bash
git clone https://github.com/dev-barot/Book-E-Pedia.git
cd Book-E-Pedia/frontend

npm install
npm start
```

Frontend runs at:
`http://localhost:3000`

---

### Backend Setup

```bash
cd Book-E-Pedia/backend/bookepedia_backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

Backend runs at:
`http://localhost:8000`

---

## API Structure

All APIs are routed through:

```
/api/
```

Example:

* `/api/category/`
* `/api/products/`
* `/api/book-types/`
* `/api/employees/`

---

## Future Improvements

* Order management system
* Payment integration
* Authentication & authorization system
* Dashboard analytics
* Image fallback handling
* Pagination & filtering

---

## Team

Built as part of a Software Engineering project.
A mix of debugging, refactoring, and surviving Git conflicts.

---

## License

Educational use only.
