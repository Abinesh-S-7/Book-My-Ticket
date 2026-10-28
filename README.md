# 🎫 BookMyTicket — Full-Stack Travel & Ticketing Super-App

BookMyTicket is an enterprise-grade, multi-modal travel reservation platform engineered to handle end-to-end bookings across **Flights, Trains, Buses, and Hotels**. The system is built on a domain-driven **Spring Boot** REST API containerized with **Docker**, a feature-sliced **React (Vite)** frontend, and a cloud-managed **MySQL** relational database.

---

## 🌐 Live Production Links

- **Frontend Web App (Vercel):** [https://bookmyticket-seven.vercel.app](https://bookmyticket-seven.vercel.app)
- **Backend REST API (Render):** [https://book-my-ticket-qwng.onrender.com](https://book-my-ticket-qwng.onrender.com)
- **Cloud Database:** Managed MySQL 8.0 hosted on Aiven Cloud

> **Note on Free-Tier Cold Starts:** The backend container is hosted on Render's free tier. Following 15 minutes of inactivity, the instance spins down; the initial request may take 45–60 seconds to wake the container.

---

## 🛠️ Technology Stack

### Backend (`backend/Book_My_Ticket`)
- **Runtime & Framework:** Java (JDK 27), Spring Boot 3 / 4, Maven Wrapper (`mvnw`)
- **Security & Auth:** Spring Security, Stateless JWT (`JwtAuthFilter`, `JwtUtils`), `BCryptPasswordEncoder`, Role-Based Access Control (`ADMIN`, `CUSTOMER`)
- **Data & Persistence:** Spring Data JPA, Hibernate ORM, HikariCP Connection Pooling, MySQL Connector/J (SSL-enforced)
- **Architecture & Validation:** Domain-Driven Package Modularization, DTO Pattern, Jakarta Bean Validation (`@Valid`), Global Exception Handling (`GlobalExceptionHandler`), Project Lombok

### Frontend (`frontend/Book_My_Project`)
- **Core & Bundler:** React, Vite (`rolldown-vite`)
- **State & Routing:** React Context API (`AuthContext.jsx`), React Router DOM
- **HTTP Client:** Centralized Axios Instance (`axiosConfig.js`) with JWT Bearer Interceptors
- **UI & Styling:** Custom Modular CSS per feature component (`Admin*`, `Book*`, `BookingModal`, `NavBar`)

### DevOps & Cloud Infrastructure
- **Containerization:** Multi-stage `Dockerfile` (`maven:3-eclipse-temurin-27` build stage + `eclipse-temurin:27-jre` runtime stage)
- **CI/CD & Hosting:** Render (Docker Web Service), Vercel (Frontend Production CDN), GitHub Push Protection & Environment Variable Injection

---

## 🏗️ Core Modules & Domain Features

1. **Authentication & Security (`auth`, `security`, `config`)**
   - Stateless JWT authentication via `/api/auth/register` and `/api/auth/login`.
   - Custom `SecurityConfig` with explicit CORS origin patterns (`https://bookmyticket-seven.vercel.app`, `http://localhost:5173`), preflight `OPTIONS` allowances, and `/error` dispatch whitelisting.
   - Strict method-level and route-level authorization (`hasRole("ADMIN")` for inventory mutations).

2. **Multi-Modal Inventory Management (`app_flight`, `app_train`, `app_bus`, `app_hotel`)**
   - **Flights:** Manages flights (`Flight`) and intermediate layover stops (`FlightStop`).
   - **Trains:** Manages trains (`Train`), seating classes (`TrainClass`), and station schedules (`TrainRoute`).
   - **Buses:** Manages bus fleets (`Bus`) with dynamic boarding (`bus_boarding_points`) and dropping (`bus_dropping_points`) route points (`RoutePoint`).
   - **Hotels:** Manages properties (`Hotel`), room configurations (`Room`), and date-wise room availability (`RoomInventory`).

3. **Unified Booking & Payment Engine (`app_booking`, `app_payment`, `enums`)**
   - Dedicated booking controllers, services, and repositories for Buses, Flights, Hotels, and Trains.
   - Integrated payment processing (`PaymentController`, `PaymentService`) tracking `PaymentMethod`, `PaymentStatus`, `BookingType`, and `BookingStatus`.

4. **Customer & Admin Dashboards (`admin`, `app_user`)**
   - **Admin Portal:** Real-time platform metrics (`AdminAnalyticsController`) and complete ledger auditing (`AdminTransactionController`).
   - **Customer Portal:** Personalized booking history, active reservations, and profile management (`UserDashboardController`, `UserController`).

---

## 📸 Application Screenshots

### 🔐 Authentication

The login and registration interface provides the entry point for customers to access the BookMyTicket platform.

![BookMyTicket Login and Registration](docs/screenshots/login.png)

### 👤 Customer Portal

Explore the customer-facing interface for searching travel options, reviewing availability, and managing reservations across four travel categories.

#### Home Page

The unified home page provides access to flights, trains, buses, and hotels from a single interface.

![BookMyTicket Customer Home Page](docs/screenshots/customer-home.png)

#### Train Booking

Search trains by source, destination, and travel date, then review available services and journey details.

![Train Search Results](docs/screenshots/customer-trains.png)

#### Flight Booking

Browse available flights, compare journey information, and explore flight reservation options.

![Flight Search Results](docs/screenshots/customer-flights.png)

#### Bus Booking

Find bus services between cities and review departure information, fares, and available options.

![Bus Search Results](docs/screenshots/customer-buses.png)

#### Hotel Reservations

Search hotels by destination and stay dates, and review property details and room availability.

![Hotel Search Results](docs/screenshots/customer-hotels.png)

#### My Bookings

View reservations by category and review booking status, journey details, and payment amounts.

![Customer Booking History](docs/screenshots/customer-bookings.png)

[🌐 **Try BookMyTicket Live**](https://bookmyticket-seven.vercel.app/)


### 🛡️ Admin Portal

#### Platform Overview & Analytics

The admin dashboard summarizes registered users, bookings, revenue, booking categories, and available travel inventory.

![Admin Dashboard and Analytics](docs/screenshots/admin-dashboard.png)

#### Flight Inventory Management

Manage flight inventory and review routes, departure dates, pricing, and seat availability.

![Flight Inventory Management](docs/screenshots/flight-management.png)

#### Train Inventory Management

Access train inventory management, route search, departure information, and configured seating classes.

![Train Inventory Management](docs/screenshots/train-management.png)

#### Bus Inventory Management

Manage bus inventory, route details, departure schedules, ticket prices, and seat availability.

![Bus Inventory Management](docs/screenshots/bus-management.png)

#### System Transactions Ledger

Review booking transactions across flights, trains, buses, and hotels, including booking references, payment amounts, and statuses.

![System Transactions Ledger](docs/screenshots/transactions-ledger.png)

---

**Explore the live application:** [BookMyTicket](https://bookmyticket-seven.vercel.app/)

## ⚙️ Configuration & Deployment

### 1. Environment Variables

Configure your database credentials using environment variables. Never commit database passwords, JWT secrets, or other credentials to GitHub.

Example `application.properties` configuration:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

Set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` in your local environment or deployment platform.

### 2. Docker Deployment

The backend uses a multi-stage Docker build to separate compilation from runtime.

```dockerfile
# Build stage
FROM maven:3-eclipse-temurin-27 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:27-jre

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

> This example assumes the project uses JDK 27 and produces an executable Spring Boot JAR. Adjust it to match your actual build configuration.

## 🚀 Running Locally

### Prerequisites

- Java Development Kit compatible with the project
- Node.js and npm
- MySQL database
- Git

### 1. Start the Backend

Open PowerShell:

```powershell
cd backend/Book_My_Ticket

$env:DB_URL="jdbc:mysql://localhost:3306/your_database"
$env:DB_USERNAME="your_username"
$env:DB_PASSWORD="your_database_password"

.\mvnw spring-boot:run
```

Replace the example database URL and credentials with your actual configuration.

### 2. Start the Frontend

Open another terminal:

```bash
cd frontend/Book_My_Project
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## 👨‍💻 Author

**Abinesh S.**

- [GitHub](https://github.com/Abinesh-S-7)
- [LinkedIn](https://www.linkedin.com/)

## 🌐 Live Demo

- [BookMyTicket Frontend](https://bookmyticket-seven.vercel.app/)
- [Backend REST API](https://book-my-ticket-qwng.onrender.com/)

**Deployment note:** The Render free-tier backend may take approximately 45–60 seconds to respond after inactivity, as described in the deployment configuration.