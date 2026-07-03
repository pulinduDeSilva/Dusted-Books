# Dusted Books

Dusted Books is a full-stack web application built with the MERN stack that enables users to buy and sell used books through a modern, secure, and user-friendly platform. The application connects buyers and sellers, making it easier to give pre-owned books a second life while promoting affordable and sustainable reading.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Dusted Books provides a marketplace where users can list, browse, purchase, and manage used books. The platform includes secure authentication, role-based access, book management, and an administrative dashboard for managing the system.

The project follows a client-server architecture:

- **Frontend:** React
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

---

## Features

### Customer Features

- User registration and login
- Secure JWT authentication
- Browse available books
- Search and filter books
- View detailed book information
- Buy available books
- List books for sale
- Manage personal listings
- Update and delete listed books
- View purchase history
- User profile management

### Admin Features

- Secure admin authentication
- Dashboard overview
- Manage users
- Manage books
- Remove inappropriate listings
- Monitor platform activity

---

## Technology Stack

### Frontend

- React
- React Router
- Axios
- Tailwind CSS / CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt

### Development Tools

- Vite
- Git
- GitHub
- Postman
- VS Code


---

## Getting Started

### Prerequisites

Before running the project, make sure you have installed:

- Node.js (v18 or later recommended)
- npm
- MongoDB (Local or MongoDB Atlas)
- Git

---

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/dusted-books.git

cd dusted-books
```

### Install frontend dependencies

```bash
cd client
npm install
```

### Install backend dependencies

```bash
cd ../server
npm install
```

---

## Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRE=7d

CLIENT_URL=http://localhost:5173
```

For the frontend also requires environment variables, create a `.env` file inside the **client** directory.

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running the Application

### Start the backend

```bash
cd server
npm run dev
```

### Start the frontend

```bash
cd client
npm run dev
```

The application should now be running at:

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---


## Authentication

The application uses **JSON Web Tokens (JWT)** for authentication.

Protected routes require a valid Bearer Token.

Example:

```http
Authorization: Bearer <your_token>
```

Passwords are securely hashed before being stored in the database using bcrypt.
