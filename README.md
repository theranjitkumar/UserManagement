# User Management System

A Node.js-based RESTful API for user management with authentication and authorization features. This application provides endpoints for user registration, login, profile management, and more.

## Features

- User registration with email and password
- User authentication using JWT (JSON Web Tokens)
- Password hashing using bcrypt
- Input validation and error handling
- Logging system
- Environment variable configuration
- Database integration with Sequelize ORM

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MySQL/PostgreSQL/SQLite (or any database supported by Sequelize)
- Git (for version control)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UserManagement
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update the database connection details and other environment variables in `.env`
   ```bash
   cp .env.example .env
   ```

4. **Database setup**
   - Create a new database in your preferred database server
   - Update the database configuration in `config/database.js` if needed
   - Run migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Start the development server**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000` by default.

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

#### Register a New User
```
POST /auth/register
```
**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "kanjitkumar@yopmail.com",
  "password": "Welcome@123",
  "role": "user"
}
```
**Required Fields:** firstName, lastName, email, password
**Optional Fields:** role (default: 'user')

#### User Login
```
POST /auth/login
```
**Request Body:**
```json
{
  "email": "kanjitkumar@yopmail.com",
  "password": "Welcome@123"
}
```
**Required Fields:** email, password

#### Forgot Password
```
POST /auth/forgot-password
```
**Request Body:**
```json
{
  "email": "kanjitkumar@yopmail.com"
}
```
**Required Fields:** email

#### Reset Password
```
PATCH /auth/reset-password/:token
```
**Request Body:**
```json
{
  "password": "Welcome@123",
  "passwordConfirm": "Welcome@123"
}
```
**Required Fields:** password, passwordConfirm

#### Get Current User Profile
```
GET /auth/me
```
**Headers:**
```
Authorization: Bearer <token>
```

#### Update Current User
```
PATCH /auth/update-me
```
**Headers:**
```
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "firstName": "Ranjit",
  "lastName": "Kumar",
  "email": "kanjitkumar@yopmail.com"
}
```
**Optional Fields:** firstName, lastName, email

#### Update Password
```
PATCH /auth/update-password
```
**Headers:**
```
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "currentPassword": "Welcome@123",
  "newPassword": "Welcome@123",
  "passwordConfirm": "Welcome@123"
}
```
**Required Fields:** currentPassword, newPassword, passwordConfirm

### Admin User Management
*All endpoints below require admin privileges*

#### Get All Users
```
GET /users
```
**Headers:**
```
Authorization: Bearer <admin_token>
```

#### Create User (Admin)
```
POST /users
```
**Headers:**
```
Authorization: Bearer <admin_token>
```
**Request Body:**
```json
{
  "firstName": "Ranjit",
  "lastName": "Kumar",
  "email": "kanjitkumar@yopmail.com",
  "password": "Welcome@123",
  "role": "user"
}
```
**Required Fields:** firstName, lastName, email, password
**Optional Fields:** role (default: 'user')

#### Get User by ID
```
GET /users/:id
```
**Headers:**
```
Authorization: Bearer <admin_token>
```
**URL Parameters:**
- `id`: User's UUID

#### Update User
```
PATCH /users/:id
```
**Headers:**
```
Authorization: Bearer <admin_token>
```
**URL Parameters:**
- `id`: User's UUID

**Request Body:**
```json
{
  "firstName": "Ranjit",
  "lastName": "Kumar",
  "email": "kanjitkumar@yopmail.com",
  "role": "admin",
  "isActive": true
}
```
**Optional Fields:** firstName, lastName, email, role, isActive

#### Delete User
```
DELETE /users/:id
```
**Headers:**
```
Authorization: Bearer <admin_token>
```
**URL Parameters:**
- `id`: User's UUID

#### Deactivate User
```
PATCH /users/:id/deactivate
```
**Headers:**
```
Authorization: Bearer <admin_token>
```
**URL Parameters:**
- `id`: User's UUID

#### Reactivate User
```
PATCH /users/:id/reactivate
```
**Headers:**
```
Authorization: Bearer <admin_token>
```
**URL Parameters:**
- `id`: User's UUID

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=user_management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

## Project Structure

```
UserManagement/
├── bin/                  # Application startup
├── config/              # Configuration files
├── controllers/         # Route controllers
├── middleware/          # Custom middleware
├── models/              # Database models
├── public/              # Static files
├── routes/              # Route definitions
├── utils/               # Utility classes and functions
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── app.js               # Express application
└── package.json         # Project metadata and dependencies
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Production

### Building for Production
```bash
npm run build
```

### Running in Production
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact the development team or open an issue in the repository.
