import { useState,useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import Login from './Login';

function App() {
  
  // In App.js or main.js


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>

  )
}

export default App
