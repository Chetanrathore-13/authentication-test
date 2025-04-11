import { useState,useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './login';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import axios from './axiosInstance';

function App() {
  const [count, setCount] = useState(0)
const [user, setUser] = useState(null);
  // In App.js or main.js
useEffect(() => {
  axios.get('/me').then(res => {
    setUser(res.data.user);
  }).catch(() => setUser(null));
}, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>

  )
}

export default App
