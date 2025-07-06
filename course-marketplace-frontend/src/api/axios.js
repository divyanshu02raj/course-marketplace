
// src/api/axios.js
import axios from 'axios';
import { API_BASE_URL } from "../config";

const instance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});


export default instance;
// URL for render 'https://course-marketplace-backend.onrender.com/api' //for local 'http://localhost:5000/api'