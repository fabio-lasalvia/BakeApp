import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Catalogs from "./pages/Catalogs";
import Products from "./pages/Products";
import Ingredients from "./pages/Ingredients";
import CustomerOrders from "./pages/CustomerOrders";
import PurchaseOrders from "./pages/PurchaseOrders";
import Invoices from "./pages/Invoices";
import InvoicePrint from "./pages/InvoicePrint";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* GUEST ROUTES */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />

                    {/* PROTECTED ROUTES */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="home" element={<Home />} />
                        <Route path="users" element={<Users />} />
                        <Route path="catalogs" element={<Catalogs />} />
                        <Route path="products" element={<Products />} />                         
                        <Route path="ingredients" element={<Ingredients />} />
                        <Route path="customer-orders" element={<CustomerOrders />} />
                         <Route path="purchase-orders" element={<PurchaseOrders />} />
                        <Route path="invoices" element={<Invoices />} />
                        <Route path="print/invoice/:id" element={<InvoicePrint />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
