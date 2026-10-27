# BookMyTicket 🎫

**BookMyTicket** is a full-stack travel Super App built with Spring Boot and React. It offers a seamless, unified platform for booking flights, trains, buses, and luxury hotels. Features include JWT authentication, role-based admin/user dashboards, real-time availability, and responsive UI design.

## 🚀 Features

* **Unified Booking System:** Search and book across four major travel verticals (Flights, Trains, Buses, Hotels) from a single application.
* **Secure Authentication:** JWT-based authentication and authorization using Spring Security.
* **Role-Based Access Control:** 
  * **User Portal:** Modern hero-banner interface, interactive search widgets, and a comprehensive "My Journeys" dashboard to manage active and cancelled bookings.
  * **Admin Portal:** Secure dashboard to manage inventory, add routes/hotels, update pricing, and view a system-wide financial transactions ledger.
* **Modern UI/UX:** Clean, intuitive interface with floating search widgets, timeline-based routing cards, and category-specific color coding.
* **Dynamic Filtering & Search:** Exact-match dropdowns for valid cities/stations and date-based inventory checking.

## 💻 Tech Stack

**Frontend:**
* React (via Vite)
* React Router DOM
* Axios
* Vanilla CSS (Custom modern UI components)

**Backend:**
* Java & Spring Boot
* Spring Security (JWT)
* Spring Data JPA / Hibernate
* MySQL (Relational Database)

## 📁 Project Structure

The repository is organized into two main directories:

* `/backend/Book_My_Ticket`: Contains the Spring Boot application, REST API controllers, JPA entities, DTOs, and security configurations.
* `/frontend/Book My Project`: Contains the Vite + React frontend application, UI components, and API integration logic.

## 🛠️ Getting Started

### Prerequisites
* Java 17+
* Node.js (v16+)
* MySQL Server (v8.0+)
* Maven

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend/Book_My_Ticket
   ```
2. Open `src/main/resources/application.properties` and configure your MySQL database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bookmyticket_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```
3. Run the Spring Boot application. The server will typically start on `http://localhost:8080`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd "frontend/Book My Project"
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

## 👨‍💻 Author
**Abinesh S**