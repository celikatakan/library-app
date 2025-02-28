import axios from 'axios';

const BASE_URL = 'https://library-backend-q2o1.onrender.com/api/v1/publishers'; // Endpoint URL

// Get Categories (GET)
export const  getPublishers = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

// Add Category (POST)
export const addPublisher = async (publisher) => {
    const response = await axios.post(BASE_URL, publisher);
    return response.data;
}

// Update Category (PUT)
export const updatePublisher = async (id, updatedPublisher ) => {
    const response = await axios.put(`${BASE_URL}/${id}`, updatedPublisher);
    return response.data;
};

// Delete Category (DELETE)
export const deletePublisher = async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
};