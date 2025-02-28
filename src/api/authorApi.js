import axios from 'axios';

const BASE_URL = "https://library-backend-q2o1.onrender.com/api/v1/authors"; // Endpoint URL

// Get Authors
export const  getAuthors = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

// Add Author (POST)
export const addAuthor = async (authorData) => {
    const response = await axios.post(BASE_URL, authorData);
    return response.data;
}

// Update Author (PUT)
export const updateAuthor = async (id, authorData ) => {
    const response = await axios.put(`${BASE_URL}/${id}`, authorData);
    return response.data;
};

// Delete Author (DELETE)
export const deleteAuthor = async (id) => {
   const response = await axios.delete(`${BASE_URL}/${id}`);
   return response.data;
};