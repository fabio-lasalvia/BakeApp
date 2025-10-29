import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import useMyProfile from "../hooks/users/useMyProfile";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hook per ottenere il profilo aggiornato dal backend
  const { profile, refetch } = useMyProfile();

  //////////////////////////
  ///// LOGIN FUNCTION /////
  //////////////////////////
  const login = (token) => {
    try {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsLogged(true);

      // Ricarica anche il profilo completo (incluso avatar)
      refetch();
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

          // Carica anche il profilo backend
          refetch();
        }
      } catch (err) {
        console.error("Invalid token in localStorage:", err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  /////////////////////////////////
  ///// SYNC PROFILE UPDATES //////
  /////////////////////////////////
  useEffect(() => {
    if (profile && isLogged) {
      setUser((prev) => ({
        ...prev,
        ...profile,
      }));
    }
  }, [profile, isLogged]);

  ///////////////////////////
  ///// REFRESH PROFILE /////
  ///////////////////////////
  const refreshProfile = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Error refreshing profile:", err);
    }
  };

  //////////////////////////
  ///// PROVIDER VALUE /////
  //////////////////////////
  return (
    <AuthContext.Provider
      value={{
        user,
        isLogged,
        login,
        logout,
        loading,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
