import { ArrowLeft } from "react-bootstrap-icons";
import IngredientsTable from "../components/ingredients/IngredientsTable";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Ingredients() {

  const navigate = useNavigate()

  return (
    <Container fluid className="py-4">
      <Button
        variant="outline-primary"
        className="d-flex align-items-center gap-2 mb-3"
        onClick={() => navigate("/home")}
      >
        <ArrowLeft size={20} />
        Back
      </Button>
      <IngredientsTable />
    </Container>
  );
}

export default Ingredients;
