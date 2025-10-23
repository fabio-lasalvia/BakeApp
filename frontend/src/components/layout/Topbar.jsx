import { Navbar, Form, InputGroup, Button, Dropdown, Image } from "react-bootstrap";
import { List, Bell, Search } from "react-bootstrap-icons";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ onToggleSidebar = () => {} }) {
  const { logout } = useAuth();

  return (
    <Navbar bg="white" className="border-bottom px-3 topbar" expand="lg">
      <Button variant="link" className="d-lg-none p-0 me-2" onClick={onToggleSidebar}>
        <List size={22} />
      </Button>

      <Form className="flex-grow-1 d-none d-md-block">
        <InputGroup>
          <InputGroup.Text className="bg-white border-end-0"><Search size={16} /></InputGroup.Text>
          <Form.Control placeholder="Search" className="border-start-0" />
        </InputGroup>
      </Form>

      <div className="ms-auto d-flex align-items-center gap-3">
        <Button variant="link" className="text-muted p-0"><Bell size={18} /></Button>

        <Dropdown align="end">
          <Dropdown.Toggle variant="link" className="p-0 d-flex align-items-center text-decoration-none">
            <Image src="https://placekitten.com/40/40" roundedCircle width={34} height={34} alt="avatar" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item disabled>Your profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={logout}>Sign out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  );
}
