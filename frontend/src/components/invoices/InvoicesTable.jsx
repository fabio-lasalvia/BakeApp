import { Table, Button, Spinner, Badge } from "react-bootstrap";
import { useState } from "react";
import useIndexInvoices from "../../hooks/invoices/useIndexInvoices";
import useDeleteInvoice from "../../hooks/invoices/useDeleteInvoice";
import useHandleModal from "../../hooks/common/useHandleModal";
import AddInvoiceModal from "./AddInvoiceModal";
import EditInvoiceModal from "./EditInvoiceModal";
import InvoiceDetailsModal from "./InvoiceDetailsModal";
import ConfirmModal from "../common/ConfirmModal";

function InvoicesTable() {
  const { invoices, loading, error, refetch } = useIndexInvoices();
  const { remove } = useDeleteInvoice();

  const addModal = useHandleModal();
  const editModal = useHandleModal();
  const detailsModal = useHandleModal();
  const confirmModal = useHandleModal();

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleDelete = async () => {
    if (!selectedInvoice) return;
    await remove(selectedInvoice._id);
    refetch();
    confirmModal.closeModal();
  };

  const handlePrint = (invoice) => {
    window.open(`/print/invoice/${invoice._id}`, "_blank");
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "PAID":
        return "success";
      case "OVERDUE":
        return "danger";
      default:
        return "warning";
    }
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
        <p>Failed to load invoices. Please try again later.</p>
      </div>
    );

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-primary mb-0">Invoices Management</h2>
        <Button variant="success" onClick={addModal.openModal}>
          <i className="bi bi-plus-circle me-2"></i>Generate Invoice
        </Button>
      </div>

      {!invoices || invoices.length === 0 ? (
        <p className="text-center mt-4">No invoices found.</p>
      ) : (
        <Table striped bordered hover responsive className="align-middle text-center shadow-sm">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Total (€)</th>
              <th>Status</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, index) => (
              <tr key={inv._id}>
                <td>{index + 1}</td>
                <td>
                  {inv.customer?.user
                    ? `${inv.customer.user.name} ${inv.customer.user.surname || ""}`
                    : "—"}
                </td>
                <td>{inv.total?.toFixed(2) || "0.00"}</td>
                <td>
                  <Badge bg={getStatusVariant(inv.status)}>{inv.status}</Badge>
                </td>
                <td>{new Date(inv.issueDate).toLocaleDateString()}</td>
                <td>
                  {inv.dueDate
                    ? new Date(inv.dueDate).toLocaleDateString()
                    : "—"}
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => {
                        setSelectedInvoice(inv);
                        detailsModal.openModal();
                      }}
                    >
                      <i className="bi bi-eye"></i>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => handlePrint(inv)}
                    >
                      <i className="bi bi-printer"></i>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => {
                        setSelectedInvoice(inv);
                        editModal.openModal();
                      }}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => {
                        setSelectedInvoice(inv);
                        confirmModal.openModal();
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
      )}

      {/* Modals */}
      <AddInvoiceModal show={addModal.isOpen} onHide={addModal.closeModal} refetch={refetch} />
      <EditInvoiceModal show={editModal.isOpen} onHide={editModal.closeModal} invoice={selectedInvoice} refetch={refetch} />
      <InvoiceDetailsModal show={detailsModal.isOpen} onHide={detailsModal.closeModal} invoice={selectedInvoice} />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        closeModal={confirmModal.closeModal}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this invoice?"
      />
    </div>
  );
}

export default InvoicesTable;
