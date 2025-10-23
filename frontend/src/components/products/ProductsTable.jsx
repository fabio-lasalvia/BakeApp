import { Table, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
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

  // Hook per gestire i modali
  const addModal = useHandleModal();
  const editModal = useHandleModal();
  const detailsModal = useHandleModal();
  const confirmModal = useHandleModal();

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

  if (!products || products.length === 0)
    return (
      <div className="text-center mt-4">
        <p>No products found.</p>
        <Button variant="success" onClick={addModal.openModal}>
          <i className="bi bi-plus-circle me-2"></i>Add Product
        </Button>

        {/* Modale di aggiunta */}
        <AddProductModal
          show={addModal.isOpen}
          onHide={addModal.closeModal}
          refetch={refetch}
        />
      </div>
    );

  const handleDelete = async () => {
    if (!selectedProduct) return;
    await remove(selectedProduct._id);
    refetch();
    confirmModal.closeModal();
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-primary">Products</h2>
        <Button variant="success" onClick={addModal.openModal}>
          <i className="bi bi-plus-circle me-2"></i>Add Product
        </Button>
      </div>

      <Table striped bordered hover responsive className="align-middle text-center">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price (€)</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price?.toFixed(2)}</td>
              <td>{product.stock || 0}</td>
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
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modali */}
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
        message={`Are you sure you want to delete ${selectedProduct?.name}? This action cannot be undone.`}
      />
    </div>
  );
}

export default ProductsTable;
