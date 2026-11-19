# Unified Investigation Intelligence Platform

A Final Year Engineering Project

## Tech Stack

Frontend

- React
- Material UI
- Axios

Backend

- Spring Boot
- Spring Security
- PostgreSQL

Features

- Case Management
- Evidence Vault
- Chain of Custody
- Timeline Builder
- Relationship Graph
- Court Report Generator

UEIIP: Unified Evidence & Investigation Intelligence Platform

A secure web application for managing digital evidence in criminal investigations. Investigators upload evidence, register structured metadata, and verify integrity with SHA-256 hashing. Original filenames are never altered.

Stack: Spring Boot, Spring Security (JWT), Spring Data JPA, Flyway, PostgreSQL, React, Vite, Tailwind CSS

Prerequisites

Install these before you start:

Tool Version Check with
Java (JDK) 17 or newer (match pom.xml) java -version
Node.js 18 or newer node -v
PostgreSQL 14 or newer psql --version
Git any git --version

You do not need to install Maven. The project includes the Maven wrapper (mvnw).

1. Clone the repository
   bash
   git clone <repository-url>
   cd <repository-folder>

Project layout:

backend/ Spring Boot API (port 8080)
initfrontend/ React + Vite app (port 5173) 2. Database setup

The database schema is managed entirely by Flyway migrations. You only create an empty database. Never create tables by hand.

2a. Fresh setup (new teammates)
Make sure PostgreSQL is running.
Create an empty database:
bash
psql -U postgres -c "CREATE DATABASE investigation_db;"

Or run CREATE DATABASE investigation_db; in pgAdmin or DBeaver.

Continue to step 3.
2b. Already ran an earlier version of this project? Reset your database

If you ran this project locally before Flyway was added, your database has leftover tables and columns from old experiments (for example investigation_case, uploaded_by_user_id, created_at on evidence). The app will fail to start or fail on upload. Do not try to patch it. Drop and recreate it.

Stop the backend if it is running. Postgres will not drop a database that has open connections.
Run:
sql
DROP DATABASE investigation_db;
CREATE DATABASE investigation_db;

From the command line:

bash
psql -U postgres -c "DROP DATABASE investigation_db;"
psql -U postgres -c "CREATE DATABASE investigation_db;"
Delete your local backend/uploads/ folder. Your old evidence rows are gone, so the files in it are orphaned.
Pull the latest code (git pull) and continue to step 3.

Test data is lost by design. Register your users again after the reset.

3. Configure the backend

The backend reads its settings from backend/src/main/resources/application.properties. The values below are defaults for local development. Set environment variables only where your setup differs.

Variable Purpose Default
DB_USERNAME Postgres username postgres
DB_PASSWORD Postgres password (empty)
JWT_SECRET Key used to sign login tokens (32+ characters) dev placeholder in the properties file

Windows (PowerShell), current session only:

powershell
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "your_local_password"

macOS / Linux:

bash
export DB_USERNAME=postgres
export DB_PASSWORD=your_local_password

Never commit real passwords or secrets to the repository.

Other settings already in application.properties:

spring.jpa.hibernate.ddl-auto=validate: Hibernate never changes the schema. If an entity does not match the database, the app refuses to start.
spring.flyway.enabled=true: migrations run automatically at startup.
file.upload-dir=uploads: evidence files are stored here, relative to where you run the backend.
Max upload size is 200MB. 4. Run the backend
bash
cd backend

macOS / Linux:

bash
./mvnw spring-boot:run

Windows:

powershell
.\mvnw.cmd spring-boot:run

On first startup you should see Flyway log lines similar to:

Creating Schema History table "public"."flyway_schema_history"
Migrating schema "public" to version "1 - baseline"
Successfully applied 1 migration

The API is now at http://localhost:8080. The uploads/ folder is created automatically.

5. Run the frontend

In a second terminal:

bash
cd initfrontend
npm install
npm run dev

Open http://localhost:5173.

If the frontend needs an API URL, check for a .env file in initfrontend/ and make sure it points to the backend:

VITE_API_BASE_URL=http://localhost:8080

Keep the frontend on port 5173. The backend's CORS configuration only allows requests from http://localhost:5173. If Vite picks a different port because 5173 is taken, API calls will be blocked by the browser.

6. Create your first user

The database starts with no users. Open the frontend's register page and create an account, or call the API directly:

bash
curl -X POST http://localhost:8080/auth/register \
 -H "Content-Type: application/json" \
 -d '{"fullName":"Your Name","email":"you@example.com","password":"yourpassword","role":"ADMIN"}'

Valid roles: ADMIN, INVESTIGATOR, FORENSIC_ANALYST, PROSECUTOR.

Then log in. A typical flow is: log in as an Investigator, upload a file, complete the registration form, and find it in the Evidence Vault.

Working with the database (Flyway rules)

Read this before you change anything that touches the database.

All schema changes go in a new migration file in backend/src/main/resources/db/migration/. Never rely on Hibernate to create or alter tables.
Never edit a migration that has already been merged. Flyway stores a checksum of every applied file. Editing one breaks everyone's database with a "checksum mismatch" error. To change something, add a new migration.
Naming: V<number>**<description>.sql with two underscores, for example V2**create_investigation_case.sql.
Avoid version collisions. Check which numbers already exist before picking one. If two branches both add V2\_\_..., whoever merges second must renumber.
After you change an entity, write the matching migration in the same commit. Otherwise ddl-auto=validate will stop everyone else's app at startup.
Do not set ddl-auto=update locally. It silently reintroduces schema drift.
Troubleshooting
Problem Cause and fix
Schema-validation: missing column or missing table An entity changed without a migration, or you have not pulled the latest migrations. Run git pull and restart.
Migration checksum mismatch A migration file was edited after being applied. Revert the edit and add a new migration. If it only happened locally, reset your database (step 2b).
null value in column ... violates not-null constraint on upload Your database is a stale pre-Flyway one. Reset it (step 2b).
password authentication failed for user DB_USERNAME or DB_PASSWORD does not match your local Postgres.
database "investigation_db" does not exist You skipped step 2. Create the empty database.
database is being accessed by other users when dropping The backend is still running. Stop it, then drop the database.
Login works but every request returns 401 Your token is stale or invalid. Log out and log in again, or clear the browser's local storage.
Browser shows a CORS error The frontend is not running on port 5173. Stop whatever else uses that port and restart npm run dev.
Port 8080 already in use Stop the other process using 8080, or change server.port in application.properties.
Evidence rows exist but files are missing The database and the uploads/ folder are both local to your machine and are not shared. Evidence uploaded on one machine does not appear on another.
Evidence rules to know
Uploaded files are stored under a random UUID name. The original filename is kept only as metadata and is never used to identify the file.
Every upload gets a SHA-256 hash at upload time.
Allowed file types: images, video, audio, PDF, ZIP, and GPS data files (.gpx, .kml, .kmz).
An Investigator can delete only their own evidence, and only before it is registered. Admins can delete any evidence.
