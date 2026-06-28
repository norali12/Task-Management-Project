# Project & Task Management API

A RESTful API for a Project and Task Management System built with Node.js, Express.js, TypeScript, and Mongoose (MongoDB).

---

## Technical Stack

* **Runtime**: Node.js (v18+)
* **Framework**: Express.js
* **Language**: TypeScript
* **Database**: MongoDB (via Mongoose)
* **Authentication**: JWT (JSON Web Tokens)
* **Validation**: Zod

---

## Setup & Installation

### 1. Prerequisites
Ensure you have Node.js and MongoDB installed and running on your system.

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root of the backend folder:
```bash
cp .env.example .env
```
Open `.env` and configure the following parameters:
* `PORT`: Port the server runs on (e.g. `5000`)
* `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/task_manager`)
* `JWT_ACCESS_SECRET`: Secret key used for signing JWT access tokens (e.g., `your_access_secret_key`)
* `JWT_REFRESH_SECRET`: Secret key used for signing JWT refresh tokens (e.g., `your_refresh_secret_key`)
* `EMAIL_USER`: Gmail/SMTP address to send verification OTPs
* `EMAIL_PASS`: Gmail/SMTP app password

### 3. Install Dependencies
```bash
npm install
```

### 4. Seed the Database
To populate the database with default sample data (Users, Projects, Tasks) for testing:
```bash
npm run seed
```
This script will clear all existing data and generate:
* **Admin User**: `admin@example.com` (password: `password123`)
* **Member User**: `member@example.com` (password: `password123`)
* Sample Projects & Tasks associated with these users.

### 5. Run the Server
* **Development Mode** (with hot reloading):
  ```bash
  npm run dev
  ```
* **Production Mode**:
  ```bash
  npm run build
  npm run start
  ```

---

## API Endpoints

All endpoints except **Auth Sign Up, Login, and Email Verification** require a valid Bearer token in the `Authorization` header: `Authorization: Bearer <your_jwt_access_token>`.

### 1. Authentication
* **POST** `/api/auth/signup` - Registers a new user. Generates an OTP (saved to DB and logs/emails it).
* **POST** `/api/auth/verify-email` - Verifies user's email with OTP.
* **POST** `/api/auth/login` - Logs in user and returns a JWT access token.

### 2. Projects
* **POST** `/api/projects` - Creates a new project.
* **GET** `/api/projects` - Gets all projects for the authenticated user (supports pagination `page` and `limit`).
* **GET** `/api/projects/:projectId` - Gets a single project by ID.
* **PUT** `/api/projects/:projectId` - Updates project details.
* **DELETE** `/api/projects/:projectId` - Deletes a project.

### 3. Tasks
* **POST** `/api/projects/:projectId/tasks/create` - Creates a task under a project.
* **GET** `/api/projects/:projectId/tasks/get-all` - Gets all tasks for a specific project. Supports pagination (`page`, `limit`) and filtering (`status`, `Priority`).
* **GET** `/api/projects/:projectId/tasks/:taskId` - Gets a single task by ID.
* **PUT** `/api/projects/:projectId/tasks/:taskId` - Updates task status/priority/details.
* **DELETE** `/api/projects/:projectId/tasks/:taskId` - Deletes a task.

---

## How to Import & Use Postman Collection

To test the APIs using the provided Postman collection:

1. **Import the Collection into Postman**:
   * Open the Postman application.
   * Click the **Import** button in the top-left sidebar/workspace panel.
   * Select or drag-and-drop the [ElectroPi task.postman_collection.json] file i will sent with the task.
   * Click **Import** to load the collection.

2. **Configure Environment Variables**:
   * Setup a Postman Environment or configure the collection variables.
   * Add a `baseUrl` variable pointing to your running server (e.g., `http://localhost:5000/api`).
   * When calling the Login endpoint, copy the returned `accessToken` and set it as the `accessToken` variable in Postman. The remaining API requests in the collection are configured to use this variable automatically as a Bearer token in their authorization headers.

---

## Architectural & Technology Decisions

This project implements modern, industrial-grade backend development patterns. Below are the key choices made and the rationale behind them:

### 1. MongoDB & Mongoose (ODM)
* **Why MongoDB?** Although a relational database (SQL) would have been more suitable for this project due to the structured relationships (Users, Projects, and Tasks), MongoDB was chosen to ensure rapid development and meet the tight timeline of this assessment task. MongoDB's document-based and schema-less structure allowed for faster integration and database setup.

### 2. Input Validation with Zod
* Validation is decoupled from controllers using Zod schemas.
* A reusable `validate` middleware interceptor checks `req.body`, `req.params`, and `req.query` *before* the request reaches the controller. Invalid requests are instantly rejected with an informative `400 Bad Request` payload, preventing malformed inputs from reaching the database.

### 3. Stateless Authentication (JWT + Refresh Tokens)
* **Access Tokens**: Short-lived JWTs (typically 15m) are sent via HTTP headers for stateless authorization, ensuring fast, scale-ready request processing.
* **Refresh Tokens**: Long-lived refresh tokens (typically 7d) are stored securely in database properties and HTTP-only cookies, providing safe session regeneration without requiring frequent user re-login.

### 4. OTP Account Verification
* To ensure emails are valid, registration generates a temporary numeric OTP code, blocking access to `/login` until `/verify-email` is successfully triggered.

### 5. Database Seeding Script
* A dedicated seed script (`npm run seed`) is provided to clear existing data collections and populate the database with a pre-configured Admin, Member, projects, and tasks structure, speeding up testing and evaluator handoffs.

---
