import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './AdminHomeDashboard.css';

function AdminHomeDashboard() {

    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    async function fetchAnalytics() {
        try {
            const response = await api.get('api/admin/analytics/dashboard');
            setStats(response.data);
        } catch (err) {
            console.error("Failed to load dashboard metrics:", err);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <div className="dashboard-status"><p>Loading system analytics...</p></div>;
    if (!stats) return <div className="dashboard-status"><p>Failed to load dashboard metrics.</p></div>;

    return (
        <div className="dashboard-container">
            <h3 className="dashboard-title">Platform Overview & Analytics</h3>

            <div className="dashboard-kpi-grid">
                <div className="kpi-card users">
                    <h4 className="kpi-title">Total Registered Users</h4>
                    <span className="kpi-value">{stats.totalUsers}</span>
                </div>
                <div className="kpi-card bookings">
                    <h4 className="kpi-title">Total Bookings Done</h4>
                    <span className="kpi-value">{stats.totalBookings}</span>
                </div>
                <div className="kpi-card revenue">
                    <h4 className="kpi-title">Total Revenue Generated</h4>
                    <span className="kpi-value">₹{stats.totalRevenue.toLocaleString()}</span>
                </div>
            </div>

            <div className="dashboard-breakdown-grid">
                <div className="breakdown-box">
                    <h4>Bookings by Category</h4>
                    <ul className="breakdown-list">
                        {Object.entries(stats.bookingCounts).map(([key, value]) => (
                            <li key={key} className="breakdown-item">
                                <span> {key}</span>
                                <strong>{value} bookings</strong>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="breakdown-box">
                    <h4>Revenue by Category</h4>
                    <ul className="breakdown-list">
                        {Object.entries(stats.revenueCounts).map(([key, value]) => (
                            <li key={key} className="breakdown-item">
                                <span>💰 {key}</span>
                                <strong>₹{value.toLocaleString()}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="inventory-box">
                <h4>Active Platform Inventory</h4>
                <div className="inventory-grid">
                    {Object.entries(stats.inventoryCounts).map(([key, value]) => (
                        <div key={key} className="inventory-card">
                            <div className="inventory-label">{key}</div>
                            <div className="inventory-value">{value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminHomeDashboard;