import { Modal, Table } from "react-bootstrap";

function SupplierDetailsModal({ show, onHide, supplier }) {
  if (!supplier) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Supplier Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table bordered hover responsive>
          <tbody>
            <tr>
              <td><strong>Name</strong></td>
              <td>{supplier.user?.name} {supplier.user?.surname || ""}</td>
            </tr>
            <tr>
              <td><strong>Email</strong></td>
              <td>{supplier.user?.email}</td>
            </tr>
            <tr>
              <td><strong>Company</strong></td>
              <td>{supplier.companyName}</td>
            </tr>
            <tr>
              <td><strong>Contact</strong></td>
              <td>{supplier.contact || "—"}</td>
            </tr>
            <tr>
              <td><strong>VAT Number</strong></td>
              <td>{supplier.vatNumber || "—"}</td>
            </tr>
            <tr>
              <td><strong>Created At</strong></td>
              <td>{new Date(supplier.createdAt).toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Updated At</strong></td>
              <td>{new Date(supplier.updatedAt).toLocaleString()}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

export default SupplierDetailsModal;
