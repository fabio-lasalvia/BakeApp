import { Modal, Button, Form, Alert, Spinner, Table } from "react-bootstrap";
import Select from "react-select";
import { useState, useEffect } from "react";
import useUpdateCustomerOrder from "../../hooks/customerOrders/useUpdateCustomerOrder";
import useIndexProducts from "../../hooks/products/useIndexProducts";

function EditCustomerOrderModal({ show, onHide, order, refetch }) {
  const { update, loading } = useUpdateCustomerOrder();
  const { products, loading: loadingProducts } = useIndexProducts();

  const [formData, setFormData] = useState({
    status: "PENDING",
    notes: "",
    products: [], // [{ value, label, price, quantity }]
    totalAmount: 0,
  });

  const [error, setError] = useState(null);

  const calculateTotal = (selectedProducts) =>
    selectedProducts.reduce(
      (sum, p) => sum + (p.price || 0) * (p.quantity || 1),
      0
    );

  useEffect(() => {
    if (order) {
      const mappedProducts =
        order.products?.map((item) => {
          const productData = item.product || item;
          const price = Number(productData?.price) || 0;
          const name = productData?.name || "Unnamed product";
          return {
            value: productData._id,
            label: `${name} — €${price.toFixed(2)}`,
            price,
            quantity: item.quantity || 1,
          };
        }) || [];

      setFormData({
        status: order.status || "PENDING",
        notes: order.notes || "",
        products: mappedProducts,
        totalAmount: order.totalAmount || calculateTotal(mappedProducts),
      });
    }
  }, [order]);

  const productOptions =
    products?.map((p) => ({
      value: p._id,
      label: `${p.name || "Unnamed"} — €${(p.price || 0).toFixed(2)}`,
      price: p.price || 0,
    })) || [];

  const handleProductChange = (selected) => {
    const newProducts = (selected || []).map((p) => {
      const existing = formData.products.find((fp) => fp.value === p.value);
      return {
        ...p,
        quantity: existing ? existing.quantity : 1,
      };
    });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        status: formData.status,
        notes: formData.notes,
        products: formData.products.map((p) => ({
          product: p.value,
          quantity: p.quantity,
        })),
        totalAmount: formData.totalAmount,
      };

      await update(order._id, payload);
      refetch();
      onHide();
    } catch (error) {
      console.error("Error updating order:", error);
      setError(error.response?.data?.message || "Error updating order");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Customer Order</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        {!order ? (
          <div className="text-center py-3">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            {/* PRODUCTS */}
            <Form.Group className="mb-3">
              <Form.Label>Products</Form.Label>
              <Select
                isMulti
                isSearchable
                isDisabled={loadingProducts}
                placeholder="Select or modify products..."
                options={productOptions}
                value={formData.products}
                onChange={handleProductChange}
              />
            </Form.Group>

            {/* TABLE WITH QUANTITIES */}
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
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Form.Select>
            </Form.Group>

            {/* NOTES */}
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={onHide} className="me-2">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <Spinner size="sm" /> : "Save Changes"}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default EditCustomerOrderModal;
