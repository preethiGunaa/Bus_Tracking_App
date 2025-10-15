import API from './api';

export const authService = {
    // Register a new user/driver
    register: async (userData) => {
        try {
            const response = await API.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    // Login user/driver
    login: async (email, password) => {
        try {
            const response = await API.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    // Get current user profile
    getProfile: async () => {
        try {
            const response = await API.get('/driver/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get profile' };
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        try {
            const response = await API.put('/driver/profile', profileData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update profile' };
        }
    }
};