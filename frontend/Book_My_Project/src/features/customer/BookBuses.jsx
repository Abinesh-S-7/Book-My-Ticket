import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Navbar from '../../components/NavBar';
import BookingModal from '../../components/BookingModal';
import './BookBuses.css';

const CITIES = [
    "Chennai", "Coimbatore", "Madurai", "Nagercoil"
].sort();

export default function BookBuses() {
    const navigate = useNavigate();
    
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    
    const [availableBuses, setAvailableBuses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);

    async function handleSearch(e) {
        e.preventDefault();

        if (source === destination) {
            setError("Origin and Destination cannot be the same.");
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            const response = await api.get(`/buses/search?source=${source}&destination=${destination}&date=${date}`);
            setAvailableBuses(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error("Search failed:", err);
            setError("Could not find buses. Please check your search details or ensure the backend is running.");
            setIsLoading(false);
        }
    }

    function openCheckout(bus) {
        setSelectedBus(bus);
        setIsModalOpen(true);
    }

    async function handleConfirmBooking(checkoutData) {
        const bookingRequest = {
            busId: selectedBus.id,
            numberOfSeats: checkoutData.units,
            paymentMethod: checkoutData.paymentMethod
        };

        try {
            await api.post('/bus-bookings/create', bookingRequest);
            alert("Bus booked and payment processed successfully!");
            setIsModalOpen(false);
            navigate('/bookings');
        } catch (err) {
            console.error("Booking failed:", err);
            alert("Failed to process booking or payment. Please try again.");
        }
    }

    return (
        <>
            <Navbar />
            <div className="bus-booking-page">
                <div className="bus-hero-section">
                    <div className="bus-hero-overlay">
                        <h1>Hit the Road</h1>
                        <p>Comfortable, safe, and scenic bus journeys across major cities.</p>
                    </div>
                </div>

                <div className="bus-booking-container">

                    <form className="modern-search-box" onSubmit={handleSearch}>
                        <div className="input-group">
                            <label>From</label>
                            <select value={source} onChange={(e) => setSource(e.target.value)} required>
                                <option value="" disabled>Select Origin</option>
                                {CITIES.map(city => <option key={`src-${city}`} value={city}>{city}</option>)}
                            </select>
                        </div>
                        
                        <div className="swap-icon">🚌</div>

                        <div className="input-group">
                            <label>To</label>
                            <select value={destination} onChange={(e) => setDestination(e.target.value)} required>
                                <option value="" disabled>Select Destination</option>
                                {CITIES.map(city => <option key={`dst-${city}`} value={city}>{city}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Travel Date</label>
                            <input 
                                type="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-search-modern bus-theme-btn">Search Buses</button>
                    </form>

                    {isLoading && <div className="loading-spinner">Finding the best routes for you...</div>}
                    {error && <div className="error-message">{error}</div>}

                    {availableBuses.length > 0 && (
                        <div className="bus-results-wrapper">
                            <h3 className="results-title">
                                {availableBuses.length} Buses found for {source} to {destination}
                            </h3>
                            
                            <div className="bus-results-grid">
                                {availableBuses.map((bus) => (
                                    <div key={bus.id} className="modern-bus-card">
                                        <div className="bus-card-header">
                                            <div className="operator-info">
                                                <div className="operator-logo">
                                                    {bus.operatorName ? bus.operatorName.charAt(0) : 'B'}
                                                </div>
                                                <div>
                                                    <h3 className="operator-name">{bus.operatorName}</h3>
                                                    <span className="bus-number">#{bus.busNumber}</span>
                                                </div>
                                            </div>
                                            <div className="bus-type-badge">{bus.busType}</div>
                                        </div>
                                        
                                        <div className="route-timeline">
                                            <div className="timeline-point">
                                                <span className="time">{new Date(bus.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className="station">{bus.source}</span>
                                                <span className="date-sub">{new Date(bus.departureTime).toLocaleDateString()}</span>
                                            </div>
                                            
                                            <div className="timeline-divider">
                                                <div className="line"></div>
                                                <span className="duration-badge">➔</span>
                                                <div className="line"></div>
                                            </div>
                                            
                                            <div className="timeline-point text-right">
                                                <span className="time">{new Date(bus.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className="station">{bus.destination}</span>
                                                <span className="date-sub">{new Date(bus.arrivalTime).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="bus-card-footer">
                                            <div className="footer-left">
                                                <span className={`seat-status ${bus.availableSeats < 5 ? 'text-red' : 'text-green'}`}>
                                                    {bus.availableSeats < 1 ? 'Sold Out' : `${bus.availableSeats} Seats Available`}
                                                </span>
                                            </div>
                                            <div className="footer-right">
                                                <div className="price-block">
                                                    <span className="currency">₹</span>
                                                    <span className="amount">{bus.price}</span>
                                                </div>
                                                <button 
                                                    className="btn-book-modern bus-theme-btn" 
                                                    onClick={() => openCheckout(bus)}
                                                    disabled={bus.availableSeats < 1}
                                                >
                                                    {bus.availableSeats < 1 ? 'Sold Out' : 'Book Now'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {availableBuses.length === 0 && !isLoading && !error && (
                        <div className="empty-state">
                            <p>Enter your origin, destination, and date above to find the best buses for your journey.</p>
                        </div>
                    )}
                </div>

                {selectedBus && (
                    <BookingModal 
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleConfirmBooking}
                        basePrice={selectedBus.price}
                        unitName="Seats"
                        maxAvailable={selectedBus.availableSeats}
                    />
                )}
            </div>
        </>
    );
}