# StudioSpace – Backend API

**Backend API:** https://my-studio-backend-xi.vercel.app

**Client Website:**https://my-studio-platform-client-k9aj.vercel.app

StudioSpace is a studio booking platform backend built with Node.js, Express.js, and MongoDB. It provides RESTful APIs to manage studio listings and supports authenticated operations for creating, retrieving, updating, and deleting studio information.

## ✨ Key Features

- **RESTful API:** Provides structured API endpoints for managing studio data.
- **Studio Management:** Create, retrieve, update, and delete studio listings.
- **MongoDB Integration:** Stores studio information in a MongoDB database.
- **Authentication & Authorization:** Uses JWT verification to protect authorized API operations.
- **CORS Support:** Allows communication between the frontend client and backend server.
- **Environment Configuration:** Uses environment variables to manage sensitive configuration.
- **Error Handling:** Handles invalid requests and missing studio records with appropriate responses.

## 🛠️ Technology Stack

- Node.js
- Express.js
- MongoDB
- MongoDB Node.js Driver
- JavaScript
- JWT / JOSE
- dotenv
- CORS
- Vercel (Deployment)

## 🚀 Local Setup Instructions

Follow these steps to run the backend project locally.

### 1. Clone the Repository

```bash
git clone YOUR_BACKEND_REPOSITORY_URL
```

### 2. Navigate to the Backend Folder

```bash
cd my-studio-platform-server
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000
MONGO_DB_URL=YOUR_MONGODB_CONNECTION_STRING
```

Add any additional authentication environment variables required by your JWT verification configuration.

### 5. Start the Development Server

```bash
npm run dev
```

If your project does not have a `dev` script, start it using:

```bash
node index.js
```

### 6. Verify the Server

Open your browser or API testing tool and visit:

```text
http://localhost:5000
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check server status |
| POST | `/studiodata` | Create a new studio |
| GET | `/studiodata` | Retrieve studio listings |
| GET | `/studiodata/:id` | Retrieve a single studio |
| PATCH | `/studiodata/:id` | Update studio information |
| DELETE | `/studiodata/:id` | Delete a studio |

**Note:** Protected endpoints may require a valid JWT token in the Authorization header.

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔐 Examiner Test Credentials

The backend API uses token-based authentication for protected operations.

**Test Account**

- Email: `YOUR_EXAMINER_TEST_EMAIL`
- Password: `YOUR_EXAMINER_TEST_PASSWORD`

Use the frontend application to sign in and obtain a valid authentication token before testing protected API endpoints.

> Replace the placeholders with valid examiner test account credentials before submission.

## 📁 Project Structure

```text
my-studio-platform-server/
├── index.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 📌 Important Notes

- Ensure MongoDB is accessible and the connection string is correctly configured.
- Keep your `.env` file private and never upload database credentials or secret keys to GitHub.
- Make sure the backend server is running before testing frontend API functionality.
- Configure the deployed backend URL in the frontend environment variables.
- Use a valid JWT token when accessing protected endpoints.

---

**Developed with ❤️ for StudioSpace.**
