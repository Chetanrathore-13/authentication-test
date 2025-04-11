import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/auth', // change to your backend URL
  withCredentials: true, // allows sending cookies
});

export default axiosInstance;
