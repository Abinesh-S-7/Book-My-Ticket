import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';
import logoImg from '../assets/logo.jpeg';

function Navbar()
{
    const{user,logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const[currentTime,setCurrentTime] = useState(new Date());

    useEffect(()=>{
        const timer = setInterval(()=>
        {
            setCurrentTime(new Date());
        },1000);

        return () => clearInterval(timer);
    },[]);

    function handleLogout() {
        logout();
        navigate('/');
    }

    return(
        <header className="navbar-container">
            <div className="top-micro-bar">
                <div className="micro-left">
                    {user && <span> Welcome <strong>{user.email}</strong></span>}
                </div>
                <div className="micro-right">
                    <span>{currentTime.toLocaleString('en-IN')}</span>
                </div>
            </div>
            <nav className="main-nav">
                <div className="nav-brand">
                    <img src={logoImg} alt="Book My Ticket" className="logo-image" />
                </div>
                <div className="nav-links">
                    <Link to="/dashboard" className="nav-item"> Home </Link>
                    <Link to="/book-trains" className="nav-item"> TRAINS </Link>
                    <Link to="/book-flights" className="nav-item"> FLIGHTS </Link>
                    <Link to="/book-buses" className="nav-item"> BUSES </Link>
                    <Link to="/book-hotels" className="nav-item"> HOTELS </Link>

                    <Link to="/bookings" className="nav-item highlight-link">MY BOOKINGS</Link>
                    <button onClick={handleLogout} className="nav-logout-btn">LOGOUT</button>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;