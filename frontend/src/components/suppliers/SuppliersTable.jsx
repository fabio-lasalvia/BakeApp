import { Table, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import useIndexSuppliers from "../../hooks/suppliers/useIndexSuppliers";
import useDeleteSupplier from "../../hooks/suppliers/useDeleteSupplier";
import useHandleModal from "../../hooks/common/useHandleModal";
import AddSupplierModal from "./AddSupplierModal";
import EditSupplierModal from "./EditSupplierModal";
import SupplierDetailsModal from "./SupplierDetailsModal";
import ConfirmModal from "../common/ConfirmModal";

function SuppliersTable() {
  const { suppliers, loading, error, refetch } = useIndexSuppliers();
  const { remove } = useDeleteSupplier();

  const addModal = useHandleModal();
  const editModal = useHandleModal();
  const detailsModal = useHandleModal();
  const confirmModal = useHandleModal();

  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const handleDelete = async () => {
    if (!selectedSupplier) return;
    await remove(selectedSupplier._id);
    refetch();
    confirmModal.closeModal();
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
        <p>Failed to load suppliers. Please try again later.</p>
      </div>
    );

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-primary mb-0">Suppliers</h2>
        <Button variant="success" onClick={addModal.openModal}>
          <i className="bi bi-plus-circle me-2"></i>Add Supplier
        </Button>
      </div>

      {!suppliers || suppliers.length === 0 ? (
        <p className="text-center mt-4">No suppliers found.</p>
      ) : (
        <Table striped bordered hover responsive className="align-middle text-center shadow-sm">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Company</th>
              <th>Contact</th>
              <th>VAT</th>
              <th>Registered User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((sup, index) => (
              <tr key={sup._id}>
                <td>{index + 1}</td>
                <td>{sup.companyName}</td>
                <td>{sup.contact || "—"}</td>
                <td>{sup.vatNumber || "—"}</td>
                <td>
                  {sup.user
                    ? `${sup.user.name} ${sup.user.surname || ""} (${sup.user.email})`
                    : "—"}
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Button size="sm" variant="outline-primary" onClick={() => { setSelectedSupplier(sup); detailsModal.openModal(); }}>
                      <i className="bi bi-eye"></i>
                    </Button>
                    <Button size="sm" variant="outline-warning" onClick={() => { setSelectedSupplier(sup); editModal.openModal(); }}>
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => { setSelectedSupplier(sup); confirmModal.openModal(); }}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modals */}
      <AddSupplierModal show={addModal.isOpen} onHide={addModal.closeModal} refetch={refetch} />
      <EditSupplierModal show={editModal.isOpen} onHide={editModal.closeModal} supplier={selectedSupplier} refetch={refetch} />
      <SupplierDetailsModal show={detailsModal.isOpen} onHide={detailsModal.closeModal} supplier={selectedSupplier} />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        closeModal={confirmModal.closeModal}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete supplier ${selectedSupplier?.companyName}?`}
      />
    </div>
  );
}

export default SuppliersTable;
