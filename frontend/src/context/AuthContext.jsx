import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on app start
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // const userData = await authService.getProfile();
                // setUser(userData.data);
            } catch (error) {
                // Token is invalid
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const response = await authService.login(email, password);
        if (response.success) {
            setUser(response.data);
            localStorage.setItem('token', response.data.token);
        }
        return response;
    };

    const register = async (userData) => {
        const response = await authService.register(userData);
        if (response.success) {
            setUser(response.data);
            localStorage.setItem('token', response.data.token);
        }
        return response;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};