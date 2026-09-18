import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";


const API_BASE_URL = "http://127.0.0.1:8000";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/me`,
        {
          withCredentials: true,
        }
      );

      setUser(response.data.user);

    } catch {
      setUser(null);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getCurrentUser();
  }, []);


  const login = async (
    email,
    password
  ) => {

    const response = await axios.post(
      `${API_BASE_URL}/api/auth/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    setUser(response.data.user);

    return response.data;
  };


  const logout = async () => {

    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

    } finally {
      setUser(null);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}