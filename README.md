# CultureX Media Uploader - Backend

CultureX Media Uploader Backend is a **Node.js (Express.js)** API designed to handle media uploads, authentication, and data retrieval. It integrates with AWS S3 for secure storage and MongoDB for database management.

API Base URL - https://culturex-api.onrender.com/web-api/v1

---

## 📌 Features
- **User Authentication** using JWT
- **Secure Media Uploads** to AWS S3
- **Fetch and List Media** (Images & Videos)
- **Optimized API Endpoints** for scalability and performance

---

## 🛠 Tech Stack
- **Node.js** (Express.js)
- **MongoDB** (Mongoose ODM)
- **AWS S3** (Storage)
- **JWT Authentication**
- **Multer** (File Upload Handling)

---

## 🚀 Setup & Installation

### 1️⃣ Clone Repository
```sh
git clone https://github.com/smitmendapara/culturex-api.git
cd culturex-api
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory from `example.env` and add the respective values.

### 4️⃣ Run the Server
```sh
npm run prod
```

---

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/authentication/google-login` | Authenticate user and return JWT |
| `GET` | `/authentication/verify-token` | Verify user session |
| `GET` | `/media/all-media` | Get all uploaded media |
| `POST` | `/media/upload-media` | Upload a new media file |

---
