import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Navbar from '../../components/NavBar';
import BookingModal from '../../components/BookingModal';
import './BookHotels.css';

const CITIES = [
    "Chennai", "Nagercoil"
].sort();

export default function BookHotels() {
    const navigate = useNavigate();
    
    const [city, setCity] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    
    const [availableHotels, setAvailableHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const today = new Date().toISOString().split('T')[0];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [selectedAvailability, setSelectedAvailability] = useState(0);

    async function handleSearch(e) {
        e.preventDefault();
        
        if (new Date(checkOutDate) <= new Date(checkInDate)) {
            setError("Error: Check-Out date must be after your Check-In date.");
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            const response = await api.get(`/hotels/search?city=${city}`);
            setAvailableHotels(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error("Search failed:", err);
            setError("Could not find hotels. Please check your search details or ensure the backend is running.");
            setIsLoading(false);
        }
    }

    function openCheckout(room, price, availableRooms) {
        if (!checkInDate || !checkOutDate) {
            alert("Please select both Check-In and Check-Out dates.");
            return;
        }
        setSelectedRoom(room);
        setSelectedPrice(price);
        setSelectedAvailability(availableRooms);
        setIsModalOpen(true);
    }

    async function handleConfirmBooking(checkoutData) {
        const bookingRequest = {
            roomId: selectedRoom.id,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            numberOfRooms: checkoutData.units,
            paymentMethod: checkoutData.paymentMethod     
        };

        try {
            await api.post('/hotel-bookings/create', bookingRequest);
            alert("Hotel booked successfully!");
            setIsModalOpen(false);
            navigate('/bookings'); 
        } catch (err) {
            console.error("Booking failed:", err);
            alert("Failed to process payment. Please try again.");
        }
    }

    function renderStars(rating) {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    }

    return (
        <>
            <Navbar />
            <div className="hotel-booking-page">
                <div className="hotel-hero-section">
                    <div className="hotel-hero-overlay">
                        <h1>Find Your Perfect Stay</h1>
                        <p>Luxury, comfort, and affordability at your fingertips.</p>
                    </div>
                </div>

                <div className="hotel-booking-container">
                    
                    <form className="modern-search-box" onSubmit={handleSearch}>
                        <div className="input-group">
                            <label>Destination City</label>
                            <select value={city} onChange={(e) => setCity(e.target.value)} required>
                                <option value="" disabled>Select City</option>
                                {CITIES.map(c => <option key={`city-${c}`} value={c}>{c}</option>)}
                            </select>
                        </div>
                        
                        <div className="input-group">
                            <label>Check-In Date</label>
                            <input 
                                type="date" 
                                min={today} 
                                value={checkInDate} 
                                onChange={(e) => { setCheckInDate(e.target.value); setError(''); }} 
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <label>Check-Out Date</label>
                            <input 
                                type="date" 
                                min={checkInDate || today} 
                                value={checkOutDate} 
                                onChange={(e) => { setCheckOutDate(e.target.value); setError(''); }} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-search-modern hotel-theme-btn">Search Hotels</button>
                    </form>

                    {isLoading && <div className="loading-spinner">Searching for the best accommodations...</div>}
                    {error && <div className="error-message">{error}</div>}

                    {availableHotels.length > 0 && !error && (
                        <div className="hotel-results-wrapper">
                            <h3 className="results-title">
                                {availableHotels.length} Hotels found in {city}
                            </h3>
                            
                            <div className="hotel-results-grid">
                                {availableHotels.map((hotel) => {
                                    const availableRooms = hotel.rooms.filter(room => {
                                        const inventoryForDate = room.inventories.find(inv => inv.date === checkInDate);
                                        return inventoryForDate && inventoryForDate.availableRooms > 0;
                                    });

                                    if (availableRooms.length === 0) return null;

                                    return (
                                        <div key={hotel.id} className="modern-hotel-card">
                                            <div className="hotel-card-header">
                                                <div className="hotel-info">
                                                    <h3>{hotel.name}</h3>
                                                    <p className="hotel-address">📍 {hotel.address}, {hotel.city}</p>
                                                </div>
                                                <div className="star-rating">
                                                    {renderStars(hotel.starRating)}
                                                </div>
                                            </div>
                                            
                                            <div className="hotel-description">{hotel.description}</div>

                                            <div className="room-section-title">Available Rooms</div>
                                            
                                            <div className="room-list-container">
                                                {availableRooms.map((room) => {
                                                    const todayInventory = room.inventories.find(inv => inv.date === checkInDate);
                                                    return (
                                                        <div key={room.id} className="room-row-modern">
                                                            <div className="room-info-left">
                                                                <span className="room-type-title">{room.roomType}</span>
                                                                <div className="room-meta">
                                                                    <span className="room-occupancy">👤 Max: {room.maxOccupancy} Guests</span>
                                                                    <span className="room-left">🚪 {todayInventory.availableRooms} rooms left</span>
                                                                </div>
                                                            </div>
                                                            <div className="room-action-right">
                                                                <div className="room-price-block">
                                                                    <span className="price-amount">₹{todayInventory.price}</span>
                                                                    <span className="price-label">/ night</span>
                                                                </div>
                                                                <button 
                                                                    className="btn-book-room hotel-theme-btn" 
                                                                    onClick={() => openCheckout(room, todayInventory.price, todayInventory.availableRooms)}
                                                                >
                                                                    Book Room
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    
                    {availableHotels.length === 0 && !isLoading && !error && (
                        <div className="empty-state">
                            <p>Select your destination and dates above to find the perfect place to stay.</p>
                        </div>
                    )}
                </div>

                {selectedRoom && (
                    <BookingModal 
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleConfirmBooking}
                        basePrice={selectedPrice}
                        unitName="Rooms"
                        maxAvailable={selectedAvailability}
                    />
                )}
            </div>
        </>
    );
}