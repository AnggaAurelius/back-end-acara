# User Authentication API

This project is a backend API for a user authentication system. It provides endpoints for user registration, login, and profile management. The API is built with Node.js, Express, and TypeScript, and it uses MongoDB for the database.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (or yarn) installed on your machine.

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/your_username/your_project_name.git
   ```
2. Install NPM packages:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add the necessary environment variables. You can use the `.env.example` file as a template.

### Running the Application

To run the application in development mode, use the following command:

```sh
npm run dev
```

This will start the server on `http://localhost:3000`.

## API Documentation

This project uses Swagger for API documentation. You can generate the documentation by running the following command:

```sh
npm run docs
```

This will generate a `swagger_output.json` file in the `src/docs` directory. The documentation will be available at `http://localhost:3000/docs`.

## Available Endpoints

The following are the available API endpoints:

-   `POST /api/auth/register`: Register a new user.
-   `POST /api/auth/login`: Log in an existing user.
-   `GET /api/auth/me`: Get the profile of the currently logged-in user (requires authentication).
-   `POST /api/auth/activation`: Activate a user account.

---
_Note: Replace `https://github.com/your_username/your_project_name.git` with the actual repository URL._
