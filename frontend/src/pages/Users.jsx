import { Container } from "react-bootstrap";
import UsersTable from "../components/users/UsersTable";

function Users() {
  return (
    <Container fluid className="p-4">
      <UsersTable />
    </Container>
  );
}

export default Users;