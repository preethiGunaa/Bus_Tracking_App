import API from './api';

export const busService = {
    // Search for buses
    searchBuses: async (searchData) => {
        try {
            const { source, destination, busType } = searchData;
            const params = { source, destination };
            if (busType) params.busType = busType;

            const response = await API.get('/buses/search', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Bus search failed' };
        }
    },

    // Calculate fare between stops
    calculateFare: async (busId, fromStop, toStop) => {
        try {
            const response = await API.get(`/buses/${busId}/fare`, {
                params: { fromStop, toStop }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Fare calculation failed' };
        }
    },

    // Get bus stops
    getBusStops: async (busId) => {
        try {
            const response = await API.get(`/buses/${busId}/stops`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get bus stops' };
        }
    },

    // Register a new bus (drivers only)
    registerBus: async (busData) => {
        try {
            const response = await API.post('/buses', busData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Bus registration failed' };
        }
    },

    // Get driver's buses
    getMyBuses: async () => {
        try {
            const response = await API.get('/driver/my-buses');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get your buses' };
        }
    }
};