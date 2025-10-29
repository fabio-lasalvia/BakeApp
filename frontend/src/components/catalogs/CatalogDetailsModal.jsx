import { Modal, Table } from "react-bootstrap";

function CatalogDetailsModal({ show, onHide, catalog }) {
  if (!catalog) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Catalog Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table bordered hover>
          <tbody>
            <tr>
              <td><strong>Name</strong></td>
              <td>{catalog.name}</td>
            </tr>
            <tr>
              <td><strong>Description</strong></td>
              <td>{catalog.description || "—"}</td>
            </tr>
            <tr>
              <td><strong>Status</strong></td>
              <td>{catalog.isActive ? "Active" : "Inactive"}</td>
            </tr>
            <tr>
              <td><strong>Products Count</strong></td>
              <td>{catalog.productCount ?? 0}</td>
            </tr>
            <tr>
              <td><strong>Created At</strong></td>
              <td>{new Date(catalog.createdAt).toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Updated At</strong></td>
              <td>{new Date(catalog.updatedAt).toLocaleString()}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

export default CatalogDetailsModal;
