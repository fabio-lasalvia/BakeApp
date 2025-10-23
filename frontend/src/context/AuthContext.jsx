import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(true);

    const login = (token) => {
        localStorage.setItem("token", token);
        setIsLogged(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsLogged(false);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setIsLogged(true);
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isLogged, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
