# **📌 Postman & cURL API Documentation**  

This document provides **Postman** and **cURL** commands for testing all API endpoints, including **User & Authentication APIs**.  

---

## **📂 Table of Contents**  
1. [Authentication API](#authentication-api)  
2. [User Management API](#user-management-api)  
3. [Categories API](#categories-api)  
4. [Subcategories API](#subcategories-api)  
5. [Product Items API](#product-items-api)  
6. [Warehouses API](#warehouses-api)  

---

# **🔐 Authentication API**  
📌 **Base Route:** `/api/auth`  

| HTTP Method | Endpoint            | Description                                    |
|------------|---------------------|-----------------------------------------------|
| **POST**   | `/register`         | Register a new user                           |
| **POST**   | `/login`            | Login user & get access token                 |
| **POST**   | `/logout`           | Logout user (client removes token)            |
| **POST**   | `/forgot-password`  | Request password reset token                  |
| **POST**   | `/reset-password`   | Reset password using reset token              |

### **🔹 Register a New User**
```sh
curl -X POST "http://localhost:3000/api/auth/register" \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "user123",
  "role": "customer"
}'
```

### **🔹 Login User**
```sh
curl -X POST "http://localhost:3000/api/auth/login" \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "securepassword"
}'
```
**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1..."
}
```

### **🔹 Logout User**
```sh
curl -X POST "http://localhost:3000/api/auth/logout"
```

### **🔹 Forgot Password**
```sh
curl -X POST "http://localhost:3000/api/auth/forgot-password" \
-H "Content-Type: application/json" \
-d '{"email": "user@example.com"}'
```

### **🔹 Reset Password**
```sh
curl -X POST "http://localhost:3000/api/auth/reset-password" \
-H "Content-Type: application/json" \
-d '{
  "resetToken": "abc123",
  "newPassword": "newsecurepassword"
}'
```

---

# **📂 User Management API**  
📌 **Base Route:** `/api/users`  
**(Requires Authentication)**  

| HTTP Method | Endpoint   | Description             |
|------------|-----------|-------------------------|
| **GET**    | `/`       | Get all users           |
| **POST**   | `/`       | Create a new user       |
| **GET**    | `/:id`    | Get user by ID          |
| **PUT**    | `/:id`    | Update user by ID       |
| **DELETE** | `/:id`    | Delete user by ID       |

### **🔹 Get All Users**
```sh
curl -X GET "http://localhost:3000/api/users" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### **🔹 Get User by ID**
```sh
curl -X GET "http://localhost:3000/api/users/1" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### **🔹 Update User**
```sh
curl -X PUT "http://localhost:3000/api/users/1" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-H "Content-Type: application/json" \
-d '{"first_name": "John", "last_name": "Doe"}'
```

### **🔹 Delete User**
```sh
curl -X DELETE "http://localhost:3000/api/users/1" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

# **📂 Categories API**  
📌 **Base Route:** `/api/categories`  

| HTTP Method | Endpoint            | Description                                      |
|------------|---------------------|--------------------------------------------------|
| **GET**    | `/`                 | Get all categories (paginated)                   |
| **POST**   | `/`                 | Create a new category                            |
| **GET**    | `/:id`              | Get category by ID                               |
| **PUT**    | `/:id`              | Update a category                               |
| **DELETE** | `/:id`              | Delete a category                               |
| **GET**    | `/:id/subcategories` | Get all subcategories of a category             |
| **GET**    | `/showall`          | Get all categories with subcategories & products |

### **🔹 Get All Categories**
```sh
curl -X GET "http://localhost:3000/api/categories" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### **🔹 Get All Categories (With Subcategories & Products)**
```sh
curl -X GET "http://localhost:3000/api/categories/showall" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

# **📂 Subcategories API**  
📌 **Base Route:** `/api/subcategories`  

| HTTP Method | Endpoint   | Description             |
|------------|-----------|-------------------------|
| **GET**    | `/`       | Get all subcategories   |
| **POST**   | `/`       | Create a new subcategory |
| **GET**    | `/:id`    | Get subcategory by ID   |
| **PUT**    | `/:id`    | Update subcategory      |
| **DELETE** | `/:id`    | Delete subcategory      |

---

# **📂 Product Items API**  
📌 **Base Route:** `/api/product/items`  

| HTTP Method | Endpoint | Description |
|------------|---------|-------------|
| **GET**    | `/` | Get all product items |
| **POST**   | `/` | Create a new product |
| **GET**    | `/:id` | Get product item by ID |
| **PUT**    | `/:id` | Update a product item |
| **DELETE** | `/:id` | Delete a product item |

### **🔹 Get All Product Items**
```sh
curl -X GET "http://localhost:3000/api/product/items?page=1&limit=10" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

# **📂 Warehouses API**  
📌 **Base Route:** `/api/warehouses`  

| HTTP Method | Endpoint   | Description             |
|------------|-----------|-------------------------|
| **GET**    | `/`       | Get all warehouses      |
| **POST**   | `/`       | Create a new warehouse  |
| **GET**    | `/:id`    | Get warehouse by ID     |
| **PUT**    | `/:id`    | Update warehouse        |
| **DELETE** | `/:id`    | Delete warehouse        |

### **🔹 Get All Warehouses**
```sh
curl -X GET "http://localhost:3000/api/warehouses" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## **✅ Summary**  
✔ **Postman & cURL commands for all APIs**  
✔ **Supports authentication (`Bearer Token`)**  
✔ **Covers user, auth, categories, subcategories, products & warehouses**  