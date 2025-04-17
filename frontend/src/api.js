import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/auth",
  withCredentials: true,
});

export const googleLogin = async (code) => {
  try {
    console.log("Google login code:", code);
    if (!code) {
      throw new Error("No code provided for Google login");
    }
    const response = await api.post("/google", { code });
    return response.data;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
}