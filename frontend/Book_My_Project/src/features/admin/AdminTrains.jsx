import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './AdminTrains.css';
import train from '../../assets/train.png'

function AdminTrains() {

    const [trains, setTrains] = useState([]);
    const [filteredTrains, setFilteredTrains] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isCreating, setIsCreating] = useState(false);

    const [searchSource, setSearchSource] = useState('');
    const [searchDestination, setSearchDestination] = useState('');
    const [searchDate, setSearchDate] = useState('');

    const [formData, setFormData] = useState({
        trainNumber: '', trainName: '', source: '', destination: '', 
        departureTime: '', arrivalTime: ''
    });

    const [classes, setClasses] = useState([]);
    const [routes, setRoutes] = useState([]);

    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
    
    const [classForm, setClassForm] = useState({ className: '', totalSeats: '', price: '' });
    const [routeForm, setRouteForm] = useState({ stationName: '', arrivalTime: '', departureTime: '', stopOrder: 1 });

    useEffect(() => {
        fetchAllTrains();
    }, []);

    async function fetchAllTrains() {
        try {
            const response = await api.get('api/trains/all');
            setTrains(response.data);
            setFilteredTrains(response.data);
        } catch (err) {
            console.error("Failed to fetch trains.", err);
        }
    }

    function handleSearch() {
        const result = trains.filter(t => {
            const matchSource = searchSource ? t.source.toLowerCase().includes(searchSource.toLowerCase()) : true;
            const matchDest = searchDestination ? t.destination.toLowerCase().includes(searchDestination.toLowerCase()) : true;
            let matchDate = true;
            if (searchDate) {
                const trainDate = t.departureTime.split('T')[0];
                matchDate = trainDate === searchDate;
            }
            return matchSource && matchDest && matchDate;
        });
        setFilteredTrains(result);
    }

    function clearSearch() {
        setSearchSource('');
        setSearchDestination('');
        setSearchDate('');
        setFilteredTrains(trains);
    }

    function handleMainFormChange(e) { setFormData({ ...formData, [e.target.name]: e.target.value }); }
    function handleClassFormChange(e) { setClassForm({ ...classForm, [e.target.name]: e.target.value }); }
    function handleRouteFormChange(e) { setRouteForm({ ...routeForm, [e.target.name]: e.target.value }); }

    function handleAddClass() {
        setClasses([...classes, { 
            className: classForm.className, 
            totalSeats: parseInt(classForm.totalSeats), 
            price: parseFloat(classForm.price) 
        }]);
        setIsClassModalOpen(false);
        setClassForm({ className: '', totalSeats: '', price: '' });
    }

    function handleAddRoute() {

        if (!formData.departureTime || !formData.arrivalTime) {
            alert("Please set the train's main Departure and Arrival times first.");
            return;
        }

        const trainDep = new Date(formData.departureTime);
        const trainArr = new Date(formData.arrivalTime);
        const routeArr = new Date(routeForm.arrivalTime);
        const routeDep = new Date(routeForm.departureTime);

        if (routeArr >= routeDep) {
            alert("Station Arrival Time must be before Station Departure Time.");
            return;
        }
        if (routeArr <= trainDep || routeArr >= trainArr || routeDep <= trainDep || routeDep >= trainArr) {
            alert("Station times must fall strictly between the Train's origin departure and final arrival times.");
            return;
        }

        setRoutes([...routes, { ...routeForm, stopOrder: parseInt(routeForm.stopOrder) }]);
        setIsRouteModalOpen(false);
        setRouteForm({ stationName: '', arrivalTime: '', departureTime: '', stopOrder: routes.length + 2 });
    }

    async function handleCreateTrain(e) {
        e.preventDefault();

        if (classes.length === 0) {
            alert("You must add at least one Train Class (e.g., Sleeper, AC).");
            return;
        }

        const trainDep = new Date(formData.departureTime);
        const trainArr = new Date(formData.arrivalTime);
        if (trainArr <= trainDep) {
            alert("Error: Final Arrival Time must be strictly after the Origin Departure Time.");
            return;
        }

        setIsLoading(true);

        const payload = {
            ...formData,
            classes: classes,
            routes: routes
        };

        try {
            await api.post('api/trains/add', payload);
            alert("Train created successfully!");
            setFormData({ trainNumber: '', trainName: '', source: '', destination: '', departureTime: '', arrivalTime: '' });
            setClasses([]);
            setRoutes([]);
            setIsCreating(false);
            fetchAllTrains();
        } catch (err) {
            console.error(err);
            alert("Failed to create train.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(trainId) {
        if(!window.confirm("Are you sure you want to delete this train?")) return;
        try {
            await api.delete(`api/trains/delete/${trainId}`);
            fetchAllTrains();
        } catch(err) {
            console.error(err);
            alert("Failed to delete train.");
        }
    }

    return (
        <div className="admin-module-container">

            <div className="admin-top-bar">
                <img src={train} alt="" />
                <h3>{isCreating ? 'Create New Train' : 'Manage Trains'}</h3>
                {!isCreating ? (
                    <button className="btn-primary-action" onClick={() => setIsCreating(true)}>+ Add New Train</button>
                ) : (
                    <button className="btn-secondary-action" onClick={() => setIsCreating(false)}>Back to Trains</button>
                )}
            </div>

            {isCreating && (
                <form onSubmit={handleCreateTrain}>
                    <div className="admin-form-grid">
                        <div className="admin-input-group">
                            <label>Train Number</label>
                            <input type="text" name="trainNumber" value={formData.trainNumber} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Train Name</label>
                            <input type="text" name="trainName" value={formData.trainName} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Source Station</label>
                            <input type="text" name="source" value={formData.source} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Destination Station</label>
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
                    </div>

                    <div className="train-nested-grid">
                        <div className="nested-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ margin: 0 }}>Train Classes</h4>
                                <button type="button" className="btn-add-stop" onClick={() => setIsClassModalOpen(true)}>+ Add Class</button>
                            </div>
                            {classes.length > 0 && (
                                <ul className="stops-list">
                                    {classes.map((cls, idx) => (
                                        <li key={idx}>
                                            <span><strong>{cls.className}</strong> | {cls.totalSeats} Seats | ₹{cls.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="nested-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ margin: 0 }}>Route Stations</h4>
                                <button type="button" className="btn-add-stop" onClick={() => setIsRouteModalOpen(true)}>+ Add Station</button>
                            </div>
                            {routes.length > 0 && (
                                <ul className="stops-list">
                                    {routes.map((route, idx) => (
                                        <li key={idx}>
                                            <span><strong>{route.stopOrder}. {route.stationName}</strong> (Arr: {route.arrivalTime.replace('T', ' ')} | Dep: {route.departureTime.replace('T', ' ')})</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="btn-submit-form" disabled={isLoading}>
                        {isLoading ? "Creating Train..." : "Create Train"}
                    </button>
                </form>
            )}

            {!isCreating && (
                <>
                    <div className="admin-search-bar">
                        <div className="search-input-group">
                            <label>Source Station</label>
                            <input type="text" placeholder="e.g. Mumbai" value={searchSource} onChange={e => setSearchSource(e.target.value)} />
                        </div>
                        <div className="search-input-group">
                            <label>Destination Station</label>
                            <input type="text" placeholder="e.g. Pune" value={searchDestination} onChange={e => setSearchDestination(e.target.value)} />
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
                                    <th>Train No. & Name</th>
                                    <th>Route</th>
                                    <th>Departure</th>
                                    <th>Classes Configured</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrains.map(t => (
                                    <tr key={t.id}>
                                        <td>{t.id}</td>
                                        <td><strong>{t.trainNumber}</strong> - {t.trainName}</td>
                                        <td>{t.source} ➔ {t.destination}</td>
                                        <td>{new Date(t.departureTime).toLocaleString()}</td>
                                        <td>
                                            {t.classes && t.classes.map(c => (
                                                <span key={c.id} style={{display: 'inline-block', background: '#e0f7fa', padding: '2px 6px', margin: '2px', borderRadius: '4px', fontSize: '12px'}}>
                                                    {c.className} (₹{c.price})
                                                </span>
                                            ))}
                                        </td>
                                        <td>
                                            <button className="btn-delete" onClick={() => handleDelete(t.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTrains.length === 0 && (
                                    <tr><td colSpan="6" style={{ textAlign: 'center' }}>No trains found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {isClassModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-content">
                        <h3>Add Train Class</h3>
                        <div className="admin-input-group" style={{ marginBottom: '10px' }}>
                            <label>Class Name (e.g., Sleeper, 3A)</label>
                            <input type="text" name="className" value={classForm.className} onChange={handleClassFormChange} />
                        </div>
                        <div className="admin-input-group" style={{ marginBottom: '10px' }}>
                            <label>Total Seats</label>
                            <input type="number" name="totalSeats" value={classForm.totalSeats} onChange={handleClassFormChange} />
                        </div>
                        <div className="admin-input-group" style={{ marginBottom: '20px' }}>
                            <label>Price (₹)</label>
                            <input type="number" name="price" value={classForm.price} onChange={handleClassFormChange} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setIsClassModalOpen(false)} style={{ padding: '8px 15px' }}>Cancel</button>
                            <button type="button" className="btn-add-stop" onClick={handleAddClass}>Save Class</button>
                        </div>
                    </div>
                </div>
            )}

            {isRouteModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-content">
                        <h3>Add Route Station</h3>
                        <div className="admin-input-group" style={{ marginBottom: '10px' }}>
                            <label>Station Name</label>
                            <input type="text" name="stationName" value={routeForm.stationName} onChange={handleRouteFormChange} />
                        </div>
                        <div className="admin-input-group" style={{ marginBottom: '10px' }}>
                            <label>Arrival Time</label>
                            <input type="datetime-local" name="arrivalTime" value={routeForm.arrivalTime} onChange={handleRouteFormChange} />
                        </div>
                        <div className="admin-input-group" style={{ marginBottom: '10px' }}>
                            <label>Departure Time</label>
                            <input type="datetime-local" name="departureTime" value={routeForm.departureTime} onChange={handleRouteFormChange} />
                        </div>
                        <div className="admin-input-group" style={{ marginBottom: '20px' }}>
                            <label>Stop Order (e.g., 1, 2)</label>
                            <input type="number" name="stopOrder" value={routeForm.stopOrder} onChange={handleRouteFormChange} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setIsRouteModalOpen(false)} style={{ padding: '8px 15px' }}>Cancel</button>
                            <button type="button" className="btn-add-stop" onClick={handleAddRoute}>Save Station</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminTrains;