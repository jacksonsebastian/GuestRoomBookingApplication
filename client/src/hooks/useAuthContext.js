import { createContext, useContext, useEffect, useState } from "react";
import { login, register, logout } from "../service/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Token authentication
  const isAuthenticated = () => !!localStorage.getItem("token");

  const loginUser = async (email, password) => {
    try {
      const userData = await login({ email, password });
      console.log("UserData:", userData);
      setUser(userData);
      setError(null);
      localStorage.setItem("token", userData.token);
    } catch (error) {
      setError(error.message);
    }
  };

  const registerUser = async (userData) => {
    try {
      console.log("UserData:", userData);
      const newUser = await register(userData);

      console.log("newUser:", newUser);
      setUser(newUser);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if(error){
      setUser(null);
    }
  }, [error]);

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        isAuthenticated,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
