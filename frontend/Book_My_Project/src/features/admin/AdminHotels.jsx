import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './AdminHotels.css';
import hotel from '../../assets/hotel.png'


function AdminHotels() {

    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isCreating, setIsCreating] = useState(false);

    const [searchCity, setSearchCity] = useState('');

    const [formData, setFormData] = useState({
        name: '', city: '', address: '', starRating: '', description: ''
    });

    const [rooms, setRooms] = useState([]);
    
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [roomForm, setRoomForm] = useState({ roomType: '', maxOccupancy: '', totalRooms: '' });
    
    const [currentRoomInventories, setCurrentRoomInventories] = useState([]);
    const [inventoryForm, setInventoryForm] = useState({ date: '', price: '' });

    const [bulkStartDate, setBulkStartDate] = useState('');
    const [bulkEndDate, setBulkEndDate] = useState('');
    const [bulkPrice, setBulkPrice] = useState('');

    useEffect(() => {
        fetchAllHotels();
    }, []);

    async function fetchAllHotels() {
        try {
            const response = await api.get('api/hotels/all');
            setHotels(response.data);
            setFilteredHotels(response.data);
        } catch (err) {
            console.error("Failed to fetch hotels.", err);
        }
    }

    function handleSearch() {
        const result = hotels.filter(h => {
            return searchCity ? h.city.toLowerCase().includes(searchCity.toLowerCase()) : true;
        });
        setFilteredHotels(result);
    }

    function clearSearch() {
        setSearchCity('');
        setFilteredHotels(hotels);
    }

    function handleMainFormChange(e) { setFormData({ ...formData, [e.target.name]: e.target.value }); }
    function handleRoomFormChange(e) { setRoomForm({ ...roomForm, [e.target.name]: e.target.value }); }
    function handleInventoryFormChange(e) { setInventoryForm({ ...inventoryForm, [e.target.name]: e.target.value }); }

    function handleBulkGenerate() {
        if (!bulkStartDate || !bulkEndDate || !bulkPrice) {
            alert("Please provide Start Date, End Date, and Base Price.");
            return;
        }

        const start = new Date(bulkStartDate);
        const end = new Date(bulkEndDate);

        if (end < start) {
            alert("End Date must be after Start Date.");
            return;
        }

        const newInventories = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
            const formattedDate = currentDate.toISOString().split('T')[0];
            
            if (!currentRoomInventories.some(inv => inv.date === formattedDate)) {
                newInventories.push({
                    date: formattedDate,
                    price: parseFloat(bulkPrice)
                });
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }

        setCurrentRoomInventories([...currentRoomInventories, ...newInventories]);
        setBulkStartDate('');
        setBulkEndDate('');
        setBulkPrice('');
    }

    function handleAddInventoryToRoom() {
        if (!inventoryForm.date || !inventoryForm.price) {
            alert("Date and Price are required for the inventory.");
            return;
        }
        
        if (currentRoomInventories.some(inv => inv.date === inventoryForm.date)) {
            alert("Inventory for this date already exists for this room.");
            return;
        }

        setCurrentRoomInventories([...currentRoomInventories, { 
            date: inventoryForm.date, 
            price: parseFloat(inventoryForm.price) 
        }]);
        setInventoryForm({ date: '', price: '' });
    }

    function handleSaveRoom() {
        if (!roomForm.roomType || !roomForm.maxOccupancy || !roomForm.totalRooms) {
            alert("Room Type, Max Occupancy, and Total Rooms are required.");
            return;
        }
        if (currentRoomInventories.length === 0) {
            alert("Please add at least one inventory date/price for this room.");
            return;
        }

        setRooms([...rooms, { 
            roomType: roomForm.roomType,
            maxOccupancy: parseInt(roomForm.maxOccupancy),
            totalRooms: parseInt(roomForm.totalRooms),
            inventories: currentRoomInventories
        }]);
        
        setIsRoomModalOpen(false);
        setRoomForm({ roomType: '', maxOccupancy: '', totalRooms: '' });
        setCurrentRoomInventories([]);
    }

    function openRoomModal() {
        setRoomForm({ roomType: '', maxOccupancy: '', totalRooms: '' });
        setCurrentRoomInventories([]);
        setBulkStartDate('');
        setBulkEndDate('');
        setBulkPrice('');
        setIsRoomModalOpen(true);
    }

    async function handleCreateHotel(e) {
        e.preventDefault();

        if (rooms.length === 0) {
            alert("You must add at least one Room configuration.");
            return;
        }

        setIsLoading(true);

        const payload = {
            ...formData,
            starRating: parseInt(formData.starRating),
            rooms: rooms
        };

        try {
            await api.post('api/hotels/add', payload);
            alert("Hotel created successfully!");
            setFormData({ name: '', city: '', address: '', starRating: '', description: '' });
            setRooms([]);
            setIsCreating(false);
            fetchAllHotels();
        } catch (err) {
            console.error(err);
            alert("Failed to create hotel.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(hotelId) {
        if(!window.confirm("Are you sure you want to delete this hotel?")) return;
        try {
            await api.delete(`api/hotels/delete/${hotelId}`);
            fetchAllHotels();
        } catch(err) {
            console.error(err);
            alert("Failed to delete hotel.");
        }
    }

    return (
        <div className="admin-module-container">
            <div className="admin-top-bar">
                <img src={hotel} alt="" />
                <h3>{isCreating ? 'Create New Hotel' : 'Manage Hotels'}</h3>
                {!isCreating ? (
                    <button className="btn-primary-action" onClick={() => setIsCreating(true)}>+ Add New Hotel</button>
                ) : (
                    <button className="btn-secondary-action" onClick={() => setIsCreating(false)}>Back to Hotels</button>
                )}
            </div>

            {isCreating && (
                <form onSubmit={handleCreateHotel}>
                    <div className="admin-form-grid">
                        <div className="admin-input-group">
                            <label>Hotel Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Star Rating (1-5)</label>
                            <input type="number" name="starRating" min="1" max="5" value={formData.starRating} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group">
                            <label>Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleMainFormChange} required />
                        </div>
                        <div className="admin-input-group span-2">
                            <label>Description</label>
                            <input type="text" name="description" value={formData.description} onChange={handleMainFormChange} required />
                        </div>
                    </div>

                    <div className="stops-section">
                        <div className="stops-section-header">
                            <h4>Hotel Rooms & Inventory</h4>
                            <button type="button" className="btn-add-stop" onClick={openRoomModal}>+ Add Room Config</button>
                        </div>
                        {rooms.length > 0 && (
                            <ul className="stops-list">
                                {rooms.map((room, idx) => (
                                    <li key={idx} className="stops-list-item-column">
                                        <div className="room-info-primary">
                                            <strong>{room.roomType}</strong> | Max Occ: {room.maxOccupancy} | Total Rooms: {room.totalRooms}
                                        </div>
                                        <div className="room-info-secondary">
                                            Total Configured Dates: {room.inventories.length} days
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button type="submit" className="btn-submit-form" disabled={isLoading}>
                        {isLoading ? "Creating Hotel..." : "Create Hotel"}
                    </button>
                </form>
            )}

            {!isCreating && (
                <>
                    <div className="admin-search-bar">
                        <div className="search-input-group">
                            <label>Filter by City</label>
                            <input type="text" placeholder="e.g. Mumbai" value={searchCity} onChange={e => setSearchCity(e.target.value)} />
                        </div>
                        <button className="btn-search" onClick={handleSearch}>Search</button>
                        <button className="btn-clear" onClick={clearSearch}>Clear</button>
                    </div>

                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Hotel Name</th>
                                    <th>Location</th>
                                    <th>Stars</th>
                                    <th>Room Types Configured</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHotels.map(h => (
                                    <tr key={h.id}>
                                        <td>{h.id}</td>
                                        <td><strong>{h.name}</strong></td>
                                        <td>{h.address}, {h.city}</td>
                                        <td>{"★".repeat(h.starRating)}</td>
                                        <td>
                                            {h.rooms && h.rooms.map(r => (
                                                <span key={r.id} className="room-type-badge">
                                                    {r.roomType}
                                                </span>
                                            ))}
                                        </td>
                                        <td>
                                            <button className="btn-delete" onClick={() => handleDelete(h.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredHotels.length === 0 && (
                                    <tr><td colSpan="6" className="text-center">No hotels found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {isRoomModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-content wide-modal">
                        <h3>Configure New Room Type</h3>
                        
                        <div className="admin-form-grid room-form-grid">
                            <div className="admin-input-group">
                                <label>Room Type (e.g., Deluxe)</label>
                                <input type="text" name="roomType" value={roomForm.roomType} onChange={handleRoomFormChange} />
                            </div>
                            <div className="admin-input-group">
                                <label>Max Occupancy</label>
                                <input type="number" name="maxOccupancy" value={roomForm.maxOccupancy} onChange={handleRoomFormChange} />
                            </div>
                            <div className="admin-input-group">
                                <label>Total Rooms Available</label>
                                <input type="number" name="totalRooms" value={roomForm.totalRooms} onChange={handleRoomFormChange} />
                            </div>
                        </div>

                        <hr className="modal-divider" />

                        <h4 className="modal-section-title">Bulk Generate Inventory (e.g. 3 Months)</h4>
                        <div className="bulk-generate-row">
                            <div className="admin-input-group flex-1">
                                <label className="small-label">Start Date</label>
                                <input type="date" value={bulkStartDate} onChange={e => setBulkStartDate(e.target.value)} className="small-input" />
                            </div>
                            <div className="admin-input-group flex-1">
                                <label className="small-label">End Date</label>
                                <input type="date" value={bulkEndDate} onChange={e => setBulkEndDate(e.target.value)} className="small-input" />
                            </div>
                            <div className="admin-input-group flex-1">
                                <label className="small-label">Base Price (₹)</label>
                                <input type="number" value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} className="small-input" />
                            </div>
                            <button type="button" className="btn-primary-action btn-generate" onClick={handleBulkGenerate}>Generate</button>
                        </div>

                        <h4 className="modal-section-title">Or Add Single Date Override</h4>
                        <div className="single-override-row">
                            <div className="admin-input-group flex-1">
                                <label className="small-label">Date</label>
                                <input type="date" name="date" value={inventoryForm.date} onChange={handleInventoryFormChange} className="small-input" />
                            </div>
                            <div className="admin-input-group flex-1">
                                <label className="small-label">Price (₹)</label>
                                <input type="number" name="price" value={inventoryForm.price} onChange={handleInventoryFormChange} className="small-input" />
                            </div>
                            <button type="button" className="btn-primary-action btn-add-small" onClick={handleAddInventoryToRoom}>Add</button>
                        </div>

                        {currentRoomInventories.length > 0 && (
                            <div className="inventory-preview-container">
                                <div className="inventory-preview-header">Total Days Configured: {currentRoomInventories.length}</div>
                                {currentRoomInventories.sort((a,b) => new Date(a.date) - new Date(b.date)).map((inv, idx) => (
                                    <div key={idx} className="inventory-preview-item">
                                        <span>📅 {inv.date}</span>
                                        <strong>₹{inv.price}</strong>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={() => setIsRoomModalOpen(false)}>Cancel</button>
                            <button type="button" className="btn-submit-form btn-submit-auto" onClick={handleSaveRoom}>Save Room Config</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminHotels;