import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './AdminDashboard.css';
import AdminFlights from './AdminFlights';
import AdminTrains from './AdminTrains';
import AdminBuses from './AdminBuses';
import AdminHotels from './AdminHotels';
import AdminTransactions from './AdminTransactions';
import AdminHomeDashboard from './AdminHomeDashboard';
import AeroPlaneImage from '../../assets/aeroplane.png';
import TrainImage from '../../assets/train.png';
import BusImage from '../../assets/bus.png';
import HotelImage from '../../assets/hotel.png';
import TrasnsactionImage from '../../assets/Transaction.png'
import DashboardImage from '../../assets/dashboard.png';

function AdminDashboard() {

    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('dashboard');

    function handleLogout() {
        logout();
        navigate('/');
    }

    function renderContent() {
        switch(activeTab) {
            case 'dashboard':
                return <AdminHomeDashboard />;
            case 'flights':
                return <AdminFlights/>;
            case 'trains':
                return <AdminTrains/>;
            case 'buses':
                return <AdminBuses/>;
            case 'hotels':
                return <AdminHotels/>;
            case 'transactions':
                return <AdminTransactions />;
            default:
                return <div>Select a module from the sidebar.</div>;
        }
    }

    return (
        <div className="admin-layout">
            
            <aside className="admin-sidebar">
                <div className="admin-brand">Admin Portal</div>
                <nav className="admin-nav">
                    <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <img src={DashboardImage} alt="" /> Dashboard
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'flights' ? 'active' : ''}`} onClick={() => setActiveTab('flights')}>
                        <img src={AeroPlaneImage} alt="" /> Manage Flights
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'trains' ? 'active' : ''}`} onClick={() => setActiveTab('trains')}>
                        <img src={TrainImage} alt="" /> Manage Trains
                    </button>
                    <button  className={`admin-nav-item ${activeTab === 'buses' ? 'active' : ''}`} onClick={() => setActiveTab('buses')}>
                        <img src={BusImage} alt="" /> Manage Buses
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'hotels' ? 'active' : ''}`}onClick={() => setActiveTab('hotels')}>
                        <img src={HotelImage} alt="" /> Manage Hotels
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'transactions' ? 'active' : ''}`}onClick={() => setActiveTab('transactions')}>
                        <img src={TrasnsactionImage} alt="" /> Transactions Ledger
                    </button>
                </nav>
                <div className="admin-logout">
                    <button className="btn-admin-logout" onClick={handleLogout}>Logout</button>
                </div>
            </aside>

            <main className="admin-content">
                <header className="admin-header">
                    <h2 className="admin-page-title">
                        {activeTab === 'dashboard' && 'Platform Overview'}
                        {activeTab === 'flights' && 'Flight Inventory Management'}
                        {activeTab === 'trains' && 'Train Inventory Management'}
                        {activeTab === 'buses' && 'Bus Inventory Management'}
                        {activeTab === 'hotels' && 'Hotel Inventory Management'}
                        {activeTab === 'transactions' && 'System Transactions Ledger'}
                    </h2>
                    <div>
                        {console.log(user)}
                        {user && <span>Logged in as Admin: <strong>{user.email}</strong></span>}
                    </div>
                </header>
                <div className="admin-main-view">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;