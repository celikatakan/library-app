import axios from 'axios';

const BASE_URL = 'https://library-backend-q2o1.onrender.com/api/v1/categories';  // Endpoint URL

// Get Categories (GET)
export const getCategories = async () => {
    const response = await axios.get(BASE_URL);
    return response.data; // Category list
};

// Add Category (POST)
export const addCategory = async (category) => {
    const response = await axios.post(BASE_URL, category);
    return response.data; // added category
};

// Update Category (PUT)
export const updateCategory = async (id, category) => {
    const response = await axios.put(`${BASE_URL}/${id}`, category);
    return response.data; 
};

// Delete Category (DELETE)
export const deleteCategory = async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data; // response data
};