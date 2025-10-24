import { Table, Button, Spinner, Badge } from "react-bootstrap";
import { useState } from "react";
import useIndexPurchaseOrders from "../../hooks/purchaseOrders/useIndexPurchaseOrders";
import useDeletePurchaseOrder from "../../hooks/purchaseOrders/useDeletePurchaseOrder";
import useHandleModal from "../../hooks/common/useHandleModal";
import AddPurchaseOrderModal from "./AddPurchaseOrderModal";
import EditPurchaseOrderModal from "./EditPurchaseOrderModal";
import PurchaseOrderDetailsModal from "./PurchaseOrderDetailsModal";
import ConfirmModal from "../common/ConfirmModal";

function PurchaseOrdersTable() {
  const { orders, loading, error, refetch } = useIndexPurchaseOrders();
  const { remove } = useDeletePurchaseOrder();

  // Custom modal hooks
  const addModal = useHandleModal();
  const editModal = useHandleModal();
  const detailsModal = useHandleModal();
  const confirmModal = useHandleModal();

  const [selectedOrder, setSelectedOrder] = useState(null);


  const handleDelete = async () => {
    if (!selectedOrder) return;
    await remove(selectedOrder._id);
    refetch();
    confirmModal.closeModal();
  };


  const getStatusVariant = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "ORDERED":
        return "info";
      case "RECEIVED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "secondary";
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
        <p>Failed to load purchase orders. Please try again later.</p>
      </div>
    );

  return (
    <div className="mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-primary mb-0">Purchase Orders Management</h2>
        <Button variant="success" onClick={addModal.openModal}>
          <i className="bi bi-plus-circle me-2"></i>
          Add Order
        </Button>
      </div>

      {/* TABLE OR EMPTY STATE */}
      {!orders || orders.length === 0 ? (
        <p className="text-center mt-4">No purchase orders found.</p>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          className="align-middle text-center shadow-sm"
        >
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Supplier</th>
              <th>Handled By</th>
              <th>Total (€)</th>
              <th>Status</th>
              <th>Expected Delivery</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>

                {/* Supplier */}
                <td>
                  {order.supplier?.user
                    ? `${order.supplier.user.name} ${order.supplier.user.surname || ""}`
                    : "—"}
                </td>

                {/* Handled By */}
                <td>
                  {order.handledBy
                    ? `${order.handledBy.name} ${order.handledBy.surname || ""}`
                    : "—"}
                </td>

                {/* Total Cost */}
                <td>{order.totalCost?.toFixed(2) || "0.00"}</td>

                {/* Status */}
                <td>
                  <Badge bg={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </td>

                {/* Expected Delivery */}
                <td>
                  {order.expectedDelivery
                    ? new Date(order.expectedDelivery).toLocaleDateString()
                    : "—"}
                </td>

                {/* ACTION BUTTONS */}
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    {/* DETAILS */}
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => {
                        setSelectedOrder(order);
                        detailsModal.openModal();
                      }}
                    >
                      <i className="bi bi-eye"></i>
                    </Button>

                    {/* EDIT */}
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => {
                        setSelectedOrder(order);
                        editModal.openModal();
                      }}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>

                    {/* DELETE */}
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => {
                        setSelectedOrder(order);
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

      {/* MODALS */}

      {/* ADD ORDER MODAL */}
      <AddPurchaseOrderModal
        show={addModal.isOpen}
        onHide={addModal.closeModal}
        refetch={refetch}
      />

      {/* EDIT ORDER MODAL */}
      <EditPurchaseOrderModal
        show={editModal.isOpen}
        onHide={editModal.closeModal}
        order={selectedOrder}
        refetch={refetch}
      />

      {/* DETAILS MODAL */}
      <PurchaseOrderDetailsModal
        show={detailsModal.isOpen}
        onHide={detailsModal.closeModal}
        order={selectedOrder}
      />

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        closeModal={confirmModal.closeModal}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this purchase order? This action cannot be undone.`}
      />
    </div>
  );
}

export default PurchaseOrdersTable;
