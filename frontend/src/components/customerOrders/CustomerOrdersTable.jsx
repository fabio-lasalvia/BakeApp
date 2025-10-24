import { Table, Button, Spinner, Badge } from "react-bootstrap";
import { useState } from "react";
import useIndexCustomerOrders from "../../hooks/customerOrders/useIndexCustomerOrders";
import useDeleteCustomerOrder from "../../hooks/customerOrders/useDeleteCustomerOrder";
import useHandleModal from "../../hooks/common/useHandleModal";
import AddCustomerOrderModal from "./AddCustomerOrderModal";
import EditCustomerOrderModal from "./EditCustomerOrderModal";
import CustomerOrderDetailsModal from "./CustomerOrderDetailsModal";
import ConfirmModal from "../common/ConfirmModal";

function CustomerOrdersTable() {
  const { orders, loading, error, refetch } = useIndexCustomerOrders();
  const { remove } = useDeleteCustomerOrder();

  // Gestione modali
  const addModal = useHandleModal();
  const editModal = useHandleModal();
  const detailsModal = useHandleModal();
  const confirmModal = useHandleModal();

  const [selectedOrder, setSelectedOrder] = useState(null);

  // Elimina ordine
  const handleDelete = async () => {
    if (!selectedOrder) return;
    await remove(selectedOrder._id);
    refetch();
    confirmModal.closeModal();
  };

  // Colori badge status
  const getStatusVariant = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "IN_PROGRESS":
        return "info";
      case "COMPLETED":
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
        <p>Failed to load orders. Please try again later.</p>
      </div>
    );

  return (
    <div className="mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-primary mb-0">Customer Orders Management</h2>
        <Button variant="success" onClick={addModal.openModal}>
          <i className="bi bi-plus-circle me-2"></i>Add Order
        </Button>
      </div>

      {/* TABLE */}
      {!orders || orders.length === 0 ? (
        <p className="text-center mt-4">No customer orders found.</p>
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
              <th>Customer</th>
              <th>Handled By</th>
              <th>Total (€)</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>

                {/* CUSTOMER */}
                <td>
                  {order.customer?.user
                    ? `${order.customer.user.name || ""} ${
                        order.customer.user.surname || ""
                      }`
                    : "—"}
                </td>

                {/* HANDLED BY */}
                <td>
                  {order.handledBy
                    ? `${order.handledBy.name || ""} ${
                        order.handledBy.surname || ""
                      }`
                    : "—"}
                </td>

                <td>{order.totalAmount?.toFixed(2) || "0.00"}</td>

                <td>
                  <Badge bg={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </td>

                <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                <td>
                  <div className="d-flex justify-content-center gap-2">
                    {/* VIEW */}
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

      {/* ADD */}
      <AddCustomerOrderModal
        show={addModal.isOpen}
        onHide={addModal.closeModal}
        refetch={refetch}
      />

      {/* EDIT */}
      <EditCustomerOrderModal
        show={editModal.isOpen}
        onHide={editModal.closeModal}
        order={selectedOrder}
        refetch={refetch}
      />

      {/* DETAILS */}
      <CustomerOrderDetailsModal
        show={detailsModal.isOpen}
        onHide={detailsModal.closeModal}
        order={selectedOrder}
      />

      {/* CONFIRM DELETE */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        closeModal={confirmModal.closeModal}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this order? This action cannot be undone.`}
      />
    </div>
  );
}

export default CustomerOrdersTable;
