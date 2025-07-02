// src/api/axios.js
import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://course-marketplace-backend.onrender.com/api' // Render backend
    : 'http://localhost:5000/api'; // Local backend

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export default instance;
