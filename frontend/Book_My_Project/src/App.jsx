import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './features/auth/Login';
import UserDashboard from './features/customer/UserDashboard';
import Bookings from './features/customer/Bookings';
import BookFlights from './features/customer/BookFlights';
import BookTrains from './features/customer/BookTrains';
import BookBuses from './features/customer/BookBuses';
import BookHotels from './features/customer/BookHotels';
import Home from './features/auth/Home';
import Register from './features/auth/Register';
import AdminDashboard from './features/admin/AdminDashboard';

function App()
{
  return(
    <AuthProvider>
      <Router>

        <Routes>
          <Route path='/' element={<Home/>}/>

          <Route path='/login' element={<Login/>}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path='/dashboard' element={<UserDashboard/>}/>
          <Route path="/bookings" element={<Bookings />}/>
          <Route path="/book-flights" element={<BookFlights />} />
          <Route path="/book-trains" element={<BookTrains />} />
          <Route path="/book-buses" element={<BookBuses />} />
          <Route path="/book-hotels" element={<BookHotels />} />

          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </Router>

    </AuthProvider>
  );
}

export default App;