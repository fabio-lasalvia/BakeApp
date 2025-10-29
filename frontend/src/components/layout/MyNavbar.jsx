import { Image, Nav, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  HouseDoorFill,
  PeopleFill,
  BoxFill,
  FolderFill,
  BagFill,
  Receipt,
  GearFill,
  ClipboardDataFill,
  PersonFill,
} from "react-bootstrap-icons";
import { useAuth } from "../../context/AuthContext";

export default function MyNavbar({ show = false, onHide = () => {} }) {
  const location = useLocation();
  const { user } = useAuth();


  ///// DEFINIZIONE VOCI SIDEBAR /////
  const allItems = [
    // Dashboard (tutti)
    { to: "/home", label: "Dashboard", Icon: HouseDoorFill, roles: ["ADMIN", "CUSTOMER", "EMPLOYEE", "SUPPLIER"] },

    // Users (solo admin)
    { to: "/users", label: "Users", Icon: PeopleFill, roles: ["ADMIN"] },

    // Cataloghi e prodotti (admin + employee)
    { to: "/catalogs", label: "Catalogs", Icon: FolderFill, roles: ["ADMIN", "EMPLOYEE"] },
    { to: "/products", label: "Products", Icon: BoxFill, roles: ["ADMIN", "EMPLOYEE", "CUSTOMER"] },

    // Ingredienti (solo admin e employee)
    { to: "/ingredients", label: "Ingredients", Icon: BoxFill, roles: ["ADMIN", "EMPLOYEE"] },

    // Ordini clienti (admin, employee, customer)
    { to: "/customer-orders", label: "Customer Orders", Icon: BagFill, roles: ["ADMIN", "EMPLOYEE", "CUSTOMER"] },

    // Ordini di acquisto (solo admin e employee)
    { to: "/purchase-orders", label: "Purchase Orders", Icon: ClipboardDataFill, roles: ["ADMIN", "EMPLOYEE"] },

    // Fatture (solo admin)
    { to: "/invoices", label: "Invoices", Icon: Receipt, roles: ["ADMIN"] },
  ];

  ///// FILTRAGGIO RUOLI /////
  const visibleItems = allItems.filter((item) => item.roles.includes(user?.role));

  ///// STRUTTURA PRINCIPALE DEL MENU /////
  const SidebarBody = (
    <div className="d-flex flex-column h-100 p-3 sidebar-dark">
      {/* Brand */}
      <div className="d-flex justify-content-center align-items-center mb-4 px-2">
        <Link to="/home" onClick={onHide}>
          <Image
            src="/img/logo/logoBakeApp.png"
            className="rounded me-2"
            style={{ maxHeight: "50px" }}
            alt="BakeApp Logo"
          />
        </Link>
      </div>

      {/* Menù dinamico */}
      <Nav className="flex-column gap-1">
        {visibleItems.map(({ to, label, Icon }) => {
          const active = location.pathname === to;
          return (
            <Nav.Link
              as={Link}
              to={to}
              key={to}
              onClick={onHide}
              className={`sidebar-link d-flex align-items-center ${active ? "active" : ""}`}
            >
              <Icon className="me-2" size={18} />
              <span>{label}</span>
            </Nav.Link>
          );
        })}
      </Nav>

      {/* Footer */}
      <div className="mt-auto pt-3">
        <Nav.Link
          as={Link}
          to="/me"
          onClick={onHide}
          className="sidebar-link d-flex align-items-center"
        >
          <PersonFill className="me-2" size={18} />
          <span>Profile</span>
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/settings"
          onClick={onHide}
          className="sidebar-link d-flex align-items-center"
        >
          <GearFill className="me-2" size={18} />
          <span>Settings</span>
        </Nav.Link>
      </div>
    </div>
  );


  return (
    <>
      {/* Sidebar desktop */}
      <div className="d-none d-lg-block sidebar-fixed">{SidebarBody}</div>

      {/* Sidebar mobile */}
      <Offcanvas
        show={show}
        onHide={onHide}
        placement="start"
        className="sidebar-offcanvas d-lg-none"
      >
        <Offcanvas.Header closeButton closeVariant="white" className="sidebar-dark" />
        <Offcanvas.Body className="p-0">{SidebarBody}</Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
