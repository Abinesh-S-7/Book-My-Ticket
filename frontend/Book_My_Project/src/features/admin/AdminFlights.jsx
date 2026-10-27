import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './AdminFlights.css';
import plane from '../../assets/aeroplane.png'
function AdminFlights() {

    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isCreating, setIsCreating] = useState(false);

    const [searchSource, setSearchSource] = useState('');
    const [searchDestination, setSearchDestination] = useState('');
    const [searchDate, setSearchDate] = useState('');

    const [formData, setFormData] = useState({
        flightNumber: '', airlineName: '', source: '', destination: '', 
        departureTime: '', arrivalTime: '', price: '', totalSeats: ''
    });

    const [stops, setStops] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stopForm, setStopForm] = useState({ city: '', arrivalTime: '', departureTime: '', stopOrder: 1 });

    useEffect(() => {
        fetchAllFlights();
    }, []);

    async function fetchAllFlights() {
        try {
            const response = await api.get('/flights/all');
            setFlights(response.data);
            setFilteredFlights(response.data);
        } catch (err) {
            console.error("Failed to fetch flights.", err);
        }
    }

    function handleSearch() {
        const result = flights.filter(f => {
            const matchSource = searchSource ? f.source.toLowerCase().includes(searchSource.toLowerCase()) : true;
            const matchDest = searchDestination ? f.destination.toLowerCase().includes(searchDestination.toLowerCase()) : true;
            
            let matchDate = true;
            if (searchDate) {
                const flightDate = f.departureTime.split('T')[0];
                matchDate = flightDate === searchDate;
            }

            return matchSource && matchDest && matchDate;
        });
        setFilteredFlights(result);
    }

    function clearSearch() {
        setSearchSource('');
        setSearchDestination('');
        setSearchDate('');
        setFilteredFlights(flights);
    }

    function handleMainFormChange(e) { setFormData({ ...formData, [e.target.name]: e.target.value }); }
    function handleStopFormChange(e) { setStopForm({ ...stopForm, [e.target.name]: e.target.value }); }

    function handleAddStop() {

        if (!formData.departureTime || !formData.arrivalTime) {
            alert("Please set the flight's main Departure and Arrival times before adding stops.");
            return;
        }

        const flightDep = new Date(formData.departureTime);
        const flightArr = new Date(formData.arrivalTime);
        const stopArr = new Date(stopForm.arrivalTime);
        const stopDep = new Date(stopForm.departureTime);


        if (stopArr >= stopDep) {
            alert("Stop Arrival Time must be before Stop Departure Time.");
            return;
        }

        if (stopArr <= flightDep || stopArr >= flightArr) {
            alert("Stop Arrival Time must be between the flight's overall departure and arrival times.");
            return;
        }
        if (stopDep <= flightDep || stopDep >= flightArr) {
            alert("Stop Departure Time must be between the flight's overall departure and arrival times.");
            return;
        }

        setStops([...stops, { ...stopForm, stopOrder: parseInt(stopForm.stopOrder) }]);
        setIsModalOpen(false);
        setStopForm({ city: '', arrivalTime: '', departureTime: '', stopOrder: stops.length + 2 });
    }

    async function handleCreateFlight(e) {
        e.preventDefault();

        const flightDep = new Date(formData.departureTime);
        const flightArr = new Date(formData.arrivalTime);

        if (flightArr <= flightDep) {
            alert("Error: Flight Arrival Time must be strictly after the Departure Time.");
            return;
        }

        setIsLoading(true);

        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            totalSeats: parseInt(formData.totalSeats),
            stops: stops
        };

        try {
            await api.post('/flights/add', payload);
            alert("Flight created successfully!");
            setFormData({ flightNumber: '', airlineName: '', source: '', destination: '', departureTime: '', arrivalTime: '', price: '', totalSeats: '' });
            setStops([]);
            setIsCreating(false);
            fetchAllFlights();
        } catch (err) {
            console.error(err);
            alert("Failed to create flight.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(flightId) {
        if(!window.confirm("Are you sure you want to delete this flight?")) return;
        try {
            await api.delete(`/flights/delete/${flightId}`);
            fetchAllFlights();
        } catch(err) {
            console.error(err);
            alert("Failed to delete flight.");
        }
    }

    return (
        <div className="admin-module-container">
            <div className="admin-top-bar">
                <img src={plane} alt="AeroPlane Image" />
                <h3>{isCreating ? 'Create New Flight' : 'Manage Flights'}</h3>
                {!isCreating ? (
                    <button className="btn-primary-action" onClick={() => setIsCreating(true)}>+ Add New Flight</button>
                ) : (
                    <button className="btn-secondary-action" onClick={() => setIsCreating(false)}>Back to Flights</button>
                )}
            </div>

            {isCreating && (
                <form onSubmit={handleCreateFlight}>
                    <div className="admin-form-grid">
                        <div className="admin-input-group">
                            <label>Flight Number</label>
                            <input type="text" name="flightNumber" value={formData.flightNumber} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Airline Name</label>
                            <input type="text" name="airlineName" value={formData.airlineName} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Source City</label>
                            <input type="text" name="source" value={formData.source} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Destination City</label>
                            <input type="text" name="destination" value={formData.destination} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Departure Time</label>
                            <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Arrival Time</label>
                            <input type="datetime-local" name="arrivalTime" value={formData.arrivalTime} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Price (₹)</label>
                            <input type="number" name="price" min="1" value={formData.price} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Total Seats</label>
                            <input type="number" name="totalSeats" min="1" value={formData.totalSeats} onChange={handleMainFormChange} required />
                        </div>
                    </div>

                    <div className="stops-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0 }}>Intermediate Stops</h4>
                            <button type="button" className="btn-add-stop" onClick={() => setIsModalOpen(true)}>+ Add Stop</button>
                        </div>
                        {stops.length > 0 && (
                            <ul className="stops-list">
                                {stops.map((stop, idx) => (
                                    <li key={idx}>
                                        <span><strong>{stop.stopOrder}. {stop.city}</strong> (Arr: {stop.arrivalTime.replace('T', ' ')} | Dep: {stop.departureTime.replace('T', ' ')})</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button type="submit" className="btn-submit-form" disabled={isLoading}>
                        {isLoading ? "Creating Flight..." : "Create Flight"}
                    </button>
                </form>
            )}

            {!isCreating && (
                <>
                    <div className="admin-search-bar">
                        <div className="search-input-group">
                            <label>Source City</label>
                            <input type="text" placeholder="e.g. Chennai" value={searchSource} onChange={e => setSearchSource(e.target.value)} />
                        </div>
                        <div className="search-input-group">
                            <label>Destination City</label>
                            <input type="text" placeholder="e.g. Delhi" value={searchDestination} onChange={e => setSearchDestination(e.target.value)} />
                        </div>
                        <div className="search-input-group">
                            <label>Departure Date</label>
                            <input type="date" value={searchDate} onChange={e => setSearchDate(e.target.value)} />
                        </div>
                        <button className="btn-search" onClick={handleSearch}>Search</button>
                        <button className="btn-clear" onClick={clearSearch}>Clear</button>
                    </div>

                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Flight No.</th>
                                    <th>Airline</th>
                                    <th>Route</th>
                                    <th>Departure</th>
                                    <th>Price</th>
                                    <th>Seats (Avail/Total)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFlights.map(f => (
                                    <tr key={f.id}>
                                        <td>{f.id}</td>
                                        <td>{f.flightNumber}</td>
                                        <td>{f.airlineName}</td>
                                        <td>{f.source} ➔ {f.destination}</td>
                                        <td>{new Date(f.departureTime).toLocaleString()}</td>
                                        <td>₹{f.price}</td>
                                        <td>{f.availableSeats} / {f.totalSeats}</td>
                                        <td>
                                            <button className="btn-delete" onClick={() => handleDelete(f.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredFlights.length === 0 && (
                                    <tr><td colSpan="8" style={{ textAlign: 'center' }}>No flights found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-content">
                        <h3>Add Intermediate Stop</h3>
                        <div className="admin-input-group" style={{ marginBottom: '10px' }}>
                            <label>City</label>
                            <input type="text" name="city" value={stopForm.city} onChange={handleStopFormChange} />
                        </div>
                        <div className="admin-input-group" style={{ marginBottom: '10px' }}>
                            <label>Arrival Time</label>
                            <input type="datetime-local" name="arrivalTime" value={stopForm.arrivalTime} onChange={handleStopFormChange} />
                        </div>
                        <div className="admin-input-group" style={{ marginBottom: '10px' }}>
                            <label>Departure Time</label>
                            <input type="datetime-local" name="departureTime" value={stopForm.departureTime} onChange={handleStopFormChange} />
                        </div>
                        <div className="admin-input-group" style={{ marginBottom: '20px' }}>
                            <label>Stop Order (e.g., 1, 2)</label>
                            <input type="number" name="stopOrder" value={stopForm.stopOrder} onChange={handleStopFormChange} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 15px' }}>Cancel</button>
                            <button type="button" className="btn-add-stop" onClick={handleAddStop}>Save Stop</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminFlights;