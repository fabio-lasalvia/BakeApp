import { Modal, Table, Badge } from "react-bootstrap";

function UserDetailsModal({ show, onHide, user }) {
  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table bordered hover>
          <tbody>
            <tr>
              <td><strong>Name</strong></td>
              <td>{user.name} {user.surname || ""}</td>
            </tr>
            <tr>
              <td><strong>Email</strong></td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td><strong>Role</strong></td>
              <td><Badge bg="info">{user.role}</Badge></td>
            </tr>

            {user.role === "CUSTOMER" && (
              <>
                <tr><td><strong>Phone</strong></td><td>{user.customer?.phone || "—"}</td></tr>
                <tr><td><strong>Address</strong></td><td>{user.customer?.address || "—"}</td></tr>
              </>
            )}

            {user.role === "EMPLOYEE" && (
              <tr>
                <td><strong>Department</strong></td>
                <td>{user.employee?.department || "—"}</td>
              </tr>
            )}

            {user.role === "SUPPLIER" && (
              <>
                <tr><td><strong>Company</strong></td><td>{user.supplier?.companyName || "—"}</td></tr>
                <tr><td><strong>Contact</strong></td><td>{user.supplier?.contact || "—"}</td></tr>
                <tr><td><strong>VAT</strong></td><td>{user.supplier?.vatNumber || "—"}</td></tr>
              </>
            )}

            <tr>
              <td><strong>Created</strong></td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

export default UserDetailsModal;
