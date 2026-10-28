import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Navbar from '../../components/NavBar';
import './BookTrains.css';
import BookingModal from '../../components/BookingModal';

const STATIONS = [
    "Bandra Terminus", "Chennai", "Chennai Central", "Hazrat Nizamuddin", 
    "Howrah", "Jalna", "Karmali", "KSR Bengaluru", "Mumbai Central", 
    "Mumbai CSMT", "Nagercoil", "New Delhi", "Shalimar", "Yesvantpur"
].sort();

function BookTrains() {
    const navigate = useNavigate();
    
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    
    const [availableTrains, setAvailableTrains] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    async function handleSearch(e) {
        e.preventDefault();
        
        if (source === destination) {
            setError("Source and Destination cannot be the same.");
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            const response = await api.get(`api/trains/search?source=${source}&destination=${destination}&date=${date}`);
            setAvailableTrains(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error("Search failed:", err);
            setError("Could not find trains. Please check your search details or ensure the backend is running.");
            setIsLoading(false);
        }
    }
    
    function openCheckout(trainClass) {
        setSelectedClass(trainClass);
        setIsModalOpen(true);
    }

    async function handleConfirmBooking(checkoutData) {
        const bookingRequest = {
            trainClassId: selectedClass.id,
            numberOfSeats: checkoutData.units,
            paymentMethod: checkoutData.paymentMethod 
        };

        try {
            await api.post('api/train-bookings/create', bookingRequest);
            alert("Train booked and payment processed successfully!");
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
            <div className="train-booking-page">
                <div className="train-hero-section">
                    <div className="train-hero-overlay">
                        <h1>Book Your Train Tickets</h1>
                        <p>Fast, secure, and hassle-free train reservations across India.</p>
                    </div>
                </div>

                <div className="train-booking-container">
                    <form className="modern-search-box" onSubmit={handleSearch}>
                        <div className="input-group">
                            <label>From</label>
                            <select value={source} onChange={(e) => setSource(e.target.value)} required>
                                <option value="" disabled>Select Origin</option>
                                {STATIONS.map(st => <option key={`src-${st}`} value={st}>{st}</option>)}
                            </select>
                        </div>
                        
                        <div className="swap-icon">⇄</div>

                        <div className="input-group">
                            <label>To</label>
                            <select value={destination} onChange={(e) => setDestination(e.target.value)} required>
                                <option value="" disabled>Select Destination</option>
                                {STATIONS.map(st => <option key={`dst-${st}`} value={st}>{st}</option>)}
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
                        <button type="submit" className="btn-search-modern">Search Trains</button>
                    </form>
                    {isLoading && <div className="loading-spinner">Searching for available trains...</div>}
                    {error && <div className="error-message">{error}</div>}

                    
                    {availableTrains.length > 0 && (
                        <div className="train-results-wrapper">
                            <h3 className="results-title">
                                {availableTrains.length} Trains found for {source} to {destination}
                            </h3>
                            
                            <div className="train-results-grid">
                                {availableTrains.map((train) => (
                                    <div key={train.trainNumber} className="modern-train-card">
                                        <div className="train-card-header">
                                            <div className="train-title-block">
                                                <h3>{train.trainName}</h3>
                                                <span className="train-number">#{train.trainNumber}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="route-timeline">
                                            <div className="timeline-point">
                                                <span className="time">{new Date(train.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className="station">{train.source}</span>
                                                <span className="date-sub">{new Date(train.departureTime).toLocaleDateString()}</span>
                                            </div>
                                            
                                            <div className="timeline-divider">
                                                <div className="line"></div>
                                                <span className="duration-badge">➔</span>
                                                <div className="line"></div>
                                            </div>
                                            
                                            <div className="timeline-point text-right">
                                                <span className="time">{new Date(train.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className="station">{train.destination}</span>
                                                <span className="date-sub">{new Date(train.arrivalTime).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {train.classes && train.classes.length > 0 && (
                                            <div className="classes-grid">
                                                {train.classes.map((cls) => (
                                                    <div key={cls.id} className={`class-card ${cls.availableSeats < 1 ? 'waitlist' : 'available'}`}>
                                                        <div className="class-card-header">
                                                            <span className="class-name">{cls.className}</span>
                                                            <span className="class-price">₹{cls.price}</span>
                                                        </div>
                                                        <div className="class-card-body">
                                                            <span className={`seat-status ${cls.availableSeats < 1 ? 'text-red' : 'text-green'}`}>
                                                                {cls.availableSeats < 1 ? 'WL' : `AVAILABLE ${cls.availableSeats}`}
                                                            </span>
                                                            <button 
                                                                className="btn-book-sm" 
                                                                onClick={() => openCheckout(cls)}
                                                                disabled={cls.availableSeats < 1}
                                                            >
                                                                Book
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {availableTrains.length === 0 && !isLoading && !error && (
                        <div className="empty-state">
                            <p>Enter your origin, destination, and date above to find the best trains for your journey.</p>
                        </div>
                    )}
                </div>

                {selectedClass && (
                    <BookingModal 
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleConfirmBooking}
                        basePrice={selectedClass.price}
                        unitName="Seats"
                        maxAvailable={selectedClass.availableSeats}
                    />
                )}
            </div>
        </>
    );
}

export default BookTrains;