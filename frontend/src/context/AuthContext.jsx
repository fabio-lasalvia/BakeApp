import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  //////////////////////////
  ///// LOGIN FUNCTION /////
  //////////////////////////
  const login = (token) => {
    try {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsLogged(true);
    } catch (error) {
      console.error("Invalid token on login:", error);
      localStorage.removeItem("token");
      setUser(null);
      setIsLogged(false);
    }
  };

  ///////////////////////////
  ///// LOGOUT FUNCTION /////
  ///////////////////////////
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLogged(false);
  };

  ////////////////////////////////
  ///// AUTO LOGIN (ON LOAD) /////
  ////////////////////////////////
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Controllo scadenza token (exp)
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          console.warn("Token expired");
          logout();
        } else {
          setUser(decoded);
          setIsLogged(true);
        }
      } catch (err) {
        console.error("Invalid token in localStorage:", err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  //////////////////////////
  ///// PROVIDER VALUE /////
  //////////////////////////
  return (
    <AuthContext.Provider value={{ user, isLogged, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
