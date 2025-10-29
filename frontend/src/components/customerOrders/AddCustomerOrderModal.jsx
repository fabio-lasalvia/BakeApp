import { Modal, Button, Form, Alert, Spinner, Table } from "react-bootstrap";
import Select from "react-select";
import { useState, useMemo, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useCreateCustomerOrder from "../../hooks/customerOrders/useCreateCustomerOrder";
import useIndexCustomers from "../../hooks/customers/useIndexCustomers";
import useIndexProducts from "../../hooks/products/useIndexProducts";
import useMyProfile from "../../hooks/users/useMyProfile";

function AddCustomerOrderModal({ show, onHide, refetch }) {
  const { create, loading } = useCreateCustomerOrder();
  const { customers, loading: loadingCustomers } = useIndexCustomers();
  const { products, loading: loadingProducts } = useIndexProducts();
  const { profile, loading: loadingProfile } = useMyProfile();

  const initialForm = {
    customer: null,
    products: [],
    totalAmount: 0,
    status: "PENDING",
    notes: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState(null);


  const decoded = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, []);

  const userRole = decoded?.role || "CUSTOMER";


  useEffect(() => {
    if (!show) {
      setFormData(initialForm);
      setError(null);
    }
  }, [show]);


  const customerOptions = (customers || [])
    .filter((c) => c?.user)
    .map((c) => ({
      value: c._id,
      label: `${c.user.name || "Unnamed"} ${c.user.surname || ""} (${c.user.email || ""})`,
    }));

  const productOptions = (products || []).map((p) => ({
    value: p._id,
    label: `${p.name || "Unnamed"} — €${(p.price || 0).toFixed(2)}`,
    price: p.price || 0,
  }));


  useEffect(() => {
    if (userRole === "CUSTOMER" && profile && profile.customer) {
      const selfCustomer = profile.customer;
      setFormData((prev) => ({
        ...prev,
        customer: {
          value: selfCustomer._id,
          label: `${profile.name} ${profile.surname} (${profile.email})`,
        },
      }));
    }
  }, [userRole, profile]);


  const calculateTotal = (prods) =>
    prods.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);

  const handleProductChange = (selected) => {
    const newProducts = (selected || []).map((p) => ({
      ...p,
      quantity: 1,
    }));
    setFormData((prev) => ({
      ...prev,
      products: newProducts,
      totalAmount: calculateTotal(newProducts),
    }));
  };

  const handleQuantityChange = (index, value) => {
    const newProducts = [...formData.products];
    newProducts[index].quantity = Math.max(1, Number(value));
    setFormData((prev) => ({
      ...prev,
      products: newProducts,
      totalAmount: calculateTotal(newProducts),
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.customer) return setError("Please select a customer.");
    if (formData.products.length === 0)
      return setError("Please select at least one product.");

    try {
      const payload = {
        customerId: formData.customer.value,
        products: formData.products.map((p) => ({
          product: p.value,
          quantity: p.quantity,
        })),
        totalAmount: formData.totalAmount,
        status: formData.status,
        notes: formData.notes,
      };

      await create(payload);
      refetch();
      onHide();
      setFormData(initialForm);
    } catch (error) {
      console.error("Error creating order:", error);
      setError(error.response?.data?.message || "Error creating order");
    }
  };

  
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Customer Order</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* CUSTOMER */}
          <Form.Group className="mb-3">
            <Form.Label>Customer</Form.Label>
            {loadingCustomers || loadingProfile ? (
              <Spinner animation="border" size="sm" />
            ) : userRole === "CUSTOMER" ? (
              <Form.Control
                type="text"
                value={formData.customer?.label || "Loading..."}
                readOnly
              />
            ) : (
              <Select
                isSearchable
                placeholder="Select customer..."
                options={customerOptions}
                value={formData.customer}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, customer: selected }))
                }
              />
            )}
          </Form.Group>

          {/* PRODUCTS */}
          <Form.Group className="mb-3">
            <Form.Label>Products</Form.Label>
            {loadingProducts ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <Select
                isMulti
                isSearchable
                placeholder="Select products..."
                options={productOptions}
                value={formData.products}
                onChange={handleProductChange}
              />
            )}
          </Form.Group>

          {/* PRODUCTS TABLE */}
          {formData.products.length > 0 && (
            <Table bordered hover responsive size="sm" className="mb-3">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Price (€)</th>
                  <th>Quantity</th>
                  <th>Subtotal (€)</th>
                </tr>
              </thead>
              <tbody>
                {formData.products.map((p, index) => (
                  <tr key={p.value}>
                    <td>{p.label}</td>
                    <td>{p.price.toFixed(2)}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        value={p.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, e.target.value)
                        }
                        style={{ width: "80px", margin: "auto" }}
                      />
                    </td>
                    <td>{(p.price * p.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-secondary fw-bold">
                  <td colSpan="3" className="text-end">
                    Total
                  </td>
                  <td>€{formData.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </Table>
          )}

          {/* STATUS */}
          {userRole !== "CUSTOMER" ? (
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Form.Select>
            </Form.Group>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" value="PENDING" readOnly />
            </Form.Group>
          )}

          {/* NOTES */}
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </Form.Group>

          {/* BUTTONS */}
          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Add Order"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddCustomerOrderModal;
