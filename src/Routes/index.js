import axios from 'axios';

const API = axios.create({
  baseURL: 'https://b639d00419a4.ngrok-free.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Bargains APIs ---

export const createBargain = (data) => API.post('/bargains', data);

export const getAllBargains = () => API.get('/bargains');

export const updateBargain = (id, data) => API.put(`/bargains/${id}`, data);

export const deleteBargain = (id) => API.delete(`/bargains/${id}`);

export default API;
