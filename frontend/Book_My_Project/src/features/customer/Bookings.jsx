import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import './Bookings.css'
import Navbar from '../../components/NavBar'
import plane from '../../assets/aeroplane.png';
import train from '../../assets/train.png';
import bus from '../../assets/bus.png';
import hotel from '../../assets/hotel.png';

export default function Bookings(){
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [bookingsData, setBookingsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [activeTab, setActiveTab] = useState('all');

    async function fetchMyTrips() {
        try{
            const response = await api.get('dashboard/my-trips');
            setBookingsData(response.data);
            setIsLoading(false);
        }
        catch(err)
        {
            console.error("Error Fetching Trips:", err);
            setError("Failed to load your bookings. Is the backend running?");
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMyTrips();
    }, []);

    function handleBookAgain(type) {
        navigate(`/book-${type}s`);
    }

    async function handleCancelBooking(type, bookingId) {
        const confirmCancel = window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.");
        if (!confirmCancel) return;

        let endpoint = '';
        switch(type) {
            case 'flight': endpoint = `/flight-bookings/cancel/${bookingId}`; break;
            case 'train': endpoint = `/train-bookings/cancel/${bookingId}`; break;
            case 'bus': endpoint = `/bus-bookings/cancel/${bookingId}`; break;
            case 'hotel': endpoint = `/hotel-bookings/cancel/${bookingId}`; break;
            default: return;
        }

        try {
            await api.put(endpoint);
            alert("Booking cancelled successfully. Your refund has been initiated.");
            fetchMyTrips(); 
        } catch (err) {
            console.error("Cancellation failed:", err);
            alert(err.response?.data || "Failed to cancel booking. Please try again.");
        }
    }

    return(
        <>
        <Navbar/>
        <div className="my-trips-page">
            
            <div className="trips-hero-section">
                <div className="trips-hero-overlay">
                    <h1>My Journeys</h1>
                    <p>Manage your upcoming trips and review past adventures.</p>
                </div>
            </div>

            <div className="trips-container">
                {isLoading && <div className="loading-spinner">Loading your itineraries...</div>}
                {error && <div className="error-message">{error}</div>}

                {bookingsData && (
                    <>
                        <div className="bookings-nav-modern">
                            <button className={`nav-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Bookings</button>
                            <button className={`nav-tab ${activeTab === 'flight' ? 'active' : ''}`} onClick={() => setActiveTab('flight')}> Flights</button>
                            <button className={`nav-tab ${activeTab === 'train' ? 'active' : ''}`} onClick={() => setActiveTab('train')}> Trains</button>
                            <button className={`nav-tab ${activeTab === 'bus' ? 'active' : ''}`} onClick={() => setActiveTab('bus')}> Buses</button>
                            <button className={`nav-tab ${activeTab === 'hotel' ? 'active' : ''}`} onClick={() => setActiveTab('hotel')}> Hotels</button>
                        </div>

                        <div className="all-bookings-wrapper">

                            {(activeTab === 'all' || activeTab === 'flight') && bookingsData.flightBookings && bookingsData.flightBookings.length > 0 && (
                                <div className="booking-category-section">
                                    <div className='category-header'>
                                        <h3 className="category-title">Flight Bookings</h3>
                                    </div>
                                    <div className="modern-bookings-grid">
                                        {bookingsData.flightBookings.map((flight)=>(
                                            <div key={flight.id} className="modern-trip-card border-flight">
                                                <div className="trip-card-header">
                                                    <div className="trip-id-block">
                                                        <span className="label">Flight</span>
                                                        <span className="id-number">{flight.flightNumber}</span>
                                                    </div>
                                                    <span className={`trip-status-badge ${flight.status === 'CANCELLED' ? 'cancelled' : 'confirmed'}`}>
                                                        {flight.status}
                                                    </span>
                                                </div>
                                                
                                                <div className="trip-route-timeline">
                                                    <div className="timeline-point"><span className="station">{flight.source}</span></div>
                                                    <div className="timeline-divider"><div className="line"></div><span className="duration-badge">➔</span><div className="line"></div></div>
                                                    <div className="timeline-point text-right"><span className="station">{flight.destination}</span></div>
                                                </div>

                                                <div className="trip-details-row">
                                                    <div className="detail-item"><span>Seats</span><strong>{flight.numberOfSeatsBooked}</strong></div>
                                                    <div className="detail-item"><span>Booked On</span><strong>{new Date(flight.bookingDate).toLocaleDateString()}</strong></div>
                                                    <div className="detail-item text-right"><span>Total Paid</span><strong className="price-text">₹{flight.totalAmountPaid}</strong></div>
                                                </div>

                                                <div className="trip-card-actions">
                                                    <button className="btn-cancel-modern" onClick={() => handleCancelBooking('flight', flight.id)} disabled={flight.status === 'CANCELLED'}>
                                                        {flight.status === 'CANCELLED' ? 'Cancelled' : 'Cancel Trip'}
                                                    </button>
                                                    <button className="btn-book-modern bg-blue" onClick={() => handleBookAgain('flight')}>Book Again</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(activeTab === 'all' || activeTab === 'train') && bookingsData.trainBookings && bookingsData.trainBookings.length > 0 && (
                                <div className="booking-category-section">
                                    <div className='category-header'>
                                        <h3 className="category-title">Train Bookings</h3>
                                    </div>
                                    <div className="modern-bookings-grid">
                                        {bookingsData.trainBookings.map((train) => (
                                            <div key={train.id} className="modern-trip-card border-train">
                                                <div className="trip-card-header">
                                                    <div className="trip-id-block">
                                                        <span className="label">Train</span>
                                                        <span className="id-number">{train.trainNumber}</span>
                                                    </div>
                                                    <span className={`trip-status-badge ${train.status === 'CANCELLED' ? 'cancelled' : 'confirmed'}`}>
                                                        {train.status}
                                                    </span>
                                                </div>
                                                    
                                                <div className="trip-route-timeline">
                                                    <div className="timeline-point"><span className="station">{train.source}</span></div>
                                                    <div className="timeline-divider"><div className="line"></div><span className="duration-badge">➔</span><div className="line"></div></div>
                                                    <div className="timeline-point text-right"><span className="station">{train.destination}</span></div>
                                                </div>

                                                <div className="trip-details-row">
                                                    <div className="detail-item"><span>Seats</span><strong>{train.numberOfSeatsBooked}</strong></div>
                                                    <div className="detail-item"><span>Booked On</span><strong>{new Date(train.bookingDate).toLocaleDateString()}</strong></div>
                                                    <div className="detail-item text-right"><span>Total Paid</span><strong className="price-text">₹{train.totalAmountPaid}</strong></div>
                                                </div>

                                                <div className="trip-card-actions">
                                                    <button className="btn-cancel-modern" onClick={() => handleCancelBooking('train', train.id)} disabled={train.status === 'CANCELLED'}>
                                                        {train.status === 'CANCELLED' ? 'Cancelled' : 'Cancel Ticket'}
                                                    </button>
                                                    <button className="btn-book-modern bg-navy" onClick={() => handleBookAgain('train')}>Book Again</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(activeTab === 'all' || activeTab === 'bus') && bookingsData.busBookings && bookingsData.busBookings.length > 0 && (
                                <div className="booking-category-section">
                                    <div className='category-header'>
                                        <h3 className="category-title">Bus Bookings</h3>
                                    </div>
                                    <div className="modern-bookings-grid">
                                        {bookingsData.busBookings.map((bus) => (
                                            <div key={bus.id} className="modern-trip-card border-bus">
                                                <div className="trip-card-header">
                                                    <div className="trip-id-block">
                                                        <span className="label">Bus</span>
                                                        <span className="id-number">{bus.busNumber}</span>
                                                    </div>
                                                    <span className={`trip-status-badge ${bus.status === 'CANCELLED' ? 'cancelled' : 'confirmed'}`}>
                                                        {bus.status}
                                                    </span>
                                                </div>
                                                    
                                                <div className="trip-route-timeline">
                                                    <div className="timeline-point"><span className="station">{bus.source}</span></div>
                                                    <div className="timeline-divider"><div className="line"></div><span className="duration-badge">➔</span><div className="line"></div></div>
                                                    <div className="timeline-point text-right"><span className="station">{bus.destination}</span></div>
                                                </div>

                                                <div className="trip-details-row">
                                                    <div className="detail-item"><span>Seats</span><strong>{bus.numberOfSeatsBooked}</strong></div>
                                                    <div className="detail-item"><span>Booked On</span><strong>{new Date(bus.bookingDate).toLocaleDateString()}</strong></div>
                                                    <div className="detail-item text-right"><span>Total Paid</span><strong className="price-text">₹{bus.totalAmountPaid}</strong></div>
                                                </div>

                                                <div className="trip-card-actions">
                                                    <button className="btn-cancel-modern" onClick={() => handleCancelBooking('bus', bus.id)} disabled={bus.status === 'CANCELLED'}>
                                                        {bus.status === 'CANCELLED' ? 'Cancelled' : 'Cancel Ticket'}
                                                    </button>
                                                    <button className="btn-book-modern bg-teal" onClick={() => handleBookAgain('bus')}>Book Again</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(activeTab === 'all' || activeTab === 'hotel') && bookingsData.hotelBookings && bookingsData.hotelBookings.length > 0 && (
                                <div className="booking-category-section">
                                    <div className='category-header'>
                                        <h3 className="category-title">Hotel Bookings</h3>
                                    </div>
                                    <div className="modern-bookings-grid">
                                        {bookingsData.hotelBookings.map((hotel)=>(
                                            <div key={hotel.id} className="modern-trip-card border-hotel">
                                                <div className="trip-card-header">
                                                    <div className="trip-id-block">
                                                        <span className="label">Hotel</span>
                                                        <span className="id-number">{hotel.hotelName}</span>
                                                    </div>
                                                    <span className={`trip-status-badge ${hotel.status === 'CANCELLED' ? 'cancelled' : 'confirmed'}`}>
                                                        {hotel.status}
                                                    </span>
                                                </div>
                                                
                                                <div className="trip-route-timeline">
                                                    <div className="timeline-point">
                                                        <span className="date-sub">CHECK-IN</span>
                                                        <span className="station">{hotel.checkInDate}</span>
                                                    </div>
                                                    <div className="timeline-divider"><div className="line"></div><span className="duration-badge">➔</span><div className="line"></div></div>
                                                    <div className="timeline-point text-right">
                                                        <span className="date-sub">CHECK-OUT</span>
                                                        <span className="station">{hotel.checkOutDate}</span>
                                                    </div>
                                                </div>

                                                <div className="trip-details-row">
                                                    <div className="detail-item"><span>Room</span><strong>{hotel.roomType} (x{hotel.numberOfRooms})</strong></div>
                                                    <div className="detail-item"><span>Booked On</span><strong>{new Date(hotel.bookingDate).toLocaleDateString()}</strong></div>
                                                    <div className="detail-item text-right"><span>Total Paid</span><strong className="price-text">₹{hotel.totalAmount}</strong></div>
                                                </div>
                                                
                                                <div className="trip-card-actions">
                                                    <button className="btn-cancel-modern" onClick={() => handleCancelBooking('hotel', hotel.id)} disabled={hotel.status === 'CANCELLED'}>
                                                        {hotel.status === 'CANCELLED' ? 'Cancelled' : 'Cancel Room'}
                                                    </button>
                                                    <button className="btn-book-modern bg-indigo" onClick={() => handleBookAgain('hotel')}>Book Again</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(!bookingsData.flightBookings?.length && !bookingsData.trainBookings?.length && !bookingsData.busBookings?.length && !bookingsData.hotelBookings?.length) && (
                                <div className="empty-state">
                                    <p>You don't have any bookings yet. Start planning your next trip!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
        </>
    )
}