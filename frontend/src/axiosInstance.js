import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // change to your backend URL
  withCredentials: true, // allows sending cookies
});

export default axiosInstance;
