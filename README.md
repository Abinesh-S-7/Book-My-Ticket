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

## ⚙️ Configuration & Deployment Details

### 1. Database & Environment Variables (`application.properties`)
Credentials are externalized to comply with GitHub Secret Scanning and Push Protection:

```properties
spring.datasource.url=jdbc:mysql://bookmyticket-samabi236-1ab4.f.aivencloud.com:19533/defaultdb?ssl-mode=REQUIRED
spring.datasource.username=avnadmin
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 2. Multi-Stage `Dockerfile` (JDK 27)
```dockerfile
# Build Stage
FROM maven:3-eclipse-temurin-27 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run Stage
FROM eclipse-temurin:27-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 🚀 Running Locally

### 1. Backend
```bash
cd backend/Book_My_Ticket

# Set your Aiven or local MySQL password in your terminal session
# PowerShell:
$env:DB_PASSWORD="your_database_password"

# Run via Maven Wrapper
./mvnw spring-boot:run
```

### 2. Frontend
```bash
cd frontend/Book_My_Project

# Install dependencies and start Vite dev server
npm install
npm run dev
```

---


## 👨‍💻 Author
**Abinesh S**