# 🎫 BookMyTicket — Full-Stack Travel & Ticketing Super-App

BookMyTicket is an enterprise-grade, multi-modal travel reservation platform engineered to handle end-to-end bookings across **Flights, Trains, Buses, and Hotels**. The system is built on a domain-driven **Spring Boot** REST API containerized with **Docker**, a feature-sliced **React (Vite)** frontend, and a cloud-managed **MySQL** relational database.

---

## 🌐 Live Production Links

- **Frontend Web App (Vercel):** [https://bookmyticket-seven.vercel.app](https://bookmyticket-seven.vercel.app)
- **Backend REST API (Render):** [https://book-my-ticket-qwng.onrender.com](https://book-my-ticket-qwng.onrender.com)[cite: 2]
- **Cloud Database:** Managed MySQL 8.0 hosted on Aiven Cloud

> **Note on Free-Tier Cold Starts:** The backend container is hosted on Render's free tier. Following 15 minutes of inactivity, the instance spins down; the initial request may take 45–60 seconds to wake the container[cite: 2].

---

## 🛠️ Technology Stack

### Backend (`backend/Book_My_Ticket`)
- **Runtime & Framework:** Java (JDK 27), Spring Boot 3 / 4, Maven Wrapper (`mvnw`)
- **Security & Auth:** Spring Security, Stateless JWT (`JwtAuthFilter`, `JwtUtils`), `BCryptPasswordEncoder`, Role-Based Access Control (`ADMIN`, `CUSTOMER`[cite: 4])
- **Data & Persistence:** Spring Data JPA, Hibernate ORM, HikariCP Connection Pooling, MySQL Connector/J (SSL-enforced)
- **Architecture & Validation:** Domain-Driven Package Modularization, DTO Pattern, Jakarta Bean Validation (`@Valid`)[cite: 3], Global Exception Handling (`GlobalExceptionHandler`), Project Lombok[cite: 3]

### Frontend (`frontend/Book_My_Project`)
- **Core & Bundler:** React, Vite (`rolldown-vite`)
- **State & Routing:** React Context API (`AuthContext.jsx`), React Router DOM
- **HTTP Client:** Centralized Axios Instance (`axiosConfig.js`) with JWT Bearer Interceptors
- **UI & Styling:** Custom Modular CSS per feature component (`Admin*`, `Book*`, `BookingModal`, `NavBar`)

### DevOps & Cloud Infrastructure
- **Containerization:** Multi-stage `Dockerfile` (`maven:3-eclipse-temurin-27` build stage + `eclipse-temurin:27-jre` runtime stage)
- **CI/CD & Hosting:** Render (Docker Web Service)[cite: 2], Vercel (Frontend Production CDN), GitHub Push Protection & Environment Variable Injection

---

## 🏗️ Core Modules & Domain Features

1. **Authentication & Security (`auth`, `security`, `config`)**
   - Stateless JWT authentication via `/api/auth/register` and `/api/auth/login`[cite: 3].
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

## 📁 Complete Project Directory Structure

```text
BookMyTicket/
├── backend/
│   └── Book_My_Ticket/
│       ├── Dockerfile
│       ├── pom.xml
│       ├── mvnw
│       ├── mvnw.cmd
│       └── src/
│           ├── main/
│           │   ├── java/com/Book_My_Ticket/
│           │   │   ├── BookMyTicketApplication.java
│           │   │   ├── admin/
│           │   │   │   ├── AdminAnalyticsController.java
│           │   │   │   └── AdminTransactionController.java
│           │   │   ├── app_booking/
│           │   │   │   ├── book_buses/
│           │   │   │   │   ├── BusBooking.java
│           │   │   │   │   ├── BusBookingController.java
│           │   │   │   │   ├── BusBookingRepository.java
│           │   │   │   │   └── BusBookingService.java
│           │   │   │   ├── book_flights/
│           │   │   │   │   ├── FlightBooking.java
│           │   │   │   │   ├── FlightBookingController.java
│           │   │   │   │   ├── FlightBookingRepository.java
│           │   │   │   │   └── FlightBookingService.java
│           │   │   │   ├── book_hotels/
│           │   │   │   │   ├── HotelBooking.java
│           │   │   │   │   ├── HotelBookingController.java
│           │   │   │   │   ├── HotelBookingRepository.java
│           │   │   │   │   └── HotelBookingService.java
│           │   │   │   ├── book_trains/
│           │   │   │   │   ├── TrainBooking.java
│           │   │   │   │   ├── TrainBookingController.java
│           │   │   │   │   ├── TrainBookingRepository.java
│           │   │   │   │   └── TrainBookingService.java
│           │   │   │   └── dto/
│           │   │   │       ├── BusBookings/
│           │   │   │       │   ├── BusBookingRequestDto.java
│           │   │   │       │   └── BusBookingResponseDto.java
│           │   │   │       ├── FlightBookings/
│           │   │   │       │   ├── FlightBookingRequestDto.java
│           │   │   │       │   └── FlightBookingResponseDto.java
│           │   │   │       ├── HotelBookings/
│           │   │   │       │   ├── HotelBookingRequestDto.java
│           │   │   │       │   └── HotelBookingResponseDto.java
│           │   │   │       └── TrainBookings/
│           │   │   │           ├── TrainBookingRequestDto.java
│           │   │   │           └── TrainBookingResponseDto.java
│           │   │   ├── app_bus/
│           │   │   │   ├── bus_controller/BusController.java
│           │   │   │   ├── bus_entity/
│           │   │   │   │   ├── Bus.java
│           │   │   │   │   └── RoutePoint.java
│           │   │   │   ├── bus_repository/BusRepository.java
│           │   │   │   ├── bus_service/BusService.java
│           │   │   │   └── dto/
│           │   │   │       ├── BusRequestDto.java
│           │   │   │       ├── BusResponseDto.java
│           │   │   │       └── RoutePointDto.java
│           │   │   ├── app_flight/
│           │   │   │   ├── dto/
│           │   │   │   │   ├── FlightRequestDto.java
│           │   │   │   │   ├── FlightResponseDto.java
│           │   │   │   │   ├── FlightStopRequestDto.java
│           │   │   │   │   └── FlightStopResponseDto.java
│           │   │   │   ├── flight_controller/FlightController.java
│           │   │   │   ├── flight_entity/
│           │   │   │   │   ├── Flight.java
│           │   │   │   │   └── FlightStop.java
│           │   │   │   ├── flight_repository/FlightRepository.java
│           │   │   │   └── flight_service/FlightService.java
│           │   │   ├── app_hotel/
│           │   │   │   ├── dto/
│           │   │   │   │   ├── HotelRequestDto.java
│           │   │   │   │   ├── HotelResponseDto.java
│           │   │   │   │   ├── RoomInventoryRequestDto.java
│           │   │   │   │   ├── RoomInventoryResponseDto.java
│           │   │   │   │   ├── RoomRequestDto.java
│           │   │   │   │   └── RoomResponseDto.java
│           │   │   │   ├── hotel_controller/HotelController.java
│           │   │   │   ├── hotel_entity/
│           │   │   │   │   ├── Hotel.java
│           │   │   │   │   ├── Room.java
│           │   │   │   │   └── RoomInventory.java
│           │   │   │   ├── hotel_repository/
│           │   │   │   │   ├── HotelRepository.java
│           │   │   │   │   ├── RoomInventoryRepository.java
│           │   │   │   │   └── RoomRepository.java
│           │   │   │   └── hotel_service/HotelService.java
│           │   │   ├── app_payment/
│           │   │   │   ├── dto/
│           │   │   │   │   ├── PaymentRequestDto.java
│           │   │   │   │   └── PaymentResponseDto.java
│           │   │   │   ├── payment_controller/PaymentController.java
│           │   │   │   ├── payment_entity/Payment.java
│           │   │   │   ├── payment_repository/PaymentRepository.java
│           │   │   │   └── payment_service/PaymentService.java
│           │   │   ├── app_train/
│           │   │   │   ├── dto/
│           │   │   │   │   ├── TrainClassRequestDto.java
│           │   │   │   │   ├── TrainClassResponseDto.java
│           │   │   │   │   ├── TrainRequestDto.java
│           │   │   │   │   ├── TrainResponseDto.java
│           │   │   │   │   ├── TrainRouteRequestDto.java
│           │   │   │   │   └── TrainRouteResponseDto.java
│           │   │   │   ├── train_controller/TrainController.java
│           │   │   │   ├── train_entity/
│           │   │   │   │   ├── Train.java
│           │   │   │   │   ├── TrainClass.java
│           │   │   │   │   └── TrainRoute.java
│           │   │   │   ├── train_repository/
│           │   │   │   │   ├── TrainClassRepository.java
│           │   │   │   │   ├── TrainRepository.java
│           │   │   │   │   └── TrainRouteRepository.java
│           │   │   │   └── train_service/TrainService.java
│           │   │   ├── app_user/
│           │   │   │   ├── dto/
│           │   │   │   │   ├── UserDashboardResponseDto.java
│           │   │   │   │   ├── UserRegistrationDto.java
│           │   │   │   │   └── UserResponseDto.java
│           │   │   │   ├── user_controller/
│           │   │   │   │   ├── UserController.java
│           │   │   │   │   └── UserDashboardController.java
│           │   │   │   ├── user_entity/User.java
│           │   │   │   ├── user_repository/UserRepository.java
│           │   │   │   └── user_service/
│           │   │   │       ├── UserDashboardService.java
│           │   │   │       └── UserService.java
│           │   │   ├── auth/
│           │   │   │   ├── auth_controller/AuthController.java
│           │   │   │   └── dto/
│           │   │   │       ├── AuthResponseDto.java
│           │   │   │       ├── LoginRequestDto.java
│           │   │   │       └── RegisterRequestDto.java
│           │   │   ├── config/
│           │   │   │   └── SecurityConfig.java
│           │   │   ├── enums/
│           │   │   │   ├── BookingStatus.java
│           │   │   │   ├── BookingType.java
│           │   │   │   ├── PaymentMethod.java
│           │   │   │   ├── PaymentStatus.java
│           │   │   │   └── Role.java
│           │   │   ├── exception/
│           │   │   │   ├── ErrorResponseDto.java
│           │   │   │   └── GlobalExceptionHandler.java
│           │   │   └── security/
│           │   │       ├── CustomUserDetailsService.java
│           │   │       ├── JwtAuthFilter.java
│           │   │       └── JwtUtils.java
│           │   └── resources/
│           │       └── application.properties
│           └── test/
│               └── java/com/Book_My_Ticket/
│                   └── BookMyTicketApplicationTests.java
└── frontend/
    └── Book_My_Project/
        ├── package.json
        ├── vite.config.js
        └── src/
            ├── App.jsx
            ├── main.jsx
            ├── api/
            │   └── axiosConfig.js
            ├── assets/
            │   ├── aeroplane.png
            │   ├── bus.png
            │   ├── dashboard.png
            │   ├── home.jpeg
            │   ├── hotel.png
            │   ├── logo.jpeg
            │   ├── train.png
            │   └── Transaction.png
            ├── components/
            │   ├── BookingModal.css
            │   ├── BookingModal.jsx
            │   ├── NavBar.css
            │   └── NavBar.jsx
            ├── context/
            │   └── AuthContext.jsx
            └── features/
                ├── admin/
                │   ├── AdminBuses.css
                │   ├── AdminBuses.jsx
                │   ├── AdminDashboard.css
                │   ├── AdminDashboard.jsx
                │   ├── AdminFlights.css
                │   ├── AdminFlights.jsx
                │   ├── AdminHomeDashboard.css
                │   ├── AdminHomeDashboard.jsx
                │   ├── AdminHotels.css
                │   ├── AdminHotels.jsx
                │   ├── AdminTrains.css
                │   ├── AdminTrains.jsx
                │   ├── AdminTransactions.css
                │   └── AdminTransactions.jsx
                ├── auth/
                │   ├── Home.css
                │   └── Home.jsx
                └── customer/
                    ├── BookBuses.css
                    ├── BookBuses.jsx
                    ├── BookFlights.css
                    ├── BookFlights.jsx
                    ├── BookHotels.css
                    ├── BookHotels.jsx
                    ├── Bookings.css
                    ├── Bookings.jsx
                    ├── BookTrains.css
                    ├── BookTrains.jsx
                    ├── UserDashboard.css
                    └── UserDashboard.jsx

```

---

## ⚙️ Configuration & Deployment Details

### 1. Database & Environment Variables (`application.properties`)

Credentials are externalized to comply with GitHub Secret Scanning and Push Protection:

```properties
spring.datasource.url=jdbc:mysql://[bookmyticket-samabi236-1ab4.f.aivencloud.com:19533/defaultdb?ssl-mode=REQUIRED](https://bookmyticket-samabi236-1ab4.f.aivencloud.com:19533/defaultdb?ssl-mode=REQUIRED)
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

## 🔑 Elevating a User to `ADMIN`

By default, newly registered users via `/api/auth/register` are assigned the `CUSTOMER` role. To grant administrative privileges (`ADMIN`) for adding flights, trains, buses, and hotels, run the following SQL on your MySQL instance:

```sql
USE defaultdb;

UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'your-registered-email@example.com';

COMMIT;

```

Log out and log back in on the web interface to generate a fresh JWT containing the `ADMIN` authority.

```

---

### 💡 How to Save Directly as a File
To save this directly as `README.md` in your root `BookMyTicket` directory:
1. Click the **Copy** button in the top-right corner of the markdown block above.
2. Run this single command in your PowerShell terminal at `C:\Users\samab\OneDrive\Desktop\BookMyTicket`:

```powershell
Get-Clipboard | Set-Content -Path "README.md" -Encoding UTF8

```

Then commit and push it to GitHub:

```powershell
git add README.md
git commit -m "Add comprehensive project README with updated architecture"
git push origin main

```