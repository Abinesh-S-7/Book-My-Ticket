import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import './Home.css';

import plane from '../../assets/aeroplane.png';
import train from '../../assets/train.png';
import hotel from '../../assets/hotel.png';
import bus from '../../assets/bus.png'

export default function Home() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState('login');

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', password: '' });
  
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('api/auth/login', loginData);
            const { token, role } = response.data;
            login(token);

            if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Login failed:", err);
            setError("Invalid Email or Password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await api.post('api/auth/register', registerData);
            alert("Registration successful! Please log in.");
            setRegisterData({ firstName: '', lastName: '', email: '', phoneNumber: '', password: '' });
            setActiveTab('login'); 
        } catch (err) {
            console.error("Registration failed:", err);
            setError(err.response?.data || "Failed to register. Please check your details.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="auth-page-wrapper">
            
            <div className="auth-left-panel">
                <div className="auth-left-overlay">
                    <div className="branding-content">
                        <h1 className="brand-title">BookMyTicket</h1>
                        <p className="brand-tagline">
                            The ultimate Super App for the modern traveler. 
                        </p>
                        
                        <div className="feature-list">
                            <div className="feature-item">
                                <img src={plane} alt="" />
                                <div>
                                    <h3>Global Flights</h3>
                                    <p>Search and book flights across the world with real-time availability.</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <img src={train} alt="" />
                                <div>
                                    <h3>Express Trains</h3>
                                    <p>Seamlessly reserve train tickets with instant PNR confirmation.</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <img src={hotel} alt="" />
                                <div>
                                    <h3>Luxury Hotels</h3>
                                    <p>Find the perfect stay matching your comfort and budget.</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <img src={bus} alt="" />
                                <div>
                                    <h3>Premium Buses</h3>
                                    <p>Book Express Buses to travel between Cities</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-right-panel">
                <div className="auth-form-container">
                    
                    {/* Toggle Switch */}
                    <div className="auth-toggle-wrapper">
                        <button 
                            className={`toggle-btn ${activeTab === 'login' ? 'active-login' : ''}`} 
                            onClick={() => { setActiveTab('login'); setError(''); }}
                        >
                            Log In
                        </button>
                        <button 
                            className={`toggle-btn ${activeTab === 'register' ? 'active-register' : ''}`} 
                            onClick={() => { setActiveTab('register'); setError(''); }}
                        >
                            Register
                        </button>
                    </div>

                    <div className="auth-form-content">
                        <h2 className="form-title">
                            {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
                        </h2>
                        
                        {error && <div className="auth-error">{error}</div>}

                        {/* --- LOGIN FORM --- */}
                        {activeTab === 'login' && (
                            <form onSubmit={handleLogin} className="auth-form">
                                <div className="auth-input-group">
                                    <label>Email Address</label>
                                    <input 
                                        type="email" name="email" placeholder="you@example.com"
                                        value={loginData.email} onChange={handleLoginChange} required 
                                    />
                                </div>
                                <div className="auth-input-group">
                                    <label>Password</label>
                                    <input 
                                        type="password" name="password" placeholder="Enter your password"
                                        value={loginData.password} onChange={handleLoginChange} required 
                                    />
                                </div>
                                <button type="submit" className="btn-auth-submit btn-login-color" disabled={isLoading}>
                                    {isLoading ? 'Logging in...' : 'Log In'}
                                </button>
                            </form>
                        )}

                        {activeTab === 'register' && (
                            <form onSubmit={handleRegister} className="auth-form">
                                <div className="auth-form-row">
                                    <div className="auth-input-group">
                                        <label>First Name</label>
                                        <input 
                                            type="text" name="firstName" placeholder="First Name" maxLength="20"
                                            value={registerData.firstName} onChange={handleRegisterChange} required 
                                        />
                                    </div>
                                    <div className="auth-input-group">
                                        <label>Last Name</label>
                                        <input 
                                            type="text" name="lastName" placeholder="Last Name" maxLength="20"
                                            value={registerData.lastName} onChange={handleRegisterChange} required 
                                        />
                                    </div>
                                </div>
                                <div className="auth-input-group">
                                    <label>Email Address</label>
                                    <input 
                                        type="email" name="email" placeholder="you@example.com"
                                        value={registerData.email} onChange={handleRegisterChange} required 
                                    />
                                </div>
                                <div className="auth-input-group">
                                    <label>Phone Number</label>
                                    <input 
                                        type="tel" name="phoneNumber" placeholder="10-digit mobile number"
                                        value={registerData.phoneNumber} onChange={handleRegisterChange} required 
                                    />
                                </div>
                                <div className="auth-input-group">
                                    <label>Password</label>
                                    <input 
                                        type="password" name="password" placeholder="Create a strong password"
                                        value={registerData.password} onChange={handleRegisterChange} required 
                                    />
                                </div>
                                <button type="submit" className="btn-auth-submit btn-register-color" disabled={isLoading}>
                                    {isLoading ? 'Registering...' : 'Register Now'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}