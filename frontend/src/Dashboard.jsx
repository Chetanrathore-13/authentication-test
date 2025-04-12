import { useAtom } from "jotai";
import { userAtom } from "./store/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./axiosInstance";

const Dashboard = () => {
  const [user] = useAtom(userAtom);
  console.log(user)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/profile");
        console.log(response.data);
        
      } catch (error) {
         console.log(error)
      }
    }
    fetchUser()
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/"); // redirect to login if not logged in
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>
        <p className="text-gray-700">Logged in as: <strong>{user?.name}</strong></p>
        <p className="text-gray-700">Logged in as: <strong>{user?.email}</strong></p>
      </div>
    </div>
  );
};

export default Dashboard;
