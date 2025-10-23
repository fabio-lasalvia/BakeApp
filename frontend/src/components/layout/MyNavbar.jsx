import { Image, Nav, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  HouseDoorFill,
  PeopleFill,
  BoxFill,
  FolderFill,
  BagFill,
  Receipt,
  GearFill
} from "react-bootstrap-icons";


export default function MyNavbar({ show = false, onHide = () => {} }) {
  const location = useLocation();

  const items = [
    { to: "/home", label: "Dashboard", Icon: HouseDoorFill },
    { to: "/users", label: "Users", Icon: PeopleFill },
    { to: "/products", label: "Products", Icon: BoxFill },
    { to: "/catalogs", label: "Catalogs", Icon: FolderFill },
    { to: "/customer-orders", label: "Customer Orders", Icon: BagFill },
    { to: "/purchase-orders", label: "Purchase Orders", Icon: Receipt },
    { to: "/invoices", label: "Invoices", Icon: Receipt },
  ];

  const SidebarBody = (
    <div className="d-flex flex-column h-100 p-3 sidebar-dark">
      {/* Brand */}
      <div className="d-flex align-items-center mb-4 px-2">
        <Image src="/img/logo/logoBakeApp.png" className="rounded me-2" style={{maxHeight: "50px"}}/>
        <span className="fw-semibold text-light">BakeApp</span>
      </div>

      {/* Menu */}
      <Nav className="flex-column gap-1">
        {items.map(({ to, label, Icon }) => {
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

      {/* Footer link */}
      <div className="mt-auto pt-3">
        <Nav.Link as={Link} to="/settings" onClick={onHide} className="sidebar-link d-flex align-items-center">
          <GearFill className="me-2" size={18} />
          <span>Settings</span>
        </Nav.Link>
      </div>
    </div>
  );

  ///// Offcanvas mobile /////
  return (
    <>
      <div className="d-none d-lg-block sidebar-fixed">{SidebarBody}</div>
      <Offcanvas show={show} onHide={onHide} placement="start" className="sidebar-offcanvas d-lg-none">
        <Offcanvas.Header closeButton closeVariant="white" className="sidebar-dark" />
        <Offcanvas.Body className="p-0">{SidebarBody}</Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
