import { Modal, Button } from "react-bootstrap";

function UserDetailsModal({ show, onHide, user }) {
  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Name:</strong> {user.name} {user.surname || ""}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

        {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
        {user.address && <p><strong>Address:</strong> {user.address}</p>}
        {user.companyName && <p><strong>Company:</strong> {user.companyName}</p>}
        {user.contact && <p><strong>Contact:</strong> {user.contact}</p>}

        <p className="text-muted small mt-3">
          Created: {new Date(user.createdAt).toLocaleDateString()}<br />
          Last Updated: {new Date(user.updatedAt).toLocaleDateString()}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserDetailsModal;