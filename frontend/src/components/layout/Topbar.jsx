import { Navbar, Form, InputGroup, Button, Dropdown, Image } from "react-bootstrap";
import { List, Bell, Search } from "react-bootstrap-icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useMyProfile from "../../hooks/users/useMyProfile";

const MySwal = withReactContent(Swal);

export default function Topbar({ onToggleSidebar = () => {} }) {
  const { user, logout } = useAuth();
   const { profile, loading: loadingProfile, error, refetch } = useMyProfile();
  const navigate = useNavigate();

  // Gestione logout con conferma + toast
const handleLogout = async () => {
  const result = await MySwal.fire({
    title: "Are you sure?",
    text: "Do you want to disconnect from BakeApp?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, log out",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
  });

  if (result.isConfirmed) {
    logout();

    MySwal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "You have been logged out successfully",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    navigate("/login");
  }
};

  return (
    <Navbar bg="white" className="border-bottom px-3 topbar shadow-sm" expand="lg">
      {/* Sidebar toggle (mobile) */}
      <Button variant="link" className="d-lg-none p-0 me-2" onClick={onToggleSidebar}>
        <List size={22} />
      </Button>

      {/* Searchbar */}
      <Form className="flex-grow-1 d-none d-md-block">
        <InputGroup>
          <InputGroup.Text className="bg-white border-end-0">
            <Search size={16} />
          </InputGroup.Text>
          <Form.Control placeholder="Search" className="border-start-0" />
        </InputGroup>
      </Form>

      {/* Right section */}
      <div className="ms-auto d-flex align-items-center gap-3">
        {/* Notification bell */}
        <Button variant="link" className="text-muted p-0">
          <Bell size={18} />
        </Button>

        {/* User dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="link"
            className="p-0 d-flex align-items-center text-decoration-none"
            id="user-menu"
          >
            <Image
              src={
                  profile?.avatar ||
                  "https://res.cloudinary.com/dbqckc5sl/image/upload/v1759400955/segnapostoNoImage_rumvcb.png"
              }
               roundedCircle
               width={34}
               height={34}
               alt="User Avatar"
               className="me-2"
              />
            <span className="fw-semibold text-dark d-none d-md-inline">
              {user?.name || "User"}
            </span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Header className="text-center">
              <div className="fw-bold">
                {user?.name} {user?.surname}
              </div>
              <small className="text-muted">{user?.role}</small>
            </Dropdown.Header>
            <Dropdown.Divider />

            <Dropdown.Item onClick={() => navigate("/me")}>
              <i className="bi bi-person-circle me-2"></i>My Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/settings")}>
              <i className="bi bi-gear me-2"></i>Settings
            </Dropdown.Item>

            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>Sign out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  );
}
