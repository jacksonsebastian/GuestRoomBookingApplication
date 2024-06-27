import axios from "axios";
import config from "../config";

const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${config.apiUrl}/auth/login`,
      credentials
    );
    if (response.data.status === 1) {
      const { token } = response.data;
      localStorage.setItem("token", token); // Store token in local storage
      return response.data; // user data
    } else {
      return null; 
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

const register = async (userData) => {
  try {
    const response = await axios.post(
      `${config.apiUrl}/auth/register`,
      userData
    );
    if (response?.data?.status === 1) {
      return response.data; // Return user data
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

const logout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

export { login, register, logout };
