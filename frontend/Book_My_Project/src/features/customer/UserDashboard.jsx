import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import './UserDashboard.css';
import plane from '../../assets/aeroplane.png';
import train from '../../assets/train.png';
import bus from '../../assets/bus.png';
import hotel from '../../assets/hotel.png';

export default function UserDashboard() {
    const navigate = useNavigate();

    return (
        <div className="home-wrapper">
            <Navbar />
            
            {/* Full Width Hero Banner */}
            <div className="hero-section">
                <div className="hero-overlay">
                    <div className="hero-content">
                        <h1>Your Journey Starts Here</h1>
                        <p>
                            Experience the ultimate Super App. Seamlessly book your flights, 
                            trains, buses, and hotels all in one unified platform. Travel smarter, not harder.
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Overlapping Cards */}
            <div className="booking-cards-container">
                <div className="action-card" onClick={() => navigate('/book-flights')}>
                    <div className="icon-wrapper">
                        <img src={plane} alt="Flights" />
                    </div>
                    <h3>Flights</h3>
                    <p>Search & Book</p>
                </div>
                
                <div className="action-card" onClick={() => navigate('/book-trains')}>
                    <div className="icon-wrapper">
                        <img src={train} alt="Trains" />
                    </div>
                    <h3>Trains</h3>
                    <p>Check availability</p>
                </div>

                <div className="action-card" onClick={() => navigate('/book-buses')}>
                    <div className="icon-wrapper">
                        <img src={bus} alt="Buses" />
                    </div>
                    <h3>Buses</h3>
                    <p>Reserve seats</p>
                </div>

                <div className="action-card" onClick={() => navigate('/book-hotels')}>
                    <div className="icon-wrapper">
                        <img src={hotel} alt="Hotels" />
                    </div>
                    <h3>Hotels</h3>
                    <p>Find your stay</p>
                </div>
            </div>
        </div>
    );
}