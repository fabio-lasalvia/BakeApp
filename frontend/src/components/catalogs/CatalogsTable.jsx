import { Table, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import useIndexCatalogs from "../../hooks/catalogs/useIndexCatalogs";
import useDeleteCatalog from "../../hooks/catalogs/useDeleteCatalog";
import AddCatalogModal from "./AddCatalogModal";
import EditCatalogModal from "./EditCatalogModal";
import CatalogDetailsModal from "./CatalogDetailsModal";
import ConfirmModal from "../common/ConfirmModal";

function CatalogsTable() {
  const { catalogs, loading, error, refetch } = useIndexCatalogs();
  const { remove } = useDeleteCatalog();

  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!selectedCatalog) return;
    await remove(selectedCatalog._id);
    refetch();
    setShowConfirm(false);
  };

  if (loading)
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-danger p-4">
        <p>Failed to load catalogs. Please try again later.</p>
      </div>
    );

  if (!catalogs || catalogs.length === 0)
    return (
      <div className="text-center mt-4">
        <p>No catalogs found.</p>
        <Button variant="success" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>Add Catalog
        </Button>
      </div>
    );

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-primary">Catalog Management</h2>
        <Button variant="success" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>Add Catalog
        </Button>
      </div>

      <Table striped bordered hover responsive className="align-middle text-center">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Products</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {catalogs.map((cat, index) => (
            <tr key={cat._id}>
              <td>{index + 1}</td>
              <td>{cat.name}</td>
              <td>{cat.description || "—"}</td>
              <td>{cat.isActive ? "Active" : "Inactive"}</td>
              <td>{cat.productCount ?? 0}</td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => {
                      setSelectedCatalog(cat);
                      setShowDetailsModal(true);
                    }}
                  >
                    <i className="bi bi-eye"></i>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline-warning"
                    onClick={() => {
                      setSelectedCatalog(cat);
                      setShowEditModal(true);
                    }}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => {
                      setSelectedCatalog(cat);
                      setShowConfirm(true);
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modali */}
      <AddCatalogModal show={showAddModal} onHide={() => setShowAddModal(false)} refetch={refetch} />
      <EditCatalogModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        refetch={refetch}
        catalog={selectedCatalog}
      />
      <CatalogDetailsModal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} catalog={selectedCatalog} />
      <ConfirmModal
        isOpen={showConfirm}
        closeModal={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${selectedCatalog?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

export default CatalogsTable;
