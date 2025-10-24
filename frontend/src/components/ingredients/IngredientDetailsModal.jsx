import { Modal, Tab, Tabs, Table, Image } from "react-bootstrap";

function IngredientDetailsModal({ show, onHide, ingredient }) {
  if (!ingredient) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Ingredient Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="overview" id="ingredient-details-tabs" className="mb-3">
          <Tab eventKey="overview" title="Overview">
            <Table bordered hover responsive>
              <tbody>
                <tr>
                  <td><strong>Name</strong></td>
                  <td>{ingredient.name}</td>
                </tr>
                <tr>
                  <td><strong>Quantity</strong></td>
                  <td>
                    {ingredient.quantity} {ingredient.unit}
                  </td>
                </tr>
                <tr>
                  <td><strong>Cost</strong></td>
                  <td>€{Number(ingredient.cost).toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Expiration</strong></td>
                  <td>
                    {ingredient.expirationDate
                      ? new Date(ingredient.expirationDate).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
                <tr>
                  <td><strong>Created</strong></td>
                  <td>{new Date(ingredient.createdAt).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>Updated</strong></td>
                  <td>{new Date(ingredient.updatedAt).toLocaleString()}</td>
                </tr>
              </tbody>
            </Table>
          </Tab>

          <Tab eventKey="image" title="Image">
            <div className="d-flex justify-content-center py-3">
              {ingredient.image ? (
                <Image
                  src={ingredient.image}
                  alt={ingredient.name}
                  rounded
                  style={{ maxWidth: 320, maxHeight: 320, objectFit: "cover" }}
                />
              ) : (
                <span className="text-muted">No image available</span>
              )}
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default IngredientDetailsModal;
