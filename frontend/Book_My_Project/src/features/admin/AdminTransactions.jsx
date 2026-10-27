import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './AdminTransactions.css';

function AdminTransactions() {
    const [transactions, setTransactions] = useState({ flights: [], trains: [], buses: [], hotels: [] });
    const [filterType, setFilterType] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAllTransactions();
    }, []);

    async function fetchAllTransactions() {
        try {
            const response = await api.get('/admin/transactions/all');
            setTransactions(response.data);
        } catch (err) {
            console.error("Failed to fetch system transactions:", err);
        } finally {
            setIsLoading(false);
        }
    }

    const extractEmail = (b) => b.user?.email || b.userEmail || b.email || 'N/A';

    const allItems = [
        ...transactions.flights.map(b => ({ ...b, type: 'Flight', refNumber: b.flightNumber, amount: b.totalAmountPaid, displayEmail: extractEmail(b) })),
        ...transactions.trains.map(b => ({ ...b, type: 'Train', refNumber: b.trainNumber, amount: b.totalAmountPaid, displayEmail: extractEmail(b) })),
        ...transactions.buses.map(b => ({ ...b, type: 'Bus', refNumber: b.busNumber, amount: b.totalAmountPaid, displayEmail: extractEmail(b) })),
        ...transactions.hotels.map(b => ({ ...b, type: 'Hotel', refNumber: b.hotelName, amount: b.totalAmount, displayEmail: extractEmail(b) }))
    ];

    const filteredItems = filterType === 'all' ? allItems : allItems.filter(item => item.type.toLowerCase() === filterType);

    if (isLoading) return <div className="admin-module-container"><p>Loading system transactions...</p></div>;

    return (
        <div className="admin-module-container">
            <div className="admin-top-bar">
                <h3>System-Wide Transactions Ledger</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select 
                        value={filterType} 
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontWeight: 'bold' }}
                    >
                        <option value="all">All Categories</option>
                        <option value="flight">Flights</option>
                        <option value="train">Trains</option>
                        <option value="bus">Buses</option>
                        <option value="hotel">Hotels</option>
                    </select>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Type</th>
                            <th>Service Ref</th>
                            <th>User Email</th>
                            <th>Status</th>
                            <th>Amount Paid</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map(item => (
                            <tr key={`${item.type}-${item.id}`}>
                                <td>#{item.id}</td>
                                <td>
                                    <span style={{ 
                                        background: item.type === 'Flight' ? '#e3f2fd' : item.type === 'Train' ? '#e8f5e9' : item.type === 'Bus' ? '#fff3e0' : '#f3e5f5',
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                                        color: item.type === 'Flight' ? '#1565c0' : item.type === 'Train' ? '#2e7d32' : item.type === 'Bus' ? '#ef6c00' : '#7b1fa2'
                                    }}>
                                        {item.type}
                                    </span>
                                </td>
                                <td><strong>{item.refNumber}</strong></td>
                                <td>{item.displayEmail}</td>
                                <td>
                                    <span style={{ 
                                        color: item.status === 'CANCELLED' ? '#d32f2f' : '#28a745', 
                                        fontWeight: 'bold', fontSize: '12px' 
                                    }}>
                                        {item.status || 'CONFIRMED'}
                                    </span>
                                </td>
                                <td><strong>₹{item.amount || item.totalAmountPaid || item.totalAmount}</strong></td>
                                <td>{new Date(item.bookingDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {filteredItems.length === 0 && (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No transactions found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminTransactions;