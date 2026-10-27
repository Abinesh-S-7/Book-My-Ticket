import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './AdminBuses.css'; 
import bus from '../../assets/bus.png'

function AdminBuses() {

    const [buses, setBuses] = useState([]);
    const [filteredBuses, setFilteredBuses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isCreating, setIsCreating] = useState(false);


    const [searchSource, setSearchSource] = useState('');
    const [searchDestination, setSearchDestination] = useState('');
    const [searchDate, setSearchDate] = useState('');


    const [formData, setFormData] = useState({
        busNumber: '', operatorName: '', busType: '', source: '', destination: '', 
        departureTime: '', arrivalTime: '', price: '', totalSeats: ''
    });

    const [boardingPoints, setBoardingPoints] = useState([]);
    const [droppingPoints, setDroppingPoints] = useState([]);
    
    const [isBoardingModalOpen, setIsBoardingModalOpen] = useState(false);
    const [isDroppingModalOpen, setIsDroppingModalOpen] = useState(false);
    
    const [pointForm, setPointForm] = useState({ location: '', time: '' });

    useEffect(() => {
        fetchAllBuses();
    }, []);

    async function fetchAllBuses() {
        try {
            const response = await api.get('/buses/all');
            setBuses(response.data);
            setFilteredBuses(response.data);
        } catch (err) {
            console.error("Failed to fetch buses.", err);
        }
    }

    function handleSearch() {
        const result = buses.filter(b => {
            const matchSource = searchSource ? b.source.toLowerCase().includes(searchSource.toLowerCase()) : true;
            const matchDest = searchDestination ? b.destination.toLowerCase().includes(searchDestination.toLowerCase()) : true;
            let matchDate = true;
            if (searchDate) {
                const busDate = b.departureTime.split('T')[0];
                matchDate = busDate === searchDate;
            }
            return matchSource && matchDest && matchDate;
        });
        setFilteredBuses(result);
    }

    function clearSearch() {
        setSearchSource('');
        setSearchDestination('');
        setSearchDate('');
        setFilteredBuses(buses);
    }

    function handleMainFormChange(e) { setFormData({ ...formData, [e.target.name]: e.target.value }); }
    function handlePointFormChange(e) { setPointForm({ ...pointForm, [e.target.name]: e.target.value }); }

    function handleAddBoardingPoint() {
        if (!pointForm.location || !pointForm.time) {
            alert("Location and Time are required.");
            return;
        }
        setBoardingPoints([...boardingPoints, { ...pointForm }]);
        setIsBoardingModalOpen(false);
        setPointForm({ location: '', time: '' });
    }

    function handleAddDroppingPoint() {
        if (!pointForm.location || !pointForm.time) {
            alert("Location and Time are required.");
            return;
        }
        setDroppingPoints([...droppingPoints, { ...pointForm }]);
        setIsDroppingModalOpen(false);
        setPointForm({ location: '', time: '' });
    }

    async function handleCreateBus(e) {
        e.preventDefault();

        const busDep = new Date(formData.departureTime);
        const busArr = new Date(formData.arrivalTime);
        if (busArr <= busDep) {
            alert("Error: Final Arrival Time must be strictly after the Origin Departure Time.");
            return;
        }

        setIsLoading(true);

        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            totalSeats: parseInt(formData.totalSeats),
            boardingPoints: boardingPoints,
            droppingPoints: droppingPoints
        };

        try {
            await api.post('/buses/add', payload);
            alert("Bus created successfully!");
            setFormData({ busNumber: '', operatorName: '', busType: '', source: '', destination: '', departureTime: '', arrivalTime: '', price: '', totalSeats: '' });
            setBoardingPoints([]);
            setDroppingPoints([]);
            setIsCreating(false);
            fetchAllBuses();
        } catch (err) {
            console.error(err);
            alert("Failed to create bus.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(busId) {
        if(!window.confirm("Are you sure you want to delete this bus?")) return;
        try {
            await api.delete(`/buses/delete/${busId}`);
            fetchAllBuses();
        } catch(err) {
            console.error(err);
            alert("Failed to delete bus.");
        }
    }

    return (
        <div className="admin-module-container">
            <div className="admin-top-bar">
                <img src={bus} alt="" />
                <h3>{isCreating ? 'Create New Bus' : 'Manage Buses'}</h3>
                {!isCreating ? (
                    <button className="btn-primary-action" onClick={() => setIsCreating(true)}>+ Add New Bus</button>
                ) : (
                    <button className="btn-secondary-action" onClick={() => setIsCreating(false)}>Back to Buses</button>
                )}
            </div>

            {isCreating && (
                <form onSubmit={handleCreateBus}>
                    <div className="admin-form-grid">
                        <div className="admin-input-group">
                            <label>Bus Number</label>
                            <input type="text" name="busNumber" value={formData.busNumber} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Operator Name</label>
                            <input type="text" name="operatorName" value={formData.operatorName} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Bus Type (e.g., AC Sleeper)</label>
                            <input type="text" name="busType" value={formData.busType} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Price per Seat (₹)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleMainFormChange} required />
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
                            <label>Origin Departure</label>
                            <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Final Arrival</label>
                            <input type="datetime-local" name="arrivalTime" value={formData.arrivalTime} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Total Seats</label>
                            <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleMainFormChange} required />
                        </div>
                    </div>

                    <div className="train-nested-grid">
                        <div className="nested-section">
                            <div className="points-section-header">
                                <h4>Boarding Points</h4>
                                <button type="button" className="btn-add-stop" onClick={() => setIsBoardingModalOpen(true)}>+ Add Point</button>
                            </div>
                            {boardingPoints.length > 0 && (
                                <ul className="stops-list">
                                    {boardingPoints.map((point, idx) => (
                                        <li key={idx}>
                                            <span><strong>{point.location}</strong> | {point.time.replace('T', ' ')}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="nested-section">
                            <div className="points-section-header">
                                <h4>Dropping Points</h4>
                                <button type="button" className="btn-add-stop" onClick={() => setIsDroppingModalOpen(true)}>+ Add Point</button>
                            </div>
                            {droppingPoints.length > 0 && (
                                <ul className="stops-list">
                                    {droppingPoints.map((point, idx) => (
                                        <li key={idx}>
                                            <span><strong>{point.location}</strong> | {point.time.replace('T', ' ')}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="btn-submit-form" disabled={isLoading}>
                        {isLoading ? "Creating Bus..." : "Create Bus"}
                    </button>
                </form>
            )}

            {!isCreating && (
                <>
                    <div className="admin-search-bar">
                        <div className="search-input-group">
                            <label>Source City</label>
                            <input type="text" placeholder="e.g. Bangalore" value={searchSource} onChange={e => setSearchSource(e.target.value)} />
                        </div>
                        <div className="search-input-group">
                            <label>Destination City</label>
                            <input type="text" placeholder="e.g. Chennai" value={searchDestination} onChange={e => setSearchDestination(e.target.value)} />
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
                                    <th>Bus Info</th>
                                    <th>Route</th>
                                    <th>Departure</th>
                                    <th>Price</th>
                                    <th>Seats (Avail/Total)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBuses.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.id}</td>
                                        <td><strong>{b.busNumber}</strong><br/>{b.operatorName} ({b.busType})</td>
                                        <td>{b.source} ➔ {b.destination}</td>
                                        <td>{new Date(b.departureTime).toLocaleString()}</td>
                                        <td>₹{b.price}</td>
                                        <td>{b.availableSeats} / {b.totalSeats}</td>
                                        <td>
                                            <button className="btn-delete" onClick={() => handleDelete(b.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredBuses.length === 0 && (
                                    <tr><td colSpan="7" className="text-center">No buses found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {(isBoardingModalOpen || isDroppingModalOpen) && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-content">
                        <h3>Add {isBoardingModalOpen ? 'Boarding' : 'Dropping'} Point</h3>
                        <div className="admin-input-group mb-10">
                            <label>Location / Landmark</label>
                            <input type="text" name="location" value={pointForm.location} onChange={handlePointFormChange} required />
                        </div>
                        <div className="admin-input-group mb-20">
                            <label>Time</label>
                            <input type="datetime-local" name="time" value={pointForm.time} onChange={handlePointFormChange} required />
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={() => { setIsBoardingModalOpen(false); setIsDroppingModalOpen(false); }}>Cancel</button>
                            <button type="button" className="btn-add-stop" onClick={isBoardingModalOpen ? handleAddBoardingPoint : handleAddDroppingPoint}>Save Point</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminBuses;