import { Button, Container } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons"; 
import CatalogsTable from "../components/catalogs/CatalogsTable";
import { useNavigate } from "react-router-dom";

function Catalogs() {

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
      <CatalogsTable />
    </Container>
  );
}

export default Catalogs;
