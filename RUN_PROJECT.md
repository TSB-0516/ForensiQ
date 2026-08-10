# Run the UEIIP Project

This repository contains a Spring Boot backend and a Vite + React frontend.

## 1. Prerequisites

- Java 21
- Maven (or use the Maven wrapper in the backend project)
- Node.js 18+ and npm
- PostgreSQL running locally on port 5432
- A database named `investigation_db`

## 2. Backend

From the repository root:

```bash
cd backend
./mvnw spring-boot:run
```

On Windows PowerShell, if `mvnw` is not executable, you can use:

```powershell
cd backend
mvnw.cmd spring-boot:run
```

The backend listens on:

http://localhost:8080

## 3. Frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs at the Vite default address, usually:

http://localhost:5173

## 4. Database

The backend configuration in `backend/src/main/resources/application.properties` points to:

- Host: `localhost`
- Port: `5432`
- Database: `investigation_db`
- Username: `postgres`
- Password: `Thamini@2006`

Make sure PostgreSQL is up and the database exists before starting the backend.

## 5. Useful Commands

Build the backend:

```bash
cd backend
./mvnw clean test
```

Build the frontend:

```bash
cd frontend
npm run build
```
