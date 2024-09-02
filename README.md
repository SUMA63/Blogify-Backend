# Blogify Backend REST API

### Description
This is a backend REST API for a blog application built using **Node.js**, **Express.js**, and **MongoDB**. The API provides user authentication, blog management, and connects users with their blogs.

### Features
- **User Signup/Login**: Secure user authentication with JWT tokens.
- **Blog Management**: Users can create, update, and delete blogs.
- **User-Blog Association**: Blogs are linked to their respective users, ensuring that users can only manage their own blogs.

### Technologies
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose** (ODM for MongoDB)
- **JWT** (for secure authentication)

### API Endpoints
- **User Routes** (`/api/user`)
  - `POST /signup`: Register a new user
  - `POST /login`: Authenticate a user
- **Blog Routes** (`/api/blog`)
  - `POST /`: Create a new blog
  - `DELETE /:id`: Delete a blog
  - `PUT /:id`: Update a blog
  - `GET /`: Fetch all blogs for the authenticated user

### Getting Started
1. Clone the repository:
    ```bash
    git clone https://github.com/SUMA63/Blogify-Backend.git
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```

