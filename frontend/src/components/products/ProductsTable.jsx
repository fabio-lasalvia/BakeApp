import { Accordion, Table, Button, Spinner, Badge, Form } from "react-bootstrap";
import { useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode"; // 👈 aggiunto import
import useIndexProducts from "../../hooks/products/useIndexProducts";
import useDeleteProduct from "../../hooks/products/useDeleteProduct";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import ProductDetailsModal from "./ProductDetailsModal";
import ConfirmModal from "../common/ConfirmModal";
import useHandleModal from "../../hooks/common/useHandleModal";

function ProductsTable() {
  const { products, loading, error, refetch } = useIndexProducts();
  const { remove } = useDeleteProduct();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const addModal = useHandleModal();
  const editModal = useHandleModal();
  const detailsModal = useHandleModal();
  const confirmModal = useHandleModal();

  ///// USER ROLE CHECK /////
  const decoded = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, []);

  const userRole = decoded?.role || "CUSTOMER"; // default: customer

  const categoryLabels = {
    LEAVENED: "Leavened",
    CAKE: "Cake",
    COOKIE: "Cookie",
    CHOCOLATE: "Chocolate",
    BREAD: "Bread",
    DESSERT: "Dessert",
    OTHER: "Other",
  };


  ///// LOADING STATE /////
  if (loading)
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-danger p-4">
        <p>Failed to load products. Please try again later.</p>
      </div>
    );


  ///// GROUP BY CATEGORY  /////
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || "OTHER";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  ///// DELETE PRODUCT ///////
  const handleDelete = async () => {
    if (!selectedProduct) return;
    await remove(selectedProduct._id);
    refetch();
    confirmModal.closeModal();
  };


  return (
    <div className="mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-primary mb-0">Products Management</h2>

        {/* AddProduct solo se non è customer */}
        {userRole !== "CUSTOMER" && (
          <Button variant="success" onClick={addModal.openModal}>
            <i className="bi bi-plus-circle me-2"></i>Add Product
          </Button>
        )}
      </div>

      {/* ACCORDION MULTI-OPEN */}
      <Accordion alwaysOpen>
        {Object.keys(groupedProducts).map((category, index) => {
          const items = groupedProducts[category];
          return (
            <Accordion.Item eventKey={index.toString()} key={category}>
              <Accordion.Header>
                <div className="d-flex align-items-center justify-content-between w-100">
                  <span>
                    {categoryLabels[category] || category}
                    <Badge bg="secondary" pill className="ms-2">
                      {items.length}
                    </Badge>
                  </span>
                </div>
              </Accordion.Header>

              <Accordion.Body>
                <Table striped bordered hover responsive className="align-middle text-center">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price (€)</th>
                      <th>Catalog</th>
                      <th>Available</th>
                      {/* Colonna Actions visibile solo se non customer */}
                      {userRole !== "CUSTOMER" && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((product, index) => (
                      <tr key={product._id}>
                        <td>{index + 1}</td>
                        <td>
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td>{product.price?.toFixed(2)}</td>
                        <td>{product.catalog?.name || "—"}</td>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={product.available}
                            readOnly
                            className="d-inline-block"
                            style={{ pointerEvents: "none" }}
                          />
                        </td>

                        {/* Bottoni visibili solo se non è customer */}
                        {userRole !== "CUSTOMER" && (
                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  detailsModal.openModal();
                                }}
                              >
                                <i className="bi bi-eye"></i>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-warning"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  editModal.openModal();
                                }}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  confirmModal.openModal();
                                }}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </td>
                        )}

                        {/* Se è customer, solo pulsante "View" */}
                        {userRole === "CUSTOMER" && (
                          <td>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => {
                                setSelectedProduct(product);
                                detailsModal.openModal();
                              }}
                            >
                              <i className="bi bi-eye"></i>
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>

      {/* MODALS */}
      <AddProductModal
        show={addModal.isOpen}
        onHide={addModal.closeModal}
        refetch={refetch}
      />
      <EditProductModal
        show={editModal.isOpen}
        onHide={editModal.closeModal}
        product={selectedProduct}
        refetch={refetch}
      />
      <ProductDetailsModal
        show={detailsModal.isOpen}
        onHide={detailsModal.closeModal}
        product={selectedProduct}
      />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        closeModal={confirmModal.closeModal}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${selectedProduct?.name}?`}
      />
    </div>
  );
}

export default ProductsTable;
