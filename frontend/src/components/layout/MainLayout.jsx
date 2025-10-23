import { useState } from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import MyNavbar from "./MyNavbar";
import Topbar from "./Topbar";
import MyFooter from "./MyFooter";
import { useAuth } from "../../context/AuthContext";

export default function MainLayout() {
  const { isLogged } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isLogged) return <Outlet />;

  return (
    <div className="vh-100 d-flex overflow-hidden">
      {/* Sidebar */}
      <MyNavbar show={sidebarOpen} onHide={() => setSidebarOpen(false)} />

      {/* Main column */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <Topbar onToggleSidebar={() => setSidebarOpen(true)} />
        <Container fluid className="flex-grow-1 overflow-auto py-4">
          <Outlet />
        </Container>
        <MyFooter role="CUSTOMER" />
      </div>
    </div>
  );
}
