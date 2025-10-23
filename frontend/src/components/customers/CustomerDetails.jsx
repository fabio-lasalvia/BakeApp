import { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useIndexCustomers, useDeleteCustomer } from "../../hooks/customers";
import AddCustomerModal from "./AddCustomerModal";
import EditCustomerModal from "./EditCustomerModal";
import CustomerDetails from "./CustomerDetails";
import Swal from "sweetalert2";

export default function CustomersTable() {
    const { customers, loading, error, refetch } = useIndexCustomers();
    const { handleDeleteCustomer, loading: deleting } = useDeleteCustomer();

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    async function handleDelete(id) {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This customer will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it",
        });

        if (result.isConfirmed) {
            try {
                await handleDeleteCustomer(id);
                Swal.fire("Deleted!", "Customer removed successfully.", "success");
                refetch();
            } catch (error) {
                Swal.fire("Error", error.response?.data?.message || "Failed to delete customer", "error");
            }
        }
    }

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return <p className="text-danger text-center">Error loading customers: {error.message}</p>;
    }

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold">Customers</h2>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    <i className="bi bi-person-plus me-2"></i> Add Customer
                </Button>
            </div>

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length > 0 ? (
                        customers.map((customer) => (
                            <tr key={customer._id}>
                                <td>{customer.name} {customer.surname}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone || "-"}</td>
                                <td>{customer.address || "-"}</td>
                                <td className="text-center">
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => { setSelectedCustomer(customer); setShowDetails(true); }}
                                    >
                                        <i className="bi bi-eye"></i>
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => { setSelectedCustomer(customer); setShowEditModal(true); }}
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        disabled={deleting}
                                        onClick={() => handleDelete(customer._id)}
                                    >
                                        {deleting ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : (
                                            <i className="bi bi-trash"></i>
                                        )}
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-muted py-3">
                                No customers found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modals */}
            <AddCustomerModal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                onSuccess={refetch}
            />
            <EditCustomerModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                customer={selectedCustomer}
                onSuccess={refetch}
            />
            <CustomerDetails
                show={showDetails}
                onHide={() => setShowDetails(false)}
                customer={selectedCustomer}
            />
        </div>
    );
}
