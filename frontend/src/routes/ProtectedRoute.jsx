import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MySpinner from "../components/common/MySpinner";

function ProtectedRoute({ children }) {
    const { isLogged, loading } = useAuth();

    if (loading) {
        return <MySpinner message="Checking authentication..." />;
    }

    if (!isLogged) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
