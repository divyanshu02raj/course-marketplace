
// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL:  'https://course-marketplace-backend.onrender.com/api' ,
  withCredentials: true,
});

export default instance;
// URL for render 'https://course-marketplace-backend.onrender.com/api' //for local 'http://localhost:5000/api'