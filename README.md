# Book-E-Pedia 📚

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

This project is for educational purposes only.
