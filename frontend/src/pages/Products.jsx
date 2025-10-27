import { Button, Container } from "react-bootstrap";
import ProductsTable from "../components/products/ProductsTable";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function Products() {

  const navigate = useNavigate()

  return (
    <Container fluid className="p-4">
      <Button
        variant="outline-primary"
        className="d-flex align-items-center gap-2 mb-3"
        onClick={() => navigate("/home")}
      >
        <ArrowLeft size={20} />
        Back
      </Button>
      <ProductsTable />
    </Container>
  );
}

export default Products;
