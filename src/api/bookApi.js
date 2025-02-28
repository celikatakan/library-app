import axios from 'axios';

const BASE_URL = 'https://library-backend-q2o1.onrender.com/api/v1/books';  // Endpoint URL

// GET
export const getBooks = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// POST
export const addBook = async (book) => {
  const response = await axios.post(BASE_URL, book);
  return response.data;
};

// PUT
export const updateBook = async (id, updatedBook) => {
  const response = await axios.put(`${BASE_URL}/${id}`, updatedBook);
  return response.data;
};

// DELETE
export const deleteBook = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
