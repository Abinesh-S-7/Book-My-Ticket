import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Navbar from '../../components/NavBar';
import BookingModal from '../../components/BookingModal';
import './BookFlights.css';

const CITIES = [
    "Ahmedabad", "Bangalore", "Chennai", "Delhi", "Hyderabad", 
    "Kochi", "Kolkata", "Mumbai", "Pune", "Trivandrum"
].sort();

export default function BookFlights() {
    const navigate = useNavigate();
    
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    
    const [availableFlights, setAvailableFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);

    async function handleSearch(e) {
        e.preventDefault();

        if (source === destination) {
            setError("Origin and Destination cannot be the same.");
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            const response = await api.get(`/flights/search?source=${source}&destination=${destination}&date=${date}`);
            setAvailableFlights(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error("Search failed:", err);
            setError("Could not find flights. Please check your details or try another date.");
            setIsLoading(false);
        }
    }

    function openCheckout(flight) {
        setSelectedFlight(flight);
        setIsModalOpen(true);
    }

    async function handleConfirmBooking(checkoutData) {
        const bookingRequest = {
            flightId: selectedFlight.id,
            numberOfSeats: checkoutData.units,
            paymentMethod: checkoutData.paymentMethod
        };

        try {
            await api.post('/flight-bookings/create', bookingRequest);
            alert("Flight booked successfully!");
            setIsModalOpen(false);
            navigate('/bookings');
        } catch (err) {
            console.error("Booking failed:", err);
            alert("Failed to book the flight. Please try again.");
        }
    }

    return (
        <>
            <Navbar />
            <div className="flight-booking-page">
                <div className="flight-hero-section">
                    <div className="flight-hero-overlay">
                        <h1>Ready for Takeoff?</h1>
                        <p>Discover the best fares and seamless booking for flights across the globe.</p>
                    </div>
                </div>

                <div className="flight-booking-container">
                    
                    <form className="modern-search-box" onSubmit={handleSearch}>
                        <div className="input-group">
                            <label>From</label>
                            <select value={source} onChange={(e) => setSource(e.target.value)} required>
                                <option value="" disabled>Select Origin</option>
                                {CITIES.map(city => <option key={`src-${city}`} value={city}>{city}</option>)}
                            </select>
                        </div>

                        <div className="swap-icon">✈</div>

                        <div className="input-group">
                            <label>To</label>
                            <select value={destination} onChange={(e) => setDestination(e.target.value)} required>
                                <option value="" disabled>Select Destination</option>
                                {CITIES.map(city => <option key={`dst-${city}`} value={city}>{city}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Departure Date</label>
                            <input 
                                type="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-search-flight">Search Flights</button>
                    </form>


                    {isLoading && <div className="loading-spinner">Searching the skies for available flights...</div>}
                    {error && <div className="error-message">{error}</div>}

                    {availableFlights.length > 0 && (
                        <div className="flight-results-wrapper">
                            <h3 className="results-title">
                                {availableFlights.length} Flights found for {source} to {destination}
                            </h3>
                            
                            <div className="flight-results-grid">
                                {availableFlights.map((flight) => (
                                    <div key={flight.id} className="modern-flight-card">
                                        
                                        <div className="flight-card-header">
                                            <div className="airline-info">
                                                <div className="airline-logo-placeholder">
                                                    {flight.airlineName ? flight.airlineName.charAt(0) : '✈'}
                                                </div>
                                                <div>
                                                    <h3 className="airline-name">{flight.airlineName || 'Air Travel'}</h3>
                                                    <span className="flight-number">{flight.flightNumber}</span>
                                                </div>
                                            </div>
                                            <div className="flight-class">Economy</div>
                                        </div>
                                        
                                        <div className="route-timeline">
                                            <div className="timeline-point">
                                                <span className="time">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className="station">{flight.source}</span>
                                                <span className="date-sub">{new Date(flight.departureTime).toLocaleDateString()}</span>
                                            </div>
                                            
                                            <div className="timeline-divider">
                                                <div className="line"></div>
                                                <span className="duration-badge">✈</span>
                                                <div className="line"></div>
                                            </div>
                                            
                                            <div className="timeline-point text-right">
                                                <span className="time">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className="station">{flight.destination}</span>
                                                <span className="date-sub">{new Date(flight.arrivalTime).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="flight-card-footer">
                                            <div className="footer-left">
                                                <span className={`seat-status ${flight.availableSeats < 5 ? 'text-red' : 'text-green'}`}>
                                                    {flight.availableSeats} Seats Left
                                                </span>
                                            </div>
                                            <div className="footer-right">
                                                <div className="price-block">
                                                    <span className="currency">₹</span>
                                                    <span className="amount">{flight.price}</span>
                                                </div>
                                                <button 
                                                    className="btn-book-flight" 
                                                    onClick={() => openCheckout(flight)}
                                                    disabled={flight.availableSeats < 1}
                                                >
                                                    {flight.availableSeats < 1 ? 'Sold Out' : 'Book Now'}
                                                </button>
                                            </div>
                                        </div>
                                        
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {availableFlights.length === 0 && !isLoading && !error && (
                        <div className="empty-state">
                            <p>Enter your origin, destination, and date above to find the best flights for your journey.</p>
                        </div>
                    )}
                </div>

                {selectedFlight && (
                    <BookingModal 
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleConfirmBooking}
                        basePrice={selectedFlight.price}
                        unitName="Seats"
                        maxAvailable={selectedFlight.availableSeats}
                    />
                )}
            </div>
        </>
    );
}