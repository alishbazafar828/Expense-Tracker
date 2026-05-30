# Expense Tracker

A full-stack web application that allows users to register, log in, and manage their personal expenses. Built with React, Node.js, Express, and MongoDB.

---

## App Description

Expense Tracker is a personal finance management app where users can:
- Create a secure account and log in
- Add expenses with a title, amount, and category
- Edit existing expenses
- Delete expenses
- View a running total of all expenses

Each user only sees their own expenses. All data is stored in the cloud using MongoDB Atlas.

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React, Bootstrap 5, Axios         |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB Atlas (Mongoose)          |
| Auth      | JWT (JSON Web Tokens), bcryptjs   |

---

## Installation Instructions

### Prerequisites
- Node.js (v16 or higher) — https://nodejs.org
- npm (comes with Node.js)

### Step 1 — Clone or Extract the Project
```
cd Lab3_ExpenseTracker
```

### Step 2 — Start the Server
```
cd server
npm install
node server.js
```

You should see:
```
Server running on 5001
MongoDB Connected
```

### Step 3 — Start the Client
Open a second terminal:
```
cd client
npm install
./node_modules/.bin/react-scripts start
```

The app will open at: http://localhost:3000

---

## How to Use

1. Go to http://localhost:3000/register
2. Create an account with your name, email, and password
3. Log in with your credentials
4. Add expenses using the form at the top of the dashboard
5. Edit an expense by clicking the **Edit** button
6. Delete an expense by clicking the **Delete** button
7. Your total is shown at the top and updates automatically

---

## API Documentation

### Base URL
```
http://localhost:5001/api
```

### Auth Routes

| Method | Endpoint            | Description         | Auth Required |
|--------|---------------------|---------------------|---------------|
| POST   | /auth/register      | Register a new user | No            |
| POST   | /auth/login         | Login and get token | No            |

#### POST /auth/register
```json
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login
```json
Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Expense Routes
All expense routes require the Authorization header:
```
Authorization: Bearer <token>
```

| Method | Endpoint          | Description            | Auth Required |
|--------|-------------------|------------------------|---------------|
| GET    | /expenses         | Get all user expenses  | Yes           |
| POST   | /expenses         | Add a new expense      | Yes           |
| PUT    | /expenses/:id     | Update an expense      | Yes           |
| DELETE | /expenses/:id     | Delete an expense      | Yes           |

#### POST /expenses
```json
Request Body:
{
  "title": "Grocery Shopping",
  "amount": 45.50,
  "category": "Food"
}

Response:
{
  "_id": "64abc123...",
  "title": "Grocery Shopping",
  "amount": 45.50,
  "category": "Food",
  "userId": "64abc456...",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### PUT /expenses/:id
```json
Request Body:
{
  "title": "Weekly Groceries",
  "amount": 55.00,
  "category": "Food"
}
```

---

## Feature List

- User Registration and Login
- JWT-based Authentication (sessions persist on refresh)
- Add Expense (title, amount, category)
- Edit Expense (inline editing)
- Delete Expense
- Total Expense calculation
- User-specific data (users only see their own expenses)
- Responsive design (mobile friendly)
- RESTful API architecture
- Secure password hashing with bcryptjs
- Protected routes (redirect to login if not authenticated)

---

## Database Schema

### User
| Field     | Type   | Required |
|-----------|--------|----------|
| name      | String | Yes      |
| email     | String | Yes      |
| password  | String | Yes (hashed) |

### Expense
| Field     | Type     | Required |
|-----------|----------|----------|
| title     | String   | Yes      |
| amount    | Number   | Yes      |
| category  | String   | Yes      |
| userId    | ObjectId | Yes      |
| createdAt | Date     | Auto     |

---

## Project Structure

```
Lab3_ExpenseTracker/
├── client/                   # React frontend
│   ├── public/
│   └── src/
│       ├── api.js            # Axios instance
│       ├── App.js            # Routes
│       ├── pages/
│       │   ├── Login.js
│       │   ├── Register.js
│       │   └── Dashboard.js
│       └── components/
│           └── Navbar.js
│
└── server/                   # Node.js backend
    ├── server.js             # Entry point
    ├── .env                  # Environment variables
    ├── models/
    │   ├── User.js
    │   └── Expense.js
    ├── routes/
    │   ├── auth.js
    │   └── expenses.js
    └── middleware/
        └── auth.js           # JWT verification
```

---

## Environment Variables

Create a `.env` file in the `server/` folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

---

*Developed as part of Lab 3 — Full Stack Web Development*
