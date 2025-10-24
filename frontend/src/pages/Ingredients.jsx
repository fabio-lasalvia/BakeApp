import IngredientsTable from "../components/ingredients/IngredientsTable";
import { Container } from "react-bootstrap";

function Ingredients() {
  return (
    <Container fluid className="py-4">
      <IngredientsTable />
    </Container>
  );
}

export default Ingredients;
