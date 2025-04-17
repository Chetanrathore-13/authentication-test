import { useState } from "react";
import axios from "./axiosInstance";
import { useSetAtom } from "jotai";
import { userAtom } from "./store/auth";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLogin } from "./api"; // Adjust the import path as necessary
import GoogleLoginSetup from "./GoogleLogin"; // Adjust the import path as necessary

const Login = () => {
  const setUser = useSetAtom(userAtom);
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("/tutor/login", { identifier, password }, { withCredentials: true });

      // Optional: Add logging to debug response
      console.log("Login response:", res.data);

      if (res.data && res.data.user) {
        setUser(res.data.user);
        navigate("/dashboard");
      } else {
        alert("Invalid login response from server.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert(err.response?.data?.message || "Login failed");
    }
  };
  const responseGoogle = async (response) => {
   try {
    console.log("Google response:", response);
    if(response["code"]){
      const result = await googleLogin(response["code"]);
      console.log("Google login result:", result);
      if (result && result.user) {
        setUser(result.user);
        navigate("/dashboard");
      } else {
        alert("Invalid login response from server.");
      }
    }

   } catch (error) {
      console.log("Google login error:", error);
      alert("Google login failed");
   }
    }

  const GoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full mb-6 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-gray-500 mt-4 text-center">
          Don't have an account? <a href="/signup" className="text-blue-600">Sign Up</a>
        </p>
        <p className="text-gray-500 mt-2 text-center">
          Forgot Password? <a href="/forgot-password" className="text-blue-600">Reset</a>
        </p>
      </div>
       {/* Login with Google */}
      <div className="flex items-center justify-center mt-4">
        <button onClick={GoogleLogin} href="/auth/google" className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition">
          Login with Google
        </button>
      </div>
      <GoogleLoginSetup />
    </div>
  );
};

export default Login;
