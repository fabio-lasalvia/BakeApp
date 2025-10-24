import { useState, useMemo } from "react";
import { Table, Button, Spinner, Image } from "react-bootstrap";
import useIndexIngredients from "../../hooks/ingredients/useIndexIngredients";
import useDeleteIngredient from "../../hooks/ingredients/useDeleteIngredient";
import useHandleModal from "../../hooks/common/useHandleModal";
import AddIngredientModal from "./AddIngredientModal";
import EditIngredientModal from "./EditIngredientModal";
import IngredientDetailsModal from "./IngredientDetailsModal";
import ConfirmModal from "../common/ConfirmModal";

function IngredientsTable() {
  const { ingredients, loading, error, refetch } = useIndexIngredients();
  const { remove, loading: deleting } = useDeleteIngredient();

  const addModal = useHandleModal();
  const editModal = useHandleModal();
  const detailsModal = useHandleModal();
  const confirmModal = useHandleModal();

  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const handleDelete = async () => {
    if (!selectedIngredient) return;
    await remove(selectedIngredient._id);
    refetch?.();
    confirmModal.closeModal();
  };

  // const totalInventoryCost = useMemo(() => {
  //   if (!ingredients) return 0;
  //   return ingredients.reduce((sum, i) => sum + Number(i.cost || 0), 0);
  // }, [ingredients]);

  if (loading)
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-danger p-4">
        <p>Failed to load ingredients. Please try again later.</p>
      </div>
    );

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-primary">Ingredients Management</h2>
        <div className="d-flex align-items-center gap-3">
          {/* <div className="text-muted small">
            Inventory Value: <strong>€{totalInventoryCost.toFixed(2)}</strong>
          </div> */}
          <Button variant="success" onClick={addModal.openModal}>
            <i className="bi bi-plus-circle me-2"></i>Add Ingredient
          </Button>
        </div>
      </div>

      {!ingredients || ingredients.length === 0 ? (
        <p className="text-center mt-4">No ingredients found.</p>
      ) : (
        <Table striped bordered hover responsive className="align-middle text-center shadow-sm">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Cost (€)</th>
              <th>Expiration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing, idx) => (
              <tr key={ing._id}>
                <td>{idx + 1}</td>
                <td>
                  {ing.image ? (
                    <Image
                      src={ing.image}
                      alt={ing.name}
                      rounded
                      style={{ width: 40, height: 40, objectFit: "cover" }}
                    />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td>{ing.name}</td>
                <td>
                  {ing.quantity} {ing.unit}
                </td>
                <td>{Number(ing.cost).toFixed(2)}</td>
                <td>
                  {ing.expirationDate
                    ? new Date(ing.expirationDate).toLocaleDateString()
                    : "—"}
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => {
                        setSelectedIngredient(ing);
                        detailsModal.openModal();
                      }}
                    >
                      <i className="bi bi-eye"></i>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => {
                        setSelectedIngredient(ing);
                        editModal.openModal();
                      }}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      disabled={deleting}
                      onClick={() => {
                        setSelectedIngredient(ing);
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
      <AddIngredientModal show={addModal.isOpen} onHide={addModal.closeModal} refetch={refetch} />
      <EditIngredientModal
        show={editModal.isOpen}
        onHide={editModal.closeModal}
        ingredient={selectedIngredient}
        refetch={refetch}
      />
      <IngredientDetailsModal
        show={detailsModal.isOpen}
        onHide={detailsModal.closeModal}
        ingredient={selectedIngredient}
      />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        closeModal={confirmModal.closeModal}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${selectedIngredient?.name}"?`}
      />
    </div>
  );
}

export default IngredientsTable;
