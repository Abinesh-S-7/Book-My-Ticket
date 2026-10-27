import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({ email: decoded.sub, role: decoded.role });
            } catch (error) {
                console.error("Invalid Token");
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    function login(token) {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser({ email: decoded.sub, role: decoded.role });
    }

    function logout() {
        localStorage.removeItem('token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}