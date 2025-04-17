import { useState,useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import Login from './Login';
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  
  // In App.js or main.js
  const GoogleWrapper = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> 
      <Login/>
    </GoogleOAuthProvider>
  );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<GoogleWrapper/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>

  )
}

export default App
