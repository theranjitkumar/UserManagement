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

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/me` - Get current user profile
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/me` - Update current user profile
- `DELETE /api/users/me` - Delete current user account

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
